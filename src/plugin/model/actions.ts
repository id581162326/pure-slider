import Namespace from 'plugin/model/namespace';

export const updateCoordinates = (value: Namespace.UpdateCoordinates['value']): Namespace.UpdateCoordinates => ({
  tag: 'UPDATE_COORDINATES',
  value
});

export const updateRange = (value: Namespace.UpdateRange['value']): Namespace.UpdateRange => ({
  tag: 'UPDATE_RANGE',
  value
});

export const updateStep = (value: Namespace.UpdateStep['value']): Namespace.UpdateStep => ({
  tag: 'UPDATE_STEP',
  value
});

export const updateMargin = (value: Namespace.UpdateMargin['value']): Namespace.UpdateMargin => ({
  tag: 'UPDATE_MARGIN',
  value
});