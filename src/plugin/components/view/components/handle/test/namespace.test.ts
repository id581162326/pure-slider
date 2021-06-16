import Handle from '../namespace';

namespace HandleTest {
  export type Orientation = Handle.Props['orientation'];

  export type Props = { orientation: Orientation, type: Handle.HandleType }

  export type DragMap = { delta: number, expected: number }[];

  export type MoveMap = {
    type: Handle.HandleType,
    test: { currents: Handle.Currents, expected: string }[]
  }[];

  export type GetSubjects = (props: Props) => { handle: Handle.Interface, node: Handle.Node };
}

export default HandleTest;