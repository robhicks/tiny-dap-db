import makeChainable from "./utils/makeChainable";
import { uuid } from "./utils/uuid";
import Vertex from "./Vertex";

const dotPathRegEx = /\./;
const emailRegEx = /\w+@\S*?\.\w+/i;

class Core {
  currentVertex: any;
  currentPath: string;
  nodes: Map<Object, Object>;
  socket: any;
  store: object;
  uuid: string;
  clientId?: string;
  appId?: string;

  constructor({
    store,
    socket,
    clientId,
    appId,
  }: {
    store?: any;
    socket?: any;
    clientId?: string;
    appId?: string;
  }) {
    this.currentPath = "";
    this.nodes = new Map();
    this.store = store;
    this.uuid = uuid();
    this.socket = socket;
    if (this.socket) {
      this.socket.init({ clientId, appId, nodeId: this.uuid });
      this.socket.connect();
    }
    return this;
  }

  del(path: string) {
    this.currentVertex.del();
  }

  get(path: string) {
    if (!path) {
      this.currentPath = "root";
    } else if (dotPathRegEx.test(path) && !emailRegEx.test(path)) {
      this.currentPath = path;
    } else {
      if (path === "root") this.currentPath = path;
      const idx = this.currentPath ? this.currentPath.lastIndexOf(path) : -1;
      if (idx !== -1) {
        this.currentPath = this.currentPath.substr(0, idx + path.length);
      } else if (path?.includes("root")) {
        this.currentPath = path;
      } else {
        this.currentPath = `${this.currentPath || "root"}.${path}`;
      }
    }
    if (!this.nodes.has(this.currentPath)) {
      this.currentVertex = new Vertex(
        this.currentPath,
        this.store,
        this.socket
      );
      this.nodes.set(this.currentPath, this.currentVertex);
    }
  }

  on(callback: Function) {
    this.currentVertex.on(callback);
  }

  once(callback: Function) {
    this.currentVertex.once(callback);
  }

  put(value: object) {
    this.currentVertex.put(value);
  }

  set(value: object) {
    this.currentVertex.set(value);
  }

  pop() {
    this.currentVertex.pop();
  }

  push(value: any) {
    this.currentVertex.push(value);
  }

  reverse() {
    this.currentVertex.reverse();
  }

  shift() {
    this.currentVertex.shift();
  }
}

const core = ({
  store,
  socket,
  clientId,
  appId,
}: {
  store: any;
  socket?: any;
  clientId?: string;
  appId?: string;
}) => makeChainable(new Core({ store, socket, clientId, appId }));

export default core;
