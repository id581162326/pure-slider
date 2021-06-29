import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as R from 'fp-ts/Record';

import * as helpersTestData from 'helpers/test';
import * as modelTestData from 'plugin/model/test';
import * as observerTestData from 'plugin/observer/test';
import * as viewHandleTestData from 'view-components/handle/test';
import * as viewBaseTestData from 'view-components/base/test';
import * as viewConnectTestData from 'view-components/connect/test';

import Test from 'test/interface';

const runTest = (test: Test<any>) => describe(test.title, () => it(test.description, () => {
  A.map(test.run)(test.map);
}));

const getTestsFrom = <Key extends string, Value extends Test<any>>(data: Record<Key, Value>) => pipe(
  data, R.toArray, A.map(([_, value]) => value)
);

const testDataMap: [string, Record<string, Test<any>>][] = [
  ['Helpers', helpersTestData],
  ['Model', modelTestData],
  ['Observer', observerTestData],
  ['View handle', viewHandleTestData],
  ['View base', viewBaseTestData],
  ['View connect', viewConnectTestData]
];

pipe(testDataMap, A.map(([title, data]) => describe(title, () => pipe(data, getTestsFrom, A.map(runTest)))));