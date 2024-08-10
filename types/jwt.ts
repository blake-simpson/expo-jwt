import { SupportedAlgorithms } from './algorithms';

export type JWTStandardClaims = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
};

export type JWTDefaultBody = Record<string, any>;
export type JWTBody<T = JWTDefaultBody> = T & JWTStandardClaims;

export type JWTToken = string;

export type HeaderOptions = {
  algorithm?: SupportedAlgorithms;
  alg?: SupportedAlgorithms;
  jku?: string;
  jwk?: string;
  kid?: string;
  x5u?: string;
  x5c?: string;
  x5t?: string;
  ['x5t#S256']?: string;
  cty?: string;
  crit?: string[];
};

export type JWTHeader = {
  alg: HeaderOptions['algorithm'];
  typ: string;
  jku?: string;
  jwk?: string;
  kid?: string;
  x5u?: string;
  x5c?: string;
  x5t?: string;
  ['x5t#S256']?: string;
  cty?: string;
  crit?: string[];
};

export type DecodingOptions = {
  exp?: number;
  nbf?: number;
  iat?: number;
  sub?: string;
  iss?: string;
  aud?: string;
  timeSkew?: number;
};

export type EncodingKey = string | null;
