import Encoder from '../lib/encoder';

export const key = 'shh';
export const body = { foo: 'bar' };

export const generate = (body, opts = {}) => {
  const encoder = new Encoder(body, key, opts);
  return encoder.encodeAndSign();
};
