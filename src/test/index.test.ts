import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as R from 'fp-ts/Record';
import * as NEA from 'fp-ts/NonEmptyArray';

import * as helpersTestData from 'helpers/test-data/index';
import * as modelTestData from 'model/test-data/index';
import * as observerTestData from 'observer/test-data/index';

import Test from 'test/interface';

const runTest = (test: Test<any>) => describe(test.title, () => it(test.description, () => {
  A.map(test.run)(test.map);
}));

const getTestsFrom = <Key extends string, Value extends Test<any>>(data: Record<Key, Value>) => pipe(
  data, R.toArray, A.map(NEA.last)
) as Test<any>[];

A.map(([title, data]: [string, object]) => describe(title, () => pipe(data, getTestsFrom, A.map(runTest))))([
  ['Helpers', helpersTestData],
  ['Model', modelTestData],
  ['Observer', observerTestData]
]);