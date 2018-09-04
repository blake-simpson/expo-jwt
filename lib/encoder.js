import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

import { AlgorithmNotSupported } from './errors';
import algorithmMapping from './algorithms';
import { urlEncodeBase64 } from './helpers';

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

    const base64Header = Base64.stringify(Utf8.parse(jsonHeader));
    const base64Body = Base64.stringify(Utf8.parse(jsonBody));

    const encodedHeader = urlEncodeBase64(base64Header);
    const encodedBody = urlEncodeBase64(base64Body);

    if (this.options.algorithm === 'none') {
      return `${encodedHeader}.${encodedBody}.`;
    }

    const algorithm = algorithmMapping[this.options.algorithm];

    if (!algorithm) {
      throw new AlgorithmNotSupported();
    }

    const signature = algorithm(`${encodedHeader}.${encodedBody}`, _key);
    const encodedSignature = signature.toString(Base64);
    const urlSafeEncodedSignature = urlEncodeBase64(encodedSignature);

    return `${encodedHeader}.${encodedBody}.${urlSafeEncodedSignature}`;
  }
}

export default Encoder;
