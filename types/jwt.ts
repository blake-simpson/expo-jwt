import { SupportedAlgorithms } from './algorithms';

export type JWTBody<T = any> = Record<string, T>;

export type JWTToken = string;

export type JWTHeader = {
  alg: EncodingOptions['algorithm'];
  typ: string;
};

export type EncodingOptions = {
  algorithm?: SupportedAlgorithms;
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

export type EncodingKey = string;
