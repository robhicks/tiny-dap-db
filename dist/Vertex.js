// src/utils/isString.ts
var isString = (str) => typeof str === "string";

// src/utils/isArray.ts
function isArray(candidate) {
  return Array.isArray(candidate);
}

// src/utils/isObject.ts
function isObject(candidate, strict = true) {
  if (!candidate)
    return false;
  if (strict)
    return typeof candidate === "object" && !isArray(candidate);
  return typeof candidate === "object";
}

// src/utils/isNumber.ts
var isNumber = (can) => typeof can === "number" && Number.isFinite(can);

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

// src/Vertex.ts
var utc = () => Math.floor(new Date().getTime() / 1e3);
var Vertex = class {
  _value;
  listeners;
  owner;
  path;
  pending;
  readers;
  store;
  storageObject;
  uuid;
  value;
  writers;
  constructor({ owner, path, store, readers, writers }) {
    this.listeners = /* @__PURE__ */ new Set();
    this.owner = owner;
    this.path = path;
    this.readers = readers;
    this.storageObject = { path, owner, readers, writers, timestamp: utc(), uuid: this.uuid, value: void 0 };
    this.store = store;
    this.uuid = uuid();
    this.writers = writers;
    this.load();
  }
  async del() {
    await this.store.del(this.path);
    this.emit(null);
  }
  emit(...args) {
    this.listeners.forEach((listener) => listener(...args));
  }
  async once(listener) {
    if (this.pending)
      await this.pending;
    listener(this.value?.value);
  }
  on(listener) {
    this.listeners.add(listener);
  }
  off(listener) {
    this.listeners.delete(listener);
  }
  async put(val) {
    if (this.pending)
      await this.pending;
    const stored = this.value;
    const value = stored?.value;
    let nVal;
    if (!value)
      nVal = val;
    else if (isString(value) || isNumber(value))
      nVal = val;
    else if (isObject(value) && isObject(val))
      nVal = { ...value, ...val };
    const newStorageObject = { ...this.storageObject, ...{ timestamp: utc(), value: nVal } };
    this.value = newStorageObject;
    this.store.put(this.path, newStorageObject);
    this.emit(newStorageObject.value);
  }
  async load() {
    this.pending = this.store.get(this.path);
    const stored = await this.pending;
    if (stored)
      this.value = stored;
  }
  async set(val) {
  }
};
export {
  Vertex as default
};
