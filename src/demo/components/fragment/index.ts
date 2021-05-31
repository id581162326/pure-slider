import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Namespace from './namespace';

class Fragment implements Namespace.Interface {
  static readonly injectTemplate = (template: string) => pipe(document, H.querySelector('body'), O.some, O.map((x) => O.isSome(x)
    ? x.value.insertAdjacentHTML('afterbegin', template)
    : O.none)
  );

  protected constructor(
    protected readonly parent: Namespace.Parent,
    private readonly templateSelector: string,
    private readonly componentSelector: string
  ) {
    this.fragment = this.renderFragment();
  }

  protected readonly fragment: O.Option<DocumentFragment>;

  protected readonly render = (fn: (x: HTMLElement) => HTMLElement) => pipe(
    this.parent,
    H.querySelector(this.componentSelector),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), fn)
      : O.none)
  );

  private readonly renderFragment: Namespace.RenderFragment = () => pipe(
    document,
    H.querySelector(this.templateSelector),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x as O.Some<HTMLTemplateElement>, H.prop('value'), H.importFragment, H.appendTo(this.parent))
      : O.none)
  ) as O.Option<DocumentFragment>;
}

export default Fragment;