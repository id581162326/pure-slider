import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../helpers';

import Element from '../element';

import Namespace from './namespace';

class Base extends Element<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Base(props);

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'), 'base');

    this.setEventListeners();
  }

  private readonly setEventListeners: Namespace.SetEventListeners = () => {
    H.addEventListener('click', this.clickListener)(this.node);
  }

  private readonly clickListener: Namespace.ClickListener = (event) => {
    const {orientation, range, onClick} = this.props;

    const min = pipe(range, NEA.head);

    const coordKey = orientation === 'horizontal' ? 'x' : 'y';

    const bouncingClientRect = pipe(this.node.getBoundingClientRect(), H.prop(coordKey));

    pipe(event, H.prop(coordKey), H.sub(bouncingClientRect), this.pxToNum, H.add(min), onClick);
  }
}

export default Base;