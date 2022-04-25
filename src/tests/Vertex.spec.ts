import Vertex from "../Vertex";
import { MemoryStore } from "../utils/MemoryStore";
import WebSocketClient from "../WebSocketClient";
import { Server } from "mock-socket";

let v;
let path = "root.vertex";
let sandbox;

describe("Vertex", () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  describe("addListener()", () => {
    it("should add a listener", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      v = new Vertex(path, store);
      v.addListener(spy);
      expect(v.listeners.size).to.be.equal(1);
    });
    it("should add a listener only once", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      v = new Vertex(path, store);
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
      v = new Vertex(path, store);
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
      v = new Vertex(path, store);
      v.listeners.add(spy);
      v.emit({ name: "foot" });
      expect(spy.calledOnce).to.be.true;
    });
    it("should emit a value to several listeners", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      const spy1 = sandbox.spy();
      const spy2 = sandbox.spy();

      v = new Vertex(path, store);

      v.listeners.add(spy);
      v.listeners.add(spy1);
      v.listeners.add(spy2);

      v.emit({ name: "foo" });
      expect(spy.calledOnce).to.be.true;
      expect(spy1.calledOnce).to.be.true;
      expect(spy2.calledOnce).to.be.true;
    });
  });

  describe("delete()", () => {
    it("should delete the vertex storageObject", async () => {
      const store = new MemoryStore();
      v = new Vertex(path, store);
      v.value = { name: "foobar" };
      v.once((val) => {
        expect(val).to.be.undefined;
      });
      await v.delete();
    });
  });

  describe("put()", () => {
    it("should set the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex(path, store);
      v.put({ name: "baz" });
      v.once((val) => {
        // console.log(`test::val`, val);
        expect(val?.name).to.be.equal("baz");
      });
    });
    it("should update the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex(path, store);
      v.put({ name: "baz" });
      v.put({ address: "foo" });
      v.put({ city: "bar" });
      v.put({ state: "foobar" });
      v.once((val) => {
        // console.log(`val`, val);
        expect(val.name).to.be.equal("baz");
        expect(val.address).to.be.equal("foo");
      });
    });
  });

  describe("set()", () => {
    it("should set the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex(path, store);
      v.set({ name: "baz" });
      v.once((val) => {
        expect(val?.name).to.be.equal("baz");
      });
    });
    it("should replace the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex(path, store);
      v.set({ name: "baz" });
      v.set({ address: "foo" });
      v.once((val) => {
        expect(val.address).to.be.equal("foo");
      });
    });
  });

  describe("push()", () => {
    it("should create an array and push a value into it", async () => {
      const store = new MemoryStore();
      v = new Vertex(path, store);
      const obj = { name: "rob" };
      v.push(obj);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
      });
    });
    it("should push a value into an existing array", async () => {
      const store = new MemoryStore();
      v = new Vertex(path, store);
      const obj = { name: "rob" };
      v.put([]);
      v.push(obj);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
      });
    });
    it("should push several values into an existing array", async () => {
      const store = new MemoryStore();
      v = new Vertex(path, store);
      const obj = { name: "rob" };
      const obj1 = { name: "crystal" };
      const obj2 = { name: "brandon" };
      const obj3 = { name: "candace" };
      const obj4 = { name: "camille" };
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
    });
  });

  describe("pop()", () => {
    it("should pop an element of an array", () => {
      const store = new MemoryStore();
      v = new Vertex(path, store);
      const obj = { name: "rob" };
      const obj1 = { name: "crystal" };
      const obj2 = { name: "brandon" };
      const obj3 = { name: "candace" };
      const obj4 = { name: "camille" };
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
      v = new Vertex(path, store);
      const obj = { name: "rob" };
      const obj1 = { name: "crystal" };
      const obj2 = { name: "brandon" };
      const obj3 = { name: "candace" };
      const obj4 = { name: "camille" };
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
      v = new Vertex(path, store);
      const obj = { name: "rob" };
      const obj1 = { name: "crystal" };
      const obj2 = { name: "brandon" };
      const obj3 = { name: "candace" };
      const obj4 = { name: "camille" };
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
      v = new Vertex(path, store);
      v.on((val) => {
        // console.log(`val`, val);
      });
      v.put({ name: "baz" });
      v.put({ address: "foo" });
      v.put({ city: "bar" });
      v.put({ state: "foobar" });
    });
    it("should listen for changes to an array", () => {
      const store = new MemoryStore();
      v = new Vertex(path, store);
      const obj = { name: "rob" };
      const obj1 = { name: "crystal" };
      const obj2 = { name: "brandon" };
      const obj3 = { name: "candace" };
      const obj4 = { name: "camille" };

      v.on((val) => {
        // console.log(`val`, val);
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
      v = new Vertex(path, store);
      v.value = { name: "foobar" };
      v.once((val) => {
        expect(val?.name).to.be.equal("foobar");
      });
    });
  });

  describe.only("network interactions", () => {
    let fakeUrl = "ws://localhost:8080";
    before(() => {
      const mockServer = new Server(fakeUrl);
    });
    describe("get()", () => {
      it("should get data from server", () => {
        const store = new MemoryStore();
        const socket = new WebSocketClient(fakeUrl);
        v = new Vertex(path, store, socket);
        v.once((val) => {
          console.log(`val`, val);
        });
      });
    });
  });
});
