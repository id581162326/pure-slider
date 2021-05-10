import View from './components/view';

import './styles.css';

const view = new View();

view.setProps({
  container: document.querySelector('.js-example-slider-1') as HTMLDivElement,
  min: 0,
  max: 10,
  currents: [3, 7],
  intervals: [true, false, true],
  orientation: 'horizontal',
  tooltipOptions: {
    enabled: false,
    alwaysShown: false
  },
  customBlockClassName: 'example-slider',
  onDragHandler: (i: number, coord: number) => console.log(i, coord)
});

view.render();