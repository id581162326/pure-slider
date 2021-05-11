import * as A from 'fp-ts/Array';
import {flow, pipe} from 'fp-ts/function';

import * as H from '../../globals/helpers';

import View from './namespace';
import './styles.css';
import './theme.css';

export default class implements View.Interface {
  public props: View.Props = {
    container: document.createElement('div'),
    min: 0,
    max: 10,
    currents: [5],
    intervals: [false, false],
    orientation: 'horizontal',
    tooltipOptions: {
      enabled: false
    },
    bemBlockClassName: 'pure-slider-theme',
    onDragHandler: (i: number, coord: number) => console.log(i, coord)
  };

  public setProps(props: View.Props) {
    this.props = {...this.props, ...props};

    console.log(this.props);
  }

  public render() {
    const {container, bemBlockClassName} = this.props;

    H.addClassList([
      'pure-slider-base',
      `${bemBlockClassName}`
    ])(container);

    this.renderNodes();
    this.updateNodes();
  }

  public destroy() {
    const {container, bemBlockClassName} = this.props;

    container.innerHTML = '';

    H.removeClassList([
      'pure-slider-base',
      `${bemBlockClassName}`
    ])(container);
  }

  public updateCurrents(currents: View.Props['currents']) {
    this.setProps({...this.props, currents});
    this.updateNodes();
  }

  private connectsMap: View.NodeMap[] = [];

  private handlersMap: View.NodeMap[] = [];

  private tooltipsMap: View.NodeMap[] = [];

  private base: HTMLDivElement = document.createElement('div');

  private range = (): number => H.sub(this.props.min)(this.props.max);

  private percentToRange = (x: number): number => pipe(x, H.percent(this.range()));

  private correctToMin = (x: number): number => pipe(x, H.sub(this.props.min));

  private getClassList = (key: View.NodeKeys): string[] => {
    const {bemBlockClassName, orientation} = this.props;

    return ([
      `pure-slider-base__${key}`,
      `pure-slider-base__${key}_orientation_${orientation}`,
      `${bemBlockClassName}__${key}`,
      `${bemBlockClassName}__${key}_orientation_${orientation}`
    ]);
  };

  private getConnectDimensions = (i: number): { size: number, pos: number } => {
    const {currents, intervals} = this.props;

    switch (i) {
      case 0:
        return ({
          size: pipe(currents, H.headOrNone(0), this.correctToMin, this.percentToRange),
          pos: 0
        });
      case pipe(intervals, A.size, H.dec):
        return ({
          size: flow(this.range, H.sub(pipe(currents, H.lastOrNone(0), this.correctToMin)), this.percentToRange)(),
          pos: pipe(currents, H.lastOrNone(0), this.correctToMin, this.percentToRange)
        });
      default:
        return ({
          size: pipe(
            H.sub(pipe(currents, H.nthOrNone(H.dec(i), 0)))(pipe(currents, H.nthOrNone(i, 0))),
            this.correctToMin,
            this.percentToRange
          ),
          pos: pipe(currents, H.nthOrNone(H.dec(i), 0), this.correctToMin, this.percentToRange)
        });
    }
  };

  private getHandlerDimensions = (i: number): { pos: number } => {
    const {currents} = this.props;

    return ({pos: pipe(currents, H.nthOrNone(i, 0), this.correctToMin, this.percentToRange)});
  };

  private renderBase = () => {
    const {container} = this.props;

    this.base = pipe(
      H.node('div'),
      H.addClassList(this.getClassList('base')),
      H.appendTo(container)
    );
  };

  private renderConnects = () => {
    const {intervals} = this.props;

    const classList = this.getClassList('connect');

    const intervalsIndexes = A.reduceWithIndex([] as number[], (i, xs, x: boolean) => x ? [...xs, i] : xs)(intervals);

    this.connectsMap = A.map((x: number) => ({
      id: x,
      node: pipe(
        H.node('div'),
        H.addClassList(classList),
        H.appendTo(this.base)
      )
    }))(intervalsIndexes);
  };

  private renderHandlers = () => {
    const {currents} = this.props;

    const classList = this.getClassList('handler');

    this.handlersMap = A.mapWithIndex((i) => ({
      id: i,
      node: pipe(
        H.node('div'),
        H.addClassList(classList),
        H.appendTo(this.base)
      )
    }))(currents);
  };

  private renderTooltips = () => {
    const classList = this.getClassList('tooltip');

    this.tooltipsMap = A.map((x: View.NodeMap) => ({
      id: x.id,
      node: pipe(H.node('span'), H.addClassList(classList), H.appendTo(x.node))
    }))(this.handlersMap);
  };

  private renderNodes = () => {
    this.renderBase();
    this.renderConnects();
    this.renderHandlers();
    this.renderTooltips();
  }

  private updateConnect = ({node, id}: View.NodeMap) => {
    const {orientation} = this.props;
    const {pos, size} = this.getConnectDimensions(id);

    switch (orientation) {
      case 'horizontal':
        H.setInlineStyle(`left: ${pos}%; max-width: ${size}%;`)(node);
        break;
      case 'vertical':
        H.setInlineStyle(`top: ${pos}%; max-height: ${size}%;`)(node);
        break;
    }
  };

  private updateHandler = ({node, id}: View.NodeMap) => {
    const {orientation} = this.props;
    const {pos} = this.getHandlerDimensions(id);

    switch (orientation) {
      case 'horizontal':
        H.setInlineStyle(`left: calc(${pos}% - ${pipe(node, H.offsetWidth, H.half)}px);`)(node);
        break;
      case 'vertical':
        H.setInlineStyle(`top: calc(${pos}% - ${pipe(node, H.offsetHeight, H.half)}px);`)(node);
        break;
    }
  };

  private updateTooltip = ({node, id}: View.NodeMap) => {
    const {currents} = this.props;

    pipe(node, H.setInnerText(pipe(currents, H.nthOrNone(id, 0), H.toString)));
  };

  private updateNodes = () => {
    A.map(this.updateConnect)(this.connectsMap);
    A.map(this.updateHandler)(this.handlersMap);
    A.map(this.updateTooltip)(this.tooltipsMap);
  };
}



