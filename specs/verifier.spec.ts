import Verifier from '../lib/verifier';
import * as Errors from '../lib/errors';

import { Claims } from '../types/claims';

describe('Claims', () => {
  let currentTime: number;
  let futureTime: number;
  let pastTime: number;

  beforeEach(() => {
    currentTime = Date.parse((new Date()).toString()) / 1000;
    futureTime = currentTime + 60;
    pastTime = currentTime - 60;
  });

  describe('[exp] expiration time claim', () => {
    it('verifies successfully', () => {
      const body = { exp: futureTime };

      expect(() => {
        new Verifier(body, Claims.EXP);
      }).not.toThrow(new Errors.TokenExpired());
    });

    it('throws if token has expired', () => {
      const body = { exp: pastTime };

      expect(() => {
        new Verifier(body, Claims.EXP);
      }).toThrow(new Errors.TokenExpired());
    });

    it('handles time skew correctly', () => {
      const body = { exp: pastTime };

      expect(() => {
        new Verifier(body, Claims.EXP, { timeSkew: 60 });
      }).not.toThrow(new Errors.TokenExpired());
    });
  });

  describe('[nbf] not before claim', () => {
    it('verifies successfully', () => {
      const body = { nbf: pastTime };

      expect(() => {
        new Verifier(body, Claims.NBF);
      }).not.toThrow(new Errors.ImmatureSignature());
    });

    it('throws if token is not valid yet', () => {
      const body = { nbf: futureTime };

      expect(() => {
        new Verifier(body, Claims.NBF);
      }).toThrow(new Errors.ImmatureSignature());
    });

    it('handles time skew correctly', () => {
      const body = { nbf: futureTime };

      expect(() => {
        new Verifier(body, Claims.NBF, { timeSkew: 60 });
      }).not.toThrow(new Errors.ImmatureSignature());
    });
  });

  describe('[iat] issued at claim', () => {
    it('verifies successfully', () => {
      const body = { iat: pastTime };

      expect(() => {
        new Verifier(body, Claims.IAT);
      }).not.toThrow(new Errors.ImmatureSignature());
    });

    it('throws if iat is in the future', () => {
      const body = { iat: futureTime };

      expect(() => {
        new Verifier(body, Claims.IAT);
      }).toThrow(new Errors.IssuedAtInvalid());
    });

    it('handles time skew correctly', () => {
      const body = { iat: futureTime };

      expect(() => {
        new Verifier(body, Claims.IAT, { timeSkew: 60 });
      }).not.toThrow(new Errors.IssuedAtInvalid());
    });
  });

  describe('[sub] subject claim', () => {
    it('verifies successfully', () => {
      const body = { sub: 'subject' };

      expect(() => {
        new Verifier(body, Claims.SUB, { sub: 'subject' });
      }).not.toThrow(new Errors.InvalidSubject());
    });

    it("throws subject doesn't match", () => {
      const body = { sub: 'subject' };

      expect(() => {
        new Verifier(body, Claims.SUB, { sub: 'something-else' });
      }).toThrow(new Errors.InvalidSubject());
    });
  });

  describe('[iss] issuer claim', () => {
    it('verifies successfully', () => {
      const body = { iss: 'authority' };

      expect(() => {
        new Verifier(body, Claims.ISS, { iss: 'authority' });
      }).not.toThrow(new Errors.InvalidIssuer());
    });

    it("throws subject doesn't match", () => {
      const body = { iss: 'authority' };

      expect(() => {
        new Verifier(body, Claims.ISS, { iss: 'something-else' });
      }).toThrow(new Errors.InvalidIssuer());
    });
  });

  describe('[aud] Audience claim', () => {
    it('verifies successfully', () => {
      const body = { aud: 'audience' };

      expect(() => {
        new Verifier(body, Claims.AUD, { aud: 'audience' });
      }).not.toThrow(new Errors.InvalidAudience());
    });

    it("throws subject doesn't match", () => {
      const body = { aud: 'audience' };

      expect(() => {
        new Verifier(body, Claims.AUD, { aud: 'something-else' });
      }).toThrow(new Errors.InvalidAudience());
    });
  });
});
