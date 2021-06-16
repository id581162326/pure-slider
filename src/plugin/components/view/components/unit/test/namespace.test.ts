import Unit from '../namespace';

namespace UnitTest {
  export type Orientation = Unit.Props['orientation'];

  export type GetSubjects = (props: {value: number, orientation: Orientation, withValue: boolean}) => { unit: Unit.Interface, node: Unit.Node };
}

export default UnitTest;