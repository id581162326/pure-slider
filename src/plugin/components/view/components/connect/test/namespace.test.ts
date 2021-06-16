import Connect from '../namespace';

namespace ConnectTest {
  export type Orientation = Connect.Props['orientation'];

  export type MoveMap = {
    type: Connect.Props['type'],
    test: {
      value: Connect.Currents,
      expected: {
        size: string,
        position: string
      }
    }[]
  }[];

  export type GetSubjects = (props: {type: Connect.Props['type'], orientation: Orientation}) => {connect: Connect.Interface, node: Connect.Node};
}

export default ConnectTest;