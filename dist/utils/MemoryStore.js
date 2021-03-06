// src/utils/MemoryStore.ts
var MemoryStore = class {
  constructor() {
    this.db = new Map();
  }
  async clear() {
    this.db.clear();
  }
  async del(path) {
    this.db.delete(path);
  }
  async get(path) {
    return this.db.get(path);
  }
  async put(path, value) {
    return this.db.set(path, value);
  }
  async set(path, value) {
    return this.db.set(path, value);
  }
};
export {
  MemoryStore
};
