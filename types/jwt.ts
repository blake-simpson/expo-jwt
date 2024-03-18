import { SupportedAlgorithms } from './algorithms';

export type JWTStandardClaims = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}

export type JWTBody<T = Record<string, any>> = T & JWTStandardClaims;

export type JWTToken = string;

export type JWTHeader = {
  alg: EncodingOptions['algorithm'];
  typ: string;
};

export type EncodingOptions = {
  algorithm?: SupportedAlgorithms;
};

export type DecodingOptions = EncodingOptions & {
  exp?: number;
  nbf?: number;
  iat?: number;
  sub?: string;
  iss?: string;
  aud?: string;
  timeSkew?: number;
};

export type EncodingKey = string | null;
