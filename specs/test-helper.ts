import Encoder from '../lib/encoder';
import { HeaderOptions, JWTBody } from '../types/jwt';

export const key = 'shh';
export const body = { foo: 'bar' };

export const generate = (body: JWTBody, header: HeaderOptions = {}) => {
  const encoder = new Encoder(body, key, header);
  return encoder.encodeAndSign();
};
