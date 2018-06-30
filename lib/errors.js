import { supportedAlgorithms } from './algorithms';

export class InvalidStructure extends Error {
  constructor() {
    super(arguments);

    this.message = 'Token must be in the format: header.body.signature';
  }
}

export class SignatureInvalid extends Error {
  constructor() {
    super(arguments);

    this.message = 'Invalid token signature';
  }
}

export class InvalidHeader extends Error {
  constructor() {
    super(arguments);

    this.message = 'Invalid token header format';
  }
}

export class InvalidBody extends Error {
  constructor() {
    super(arguments);

    this.message = 'Invalid token body format';
  }
}

export class AlgorithmMissing extends Error {
  constructor() {
    super(arguments);

    this.message = 'Algorithm specified in header is missing';
  }
}

export class AlgorithmNotSupported extends Error {
  constructor() {
    super(arguments);

    const supported = supportedAlgorithms.join(', ');
    this.message = `Algorithm not supported. Supported algorithms are: ${supported}`;
  }
}

export class TokenExpired extends Error {
  constructor() {
    super(arguments);

    this.message = `Token has expired`;
  }
}

export class ImmatureSignature extends Error {
  constructor() {
    super(arguments);

    this.message = `Token used before becoming valid`;
  }
}

export class IssuedAtInvalid extends Error {
  constructor() {
    super(arguments);

    this.message = `Issued At claim is invalid`;
  }
}

export class InvalidSubject extends Error {
  constructor() {
    super(arguments);

    this.message = `Subject is invalid`;
  }
}

export class InvalidIssuer extends Error {
  constructor() {
    super(arguments);

    this.message = `Issuer is invalid`;
  }
}

export class InvalidAudience extends Error {
  constructor() {
    super(arguments);

    this.message = `Audience is invalid`;
  }
}
