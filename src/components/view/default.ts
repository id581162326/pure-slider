import View from './namespace';

const defaultProps: View.Props = {
  container: document.createElement('div'),
  min: 0,
  max: 10,
  currents: [5],
  intervals: [false, false],
  orientation: 'horizontal',
  tooltipOptions: {
    enabled: false
  },
  bemBlockClassName: 'pure-slider-theme',
  onDragHandler: (i: number, coord: number) => console.log(i, coord)
};

export default defaultProps;