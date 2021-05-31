import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from '../../helpers';

import Example from '../components/example';

import Namespace from './namespace';
import './style.css';

class Demo {
  static readonly of: Namespace.Of = () => new Demo();

  private constructor() {
    this.exampleNodes = H.querySelectorAll('.js-demo-page__example')(document) as HTMLLIElement[];

    this.renderExamples();
  }

  private readonly exampleNodes: HTMLLIElement[];

  private renderExamples = () => A.mapWithIndex((idx, node: HTMLLIElement) => Example.of({
    title: `Example No ${pipe(idx, H.inc)}`,
    description: 'Slider examples. Set options below to see changes',
    sliderConfig: {
      range: [-1000, 100],
      step: 10,
      margin: 20,
      currents: [-50, 500],
      connectType: 'none',
      tooltipOptions: {
        alwaysShown: true
      },
      scaleOptions: {
        withValue: true,
        showValueEach: 5
      }
    }
  })(node))(this.exampleNodes);
}

Demo.of();