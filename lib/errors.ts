import { supportedAlgorithms } from './algorithms';

export class InvalidStructure extends Error {
  constructor() {
    super('Token must be in the format: header.body.signature');
  }
}

export class SignatureInvalid extends Error {
  constructor() {
    super('Invalid token signature');
  }
}

export class InvalidHeader extends Error {
  constructor() {
    super('Invalid token header format');
  }
}

export class InvalidBody extends Error {
  constructor() {
    super('Invalid token body format');
  }
}

export class AlgorithmMissing extends Error {
  constructor() {
    super('Algorithm specified in header is missing');
  }
}

export class AlgorithmNotSupported extends Error {
  constructor() {
    const supported = supportedAlgorithms.join(', ');

    super(`Algorithm not supported. Supported algorithms are: ${supported}`);
  }
}

export class TokenExpired extends Error {
  constructor() {
    super('Token has expired');
  }
}

export class ImmatureSignature extends Error {
  constructor() {
    super('Token used before becoming valid');
  }
}

export class IssuedAtInvalid extends Error {
  constructor() {
    super('Issued At claim is invalid');
  }
}

export class InvalidSubject extends Error {
  constructor() {
    super('Subject is invalid');
  }
}

export class InvalidIssuer extends Error {
  constructor() {
    super('Issuer is invalid');
  }
}

export class InvalidAudience extends Error {
  constructor() {
    super('Audience is invalid');
  }
}
