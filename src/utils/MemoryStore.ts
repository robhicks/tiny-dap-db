export class MemoryStore {
  db: Map<string, any>;

  constructor() {
    this.db = new Map();
  }

  async clear() {
    this.db.clear();
  }

  async del(path: string) {
    this.db.delete(path);
  }

  async get(path: string) {
    return this.db.get(path);
  }

  async put(path: string, value: any) {
    return this.db.set(path, value);
  }

  async set(path: string, value: any) {
    return this.db.set(path, value);
  }
}
