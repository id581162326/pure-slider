import Namespace from './namespace';

const baseProps = {
  range: [0, 100] as [number, number],
  bemBlockClassName: {
    base: 'pure-slider',
    theme: '-slider'
  }
}

export const getMoveMapArray: (container: HTMLElement) => Namespace.MoveMap[] = (container) => [
  {
    props: {
      ...baseProps,
      type: 'inner',
      container,
      orientation: 'vertical',
    },
    test: [
      {
        value: [50, 60],
        expected: {
          size: '10%',
          position: '50%'
        }
      }
    ]
  },
  {
    props: {
      ...baseProps,
      type: 'inner',
      container,
      orientation: 'horizontal'
    },
    test: [
      {
        value: [50, 60],
        expected: {
          size: '10%',
          position: '50%'
        }
      }
    ]
  },
  {
    props: {
      ...baseProps,
      type: 'from-start',
      container,
      orientation: 'vertical'
    },
    test: [
      {
        value: [50, 60],
        expected: {
          size: '50%',
          position: '0%'
        }
      }
    ]
  },
  {
    props: {
      ...baseProps,
      type: 'from-start',
      container,
      orientation: 'horizontal'
    },
    test: [
      {
        value: [50, 60],
        expected: {
          size: '50%',
          position: '0%'
        }
      }
    ]
  },
  {
    props: {
      ...baseProps,
      type: 'to-end',
      container,
      orientation: 'vertical'
    },
    test: [
      {
        value: [50, 60],
        expected: {
          size: '40%',
          position: '60%'
        }
      }
    ]
  },
  {
    props: {
      ...baseProps,
      type: 'to-end',
      container,
      orientation: 'horizontal'
    },
    test: [
      {
        value: [50, 60],
        expected: {
          size: '40%',
          position: '60%'
        }
      }
    ]
  }
];