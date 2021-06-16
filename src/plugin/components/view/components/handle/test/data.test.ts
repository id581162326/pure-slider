import Namespace from './namespace.test';

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
        expected: 'calc(25% - 0px)'
      },
      {
        currents: [50],
        expected: 'calc(50% - 0px)'
      },
      {
        currents: [75],
        expected: 'calc(75% - 0px)'
      },
      {
        currents: [0, 25],
        expected: 'calc(0% - 0px)'
      }
    ]
  },
  {
    type: 'end',
    test: [
      {
        currents: [0, 25],
        expected: 'calc(25% - 0px)'
      },
      {
        currents: [0, 50],
        expected: 'calc(50% - 0px)'
      },
      {
        currents: [0, 75],
        expected: 'calc(75% - 0px)'
      },
      {
        currents: [50, 100],
        expected: 'calc(100% - 0px)'
      }
    ]
  }
];