import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as H from 'helpers';

import 'view-components/handle/style.core.css';
import 'view-components/handle/style.theme.css';
import Namespace from 'view-components/handle/namespace';

class Handle implements Namespace.Interface {
  public readonly node: HTMLDivElement;

  public readonly moveTo = (pos: number) => pipe(this.props.orientation, H.switchCases([
    ['horizontal', () => this.setLeft(pos)],
    ['vertical', () => this.setBottom(pos)]
  ], F.constVoid));

  constructor(public readonly props: Namespace.Props) {
    this.node = this.render();

    this.setEventListeners();
  }

  private readonly render = () => {
    const {bemBlockClassName, orientation} = this.props;

    const classList = [
      'pure-slider__handle',
      `pure-slider__handle_orientation_${orientation}`,
      ...(bemBlockClassName ? [
        `${bemBlockClassName}__handle`,
        `${bemBlockClassName}__handle_orientation_${orientation}`
      ] : [])
    ];

    return (pipe(H.node('div'), H.addClassList(classList), H.setAttribute('tabindex', '0')));
  };

  private readonly setLeft = (pos: number) => {
    pipe(this.node, H.setInlineStyle(`left: calc(${pos}% - ${pipe(this.node.offsetWidth, H.half)}px);`));
  };

  private readonly setBottom = (pos: number) => {
    pipe(this.node, H.setInlineStyle(`bottom: calc(${pos}% - ${pipe(this.node.offsetHeight, H.half)}px);`));
  };

  private readonly setEventListeners = () => {
    H.addEventListener('mousedown', this.startDrag)(this.node);
    H.addEventListener('mouseup', this.endDrag)(window);
    H.addEventListener('keydown', this.keyDownListener)(this.node);
  };

  private readonly startDrag = (event: MouseEvent) => {
    event.stopPropagation();

    H.addEventListener('mousemove', this.dragListener)(window);
  };

  private readonly endDrag = (event: MouseEvent) => {
    event.stopPropagation();

    H.removeEventListener('mousemove', this.dragListener)(window);
  };

  private readonly dragListener = (event: MouseEvent) => {
    const {onDrag} = this.props;

    const {x, y} = this.node.getBoundingClientRect();

    onDrag({
      x: pipe(event.x, H.sub(x), H.sub(this.node.offsetWidth)),
      y: pipe(event.y, H.sub(y), H.sub(this.node.offsetHeight)),
    });
  };

  private readonly keyDownListener = (event: KeyboardEvent) => {
    const {orientation, onKeyPress} = this.props;

    const decCond = (orientation === 'horizontal' && event.code === 'ArrowLeft')
      || (orientation === 'vertical' && event.code === 'ArrowDown')
      || event.code === 'Minus';

    const incCond = (orientation === 'horizontal' && event.code === 'ArrowRight')
      || (orientation === 'vertical' && event.code === 'ArrowUp')
      || event.code === 'Equal';

    if (decCond || incCond) {
      event.preventDefault();
    }

    pipe(true, H.switchCases([
      [decCond, () => onKeyPress('dec')],
      [incCond, () => onKeyPress('inc')]
    ], F.constVoid));
  };
}

export default Handle;