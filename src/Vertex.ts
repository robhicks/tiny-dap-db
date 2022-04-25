import { isArray } from "./utils/isArray";
import { isString } from "./utils/isString";
import { isObject } from "./utils/isObject";
import { isNumber } from "./utils/isNumber";
import { uuid } from "./utils/uuid";
import copy from "./utils/copy";
import vertices from "./vertices";

const utc = (): number => Date.now();

export default class Vertex {
  listeners: Set<any>;
  path: String;
  pending: Promise | undefined;
  socket: any;
  store: any;
  uuid: String;

  constructor(path: string, store: any, socket?: any) {
    this.listeners = new Set();
    this.uuid = uuid();
    this.path = path;
    this.pending;
    this.socket = socket;
    this.store = store;
    this.storageObject = {
      path: this.path,
      timestamp: utc(),
      uuid: uuid(),
    };
    this.load();
  }

  addListener(listener: Function) {
    this.listeners.add(listener);
  }

  delete() {
    this.value = undefined;
    this.store.del(this.path);
    vertices.delete(this.path);
    this.emit(undefined);
  }

  emit(val: any) {
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

  once(listener: Function) {
    this.addListener(listener);
    const value = this.value;
    if (isArray(value)) {
      const values = value.map((el) => {
        const v = vertices.get(el);
        const val = v.value;
        return val;
      });
      this.emit(values);
    } else {
      this.emit(this.value);
    }
    this.removeListener(listener);
  }

  pop() {
    const value = copy(this.value);
    if (isArray(value)) {
      const popped = value.pop();
      const v = vertices.get(popped);
      v.delete();
      this.value = value;
    }
  }

  push(val: any) {
    const value = copy(this.value);
    if (!isArray(value)) throw new TypeError("cannot push into non-array");
    const uid = uuid();
    const path = `${this.path}.${uid}`;
    const el = new Vertex(path, this.store, this.socket);
    vertices.set(path, el);
    el.storageObject.value = val;
    el.storageObject.timestamp = utc();
    value.push(path);
    this.value = value;
  }

  put(val: object, update?: boolean = true) {
    let nVal = val;
    if (!this.value || !update) nVal = val;
    else if (update) nVal = { ...this.value, ...val };
    this.value = nVal;
  }

  removeListener(listener: Function) {
    this.listeners.delete(listener);
  }

  reverse() {
    const value = copy(this.value);
    if (isArray(value)) {
      value.reverse();
      this.value = value;
    }
  }

  set(val: Object) {
    this.put(val, false);
  }

  shift() {
    const value = copy(this.value);
    if (isArray(value)) {
      const shifted = value.shift();
      const v = vertices.get(shifted);
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
}
