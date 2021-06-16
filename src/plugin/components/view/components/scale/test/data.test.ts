import Namespace from './namespace.test';

export const moveMap: Namespace.MoveMap = [
  {
    type: 'from-start',
    test:  [
      [0],
      [50],
      [25, 75],
      [100]
    ]
  },
  {
    type: 'to-end',
    test:  [
      [0],
      [50],
      [25, 75],
      [100]
    ]
  },
  {
    type: 'inner-range',
    test:  [
      [0],
      [50],
      [25, 75],
      [100]
    ]
  },
  {
    type: 'outer-range',
    test: [
      [0],
      [50],
      [25, 75],
      [100]
    ]
  },
  {
    type: 'single',
    test: [
      [0],
      [50],
      [25, 75],
      [100]
    ]
  }
];