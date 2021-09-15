import Test from 'test/interface';

import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';

import Observer from 'plugin/observer/index';
import Namespace from 'plugin/observer/namespace';

export const attachTest: Test<Namespace.Listener<{}>> = {
  title: 'Attach method',
  description: 'should attach listener to observer',
  run: (listener) => {
    const observer = new Observer();

    observer.attach(listener);

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
    const observer = new Observer();

    observer.attach(listener);
    observer.detach(listener);

    expect(A.size(observer.listeners)).toEqual(0);
  },
  map: [{
    notify: (_) => {
    }
  }]
};

export const dispatchTest: Test<any> = {
  title: 'Dispatch method',
  description: 'should dispatch state to listeners',
  run: (subj) => {
    const observer = new Observer();
    const listener1 = {notify: (_: typeof subj) => {}};
    const listener2 = {notify: (_: typeof subj) => {}};

    spyOn(listener1, 'notify');
    spyOn(listener2, 'notify');

    observer.attach(listener1);
    observer.attach(listener2);
    observer.notify(subj);

    expect(listener1.notify).toHaveBeenCalledWith(subj);
    expect(listener2.notify).toHaveBeenCalledWith(subj);
  },
  map: [1, {x: 1}, [1]]
};