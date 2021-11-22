import * as Errors from './errors';

import { DecodingOptions, JWTBody } from '../types/jwt';
import { Claims } from '../types/claims';

const claims = [
  Claims.EXP,
  Claims.NBF,
  Claims.IAT,
  Claims.SUB,
  Claims.ISS,
  Claims.AUD
];

const parseToNumber = (value?: string) => value ? (parseInt(value) || null) : null;

class Verifier {
  body: JWTBody;
  options: DecodingOptions;
  time: number;
  timeSkew: number;

  static verifyAll(body: JWTBody, options: DecodingOptions) {
    claims.forEach(claim => {
      new this(body, claim, options);
    });
  }

  constructor(body: JWTBody, claim: Claims, options: DecodingOptions = {}) {
    this.body = body;
    this.options = options;
    this.time = Date.parse((new Date()).toString()) / 1000;
    this.timeSkew = options.timeSkew || 0;

    const methodName = `verify_${claim}`;

    if (this[methodName]) {
      this[methodName]();
    }
  }

  verify_exp() {
    const exp = parseToNumber(this.body.exp);

    if (!exp) {
      return;
    }

    if (exp < this.time - this.timeSkew) {
      throw new Errors.TokenExpired();
    }
  }

  verify_nbf() {
    const nbf = parseToNumber(this.body.nbf);

    if (!nbf) {
      return;
    }

    if (nbf > this.time + this.timeSkew) {
      throw new Errors.ImmatureSignature();
    }
  }

  verify_iat() {
    const iat = parseToNumber(this.body.iat);

    if (!this.body.iat || !iat) {
      return;
    }

    if (iat > this.time + this.timeSkew) {
      throw new Errors.IssuedAtInvalid();
    }
  }

  verify_sub() {
    if (!this.options.sub) {
      return;
    }

    if (this.body.sub !== this.options.sub) {
      throw new Errors.InvalidSubject();
    }
  }

  verify_iss() {
    if (!this.options.iss) {
      return;
    }

    if (this.body.iss !== this.options.iss) {
      throw new Errors.InvalidIssuer();
    }
  }

  verify_aud() {
    if (!this.options.aud) {
      return;
    }

    if (this.body.aud !== this.options.aud) {
      throw new Errors.InvalidAudience();
    }
  }
}

export default Verifier;
