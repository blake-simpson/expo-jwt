import Decoder from '../lib/decoder';
import Verifier from '../lib/verifier';
import * as Errors from '../lib/errors';

import { key, generate } from './test-helper';

const decoder = new Decoder(key);

describe('Decoder', () => {
  describe('#decodeAndVerify', () => {
    describe('invalid formats', () => {
      describe('structure invalid', () => {
        const inputs = [123, {}, [], '', 'foo', 'header.'];

        inputs.forEach(input => {
          it(`throws InvalidStructure error for the input "${input}"`, () => {
            expect(() => {
              decoder.decodeAndVerify(input);
            }).toThrowError(Errors.InvalidStructure);
          });
        });
      });

      it('throws InvalidHeader if the header cannot be parsed', () => {
        const token = 'eyJhbGciOiJmLCJ0eXAiOiJKV1QifQ==.eyJmb28iOiJiYXIifQ==.';

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrowError(Errors.InvalidHeader);
      });

      it('throws InvalidBody if the body cannot be parsed', () => {
        const token = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0=.eyJmb28iOiAiYmF9.';

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrowError(Errors.InvalidBody);
      });

      it('throws AlgorithmMissing if "alg" is missing from the header', () => {
        const token = 'eyJ0eXAiOiJKV1QifQ==.eyJmb28iOiJiYXIifQ==.';

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrowError(Errors.AlgorithmMissing);
      });

      it('throws AlgorithmNotSupported if "alg" is not supported', () => {
        const token =
          'eyJhbGciOiJmb28iLCJ0eXAiOiJKV1QifQ==.eyJmb28iOiJiYXIifQ==.';

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrowError(Errors.AlgorithmNotSupported);
      });
    });

    describe('verifying signature', () => {
      const body = { foo: 'bar' };
      const token = generate(body);

      it('verifies the signature successfully', () => {
        const actual = decoder.decodeAndVerify(token);

        expect(actual).toEqual(body);
      });

      it('throws if signature is invalid', () => {
        expect(() => {
          decoder.decodeAndVerify(token + 'XYZ');
        }).toThrowError(Errors.SignatureInvalid);
      });

      it('validates claims', () => {
        const spy = spyOn(Verifier, 'verifyAll');

        decoder.decodeAndVerify(token);

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
