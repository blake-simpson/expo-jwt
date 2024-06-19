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

        inputs.forEach((input) => {
          it(`throws InvalidStructure error for the input "${input}"`, () => {
            expect(() => {
              // @ts-ignore-next-line
              decoder.decodeAndVerify(input);
            }).toThrow(new Errors.InvalidStructure());
          });
        });
      });

      it('throws InvalidHeader if the header cannot be parsed', () => {
        const token = 'eyJhbGciOiJmLCJ0eXAiOiJKV1QifQ.eyJmb28iOiJiYXIifQ.';

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrow(new Errors.InvalidHeader());
      });

      it('throws InvalidBody if the body cannot be parsed', () => {
        const token = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJmb28iOiAiYmF9.';

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrow(new Errors.InvalidBody());
      });

      it('throws AlgorithmMissing if "alg" is missing from the header', () => {
        const token = 'eyJ0eXAiOiJKV1QifQ.eyJmb28iOiJiYXIifQ.';

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrow(new Errors.AlgorithmMissing());
      });

      it('throws AlgorithmNotSupported if "alg" is not supported', () => {
        const token = 'eyJhbGciOiJmb28iLCJ0eXAiOiJKV1QifQ.eyJmb28iOiJiYXIifQ.';

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrow(new Errors.AlgorithmNotSupported());
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
        }).toThrow(new Errors.SignatureInvalid());
      });

      it('validates claims', () => {
        const spy = jest.spyOn(Verifier, 'verifyAll');

        decoder.decodeAndVerify(token);

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('with generic types', () => {
      type TestBodyType = Record<string, number>;

      const typedDecoder = new Decoder<TestBodyType>(key);
      const body = { number: 42 };
      const token = generate(body);

      it('accepts the generic type and returns the body', () => {
        const actual = typedDecoder.decodeAndVerify(token);

        expect(actual).toEqual(body);
      });
    });
  });
});
