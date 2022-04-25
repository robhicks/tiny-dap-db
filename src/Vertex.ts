import { isArray } from "./utils/isArray";
import { isString } from "./utils/isString";
import { isObject } from "./utils/isObject";
import { isNumber } from "./utils/isNumber";
import { uuid } from "./utils/uuid";
import copy from "./utils/copy";

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
  }

  addListener(listener: Function) {
    this.listeners.add(listener);
  }

  delete() {
    this.value = undefined;
    this.emit(undefined);
  }

  emit(val: any) {
    this.listeners.forEach((listener) => listener(val));
  }

  on(listener) {
    this.addListener(listener);
  }

  once(listener: Function) {
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

  push(val: any) {
    setTimeout(async () => {
      const value = await this.value;
      let nVal;
      if (!value) nVal = [val];
      else if (!isArray(value)) nVal = [nVal];
      else nVal = [...value, val];
      this.value = nVal;
      this.emit(nVal);
    }, 0);
  }

  put(val: object, update?: boolean = true) {
    setTimeout(async () => {
      const value = await this.value;
      let nVal = val;
      if (!value || !update) nVal = val;
      else if (update) nVal = { ...value, ...val };
      this.value = nVal;

      if (this.pending) await this.pending;
      this.emit(nVal);
    }, 0);
  }

  removeListener(listener: Function) {
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

  set(val: Object) {
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
      if (this.pending) await this.pending;
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
        ...{ timestamp: utc(), value: val },
      });
    })();
  }
}
