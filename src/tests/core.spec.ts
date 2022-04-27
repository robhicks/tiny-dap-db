import core from "../core";
import { MemoryStore } from "../utils/MemoryStore";
import { WebSocketClient } from "../WebSocketClient";

const store = new MemoryStore();

describe("core", () => {
  let db;
  before(() => {
    db = core({ store });
  });
  describe("get()", () => {
    it("should get the root", () => {
      const root = db.get();
      expect(root.currentPath).to.be.equal("root");
    });

    it("should support chaining", () => {
      const t = db.get().get("users").get("rob");
      expect(t.currentPath).to.be.equal("root.users.rob");
    });

    it("should get a dot-separated path", () => {
      const db = core({ store });
      const root = db.get("root.users.rob");
      expect(root.currentPath).to.be.equal("root.users.rob");
    });
  });

  describe("put()", () => {
    it("should store an initial value", () => {
      db.get()
        .get("experiments")
        .put({ name: "rob" })
        .once((val) => expect(val.name).to.be.equal("rob"));
    });

    it("should update an initial value", () => {
      const root = db.get();
      const experiments = root.get("experiments");
      db.get()
        .get("experiments")
        .put({ name: "rob" })
        .put({ address: "foo" })
        .once((val) => {
          console.log(`val`, val);
        });
    });

    it("should NOT update an initial value", () => {
      const root = db.get();
      const experiments = root.get("experiments");
      db.get()
        .get("experiments")
        .put({ name: "rob" })
        .put({ address: "foo" }, false)
        .once((val) => expect(val.name).to.be.equal("rob"));
    });
  });

  describe("set()", () => {
    it("should set an initial value", () => {
      const root = db.get();
      const experiments = root.get("experiments");
      db.get()
        .get("experiments")
        .set({ name: "rob" })
        .once((val) => expect(val.name).to.be.equal("rob"));
    });
    it("should set the value over an existing value", () => {
      const root = db.get();
      const experiments = root.get("experiments");
      db.get()
        .get("experiments")
        .set({ name: "glenda" })
        .once((val) => expect(val.name).to.be.equal("glenda"));
    });
  });

  describe("push()", () => {
    it("should create an array if one doesn't exist and add an element", () => {
      const obj = { name: "rob" };
      db.get()
        .get("array")
        .set([])
        .push(obj)
        .once((val) => {
          expect(val).to.be.an("array");
          expect(val[0]).to.be.an("object");
          expect(val[0]).to.be.equal(obj);
        });
    });
    it("should push a value into an array", () => {
      const obj = { name: "rob" };
      db.get()
        .get("array")
        .set([])
        .push(obj)
        .push(obj)
        .once((val) => {
          // console.log(`val`, val)
        });
    });
  });

  describe("web socket", () => {
    // const socket = new WebSocketClient('ws://localhost:3001')
    // const db = core({store, socket, clientId: 'foo', appId: 'bar'})
  });
});
