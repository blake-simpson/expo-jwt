import Verifier from '../lib/verifier';
import * as Errors from '../lib/errors';

describe('Claims', () => {
  let currentTime;
  let futureTime;
  let pastTime;

  beforeEach(() => {
    currentTime = Date.now();
    futureTime = currentTime + 10000;
    pastTime = currentTime - 10000;
  });

  describe('[exp] expiration time claim', () => {
    it('verifies successfully', () => {
      const body = { exp: futureTime };

      expect(() => {
        new Verifier(body, 'exp');
      }).not.toThrowError(Errors.TokenExpired);
    });

    it('throws if token has expired', () => {
      const body = { exp: pastTime };

      expect(() => {
        new Verifier(body, 'exp');
      }).toThrowError(Errors.TokenExpired);
    });
  });

  describe('[nbf] not before claim', () => {
    it('verifies successfully', () => {
      const body = { nbf: pastTime };

      expect(() => {
        new Verifier(body, 'nbf');
      }).not.toThrowError(Errors.ImmatureSignature);
    });

    it('throws if token is not valid yet', () => {
      const body = { nbf: futureTime };

      expect(() => {
        new Verifier(body, 'nbf');
      }).toThrowError(Errors.ImmatureSignature);
    });
  });

  describe('[iat] issued at claim', () => {
    it('verifies successfully', () => {
      const body = { iat: pastTime };

      expect(() => {
        new Verifier(body, 'iat');
      }).not.toThrowError(Errors.ImmatureSignature);
    });

    it('throws if iat is in the future', () => {
      const body = { iat: futureTime };

      expect(() => {
        new Verifier(body, 'iat');
      }).toThrowError(Errors.IssuedAtInvalid);
    });
  });

  describe('[sub] subject claim', () => {
    it('verifies successfully', () => {
      const body = { sub: 'subject' };

      expect(() => {
        new Verifier(body, 'sub', { sub: 'subject' });
      }).not.toThrowError(Errors.InvalidSubject);
    });

    it("throws subject doesn't match", () => {
      const body = { sub: 'subject' };

      expect(() => {
        new Verifier(body, 'sub', { sub: 'something-else' });
      }).toThrowError(Errors.InvalidSubject);
    });
  });

  describe('[iss] issuer claim', () => {
    it('verifies successfully', () => {
      const body = { iss: 'authority' };

      expect(() => {
        new Verifier(body, 'iss', { iss: 'authority' });
      }).not.toThrowError(Errors.InvalidIssuer);
    });

    it("throws subject doesn't match", () => {
      const body = { iss: 'authority' };

      expect(() => {
        new Verifier(body, 'iss', { iss: 'something-else' });
      }).toThrowError(Errors.InvalidIssuer);
    });
  });

  describe('[aud] Audience claim', () => {
    it('verifies successfully', () => {
      const body = { aud: 'audience' };

      expect(() => {
        new Verifier(body, 'aud', { aud: 'audience' });
      }).not.toThrowError(Errors.InvalidAudience);
    });

    it("throws subject doesn't match", () => {
      const body = { aud: 'audience' };

      expect(() => {
        new Verifier(body, 'aud', { aud: 'something-else' });
      }).toThrowError(Errors.InvalidAudience);
    });
  });
});
