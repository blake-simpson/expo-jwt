import Encoder from '../lib/encoder';
import { EncodingOptions, JWTBody } from '../types/jwt';

export const key = 'shh';
export const body = { foo: 'bar' };

export const generate = (body: JWTBody, opts: EncodingOptions = {}) => {
  const encoder = new Encoder(body, key, opts);
  return encoder.encodeAndSign();
};
