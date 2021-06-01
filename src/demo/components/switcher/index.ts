import * as O from 'fp-ts/Option';
import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Slider from '../../../plugin/slider';

import Fragment from '../fragment';

import Namespace from './namespace';
import template from './index.html';
import './style.css';

Fragment.injectTemplate(template);

class Switcher extends Fragment <HTMLDivElement> implements Namespace.Interface {
  static readonly of: Namespace.Of = (props) => (parent) => new Switcher(props, parent);

  private constructor(private readonly props: Namespace.Props, parent: Namespace.Parent) {
    super(parent, '#js-switcher', '.js-switcher');

    pipe(this.mapSwitcher, this.render);

    pipe(this.slider, O.some, O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value')).dispatch({type: 'ATTACH_LISTENER', listener: this.connectTypeChangedListener})
      : O.none
    ));
  }

  private slider: O.Option<Namespace.Slider> = O.none;

  private readonly mapSwitcher: Namespace.MapSwitcher = (switcherNode) => pipe(
    switcherNode,
    this.setLabel,
    this.renderInput,
    () => switcherNode
  );

  private readonly connectTypeChangedListener: Namespace.ConnectTypeChangedListener = {
    update: (action) => {
      switch (action.type) {
        case 'CURRENTS_UPDATED': {
          pipe(action, H.prop('currents'), NEA.head, this.props.onChange);

          break;
        }
      }
    }
  };

  private readonly renderInput: Namespace.MapSwitcher = (switcherNode) => pipe(
    switcherNode,
    H.querySelector('.js-switcher__input'),
    O.some,
    O.map((inputNode) => O.isSome(inputNode)
      ? pipe(inputNode as O.Some<HTMLElement>, H.prop('value'), Slider.of, H.call([{
          range: [0, 4],
          step: 1,
          margin: 1,
          currents: [0],
          connectType: 'none',
          scaleOptions: {
            withValue: true,
            showValueEach: 1
          },
          themeBemBlockClassName: 'switcher'
        }]),
      ) : O.none),
    (slider) => this.slider = slider as O.Option<Namespace.Slider>,
    () => switcherNode
  );

  private readonly setLabel: Namespace.MapSwitcher = (switcherNode) => pipe(
    switcherNode,
    H.querySelector('.js-switcher__label'),
    O.some,
    O.map((labelNode) => O.isSome(labelNode)
      ? pipe(labelNode, H.prop('value'), H.setInnerText(this.props.label))
      : O.none),
    () => switcherNode
  );
}

export default Switcher;