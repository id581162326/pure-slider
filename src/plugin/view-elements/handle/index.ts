import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as H from 'helpers/index';

import 'view-elements/handle/style.core.css';
import 'view-elements/handle/style.theme.css';
import Namespace from 'view-elements/handle/namespace';

class Handle implements Namespace.Interface {
  public readonly node;

  public readonly moveTo = (pos: number) => {
    pipe(this.props.orientation, H.switchCases([
      ['horizontal', () => pipe(this.node, H.setStyle('left', `calc(${pos}% - ${pipe(this.node.offsetWidth, H.half)}px)`))],
      ['vertical', () => pipe(this.node, H.setStyle('bottom', `calc(${pos}% - ${pipe(this.node.offsetHeight, H.half)}px)`))]
    ], F.constVoid))

    return (this);
  };

  public readonly removeSideEffects = () => {
    H.removeEventListener('mouseup', this.endDrag)(window);

    return (this);
  };

  constructor(private readonly props: Namespace.Props) {
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
    const {onIncrease, onDecrease} = this.props;

    const decCond = event.code === 'ArrowLeft' || event.code === 'ArrowDown' || event.code === 'Minus';

    const incCond = event.code === 'ArrowRight' || event.code === 'ArrowUp' || event.code === 'Equal';

    if (decCond || incCond) {
      event.preventDefault();
    }

    pipe(true, H.switchCases([
      [decCond, () => onDecrease()],
      [incCond, () => onIncrease()]
    ], F.constVoid));
  };
}

export default Handle;