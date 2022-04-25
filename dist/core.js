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

// src/utils/uuid.ts
function uuid() {
  let d = new Date().getTime();
  const uid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : r & 3 | 8).toString(16);
  });
  return uid;
}

// src/utils/isArray.ts
function isArray(candidate) {
  return Array.isArray(candidate);
}

// src/Vertex.ts
var utc = () => Date.now();
var Vertex = class {
  constructor(path, store, socket) {
    this.listeners = new Set();
    this.uuid = uuid();
    this.path = path;
    this.pending;
    this.socket = socket;
    this.store = store;
    this.storageObject = {
      path: this.path,
      timestamp: utc(),
      uuid: uuid()
    };
  }
  addListener(listener) {
    this.listeners.add(listener);
  }
  delete() {
    this.value = void 0;
    this.emit(void 0);
  }
  emit(val) {
    this.listeners.forEach((listener) => listener(val));
  }
  on(listener) {
    this.addListener(listener);
  }
  once(listener) {
    setTimeout(async () => {
      this.addListener(listener);
      const val = await this.value;
      this.emit(val);
      this.removeListener(listener);
    }, 0);
  }
  pop() {
    setTimeout(async () => {
      const value = await this.value;
      if (isArray(value)) {
        const array = [...value];
        const popped = array.pop();
        this.value = array;
        this.emit(popped);
      }
    }, 0);
  }
  push(val) {
    setTimeout(async () => {
      const value = await this.value;
      let nVal;
      if (!value)
        nVal = [val];
      else if (!isArray(value))
        nVal = [nVal];
      else
        nVal = [...value, val];
      this.value = nVal;
      this.emit(nVal);
    }, 0);
  }
  put(val, update = true) {
    setTimeout(async () => {
      const value = await this.value;
      let nVal = val;
      if (!value || !update)
        nVal = val;
      else if (update)
        nVal = {...value, ...val};
      this.value = nVal;
      if (this.pending)
        await this.pending;
      this.emit(nVal);
    }, 0);
  }
  removeListener(listener) {
    this.listeners.delete(listener);
  }
  reverse() {
    setTimeout(async () => {
      const value = await this.value;
      if (isArray(value)) {
        const array = [...value].reverse();
        this.value = array;
        this.emit(array);
      }
    }, 0);
  }
  set(val) {
    this.put(val, false);
  }
  shift() {
    setTimeout(async () => {
      const value = await this.value;
      if (isArray(value)) {
        const array = [...value];
        array.shift();
        this.value = array;
        this.emit(array);
      }
    }, 0);
  }
  get value() {
    return (async () => {
      if (this.pending)
        await this.pending;
      this.pending = this.store.get(this.path);
      const storageObject = await this.pending;
      const value = storageObject?.value;
      return value;
    })();
  }
  set value(val) {
    return (async () => {
      this.pending = this.store.set(this.path, {
        ...this.storageObject,
        ...{timestamp: utc(), value: val}
      });
    })();
  }
};
var Vertex_default = Vertex;

// src/core.ts
var dotPathRegEx = /\./;
var emailRegEx = /\w+@\S*?\.\w+/i;
var Core = class {
  constructor({
    store,
    socket,
    clientId,
    appId
  }) {
    this.currentPath = "";
    this.nodes = new Map();
    this.store = store;
    this.uuid = uuid();
    this.socket = socket;
    if (this.socket) {
      this.socket.init({clientId, appId, nodeId: this.uuid});
      this.socket.connect();
    }
    return this;
  }
  del(path) {
    this.currentVertex.del();
  }
  get(path) {
    if (!path) {
      this.currentPath = "root";
    } else if (dotPathRegEx.test(path) && !emailRegEx.test(path)) {
      this.currentPath = path;
    } else {
      if (path === "root")
        this.currentPath = path;
      const idx = this.currentPath ? this.currentPath.lastIndexOf(path) : -1;
      if (idx !== -1) {
        this.currentPath = this.currentPath.substr(0, idx + path.length);
      } else if (path?.includes("root")) {
        this.currentPath = path;
      } else {
        this.currentPath = `${this.currentPath || "root"}.${path}`;
      }
    }
    if (!this.nodes.has(this.currentPath)) {
      this.currentVertex = new Vertex_default(this.currentPath, this.store, this.socket);
      this.nodes.set(this.currentPath, this.currentVertex);
    }
  }
  on(callback) {
    this.currentVertex.on(callback);
  }
  once(callback) {
    this.currentVertex.once(callback);
  }
  put(value) {
    this.currentVertex.put(value);
  }
  set(value) {
    this.currentVertex.set(value);
  }
  pop() {
    this.currentVertex.pop();
  }
  push(value) {
    this.currentVertex.push(value);
  }
  reverse() {
    this.currentVertex.reverse();
  }
  shift() {
    this.currentVertex.shift();
  }
};
var core = ({
  store,
  socket,
  clientId,
  appId
}) => makeChainable_default(new Core({store, socket, clientId, appId}));
var core_default = core;
export {
  core_default as default
};
