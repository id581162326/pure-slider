import {addIndex, curry, dec, forEach, isNil, map, nth, reduce, subtract} from 'ramda';

export const throwError = (name: string, message: string): void => {
  const error = new Error();
  
  error.name = name;
  error.message = message;
  
  throw error;
};

export const isDefined = (val: unknown) => !isNil(val);

export const subtractAdjacent = curry((index, arr) => subtract(nth(index, arr), nth(dec(index), arr)));

export const reduceIndexed = addIndex(reduce);

export const mapIndexed = addIndex(map);

export const forEachIndexed = addIndex(forEach);

export const trace = (val: unknown) => {
  console.log(val);
  
  return (val);
}