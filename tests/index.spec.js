import JWT from '../lib';

const key = 'shh';

export const expectedTokens = {
  none: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0=.eyJmb28iOiJiYXIifQ==.',
  HS256:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ==.MwMPn+JotG0ADbVQz8KgAXQkwT4Dd37499WucrGC6M4=',
  HS384:
    'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ==.ythJt3pdoNd1Wq5LMFwvA/G5JlIeyqd73hVrUj5+WrmSBHi8Eeu5X1G/NunE3FGR',
  HS512:
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ==.mdsKdpOymFm2IqXTTtS1JLA/9XM1c/Cjo9IwZoRlFd8MshIjp/RifniPlz9Nq5LCVwa8xIFeKYeNu0pvNJl4JQ=='
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
  }
});
