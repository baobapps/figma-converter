import { Greeter } from '../index';

test('My Greeter', () => {
  expect(Greeter('Mouctar')).toBe('Hello Mouctar');
  expect(Greeter('John')).not.toBe('Hello Mouctar');
});
