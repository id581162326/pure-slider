import View from './namespace';

export const defaultProps: View.Props = {
  container: document.createElement('div'),
  min: 0,
  max: 10,
  intervals: [false, false],
  orientation: 'horizontal',
  tooltipOptions: {
    enabled: false
  },
  bemBlockClassName: 'pure-slider-theme',
  onDragHandler: (currents) => console.log(currents)
};

export const defaultState: View.State = {
  currents: [5]
}