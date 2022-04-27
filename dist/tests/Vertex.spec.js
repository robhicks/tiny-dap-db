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
  constructor(path2, store, socket) {
    this.listeners = new Set();
    this.uuid = uuid();
    this.path = path2;
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
        const v2 = vertices_default.get(el);
        const val = v2.value;
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
      const v2 = vertices_default.get(popped);
      v2.delete();
      this.value = value;
    }
  }
  push(val) {
    const value = copy(this.value);
    if (!isArray(value))
      throw new TypeError("cannot push into non-array");
    const uid = uuid();
    const path2 = `${this.path}.${uid}`;
    const el = new Vertex(path2, this.store, this.socket);
    vertices_default.set(path2, el);
    el.storageObject.value = val;
    el.storageObject.timestamp = utc();
    value.push(path2);
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
      const v2 = vertices_default.get(shifted);
      v2.delete();
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

// src/utils/MemoryStore.ts
var MemoryStore = class {
  constructor() {
    this.db = new Map();
  }
  async clear() {
    this.db.clear();
  }
  async del(path2) {
    this.db.delete(path2);
  }
  async get(path2) {
    return this.db.get(path2);
  }
  async put(path2, value) {
    return this.db.set(path2, value);
  }
  async set(path2, value) {
    return this.db.set(path2, value);
  }
};

// src/tests/Vertex.spec.ts
var v;
var path = "root.vertex";
var sandbox;
describe("Vertex", () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  describe("addListener()", () => {
    it("should add a listener", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      v = new Vertex_default(path, store);
      v.addListener(spy);
      expect(v.listeners.size).to.be.equal(1);
    });
    it("should add a listener only once", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      v = new Vertex_default(path, store);
      v.addListener(spy);
      v.addListener(spy);
      v.addListener(spy);
      expect(v.listeners.size).to.be.equal(1);
    });
  });
  describe("removeListener()", () => {
    it("should delete a listener", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      v = new Vertex_default(path, store);
      v.addListener(spy);
      expect(v.listeners.size).to.be.equal(1);
      v.removeListener(spy);
      expect(v.listeners.size).to.be.equal(0);
    });
  });
  describe("emit()", () => {
    it("should emit a value to a single listener", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      v = new Vertex_default(path, store);
      v.listeners.add(spy);
      v.emit({name: "foot"});
      expect(spy.calledOnce).to.be.true;
    });
    it("should emit a value to several listeners", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      const spy1 = sandbox.spy();
      const spy2 = sandbox.spy();
      v = new Vertex_default(path, store);
      v.listeners.add(spy);
      v.listeners.add(spy1);
      v.listeners.add(spy2);
      v.emit({name: "foo"});
      expect(spy.calledOnce).to.be.true;
      expect(spy1.calledOnce).to.be.true;
      expect(spy2.calledOnce).to.be.true;
    });
  });
  describe("delete()", () => {
    it("should delete the vertex storageObject value", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.value = {name: "foobar"};
      v.delete();
      v.once((val) => {
        expect(val).to.be.undefined;
      });
    });
  });
  describe("put()", () => {
    it("should set the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.put({name: "baz"});
      v.once((val) => {
        expect(val?.name).to.be.equal("baz");
      });
    });
    it("should update the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.put({name: "baz"});
      v.put({address: "foo"});
      v.put({city: "bar"});
      v.put({state: "foobar"});
      v.once((val) => {
        expect(val.name).to.be.equal("baz");
        expect(val.address).to.be.equal("foo");
      });
    });
  });
  describe("set()", () => {
    it("should set the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.set({name: "baz"});
      v.once((val) => {
        expect(val?.name).to.be.equal("baz");
      });
    });
    it("should replace the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.set({name: "baz"});
      v.set({address: "foo"});
      v.once((val) => {
        expect(val.address).to.be.equal("foo");
      });
    });
  });
  describe("push()", () => {
    it("should push a value into an array", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      v.set([]);
      v.push(obj);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
      });
    });
    it("should push several values into an existing array", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      const obj1 = {name: "crystal"};
      const obj2 = {name: "brandon"};
      const obj3 = {name: "candace"};
      const obj4 = {name: "camille"};
      v.put([]);
      v.push(obj);
      v.push(obj1);
      v.push(obj2);
      v.push(obj3);
      v.push(obj4);
      v.once((val) => {
        console.log(`val`, val);
        expect(val[0].name).to.be.equal("rob");
        expect(val[1].name).to.be.equal("crystal");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("candace");
        expect(val[4].name).to.be.equal("camille");
      });
    });
  });
  describe("pop()", () => {
    it("should pop an element of an array", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      const obj1 = {name: "crystal"};
      const obj2 = {name: "brandon"};
      const obj3 = {name: "candace"};
      const obj4 = {name: "camille"};
      v.put([]);
      v.push(obj);
      v.push(obj1);
      v.push(obj2);
      v.push(obj3);
      v.push(obj4);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
        expect(val[1].name).to.be.equal("crystal");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("candace");
        expect(val[4].name).to.be.equal("camille");
      });
      v.pop();
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
        expect(val[1].name).to.be.equal("crystal");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("candace");
      });
    });
  });
  describe("shift()", () => {
    it("should shift an element of an array", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      const obj1 = {name: "crystal"};
      const obj2 = {name: "brandon"};
      const obj3 = {name: "candace"};
      const obj4 = {name: "camille"};
      v.put([]);
      v.push(obj);
      v.push(obj1);
      v.push(obj2);
      v.push(obj3);
      v.push(obj4);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
        expect(val[1].name).to.be.equal("crystal");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("candace");
        expect(val[4].name).to.be.equal("camille");
      });
      v.shift();
      v.once((val) => {
        expect(val[0].name).to.be.equal("crystal");
        expect(val[1].name).to.be.equal("brandon");
        expect(val[2].name).to.be.equal("candace");
        expect(val[3].name).to.be.equal("camille");
      });
    });
  });
  describe("reverse()", () => {
    it("should reverse the elements of an array", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      const obj1 = {name: "crystal"};
      const obj2 = {name: "brandon"};
      const obj3 = {name: "candace"};
      const obj4 = {name: "camille"};
      v.put([]);
      v.push(obj);
      v.push(obj1);
      v.push(obj2);
      v.push(obj3);
      v.push(obj4);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
        expect(val[1].name).to.be.equal("crystal");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("candace");
        expect(val[4].name).to.be.equal("camille");
      });
      v.reverse();
      v.once((val) => {
        expect(val[0].name).to.be.equal("camille");
        expect(val[1].name).to.be.equal("candace");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("crystal");
        expect(val[4].name).to.be.equal("rob");
      });
    });
  });
  describe("on()", () => {
    it("should listen for changes to an object", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.on((val) => {
      });
      v.put({name: "baz"});
      v.put({address: "foo"});
      v.put({city: "bar"});
      v.put({state: "foobar"});
    });
    it("should listen for changes to an array", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      const obj1 = {name: "crystal"};
      const obj2 = {name: "brandon"};
      const obj3 = {name: "candace"};
      const obj4 = {name: "camille"};
      v.on((val) => {
      });
      v.put([]);
      v.push(obj);
      v.push(obj1);
      v.push(obj2);
      v.push(obj3);
      v.push(obj4);
    });
  });
  describe("once()", () => {
    it("should get the value of the vertex", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.value = {name: "foobar"};
      v.once((val) => {
        expect(val?.name).to.be.equal("foobar");
      });
    });
  });
});
