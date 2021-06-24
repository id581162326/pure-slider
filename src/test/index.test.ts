import * as A from 'fp-ts/Array';

import * as Helpers from 'helpers/test/data';
import * as Model from 'components/model/test/data';
import * as Observer from 'components/observer/test/data';

import Test from 'test/interface';

const runTest = (test: Test<any>) => describe(test.title, () => {
  it(test.description, () => {
    A.map(test.run)(test.map);
  });
});

describe('Helpers', () => {
  describe('Debug functions', () => runTest(Helpers.traceTest));

  describe('Misc functions', () => A.map(runTest)([
    Helpers.toStringTest, Helpers.propTest, Helpers.identTest, Helpers.callWithTest,
    Helpers.instantiateTest, Helpers.switchCasesTest
  ]));

  describe('Boolean functions', () => A.map(runTest)([
    Helpers.notTest, Helpers.eqTest
  ]));

  describe('Math functions', () => A.map(runTest)([
    Helpers.subTest, Helpers.addTest, Helpers.decTest, Helpers.incTest,
    Helpers.divTest, Helpers.multTest, Helpers.halfTest, Helpers.negate,
    Helpers.percentageTest, Helpers.remainderTest
  ]));

  describe('Array functions', () => A.map(runTest)([
    Helpers.nthOrNoneTest, Helpers.subAdjacentTest
  ]));

  describe('DOM functions', () => A.map(runTest)([
    Helpers.nodeTest, Helpers.appendToTest, Helpers.addClassListTest, Helpers.removeClassListTest,
    Helpers.setInlineStyleTest, Helpers.setInnerTextTest, Helpers.addEventListenerTest, Helpers.removeEventListenerTest,
    Helpers.querySelectorTest, Helpers.querySelectorAllTest
  ]));
});

describe('Model', () => A.map(runTest)([
  Model.initTestWithValidState, Model.initTestWithInvalidRange, Model.initTestWithInvalidStep,
  Model.initTestWithInvalidMargin, Model.initTestWithInvalidCoordinates, Model.dispatchTest
]));

describe('Observer', () => A.map(runTest)([
  Observer.attachTest, Observer.detachTest, Observer.dispatchTest
]));