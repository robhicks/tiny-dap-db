import Vertex from "../Vertex";
import { MemoryStore } from "../utils/MemoryStore";
import WebSocketClient from "../WebSocketClient";
import { Server } from "mock-socket";
import { deserialize, serialize } from "../utils/serializer";
import vertices from "../vertices";

let v;
let path = "root.vertex";
let sandbox;
let wsc;
let store;

describe.only("Vertex-network interactions", () => {
  let fakeUrl = "ws://localhost:8080";
  before(() => {
    const mockServer = new Server(fakeUrl);
    wsc = new WebSocketClient(fakeUrl);
    store = new MemoryStore();
    v = new Vertex(path, store, wsc);
    vertices.set(path, v);
    mockServer.on("connection", (socket) => {
      socket.on("message", (data) => {
        const message = deserialize(data);
        if (message.request === "REGISTER") {
          socket.send(serialize({ ...message, ...{ response: "OK" } }));
        }
      });
    });
  });
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  describe("registration", () => {
    it("should register with a server", () => {});
  });

  describe("onmessage()", () => {
    it("should receive data from a server", () => {});
  });
});
