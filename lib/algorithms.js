import HmacSHA256 from 'crypto-js/hmac-sha256';
import HmacSHA384 from 'crypto-js/hmac-sha384';
import HmacSHA512 from 'crypto-js/hmac-sha512';

const mapping = {
  HS256: HmacSHA256,
  HS384: HmacSHA384,
  HS512: HmacSHA512
};

export const supportedAlgorithms = Object.keys(mapping);

export default mapping;
