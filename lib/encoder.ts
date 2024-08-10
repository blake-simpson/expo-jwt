import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

import { AlgorithmNotSupported } from './errors';
import algorithmMapping from './algorithms';
import { urlEncodeBase64 } from './helpers';

import {
  JWTToken,
  JWTBody,
  JWTHeader,
  HeaderOptions,
  EncodingKey,
} from '../types/jwt';
import { SupportedAlgorithms } from '../types/algorithms';

let _key: EncodingKey;

const stripAlgorithmOptions = (options: HeaderOptions): HeaderOptions => {
  const { algorithm, alg, ...strippedOptions } = options;

  return strippedOptions;
};

class Encoder {
  body: JWTBody;
  header: JWTHeader;

  constructor(
    body: JWTBody,
    key: EncodingKey,
    headerOptions: HeaderOptions = {}
  ) {
    this.body = body;
    this.header = {
      alg:
        headerOptions.algorithm ||
        headerOptions.alg ||
        SupportedAlgorithms.HS256,
      typ: 'JWT',
      ...stripAlgorithmOptions(headerOptions),
    };

    _key = key;
  }

  buildHeader(): JWTHeader {
    // This function is somewhat unecessary now but it is needed for backwards compatibility
    // Possible alias it to getHeader in future, or strip out fully in 2.0
    return this.header;
  }

  encodeAndSign(): JWTToken {
    const jsonHeader = JSON.stringify(this.header);
    const jsonBody = JSON.stringify(this.body);

    const base64Header = Base64.stringify(Utf8.parse(jsonHeader));
    const base64Body = Base64.stringify(Utf8.parse(jsonBody));

    const encodedHeader = urlEncodeBase64(base64Header);
    const encodedBody = urlEncodeBase64(base64Body);

    if (!this.header.alg || this.header.alg === 'none') {
      return `${encodedHeader}.${encodedBody}.`;
    }

    const algorithm = algorithmMapping[this.header.alg];

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
