import View from './components/view';
import Model from './components/model';

import './styles.css';

const model = new Model();

const view = new View();

model.setProps({
  min: 100000,
  max: 1000000,
  step: 1000,
  margin: 100000
});

model.setState({
  currents: [250000, 500000, 750000, 900000]
});

model.setListener({
  update: (a) => {
    view.updateState({type: 'UPDATE_HANDLERS_POSITION', currents: a.currents});
  }
});

view.setProps({
  container: document.querySelector('.js-example-slider-1') as HTMLDivElement,
  min: 100000,
  max: 1000000,
  intervals: [false, true, false, true, false],
  orientation: 'horizontal',
  tooltipOptions: {
    enabled: false,
    alwaysShown: false
  },
  onDragHandler: (currents) => model.updateState({type: 'UPDATE_CURRENTS', currents})
});

view.setState({
  currents: [250000, 500000, 750000, 900000]
});

view.render();

