import Namespace from 'view-managers/scale/namespace';
import ComponentManager from 'view-managers/component';
import {pipe} from 'fp-ts/function';
import * as H from 'helpers';
import * as A from 'fp-ts/Array';
import Unit from 'view-elements/unit';

class ScaleManager extends ComponentManager<Namespace.Props> implements Namespace.Interface {
  public readonly moveTo = (coordinates: Namespace.Props['coordinates']) => {
    return (this);
  };

  constructor(props: Namespace.Props) {
    super(props);

    this.units = this.renderUnits();
  }

  private readonly units;

  private readonly renderUnits = () => {
    const {orientation, step, bemBlockClassName} = this.props;

    const unitCount = this.getUnitCount();

    return (pipe(
      Array,
      H.instance(unitCount),
      A.mapWithIndex((idx) => pipe(Unit, H.instance({
        orientation,
        value: step * idx,
        showValue: false,
        bemBlockClassName,
        onClick: (_) => {}
      })))
    ));
  };

  private readonly getUnitCount = () => {
    const {step, range} = this.props;

    return (pipe(range, H.subAdjacent(1), H.div(step), Math.round));
  };
}

export default ScaleManager;