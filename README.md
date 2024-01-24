# expo-jwt [![Build Status](https://app.travis-ci.com/blake-simpson/expo-jwt.svg?branch=master)](https://app.travis-ci.com/blake-simpson/expo-jwt)

A library for encoding or decoding JSON Web Tokens (JWT) in an Expo based React
Native project.

In an Expo project the JavaScript environment is not node.js so specific objects
such as `Stream` are not available, rendering many of the popular node-based JWT
libraries on NPM unusable with Expo.

Additionally unless the Expo project is "ejected" there is no access to the
iOS/Android native code as other React Native specific JWT libraries have done.

This library implements HMAC-SHA signing for JWT by using Crypto.JS in pure
JavaScript so it can be used inside of an Expo project.

## Supported Algorithms

| HS256 | HS384 | HS512 | RS256 | RS384 | RS512 | ES256 | ES384 | ES512 |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| Yes   | Yes   | Yes   | No    | No    | No    | No    | No    | No    |

## Supported Claims

| exp | nbf | iat | sub | iss | aud | jti |
|-----|-----|-----|-----|-----|-----|-----|
| Yes | Yes | Yes | Yes | Yes | Yes | No  |

## Installation

```bash
npm install --save expo-jwt
```

## Usage

### Encode

```js
import JWT, { SupportedAlgorithms } from 'expo-jwt';

const key = 'shh';

JWT.encode({ foo: 'bar' }, key);
// => eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.YVoZ0LkWCMCnwEf7Nju2SJt_9mseJP1Q3RvCz4frGwM

JWT.encode({ foo: 'bar' }, key, { algorithm: SupportedAlgorithms.HS512 });
// => eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.Kyojwz8Z5SckLbMU-EImuzHEjjg_1apSOLz_tsZQj1025OH--qaORzkHUkScScd8-RZnWUdCu0epiaofQZNkBA

JWT.encode({ foo: 'bar' }, key, { algorithm: SupportedAlgorithms.NONE });
// => eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJmb28iOiJiYXIifQ.
```

### Decode

```js
import JWT from 'expo-jwt';

const key = 'shh';
const token =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.Kyojwz8Z5SckLbMU-EImuzHEjjg_1apSOLz_tsZQj1025OH--qaORzkHUkScScd8-RZnWUdCu0epiaofQZNkBA';

JWT.decode(token, key);
// => { foo: 'bar' }
```

## TypeScript

If you would like to take advantage of a typed `decode` object body, you may pass a generic:

```ts
const foo = JWT.decode(token, key);
// foo.body === any

type MyType = Record<string, number>;
const bar = JWT.decode<MyType>(token, key);
// bar.body === MyType
```

## JWT Claims

The claims `exp`, `nbf`, and `iat` will automatically be verified if the decoded
payload of the JWT contains any of them.

The `iss`, `sub`, and `aud` claims can be verified by passing in the expected
value to the `decode` options.

```js
// Issuer - iss
JWT.decode(token, key, { iss: 'expected-issuer' });

// Subject - sub
JWT.decode(token, key, { sub: 'expected-subject' });

// Audience - aud
JWT.decode(token, key, { aud: 'expected-audience' });
```

### Time Skew

As mentioned in [issue 7](https://github.com/kartenmacherei/expo-jwt/issues/7)
certain device clocks may be slightly off, causing time based claims to fail. If
you are experiencing this issue you can pass the option `timeSkew` to
`JWT.decode` which will take this into account.

The value of this parameter is the number of seconds that the claim can be
skewed by. Example:

```js
// Allow verification of tokens that include "exp", "nbf", or "iat" claims
// within an additional 30 seconds of the system time.
JWT.decode(token, key, { timeSkew: 30 });
```
