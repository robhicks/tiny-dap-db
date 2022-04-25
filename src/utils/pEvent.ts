import { isArgumentsObject } from "util/types";

const pEvent = (emitter, event) => {
  let listener = null;
  const promise = new Promise((resolve, reject) => {
    listener = (...args) => {
      event === "error" ? reject(args) : resolve(args);
    };
    emitter.once(event, listener);
  });
  promise.cancel = () => emitter.off();
  return promise;
};
