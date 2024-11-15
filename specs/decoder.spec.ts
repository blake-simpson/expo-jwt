import Decoder from "../lib/decoder";
import Verifier from "../lib/verifier";
import * as Errors from "../lib/errors";

import { key, generate } from "./test-helper";

const decoder = new Decoder(key);

describe("Decoder", () => {
  describe("#decodeAndVerify", () => {
    describe("invalid formats", () => {
      describe("structure invalid", () => {
        const inputs = [123, {}, [], "", "foo", "header."];

        inputs.forEach((input) => {
          it(`throws InvalidStructure error for the input "${input}"`, () => {
            expect(() => {
              // @ts-ignore-next-line
              decoder.decodeAndVerify(input);
            }).toThrow(new Errors.InvalidStructure());
          });
        });
      });

      it("throws InvalidHeader if the header cannot be parsed", () => {
        const token = "eyJhbGciOiJmLCJ0eXAiOiJKV1QifQ.eyJmb28iOiJiYXIifQ.";

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrow(new Errors.InvalidHeader());
      });

      it("throws InvalidBody if the body cannot be parsed", () => {
        const token = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJmb28iOiAiYmF9.";

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrow(new Errors.InvalidBody());
      });

      it('throws AlgorithmMissing if "alg" is missing from the header', () => {
        const token = "eyJ0eXAiOiJKV1QifQ.eyJmb28iOiJiYXIifQ.";

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrow(new Errors.AlgorithmMissing());
      });

      it('throws AlgorithmNotSupported if "alg" is not supported', () => {
        const token = "eyJhbGciOiJmb28iLCJ0eXAiOiJKV1QifQ.eyJmb28iOiJiYXIifQ.";

        expect(() => {
          decoder.decodeAndVerify(token);
        }).toThrow(new Errors.AlgorithmNotSupported());
      });
    });

    describe("verifying signature", () => {
      const body = { foo: "bar" };
      const token = generate(body);

      it("verifies the signature successfully", () => {
        const actual = decoder.decodeAndVerify(token);

        expect(actual).toEqual(body);
      });

      it("throws if signature is invalid", () => {
        expect(() => {
          decoder.decodeAndVerify(token + "XYZ");
        }).toThrow(new Errors.SignatureInvalid());
      });

      it("validates claims", () => {
        const spy = jest.spyOn(Verifier, "verifyAll");

        decoder.decodeAndVerify(token);

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe("with generic types", () => {
      type TestBodyType = Record<string, number>;

      const typedDecoder = new Decoder<TestBodyType>(key);
      const body = { number: 42 };
      const token = generate(body);

      it("accepts the generic type and returns the body", () => {
        const actual = typedDecoder.decodeAndVerify(token);

        expect(actual).toEqual(body);
      });
    });

    describe("with urlBase64 parse", () => {
      type TestBodyType = Record<string, any>;
      const typedDecoder = new Decoder<TestBodyType>(key);
      const body = {
        code: 1,
        message: "OK",
        data: {
          user: {
            level_experience_upper_limit: 9999,
            total_level_experience: "xxx",
            current_level_process_rate: 0.0996,
            employer_invite_code: "BQ4W8Q",
            level_reward_rate: 0.996,
            id: "*****",
            invite_code: "EQYUNC",
            has_transactions: true,
            level: 3,
            avatar_url:
              "https://app-xxxx.x.x-xx.xxx.com/public/development/avatarImage/924e97db-XXX-XX-ABAB-AA33ee9e3ecx.png?imageMogr2/crop/50x50",
            first_name: "sss",
            last_name: "ddd",
            country: "japan",
            balance: "*****",
            invitees: 5,
          },
          user_token: "*****",
        },
      };
      const token = generate(body);

      it("Return the correct object containing URL-encoded data", () => {
        const actual = typedDecoder.decodeAndVerify(token);

        console.debug("🐛🐛🐛 ------------------------------🐛🐛🐛");
        console.debug("🐛🐛🐛 ::: actual:::", actual);
        console.debug("🐛🐛🐛 ------------------------------🐛🐛🐛");

        expect(actual).toEqual(body);
      });
    });
  });
});
