import JWT from '../dist/lib/index';

type MyData = {
  foo: {
    bar: number;
  };
};

const key = 'shhh';
const data = { foo: { bar: 42 } };

const encoded = JWT.encode(data, key);
console.log(encoded);

const decoded = JWT.decode<MyData>(encoded, key);
console.log(decoded);

const bar = decoded.body.foo.bar;
console.log(bar);

const decodedWithNoType = JWT.decode(encoded, key);
console.log(decodedWithNoType.body);
