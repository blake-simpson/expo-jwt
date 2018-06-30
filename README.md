# expo-jwt

A library for encoding or decoding JSON Web Tokens (JWT) in an Expo based React
Native project.

In an Expo project the JavaScript environment is not node so specific objects
such as `Stream` are not available, rendering many of the popular node-based JWT
libraries on NPM unusable with Expo.

Additionally, unless the Expo project is "ejected" there is no access to the
iOS/Android native code as other React Native specific JWT libraries have done.

This library implements HMAC-SHA signing for JWT by using Crypto.JS in pure
JavaScript so it can be used inside of Expo.

## Supported Algorithms

| HS256 | HS384 | HS512 | RS256 | RS384 | RS512 | ES256 | ES384 | ES512 |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Yes   | Yes   | Yes   | No    | No    | No    | No    | No    | No    |

## Supported Claims

| exp | nbf | iat | sub | iss | aud | jti |
| --- | --- | --- | --- | --- | --- | --- |
| Yes | Yes | Yes | Yes | Yes | Yes | No  |

## Installation

```bash
npm install expo-jwt
```

or

```bash
yarn add expo-jwt
```

## Usage

#### Encode

```js
import JWT from 'expo-jwt';

const key = 'shh';

JWT.encode({ foo: 'bar' }, key);
// => eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ==.MwMPn+JotG0ADbVQz8KgAXQkwT4Dd37499WucrGC6M4=

JWT.encode({ foo: 'bar' }, key, { algorithm: 'HS512' });
// => eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ==.mdsKdpOymFm2IqXTTtS1JLA/9XM1c/Cjo9IwZoRlFd8MshIjp/RifniPlz9Nq5LCVwa8xIFeKYeNu0pvNJl4JQ==

JWT.encode({ foo: 'bar' }, key, { algorithm: 'none' });
// => eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0=.eyJmb28iOiJiYXIifQ==.
```

#### Decode

```js
import JWT from 'expo-jwt';

const key = 'shh';
const token =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ==.mdsKdpOymFm2IqXTTtS1JLA/9XM1c/Cjo9IwZoRlFd8MshIjp/RifniPlz9Nq5LCVwa8xIFeKYeNu0pvNJl4JQ==';

JWT.decode(token, key);
// => { foo: 'bar' }
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
