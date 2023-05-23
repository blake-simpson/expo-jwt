import { expectedTokens } from './index.spec';
import { key, body } from './test-helper';

import Encoder from '../lib/encoder';
import { AlgorithmNotSupported } from '../lib/errors';

import { SupportedAlgorithms } from '../types/algorithms';

describe('Encoder', () => {
  describe('#buildHeader', () => {
    it('returns a default header', () => {
      const jwt = new Encoder(body, key);

      const actual = jwt.buildHeader();
      const expected = {
        alg: 'HS256',
        typ: 'JWT',
      };

      expect(actual).toEqual(expected);
    });

    it('uses the algorithm from the options', () => {
      const jwt = new Encoder(body, key, {
        algorithm: SupportedAlgorithms.HS512,
      });

      const actual = jwt.buildHeader();
      const expected = {
        alg: 'HS512',
        typ: 'JWT',
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('#encodeAndSign with algorithm', () => {
    describe('with an unknown algorithm', () => {
      const expected = expectedTokens.NONE;

      it('throws AlgorithmNotSupported', () => {
        expect(() => {
          // @ts-ignore-next-line
          const jwt = new Encoder(body, key, { algorithm: 'foo' });
          const actual = jwt.encodeAndSign();
        }).toThrow(new AlgorithmNotSupported().message);
      });
    });

    describe('none', () => {
      const expected = expectedTokens.NONE;

      it('encodes the token without a signature', () => {
        const jwt = new Encoder(body, key, {
          algorithm: SupportedAlgorithms.NONE,
        });
        const actual = jwt.encodeAndSign();

        expect(actual).toEqual(expected);
      });
    });

    describe('HS256', () => {
      const expected = expectedTokens.HS256;

      it('encodes the token correctly (no algorithm option passed)', () => {
        const jwt = new Encoder(body, key);
        const actual = jwt.encodeAndSign();

        expect(actual).toEqual(expected);
      });

      it('encodes the token correctly (with algorithm option)', () => {
        const jwt = new Encoder(body, key, {
          algorithm: SupportedAlgorithms.HS256,
        });
        const actual = jwt.encodeAndSign();

        expect(actual).toEqual(expected);
      });
    });

    describe('HS384', () => {
      it('encodes the token correctly', () => {
        const jwt = new Encoder(body, key, {
          algorithm: SupportedAlgorithms.HS384,
        });

        const expected = expectedTokens.HS384;
        const actual = jwt.encodeAndSign();

        expect(actual).toEqual(expected);
      });
    });

    describe('HS512', () => {
      it('encodes the token correctly', () => {
        const jwt = new Encoder(body, key, {
          algorithm: SupportedAlgorithms.HS512,
        });

        const expected = expectedTokens.HS512;
        const actual = jwt.encodeAndSign();

        expect(actual).toEqual(expected);
      });
    });
  });
});
