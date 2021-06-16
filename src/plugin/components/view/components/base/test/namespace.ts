import Base from '../namespace';

namespace BaseTest {
  export type Orientation = Base.Props['orientation'];

  export type GetSubjects = (orientation: Orientation) => {base: Base.Interface, node: Base.Node};

  export type ClickMap = {
    clientX: number,
    clientY: number,
    expected: number
  }[];
}

export default BaseTest;