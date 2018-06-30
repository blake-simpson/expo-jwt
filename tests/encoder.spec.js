import Encoder from '../lib/encoder';
import { AlgorithmNotSupported } from '../lib/errors';

import { expectedTokens } from './index.spec.js';

import { key, body } from './test-helper';

describe('Encoder', () => {
  describe('#buildHeader', () => {
    it('returns a default header', () => {
      const jwt = new Encoder(body, key);

      const actual = jwt.buildHeader();
      const expected = {
        alg: 'HS256',
        typ: 'JWT'
      };

      expect(actual).toEqual(expected);
    });

    it('uses the algorithm from the options', () => {
      const jwt = new Encoder(body, key, { algorithm: 'HS512' });

      const actual = jwt.buildHeader();
      const expected = {
        alg: 'HS512',
        typ: 'JWT'
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('#encodeAndSign with algorithm', () => {
    describe('with an unknown algorithm', () => {
      const expected = expectedTokens.none;

      it('throws AlgorithmNotSupported', () => {
        expect(() => {
          const jwt = new Encoder(body, null, { algorithm: 'unknown' });
          const actual = jwt.encodeAndSign();
        }).toThrowError(AlgorithmNotSupported);
      });
    });

    describe('none', () => {
      const expected = expectedTokens.none;

      it('encodes the token without a signature', () => {
        const jwt = new Encoder(body, null, { algorithm: 'none' });
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
        const jwt = new Encoder(body, key, { algorithm: 'HS256' });
        const actual = jwt.encodeAndSign();

        expect(actual).toEqual(expected);
      });
    });

    describe('HS384', () => {
      it('encodes the token correctly', () => {
        const jwt = new Encoder(body, key, { algorithm: 'HS384' });

        const expected = expectedTokens.HS384;
        const actual = jwt.encodeAndSign();

        expect(actual).toEqual(expected);
      });
    });

    describe('HS512', () => {
      it('encodes the token correctly', () => {
        const jwt = new Encoder(body, key, { algorithm: 'HS512' });

        const expected = expectedTokens.HS512;
        const actual = jwt.encodeAndSign();

        expect(actual).toEqual(expected);
      });
    });
  });
});
