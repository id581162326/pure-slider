/* ramda */
import {any, curry, gt, ifElse, lt, lte, or, prop, T} from 'ramda';
/* locals */
import Model from './namespace';
/* helpers */
import {throwError} from '../../globals/helpers';

const min = prop('min');
const max = prop('max');
const step = prop('step');
const margin = prop('margin');
const currents = prop('currents');
const range = (state: Model.State) => max(state) - min(state);

const invalidState = throwError('Invalid state');

type Validate = (bool: boolean, errorMessage: string) => void;

const validate = curry(((bool, errorMessage) => ifElse(
  () => bool,
  () => T,
  () => invalidState(errorMessage)
)(bool)) as Validate);

type ValidateState = (state: Model.State) => void;

const validateEndPoints: ValidateState = (state) => validate(
  lte(range(state), 0),
  'Range value must not be less than zero or equal to it'
);

const validateStep: ValidateState = (state) => validate(
  gt(step(state), range(state)),
  'Step value must not be more than range value'
);

const validateMargin: ValidateState = (state) => validate(
  gt(margin(state), range(state)),
  'Margin value must not be more than range value'
);

const validateCurrents: ValidateState = (state) => validate(
  any((current: number) => or(lt(current, min(state)), gt(current, max(state))), currents(state)),
  'Current value must not be out of range'
);

const validateState: ValidateState = (state) => {
  validateEndPoints(state);
  validateStep(state);
  validateMargin(state);
  validateCurrents(state);
}
export default class implements Model.Interface {
  state: Model.State;

  setState = (newState: Model.State) => {
    validateState(newState);

    this.state = newState;
  };
}