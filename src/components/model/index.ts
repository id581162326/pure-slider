import {IModel, IProps, IState} from './interfaces';
import {defaultProps} from './defaults';

export default class SliderModel implements IModel {
  private _state: IState = {currentValues: defaultProps.defaultValues};
  private _props: IProps = defaultProps;
  
  get props() {
    return this._props;
  }
  
  get state() {
    return this._state;
  }
  
  public setProps(props: IProps) {
    this.validateProps(props);
    
    this._props = props;
    
    this._state = {
      currentValues: this.sortValuesAscending(props.defaultValues)
    }
  }
  
  public setState(state: IState) {
    const {
      maxValue,
      minValue,
      margin
    } = this._props;
    
    const {
      currentValues
    } = state;
    
    if (!this.checkValuesByRange(currentValues, maxValue, minValue)) {
      return;
    }
    
    if (margin !== undefined) {
      if (!this.checkValuesByMargin(currentValues, margin)) {
        return;
      }
    }
    
    this._state = {
      ...this._state,
      ...state
    };
  }
  
  private validateProps(props: IProps) {
    const {
      minValue,
      maxValue,
      step,
      margin
    } = props;
    
    const defaultValues = this.sortValuesAscending(props.defaultValues);
    
    if (minValue < 0) {
      this.throwInvalidPropError('Min value mustn\'t be less than zero.');
    }
    
    if (minValue >= maxValue) {
      this.throwInvalidPropError('Min value mustn\'t be more than max value or equal of it.');
    }
    
    if (!this.checkValuesByRange(defaultValues, maxValue, minValue)) {
      this.throwInvalidPropError('Default values mustn\'t be more than max value or less than min value.')
    }
    
    if (step < 0) {
      this.throwInvalidPropError('Step value mustn\'t be less than zero.');
    }
    
    if (step > maxValue - minValue) {
      this.throwInvalidPropError('Step value mustn\'t be less than difference between max and min values.');
    }
  
    if (margin && !this.checkValuesByMargin(defaultValues, margin)) {
      this.throwInvalidPropError('Difference between two adjacent values mustn\'t be less than margin value.');
    }
    
    if (margin && margin < step) {
      this.throwInvalidPropError('Margin value mustn\'t be less than step value.');
    }
  }
  
  private sortValuesAscending(values: number[]) {
    return values.sort((a: number, b: number) => a >= b ? 1 : -1);
  }
  
  private checkValuesByRange(values: number[], maxValue: number, minValue: number) {
    return values.reduce((bool: boolean, value) => value > maxValue || value < minValue ? false : bool, true);
  }
  
  private checkValuesByMargin(values: number[], margin: number) {
    return values.reduce((bool: boolean, value, index, arr) =>
      index > 0 && Math.abs(value - arr[index - 1]) < margin ? false : bool, true);
  }
  
  private throwInvalidPropError(message: string) {
    const error = new Error();
    
    error.name = 'Invalid prop value'
    error.message = message;
    
    throw error;
  }
}