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
  constructor(path, store2, socket) {
    this.listeners = new Set();
    this.uuid = uuid();
    this.path = path;
    this.pending;
    this.socket = socket;
    this.store = store2;
    this.storageObject = {
      path: this.path,
      timestamp: utc(),
      uuid: uuid()
    };
    this.load();
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

// src/core.ts
var dotPathRegEx = /\./;
var emailRegEx = /\w+@\S*?\.\w+/i;
var Core = class {
  constructor({
    store: store2,
    socket,
    clientId,
    appId
  }) {
    this.currentPath = "";
    this.vertices = vertices_default;
    this.store = store2;
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
    if (!this.vertices.has(this.currentPath)) {
      this.currentVertex = new Vertex_default(this.currentPath, this.store, this.socket);
      this.vertices.set(this.currentPath, this.currentVertex);
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
  store: store2,
  socket,
  clientId,
  appId
}) => makeChainable_default(new Core({store: store2, socket, clientId, appId}));
var core_default = core;

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

// src/tests/core.spec.ts
var store = new MemoryStore();
describe("core", () => {
  describe("get()", () => {
    it("should get the root", () => {
      const db = core_default({store});
      const root = db.get();
      expect(root.currentPath).to.be.equal("root");
    });
    it("should support chaining", () => {
      const db = core_default({store});
      const t = db.get().get("users").get("rob");
      expect(t.currentPath).to.be.equal("root.users.rob");
    });
    it("should get a dot-separated path", () => {
      const db = core_default({store});
      const root = db.get("root.users.rob");
      expect(root.currentPath).to.be.equal("root.users.rob");
    });
  });
  describe("put()", () => {
    it("should store an initial value", () => {
      const db = core_default({store});
      db.get().get("experiments").put({name: "rob"}).once((val) => expect(val.name).to.be.equal("rob"));
    });
    it("should update an initial value", () => {
      const db = core_default({store});
      const root = db.get();
      const experiments = root.get("experiments");
      db.get().get("experiments").put({name: "rob"}).put({address: "foo"}).once((val) => {
      });
    });
    it("should NOT update an initial value", () => {
      const db = core_default({store});
      const root = db.get();
      const experiments = root.get("experiments");
      db.get().get("experiments").put({name: "rob"}).put({address: "foo"}, false).once((val) => expect(val.name).to.be.equal("rob"));
    });
  });
  describe("set()", () => {
    it("should set an initial value", () => {
      const db = core_default({store});
      const root = db.get();
      const experiments = root.get("experiments");
      db.get().get("experiments").set({name: "rob"}).once((val) => expect(val.name).to.be.equal("rob"));
    });
    it("should set the value over an existing value", () => {
      const db = core_default({store});
      const root = db.get();
      const experiments = root.get("experiments");
      db.get().get("experiments").set({name: "glenda"}).once((val) => expect(val.name).to.be.equal("glenda"));
    });
  });
  describe("push()", () => {
    it("should create an array if one doesn't exist and add an element", () => {
      const db = core_default({store});
      const obj = {name: "rob"};
      db.get().get("array").push(obj).once((val) => {
        expect(val).to.be.an("array");
        expect(val[0]).to.be.an("object");
        expect(val[0]).to.be.equal(obj);
      });
    });
    it("should push a value into an array", () => {
      const db = core_default({store});
      const obj = {name: "rob"};
      db.get().get("array").push(obj).push(obj).once((val) => {
      });
    });
  });
  describe("web socket", () => {
  });
});
