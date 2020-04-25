import JWT from '../lib';

const key = 'shh';

export const expectedTokens = {
  none: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJmb28iOiJiYXIifQ.',
  HS256:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.YVoZ0LkWCMCnwEf7Nju2SJt_9mseJP1Q3RvCz4frGwM',
  HS384:
    'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.VO9qxNYriOfR6DfkvtBFIQydweEj7nmd6YUixV_TSzUSm7OXR_dDmVIfdHtHVmuo',
  HS512:
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.Kyojwz8Z5SckLbMU-EImuzHEjjg_1apSOLz_tsZQj1025OH--qaORzkHUkScScd8-RZnWUdCu0epiaofQZNkBA'
};

describe('JWT', () => {
  for (let algorithm in expectedTokens) {
    let expectedToken = expectedTokens[algorithm];

    it(`can successfully encode and decode a token for algorithm ${algorithm}`, () => {
      const body = { foo: 'bar' };
      const encoded = JWT.encode(body, key, { algorithm });

      expect(encoded).toEqual(expectedToken);

      const decoded = JWT.decode(encoded, key);

      expect(decoded).toEqual(body);
    });
    it(`can successfully decode a body without knowing the secret for algorithm ${algorithm}`, () => {
      const body = { foo: 'bar' };
      
      const decodedBody = JWT.decode(expectedToken, null, { algorithm });
      
      expect(decodedBody).toEqual(body);
    });
  }
});
