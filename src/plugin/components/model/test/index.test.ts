import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../helpers';

import Model from '../index';

import * as D from './data.test';
import Namespace from './namespace';

const getSubjects: Namespace.GetSubjects = () => {
  const model: Namespace.ModelInterface = Model.of(D.initState.state);

  const mockView: Namespace.MockView = new D.MockView();

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

  return ({model, mockView, listener})
};

describe('Model', () => {
  describe('Method of', () => {
    const model = Model.of(D.initState.state);

    it('should init instance', () => {
      const actual = model instanceof Model;

      expect(true).toEqual(actual);
    });
  })

  describe('Method getState', () => {
    const {model} = getSubjects();

    it('should get state', () => {
      const actual = model.getState();
      const expected = D.initState.expected;

      expect(expected).toEqual(actual);
    });
  });

  describe('Method attachListener', () => {
    const {model, mockView, listener} = getSubjects();

    model.attachListener(listener);

    it('should attach listener', () => {
      const actual = pipe(model.getListeners(), H.nthOrNone(0, {update: (_) => {}}));

      expect(listener).toEqual(actual);
    });

    it('should update listener', () => {
      const actual = mockView.getState();
      const expected = model.getState();

      expect(expected).toEqual(actual);
    });
  });

  describe('Method update', () => {
    A.map(({tests, description}: Namespace.UpdateTestMap) => {
      it(description, () => {
        A.map(({expected, action}: ArrayElement<Namespace.UpdateTestMap['tests']>) => {
          const {model, mockView, listener} = getSubjects();

          model.attachListener(listener);
          model.update(action);

          const modelState = model.getState();
          const mockViewState = mockView.getState();

          expect(expected).toEqual(modelState);
          expect(expected).toEqual(mockViewState);
        })(tests);
      });
    })(D.updateTestMap);
  });

  describe('Method getListeners', () => {
    const {model, listener} = getSubjects();

    it('should get listeners', () => {
      model.attachListener(listener);

      const actual = model.getListeners();

      const expected = [listener];

      expect(expected).toEqual(actual);
    });
  });
});


