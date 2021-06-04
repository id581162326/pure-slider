import Namespace from './namespace';

export class MockView implements Namespace.MockView {
  public readonly getState: Namespace.GetState = () => this.state;

  public readonly update: Namespace.Update = (state) => this.state = {...this.state, ...state};

  private state: Namespace.State = {
    step: 0,
    currents: [0],
    range: [0, 0],
    margin: 0
  };
}

export const initState: Namespace.StateMap = {
  state: {
    currents: [0, 0],
    range: [-100, 100],
    step: 10,
    margin: 10
  },
  expected: {
    currents: [0, 10],
    range: [-100, 100],
    step: 10,
    margin: 10
  }
};

export const updateTestMap: Namespace.UpdateTestMap[] = [
  {
    description: 'should update currents',
    tests: [
      {
        action: {type: 'UPDATE_CURRENTS', currents: [-100, -95]},
        expected: {
          ...initState.expected,
          currents: [-100, -90]
        }
      },
      {
        action: {type: 'UPDATE_CURRENTS', currents: [90, 1000]},
        expected: {
          ...initState.expected,
          currents: [90, 100]
        }
      },
      {
        action: {type: 'UPDATE_CURRENTS', currents: [-1000, -90]},
        expected: {
          ...initState.expected,
          currents: [-100, -90]
        }
      },
      {
        action: {type: 'UPDATE_CURRENTS', currents: [-1000, -1000]},
        expected: {
          ...initState.expected,
          currents: [-100, -90]
        }
      },
      {
        action: {type: 'UPDATE_CURRENTS', currents: [1000, 1000]},
        expected: {
          ...initState.expected,
          currents: [90, 100]
        }
      },
      {
        action: {type: 'UPDATE_CURRENTS', currents: [0, 0]},
        expected: {
          ...initState.expected,
          currents: [0, 10]
        }
      }
    ]
  },
  {
    description: 'should update step',
    tests: [
      {
        action: {type: 'UPDATE_STEP', step: 15},
        expected: {
          ...initState.expected,
          step: 15,
          currents: [-10, 5]
        }
      },
      {
        action: {type: 'UPDATE_STEP', step: -1000},
        expected: {
          ...initState.expected,
          step: 1
        }
      },
      {
        action: {type: 'UPDATE_STEP', step: 1000},
        expected: {
          ...initState.expected,
          step: 200,
          currents: [-100, -90]
        }
      }
    ]
  },
  {
    description: 'should update range',
    tests: [
      {
        action: {type: 'UPDATE_RANGE', range: [100, 500]},
        expected: {
          ...initState.expected,
          range: [100, 500],
          currents: [100, 110]
        }
      },
      {
        action: {type: 'UPDATE_RANGE', range: [-100, -500]},
        expected: {
          ...initState.expected,
          range: [-500, -100],
          currents: [-110, -100]
        }
      },
      {
        action: {type: 'UPDATE_RANGE', range: [-100, -100]},
        expected: {
          ...initState.expected,
          range: [-100, -99],
          currents: [-100, -99],
          step: 1,
          margin: 1
        }
      },
      {
        action: {type: 'UPDATE_RANGE', range: [100, 100]},
        expected: {
          ...initState.expected,
          range: [99, 100],
          currents: [99, 100],
          step: 1,
          margin: 1
        }
      },
      {
        action: {type: 'UPDATE_RANGE', range: [0, 0]},
        expected: {
          ...initState.expected,
          range: [0, 1],
          currents: [0, 1],
          step: 1,
          margin: 1
        }
      }
    ]
  },
  {
    description: 'should update margin',
    tests: [
      {
        action: {type: 'UPDATE_MARGIN', margin: 25},
        expected: {
          ...initState.expected,
          margin: 25,
          currents: [0, 25]
        }
      },
      {
        action: {type: 'UPDATE_MARGIN', margin: -25},
        expected: {
          ...initState.expected,
          margin: 1
        }
      },
      {
        action: {type: 'UPDATE_MARGIN', margin: 1000},
        expected: {
          ...initState.expected,
          margin: 200,
          currents: [-100, 100]
        }
      }
    ]
  },
  {
    description: 'should toggle range',
    tests: [
      {
        action: {type: 'TOGGLE_RANGE'},
        expected: {
          ...initState.expected,
          currents: [0]
        }
      }
    ]
  }
];