import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {flow, pipe} from 'fp-ts/function';

import * as H from '../../../../../helpers';

import Element from '../element';
import Unit from '../unit';

import Namespace from './namespace';

class Scale extends Element<Namespace.Props, Namespace.Node> implements Namespace.Interface {
  static of: Namespace.Of = (props) => new Scale(props);

  public readonly getUnits: Namespace.GetUnits = () => this.units;

  public readonly moveTo: Namespace.MoveTo = (currents) => {
    const {type} = this.props;

    const first = pipe(currents, NEA.head);
    const second = pipe(currents, NEA.last);

    const isEqualTo = (value: number) => (bool: boolean, x: number) => x === value ? true : bool;

    const currentsHasEqualTo = (value: number) => pipe(currents, A.reduce(false, isEqualTo(value)));

    const isLessThanFirst = (value: number): boolean => value <= first;
    const isMoreThanSecond = (value: number): boolean => value >= second;

    const isOuterRange = (value: number): boolean => isLessThanFirst(value) || isMoreThanSecond(value);
    const isInnerRange = (value: number): boolean => value >= first && value <= second;

    const setUnitActive = ({getValue, setActive}: Namespace.Unit) => flow(
      getValue,
      type === 'outer-range'
        ? isOuterRange : type === 'inner-range'
          ? isInnerRange : type === 'from-start'
            ? isLessThanFirst : type === 'to-end'
              ? isMoreThanSecond : currentsHasEqualTo,
      setActive
    )();

    A.map(setUnitActive)(this.units);
  };

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'), 'scale');

    this.units = this.renderUnits();

    this.setClassList();
    this.appendUnits();
  }

  private readonly units: Namespace.Unit[];

  private readonly renderUnits: Namespace.RenderSteps = () => {
    const {step, range, container, orientation, bemBlockClassName, withValue, showValueEach, onClick} = this.props;

    const unitCountLimit = 20;
    const unitsCount = pipe(range, H.subAdjacent(1), H.div(step), Math.ceil);
    const unitMult = pipe(unitsCount, H.div(unitCountLimit), Math.ceil);

    const min = pipe(range, NEA.head);
    const max = pipe(range, NEA.last);

    const units: Namespace.Unit[] = [];

    const arrayToFill: null[] = new Array(pipe(unitsCount > unitCountLimit
      ? unitCountLimit
      : unitsCount, H.inc)).fill(null);

    const valueFrom = (idx: number): number => pipe(idx, H.mult(step), H.add(min));

    const getUnitProps = (idx: number): Namespace.UnitProps => ({
      range, container, orientation, bemBlockClassName, onClick,
      withValue: withValue && (idx === 0 || (
        pipe(idx, H.div(showValueEach), H.decimal(1)) === 0 &&
        pipe(idx, H.inc, H.mult(unitMult), valueFrom) <= max
      ) || pipe(idx, H.mult(unitMult), valueFrom) >= max),
      value: pipe(idx, H.mult(unitMult), valueFrom, (x) => x >= max ? max : x)
    });

    const pushUnit = (idx: number) => units.push(pipe(idx, getUnitProps, Unit.of));

    A.mapWithIndex(pushUnit)(arrayToFill);

    return (units);
  };

  private readonly appendUnits: Namespace.AppendUnits = () => {
    pipe(this.units, A.map((x) => x.getNode()), H.appendChildListTo(this.node));
  };
}

export default Scale;