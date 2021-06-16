import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Namespace from './namespace';

class Fragment<Node extends HTMLElement> implements Namespace.Interface {
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

  protected readonly render: Namespace.Render<Node> = (mapNode) => pipe(
    this.parent,
    H.querySelector(this.componentSelector),
    O.some,
    O.map((node) => O.isSome(node)
      ? pipe(node as O.Some<Node>, H.prop('value'), mapNode)
      : O.none)
  );

  private readonly importFragment: Namespace.ImportFragment = (template) => {
    const content = template.content;

    const fragment = document.importNode(content, true);

    return (fragment);
  }

  private readonly renderFragment: Namespace.RenderFragment = () => pipe(
    document,
    H.querySelector(this.templateSelector),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x as O.Some<HTMLTemplateElement>, H.prop('value'), this.importFragment, H.appendTo(this.parent))
      : O.none)
  ) as O.Option<DocumentFragment>;
}

export default Fragment;