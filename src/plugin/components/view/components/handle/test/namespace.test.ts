import Handle from '../namespace';

namespace HandleTest {
  export type Orientation = Handle.Props['orientation'];

  export type Props = { orientation: Orientation, type: Handle.HandleType, showTooltip: boolean }

  export type DragMap = { delta: number, expected: number }[];

  export type InitMap = { orientation: Orientation, showTooltip: boolean }[]

  export type MoveMap = {
    type: Handle.HandleType,
    test: { currents: Handle.Currents, expected: number }[]
  }[];

  export type GetSubjects = (props: Props) => { handle: Handle.Interface, node: Handle.Node, tooltip: Handle.Tooltip };
}

export default HandleTest;