import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as R from 'fp-ts/Record';

import * as helpersTest from 'helpers/test';
import * as modelTest from 'plugin/model/test';
import * as observerTest from 'plugin/observer/test';
import * as viewHandleTest from 'view-elements/handle/test';
import * as viewBaseTest from 'view-elements/base/test';
import * as viewConnectTest from 'view-elements/connect/test';
import * as viewTooltipTest from 'view-elements/tooltip/test';
import * as viewUnitTest from 'view-elements/unit/test';

import Test from 'test/interface';

const runTest = (test: Test<any>) => describe(test.title, () => it(test.description, () => {
  A.map(test.run)(test.map);
}));

const getTestsFrom = <Key extends string, Value extends Test<any>>(data: Record<Key, Value>) => pipe(
  data, R.toArray, A.map(([_, value]) => value)
);

const testDataMap: [string, Record<string, Test<any>>][] = [
  ['Helpers', helpersTest],
  ['Model', modelTest],
  ['Observer', observerTest],
  ['View handle', viewHandleTest],
  ['View base', viewBaseTest],
  ['View connect', viewConnectTest],
  ['View tooltip', viewTooltipTest],
  ['View unit', viewUnitTest]
];

pipe(testDataMap, A.map(([title, data]) => describe(title, () => pipe(data, getTestsFrom, A.map(runTest)))));