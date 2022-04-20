// src/utils/makeChainable.ts
var makeChainable = (obj) => new Proxy(obj, {
  get(target, property, receiver) {
    return typeof target[property] === "function" ? (...args) => {
      const result = target[property](...args);
      return result === void 0 ? receiver : result;
    } : target[property];
  }
});
var makeChainable_default = makeChainable;
export {
  makeChainable_default as default
};
