import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

import Verifier from './verifier';
import * as Errors from './errors';
import algorithms, { supportedAlgorithms } from './algorithms';
import { urlEncodeBase64 } from './helpers';

let _key;

const parse = encodedString =>
  JSON.parse(Base64.parse(encodedString).toString(Utf8));

const sign = (body, algorithm) =>
  urlEncodeBase64(algorithm(body, _key).toString(Base64));

class Decoder {
  constructor(key) {
    _key = key;
  }

  set header(header) {
    try {
      this._header = parse(header);
    } catch (error) {
      throw new Errors.InvalidHeader();
    }
  }

  set body(body) {
    try {
      this._body = parse(body);
    } catch (error) {
      throw new Errors.InvalidBody();
    }
  }

  getAlgorithm() {
    const algorithm = this._header && this._header.alg;

    if (!algorithm) {
      throw new Errors.AlgorithmMissing();
    }

    if (algorithm === 'none') {
      return 'none';
    }

    if (!~supportedAlgorithms.indexOf(algorithm)) {
      throw new Errors.AlgorithmNotSupported();
    }

    return algorithms[algorithm];
  }

  verifySignature(encodedHeader, encodedBody) {
    if (this.algorithm === 'none') {
      return true;
    }

    const signatureBody = `${encodedHeader}.${encodedBody}`;

    if (this.signature !== sign(signatureBody, this.algorithm)) {
      throw new Errors.SignatureInvalid();
    }

    return true;
  }

  verifyClaims() {
    Verifier.verifyAll(this._body, this.options);
  }

  decodeAndVerify(token, options = {}) {
    const [encodedHeader, encodedBody, signature] = token.toString().split('.');

    if (!encodedHeader || !encodedBody) {
      throw new Errors.InvalidStructure();
    }

    this.options = options;
    this.header = encodedHeader;
    this.body = encodedBody;
    this.signature = signature;
    this.algorithm = this.getAlgorithm();

    if(_key != null) {
      this.verifySignature(encodedHeader, encodedBody);
    }
    this.verifyClaims();

    return this._body;
  }
}

export default Decoder;
