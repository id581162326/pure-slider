import * as O from 'fp-ts/Option';

namespace TextField {
  export type Parent = HTMLElement;

  export type Of = (o: Props) => (p: Parent) => Interface;

  export type RenderTextField = () => O.Option<HTMLElement>;

  export type SetLabel = (x: HTMLElement) => HTMLElement;

  export interface Props {
    label: string,
    onEnter: (x: number) => void
  }

  export interface Interface {
    getValue: () => number,
    setValue: (x: number) => void,
    setStep: (x: number) => void
  }
}

export default TextField;