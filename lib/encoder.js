import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

import { AlgorithmNotSupported } from './errors';
import algorithmMapping from './algorithms';

const defaultOptions = {
  algorithm: 'HS256'
};

let _key;

class Encoder {
  constructor(body, key, options = {}) {
    this.body = body;
    this.options = { ...defaultOptions, ...options };
    _key = key;
  }

  buildHeader() {
    return {
      alg: this.options.algorithm,
      typ: 'JWT'
    };
  }

  encodeAndSign() {
    const jsonHeader = JSON.stringify(this.buildHeader());
    const jsonBody = JSON.stringify(this.body);

    const encodedHeader = Base64.stringify(Utf8.parse(jsonHeader));
    const encodedBody = Base64.stringify(Utf8.parse(jsonBody));

    if (this.options.algorithm === 'none') {
      return `${encodedHeader}.${encodedBody}.`;
    }

    const algorithm = algorithmMapping[this.options.algorithm];

    if (!algorithm) {
      throw new AlgorithmNotSupported();
    }

    const signature = algorithm(`${encodedHeader}.${encodedBody}`, _key);
    const encodedSignature = signature.toString(Base64);

    return `${encodedHeader}.${encodedBody}.${encodedSignature}`;
  }
}

export default Encoder;
