import Encoder from './encoder';
import Decoder from './decoder';

import {
  JWTBody,
  JWTToken,
  HeaderOptions,
  DecodingOptions,
  EncodingKey,
  JWTDefaultBody,
} from '../types/jwt';

const JWT = {
  encode: (body: JWTBody, key: EncodingKey, options: HeaderOptions = {}) => {
    const encoder = new Encoder(body, key, options);

    return encoder.encodeAndSign();
  },

  decode: <T = JWTDefaultBody>(
    token: JWTToken,
    key: EncodingKey,
    options: DecodingOptions = {}
  ): JWTBody<T> => {
    const decoder = new Decoder<T>(key);

    return decoder.decodeAndVerify(token, options);
  },
};

export default JWT;

export * from '../types';
