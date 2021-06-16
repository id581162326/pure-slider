import Namespace from './namespace.test';

export const initMap: Namespace.InitMap = [
  {
    orientation: 'horizontal',
    showTooltip: true
  },
  {
    orientation: 'horizontal',
    showTooltip: false
  },
  {
    orientation: 'vertical',
    showTooltip: true
  },
  {
    orientation: 'vertical',
    showTooltip: false
  }
];

export const dragMap: Namespace.DragMap = [
  {delta: 30, expected: 30},
  {delta: -30, expected: -30}
];

export const moveMap: Namespace.MoveMap = [
  {
    type: 'start',
    test: [
      {
        currents: [25],
        expected: 25
      },
      {
        currents: [50],
        expected: 50
      },
      {
        currents: [75],
        expected: 75
      },
      {
        currents: [0, 25],
        expected: 0
      }
    ]
  },
  {
    type: 'end',
    test: [
      {
        currents: [0, 25],
        expected: 25
      },
      {
        currents: [0, 50],
        expected: 50
      },
      {
        currents: [0, 75],
        expected: 75
      },
      {
        currents: [50, 100],
        expected: 100
      }
    ]
  }
];