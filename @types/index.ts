interface Array<T> {
  // T[] | [T] enforces a tuple type. {[K in keyof this]: U} keeps a mapped tuple type.
  map<U>(callbackfn: (value: T, index: number, tuple: T[] | [T]) => U, thisArg?: any): {[K in keyof this]: U}
}