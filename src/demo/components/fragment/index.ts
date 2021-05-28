import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Namespace from './namespace';

class Fragment implements Namespace.Interface {
  protected constructor(protected readonly parent: Namespace.Parent, private readonly selector: string) {
    this.fragment = this.renderFragment();
  }

  protected readonly fragment: O.Option<DocumentFragment>;

  protected readonly render = (fn: (x: O.Some<HTMLElement>) => O.Option<HTMLElement>) => pipe(
    this.parent,
    H.querySelector(`.${this.selector}`),
    O.some,
    O.map((x) => O.isSome(x)
      ? fn(x)
      : O.none)
  );

  private readonly renderFragment: Namespace.RenderFragment = () => pipe(
    document,
    H.querySelector(`.${this.selector}-template`),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x as O.Some<HTMLTemplateElement>, H.prop('value'), H.importFragment, H.appendTo(this.parent))
      : O.none)
  ) as O.Option<DocumentFragment>;
}

export default Fragment;