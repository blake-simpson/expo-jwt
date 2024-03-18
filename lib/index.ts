import Encoder from './encoder';
import Decoder from './decoder';

import {
  JWTBody,
  JWTToken,
  EncodingOptions,
  DecodingOptions,
  EncodingKey,
} from '../types/jwt';

const JWT = {
  encode: (body: JWTBody, key: EncodingKey, options: EncodingOptions = {}) => {
    const encoder = new Encoder(body, key, options);

    return encoder.encodeAndSign();
  },

  decode: <T = Record<string, any>>(
    token: JWTToken,
    key: EncodingKey,
    options: DecodingOptions = {}
  ): JWTBody<T> => {
    const decoder = new Decoder(key);

    return decoder.decodeAndVerify<T>(token, options);
  },
};

export default JWT;
