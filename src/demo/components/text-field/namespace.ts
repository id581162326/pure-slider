namespace TextField {
  export type Parent = HTMLElement | DocumentFragment;

  export type Of = (props: Props) => <T extends Parent>(parent: T) => Interface;

  export type MapTextField = (textFieldNode: HTMLLabelElement) => HTMLLabelElement;

  export type OnChange = (value: number) => void;

  export type SetValue = (value: number) => void;

  export type SetStep = (step: number) => void;

  export type GetValue = () => number;

  export interface Props {
    label: string,
    onChange: OnChange
  }

  export interface Interface {
    getValue: GetValue,
    setValue: SetValue,
    setStep: SetStep
  }

}

export default TextField;