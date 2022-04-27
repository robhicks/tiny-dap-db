// src/utils/isArray.ts
function isArray(candidate) {
  return Array.isArray(candidate);
}

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

// src/utils/copy.ts
function copy(obj = {}) {
  return JSON.parse(JSON.stringify(obj));
}

// src/vertices.ts
var vertices = new Map();
var vertices_default = vertices;

// src/Vertex.ts
var utc = () => Date.now();
var Vertex = class {
  constructor(path, store, socket) {
    this.listeners = new Set();
    this.uuid = uuid();
    this.path = path;
    this.pending;
    this.registered = false;
    this.socket = socket;
    this.store = store;
    this.storageObject = {
      path: this.path,
      timestamp: utc(),
      uuid: uuid()
    };
    this.load();
    this.register();
  }
  addListener(listener) {
    this.listeners.add(listener);
  }
  delete() {
    this.value = void 0;
    this.store.del(this.path);
    vertices_default.delete(this.path);
    this.emit(void 0);
  }
  emit(val) {
    this.listeners.forEach((listener) => listener(val));
  }
  async load() {
    const storedObject = await this.store.get(this.path);
    if (storedObject?.value) {
      this.storageObject.value = storedObject.value;
      this.storageObject.timestamp = utc();
      this.emit(storedObject.value);
    }
  }
  on(listener) {
    this.addListener(listener);
  }
  once(listener) {
    this.addListener(listener);
    const value = this.value;
    if (isArray(value)) {
      const values = value.map((el) => {
        const v = vertices_default.get(el);
        const val = v.value;
        return val;
      });
      this.emit(values);
    } else {
      this.emit(this.value);
    }
    this.removeListener(listener);
  }
  onMessage(message) {
    if (message.request === "REGISTER" && message.response === "OK") {
      this.registered = true;
    }
  }
  pop() {
    const value = copy(this.value);
    if (isArray(value)) {
      const popped = value.pop();
      const v = vertices_default.get(popped);
      v.delete();
      this.value = value;
    }
  }
  push(val) {
    const value = copy(this.value);
    if (!isArray(value))
      throw new TypeError("cannot push into non-array");
    const uid = uuid();
    const path = `${this.path}.${uid}`;
    const el = new Vertex(path, this.store, this.socket);
    vertices_default.set(path, el);
    el.storageObject.value = val;
    el.storageObject.timestamp = utc();
    value.push(path);
    this.value = value;
  }
  put(val, update = true) {
    let nVal = val;
    if (!this.value || !update)
      nVal = val;
    else if (update)
      nVal = {...this.value, ...val};
    this.value = nVal;
  }
  register() {
    if (this.socket) {
      this.socket.send({...this.storageObject, ...{request: "REGISTER"}});
    }
  }
  removeListener(listener) {
    this.listeners.delete(listener);
  }
  reverse() {
    const value = copy(this.value);
    if (isArray(value)) {
      value.reverse();
      this.value = value;
    }
  }
  set(val) {
    this.put(val, false);
  }
  shift() {
    const value = copy(this.value);
    if (isArray(value)) {
      const shifted = value.shift();
      const v = vertices_default.get(shifted);
      v.delete();
      this.value = value;
    }
  }
  get value() {
    return this.storageObject?.value;
  }
  set value(val) {
    this.storageObject.value = val;
    this.storageObject.timestamp = utc();
    this.store.set(this.path, this.storageObject);
    this.emit(this.path, val);
  }
};
var Vertex_default = Vertex;
export {
  Vertex_default as default
};
