import Encoder from './encoder';
import Decoder from './decoder';

const JWT = {
  encode: (body, key, options = {}) => {
    const encoder = new Encoder(body, key, options);

    return encoder.encodeAndSign();
  },

  decode: (token, key, options = {}) => {
    const decoder = new Decoder(key);

    return decoder.decodeAndVerify(token, options);
  }
};

export default JWT;
