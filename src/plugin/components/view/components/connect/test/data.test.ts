import Namespace from './namespace';

export const moveMap: Namespace.MoveMap = [
  {
    type: 'inner',
    test: [
      {
        value: [50, 60],
        expected: {
          size: '10%',
          position: '50%'
        }
      },
      {
        value: [55, 60],
        expected: {
          size: '5%',
          position: '55%'
        }
      },
      {
        value: [50, 50],
        expected: {
          size: '0%',
          position: '50%'
        }
      }
    ]
  },
  {
    type: 'from-start',
    test: [
      {
        value: [50, 60],
        expected: {
          size: '50%',
          position: '0%'
        }
      }
      ,{
        value: [0, 60],
        expected: {
          size: '0%',
          position: '0%'
        }
      }
    ]
  },
  {
    type: 'to-end',
    test: [
      {
        value: [50, 60],
        expected: {
          size: '40%',
          position: '60%'
        }
      },
      {
        value: [60, 65],
        expected: {
          size: '35%',
          position: '65%'
        }
      },
      {
        value: [60, 100],
        expected: {
          size: '0%',
          position: '100%'
        }
      }
    ]
  },
];