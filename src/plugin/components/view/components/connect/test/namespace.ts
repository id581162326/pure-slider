import Connect from '../namespace';

namespace TestData {
  export type Orientation = Connect.Props['orientation'];

  export interface MoveMap {
    props: Connect.Props,
    test: {
      value: Connect.Currents,
      expected: {
        size: string,
        position: string
      }
    }[]
  }
}

export default TestData;