import {pipe} from 'fp-ts/function';

import * as H from '../../../../../helpers';

import Element from '../element';

import Namespace from './namespace';

class Unit extends Element<Namespace.Props, Namespace.Node> implements Namespace.Interface {
  static of: Namespace.Of = (props) => new Unit(props);

  public readonly setActive: Namespace.SetActive = (isActive) => {
    const {bemBlockClassName} = this.props;
    const {base, theme} = bemBlockClassName;

    const classList = [`${base}__unit_active`, `${theme}__unit_active`];

    isActive ? H.addClassList(classList)(this.node) : H.removeClassList(classList)(this.node);
  }

  public readonly updatePosition: Namespace.PlaceNode = () => {
    const {value, orientation} = this.props;

    const pos = pipe(value, this.correctToMin, this.percentOfRange);

    const style = orientation === 'horizontal' ? `left: ${pos}%` : `bottom: ${pos}%`;

    H.setInlineStyle(style)(this.node);
  }

  public readonly getValue: Namespace.GetValue = () => this.props.value;

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'), 'unit');

    this.setClassList();
    this.updatePosition();

    if (props.withValue) {
      this.renderValue();
    }

    this.initEventListeners();
  }

  private readonly renderValue: Namespace.RenderValue = () => {
    const {value, bemBlockClassName} = this.props;
    const {base, theme} = bemBlockClassName;

    const classList = [`${base}__unit-value`, `${theme}__unit-value`];

    const valueNode = pipe(H.node('span'), pipe(value, H.toString, H.setInnerText), H.addClassList(classList))

    this.node.appendChild(valueNode);
  }

  private readonly clickListener: Namespace.ClickListener = (event: MouseEvent) => {
    event.stopPropagation();

    const {onClick} = this.props;

    onClick(this.getValue());
  }

  private readonly initEventListeners = () => {
    H.addEventListener('click', this.clickListener)(this.node);
  }
}

export default Unit;