import View from './components/view';

import './styles.css';

const view = new View();

view.setProps({
  container: document.querySelector('.js-example-slider-1') as HTMLDivElement,
  min: 10,
  max: 20,
  currents: [12, 18],
  intervals: [true, false, true],
  orientation: 'horizontal',
  tooltipOptions: {
    enabled: false,
    alwaysShown: false
  },
  onDragHandler: (i: number, coord: number) => console.log(i, coord)
});

view.render();