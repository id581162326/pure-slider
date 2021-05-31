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

class Switcher extends Fragment implements Namespace.Interface {
  static readonly of: Namespace.Of = (props) => (parent) => new Switcher(props, parent);

  private constructor(private readonly props: Namespace.Props, parent: Namespace.Parent) {
    super(parent, '#js-switcher', '.js-switcher');


    pipe(this.switcherMap, this.render);

    pipe(this.slider, O.some, O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value')).attachListener(this.connectTypeChangedListener)
      : O.none
    ));
  }

  private slider: O.Option<Namespace.Slider> = O.none;

  private readonly switcherMap = (x: HTMLElement) => pipe(
    x,
    this.setLabel,
    this.renderInput,
    () => x
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

  private readonly renderInput = (x: HTMLElement) => pipe(
    x,
    H.querySelector('.js-switcher__input'),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x as O.Some<HTMLElement>, H.prop('value'), Slider.of, H.call([{
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
    (x) => this.slider = x as O.Option<Namespace.Slider>,
    () => x
  );

  private readonly setLabel = (x: HTMLElement) => pipe(
    x,
    H.querySelector('.js-switcher__label'),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), H.setInnerText(this.props.label))
      : O.none),
    () => x
  );
}

export default Switcher;