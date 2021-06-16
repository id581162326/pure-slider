import Scale from '../namespace';

namespace ScaleTest {
  export type Orientation = Scale.Props['orientation'];

  export type Unit = Scale.Unit;

  export type GetSubjects = (props: {orientation: Orientation, type: Scale.Type}) => { node: Scale.Node, scale: Scale.Interface, units: Unit[] };

  export type MoveMap = {
    type: Scale.Type,
    test: Scale.Currents[]
  }[];
}

export default ScaleTest;