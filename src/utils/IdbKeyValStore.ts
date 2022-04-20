/* eslint-disable import/prefer-default-export */
import {
  clear, createStore, del, get, set,
} from 'idb-keyval';

const defaultDbName = 'webDb';
const defaultStoreName = 'webDbStore';

export class IdbKeyValStore {
  store: Object
  constructor(dbName: string, storeName: string) {
    this.store = createStore(dbName || defaultDbName, storeName || defaultStoreName);
  }

  async clear() {
    return clear(this.store)
  }

  async del(key: string) {
    return del(key, this.store)
  }

  async get(key: string) {
    return get(key, this.store)
  }

  async put(key: string, data: any) {
    return set(key, data, this.store)
  }

  async set(key: string, data: any) {
    return set(key, data, this.store)
  }
}
