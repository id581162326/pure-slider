import Model from './namespace';

export const defaultProps: Model.Props = {
  min: 0,
  max: 10,
  step: 1,
  margin: 1
};

export const defaultState: Model.State = {
  currents: [5]
};