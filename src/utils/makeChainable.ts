const makeChainable = (obj: Object) =>
  new Proxy(obj, {
    get(target: any, property, receiver) {
      /* 1 */
      return typeof target[property] === "function" /* 2 */
        ? (...args: []) => {
            /* 3 */
            const result = target[property](...args); /* 4 */
            return result === undefined ? receiver : result; /* 5 */
          }
        : target[property]; /* 6 */
    },
  });

export default makeChainable;
