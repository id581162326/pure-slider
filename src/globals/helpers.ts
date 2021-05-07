import {addIndex, compose, curry, dec, divide, forEach, isNil, map, multiply, nth, reduce, subtract} from 'ramda';

export const throwError = curry((name: string, message: string): void => {
  const error = new Error();

  error.name = name;
  error.message = message;

  throw error;
});

type IsDefined = (val: unknown) => boolean;

export const isDefined: IsDefined = (val) => !isNil(val);

type SubtractAdjacent = (index: number, array: number[]) => void;

export const subtractAdjacent = curry(((index, arr) => subtract(nth(index, arr), nth(dec(index), arr))) as SubtractAdjacent);

export const reduceIndexed = addIndex(reduce);

export const mapIndexed = addIndex(map);

export const forEachIndexed = addIndex(forEach);

type Trace = (val: unknown) => unknown;

export const trace: Trace = (val) => {
  console.log(val);

  return (val);
};

type Percentage = (x: number, y: number) => number;

export const percentage = curry(((x, y) => compose(
  multiply(100),
  divide(y)
)(x)) as Percentage);