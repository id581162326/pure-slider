// noinspection DuplicatedCode

import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';
import {assert} from 'chai';

import * as H from '../../../../helpers';

import Model from '../index';

import * as D from './data.test';
import Namespace from './namespace';

describe('Model', () => {
  describe('Method of', () => {
    it('should init instance', () => {
      const model = Model.of(D.initState.state);

      const actual = pipe(model, H.prop('getState'), H.call([]), H.ident);

      const expected = D.initState.expected;

      assert.deepEqual(actual, expected, `Must be ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
    });
  });

  describe('Method attachListener', () => {
    const model = Model.of(D.initState.state);

    const mockView = new D.MockView();

    const listener: Namespace.Listener = {
      update: (event) => {
        switch (event.type) {
          case 'CURRENTS_UPDATED': {
            mockView.update({currents: event.currents});

            break;
          }

          case 'RANGE_UPDATED': {
            mockView.update({range: event.range});

            break;
          }

          case 'STEP_UPDATED': {
            mockView.update({step: event.step});

            break;
          }

          case 'MARGIN_UPDATED': {
            mockView.update({margin: event.margin});


            break;
          }
        }
      }
    };

    model.attachListener(listener);

    it('should attach listener', () => {
      const actual = pipe(model.getListeners(), H.nthOrNone(0, {update: (_) => {}}));

      assert.deepEqual(actual, listener, `Must be ${JSON.stringify(listener)}, but got ${JSON.stringify(actual)}`);
    });

    it('should update listener', () => {
      const actual = mockView.getState();

      const expected = model.getState();

      assert.deepEqual(actual, expected, `Must be ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
    });
  });

  describe('Method update', () => {
    A.map(({tests, description}: Namespace.UpdateTestMap) => {
      it(description, () => {
        A.map(({expected, action}: ArrayElement<Namespace.UpdateTestMap['tests']>) => {
          const model = Model.of(D.initState.state);

          const mockView = new D.MockView();

          const listener: Namespace.Listener = {
            update: (event) => {
              switch (event.type) {
                case 'CURRENTS_UPDATED': {
                  mockView.update({currents: event.currents});

                  break;
                }

                case 'RANGE_UPDATED': {
                  mockView.update({range: event.range});

                  break;
                }

                case 'STEP_UPDATED': {
                  mockView.update({step: event.step});

                  break;
                }

                case 'MARGIN_UPDATED': {
                  mockView.update({margin: event.margin});


                  break;
                }
              }
            }
          };

          model.attachListener(listener);

          model.update(action);

          const modelState = model.getState();

          assert.deepEqual(modelState, expected, `Must be ${JSON.stringify(expected)}, but got ${JSON.stringify(modelState)}`);
        })(tests);
      });
    })(D.updateTestMap);
  });

  describe('Method getState', () => {
    it('should get state', () => {
      const model = Model.of(D.initState.state);

      const actual = model.getState();

      const expected = D.initState.expected;

      assert.deepEqual(actual, expected, `Must be ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
    });
  });

  describe('Method getListeners', () => {
    it('should get listeners', () => {
      const model = Model.of(D.initState.state);

      const mockView = new D.MockView();

      const listener: Namespace.Listener = {
        update: (event) => {
          switch (event.type) {
            case 'CURRENTS_UPDATED': {
              mockView.update({currents: event.currents});

              break;
            }

            case 'RANGE_UPDATED': {
              mockView.update({range: event.range});

              break;
            }

            case 'STEP_UPDATED': {
              mockView.update({step: event.step});

              break;
            }

            case 'MARGIN_UPDATED': {
              mockView.update({margin: event.margin});


              break;
            }
          }
        }
      };

      model.attachListener(listener);

      const actual = model.getListeners();

      const expected = [listener];

      assert.deepEqual(actual, expected, `Must be ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
    });
  });
});


