interface Test<Data> {
  title: string,
  description: string,
  run: (x: Data) => void,
  map: Data[]
}

export default Test;