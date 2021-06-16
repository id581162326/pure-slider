import Element from '../namespace';

namespace TestData {
  export type NodeKeys = Element.NodeKeys;

  export type GetSubjects = (key: NodeKeys) => { node: Element.Node, element: Element.Interface };
}

export default TestData;