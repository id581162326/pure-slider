export interface IModel {
  readonly props: IProps,
  readonly state: IState,
  
  setProps(props: IProps): void,
  
  setState(state: IState): void
}

export interface IProps {
  maxValue: number,
  minValue: number,
  step: number,
  defaultValues?: number[],
  margin?: number
}

export interface IState {
  currentValues: number[]
}