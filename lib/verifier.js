import * as Errors from './errors';

const claims = ['exp', 'nbf', 'iat', 'sub', 'iss', 'aud'];

const parse = value => parseInt(value) || null;

class Verifier {
  static verifyAll(body, options) {
    claims.forEach(claim => {
      new this(body, claim, options);
    });
  }

  constructor(body, claim, options = {}) {
    this.body = body;
    this.options = options;
    this.time = Date.parse(new Date()) / 1000;

    this[`verify_${claim}`]();
  }

  verify_exp() {
    const exp = parse(this.body.exp);

    if (!exp) {
      return;
    }

    if (exp < this.time) {
      throw new Errors.TokenExpired();
    }
  }

  verify_nbf() {
    const nbf = parse(this.body.nbf);

    if (!nbf) {
      return;
    }

    if (nbf > this.time) {
      throw new Errors.ImmatureSignature();
    }
  }

  verify_iat() {
    const iat = parse(this.body.iat);

    if (!this.body.iat) {
      return;
    }

    if (iat > this.time) {
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
