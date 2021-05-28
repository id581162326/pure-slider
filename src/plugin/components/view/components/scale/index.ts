import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {flow, pipe} from 'fp-ts/function';

import * as H from '../../../../../helpers';

import Element from '../element';
import Unit from '../unit';

import Namespace from './namespace';
import {div} from '../../../../../helpers';

class Scale extends Element<Namespace.Props, Namespace.Node> implements Namespace.Interface {
  static of: Namespace.Of = (props) => new Scale(props);

  public readonly moveTo: Namespace.MoveTo = (currents) => {
    const {connectType} = this.props;

    const isEqualTo = (value: number) => (bool: boolean, x: number) => x === value ? true : bool;

    const first = pipe(currents, NEA.head);

    const second = pipe(currents, NEA.last);

    const currentsHasEqualTo = (value: number) => pipe(currents, A.reduce(false, isEqualTo(value)));

    const isLessThanFirst = (value: number): boolean => value <= first;

    const isMoreThanSecond = (value: number): boolean => value >= second;

    const isOuterRange = (value: number): boolean => isLessThanFirst(value) || isMoreThanSecond(value);

    const isInnerRange = (value: number): boolean => value >= first && value <= second;

    const setUnitActive = ({getValue, setActive}: Namespace.Unit) => flow(
      getValue,
      connectType === 'outer-range'
        ? isOuterRange
        : connectType === 'inner-range'
        ? isInnerRange
        : connectType === 'from-start'
          ? isLessThanFirst
          : connectType === 'to-end'
            ? isMoreThanSecond
            : currentsHasEqualTo,
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

    const unitsCount = pipe(range, H.subAdjacent(1), H.div(step), Math.ceil, H.inc);

    const min = pipe(range, NEA.head);

    const max = pipe(range, NEA.last);

    const valueFrom = (x: number): number => pipe(step, H.mult(x), H.add(min));

    const getUnitProps = (idx: number): Namespace.UnitProps => ({
      range,
      container,
      orientation,
      bemBlockClassName,
      onClick,
      withValue: withValue && pipe(idx, unitsCount > 20 ? H.div(unitMult) : H.ident, H.div(showValueEach), H.decimal(1)) === 0,
      value: pipe(idx, valueFrom, (x) => x > max ? max : x)
    });

    const ofUnit = pipe(Unit, H.prop('of'));

    const units: Namespace.Unit[] = [];

    const unitMult = pipe(unitsCount, div(20), Math.trunc);

    const arrayToFill: null[] = new Array(unitsCount > 21 ? 21 : unitsCount).fill(null);

    const pushUnit = (idx: number) => units.push(pipe(
      idx,
      unitsCount > 21 ? flow(H.mult(unitMult)) : H.ident,
      getUnitProps,
      ofUnit
    ));

    A.mapWithIndex(pushUnit)(arrayToFill);

    return (units);
  };

  private readonly appendUnits: Namespace.AppendUnits = () => {
    A.map((unit: Namespace.Unit) => pipe(unit.getNode(), H.appendTo(this.node)))(this.units);
  };
}

export default Scale;