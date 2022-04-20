import { isString } from './utils/isString'
import { isObject } from './utils/isObject';
import { isNumber } from './utils/isNumber';
import { uuid } from './utils/uuid';

const utc = (): number => Math.floor(new Date().getTime() / 1000);



export default class Vertex {
  _value: any
  listeners: Set<any>
  owner: String | undefined
  path: String
  pending: Promise<any> | undefined
  readers: Array<String> | undefined
  store: any
  storageObject: Object
  uuid: String
  value: any
  writers: Array<String> | undefined

  constructor({ owner, path, store, readers, writers }) {
    this.listeners = new Set()
    this.owner = owner
    this.path = path;
    this.readers = readers
    this.storageObject = { path, owner, readers, writers, timestamp: utc(), uuid: this.uuid, value: undefined };
    this.store = store;
    this.uuid = uuid();
    this.writers = writers;
    this.load()
  }

  async del() {
    await this.store.del(this.path)
    this.emit(null)
  }

  emit(...args: Array<any>) {
    this.listeners.forEach((listener) => listener(...args))
  }

  async once(listener: Function) {
    if (this.pending) await this.pending
    listener(this.value?.value)
  }

  on(listener: Function) {
    this.listeners.add(listener)
  }

  off(listener: Function) {
    this.listeners.delete(listener)
  }

  async put(val: any): Promise<any> {
    if (this.pending) await this.pending
    const stored = this.value
    const value = stored?.value
    let nVal
    if (!value) nVal = val;
    else if (isString(value) || isNumber(value)) nVal = val;
    else if (isObject(value) && isObject(val)) nVal = { ...value, ...val };
    const newStorageObject = { ...this.storageObject, ...{ timestamp: utc(), value: nVal } }
    this.value = newStorageObject
    this.store.put(this.path, newStorageObject)
    this.emit(newStorageObject.value)
  }

  async load() {
    this.pending = this.store.get(this.path)
    const stored = await this.pending
    if (stored) this.value = stored
  }

  async set(val): Promise<any> {
    // this.pending = this.store.set(this.path, val)
    // await this.pending
    // this.emit(val)
    // this.pending = undefined
  }
}
