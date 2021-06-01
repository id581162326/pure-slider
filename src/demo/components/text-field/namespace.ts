namespace TextField {
  export type Parent = HTMLElement | DocumentFragment;

  export type Range = [number, number];

  export type Of = (props: Props) => <T extends Parent>(parent: T) => Interface;

  export type MapTextField = (textFieldNode: HTMLLabelElement) => HTMLLabelElement;

  export type MapInput = (inputNode: HTMLInputElement) => HTMLInputElement;

  export type OnChange = (value: number) => void;

  export type SetValue = (value: number) => void;

  export type SetStep = (step: number) => void;

  export type SetRange = (range: Range) => void;

  export type GetValue = () => number;

  export interface Props {
    label: string,
    onChange: OnChange,
    min?: number,
    max?: number,
    step?: number
  }

  export interface Interface {
    getValue: GetValue,
    setValue: SetValue,
    setStep: SetStep,
    setRange: SetRange
  }

}

export default TextField;