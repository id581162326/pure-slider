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
  };

  private readonly clickListener: Namespace.ClickListener = (event) => {
    const {orientation, range, onClick, container} = this.props;

    const min = pipe(range, NEA.head);

    if (orientation === 'horizontal') {
      const bouncingClientRect = this.node.getBoundingClientRect().x;

      pipe(event, H.prop('x'), H.sub(bouncingClientRect), this.pxToNum, H.add(min), onClick);
    }

    if (orientation === 'vertical') {
      const bouncingClientRect = this.node.getBoundingClientRect().y;

      const containerSize = pipe(container, this.nodeSize);

      pipe(event, H.prop('y'), H.sub(bouncingClientRect), H.sub(containerSize), Math.abs, this.pxToNum, H.add(min), onClick);
    }
  };
}

export default Base;