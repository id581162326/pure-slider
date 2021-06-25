import Test from 'test/interface';

import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as H from 'helpers/index';

import Observer from 'observer/index';
import Namespace from 'observer/namespace';

export const attachTest: Test<Namespace.Listener<{}>> = {
  title: 'Attach method',
  description: 'should attach listener to observer',
  run: (listener) => {
    const observer = pipe(Observer, H.instantiateWith());

    observer.attach(listener);

    expect(A.size(observer.listeners)).toEqual(1);
    pipe(observer.listeners, A.head, O.map((x) => expect(x).toEqual(listener)));
  },
  map: [{
    notify: () => {
    }
  }]
};

export const detachTest: Test<Namespace.Listener<{}>> = {
  title: 'Detach method',
  description: 'should detach listener to observer',
  run: (listener) => {
    const observer = pipe(Observer, H.instantiateWith());

    observer.attach(listener);
    observer.detach(listener);

    expect(A.size(observer.listeners)).toEqual(0);
  },
  map: [{
    notify: (_) => {
    }
  }]
};

export const dispatchTest: Test<{}> = {
  title: 'Dispatch method',
  description: 'should dispatch state to listeners',
  run: (obj) => {
    const listener1 = {notify: (_: typeof obj) => {}};
    const listener2 = {notify: (_: typeof obj) => {}};

    spyOn(listener1, 'notify');
    spyOn(listener2, 'notify');

    const observer = pipe(Observer, H.instantiateWith());

    observer.attach(listener1);
    observer.attach(listener2);
    observer.notify(obj);

    expect(listener1.notify).toHaveBeenCalledWith(obj);
    expect(listener2.notify).toHaveBeenCalledWith(obj);
  },
  map: [
    {}
  ]
};