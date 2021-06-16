import Tooltip from '../namespace';

namespace TooltipTest {
  export type Orientation = Tooltip.Props['orientation'];

  export type GetSubjects = (props: { orientation: Orientation, alwaysShown: boolean }) => { tooltip: Tooltip.Interface, node: Tooltip.Node };
}

export default TooltipTest;