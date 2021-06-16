import Handler from '../namespace';

namespace HandlerTest {
  export type Orientation = Handler.Props['orientation'];

  export type Props = { orientation: Orientation, type: Handler.HandleType }

  export type DragMap = { delta: number, expected: number }[];

  export type MoveMap = {
    type: Handler.HandleType,
    test: { currents: Handler.Currents, expected: string }[]
  }[];

  export type GetSubjects = (props: Props) => { handler: Handler.Interface, node: Handler.Node };
}

export default HandlerTest;