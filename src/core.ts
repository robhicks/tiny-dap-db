import makeChainable from './utils/makeChainable';
import { uuid } from './utils/uuid';
import Vertex from './Vertex';

const dotPathRegEx = /\./;
const emailRegEx = /\w+@\S*?\.\w+/i;

class Core {
  currentNode: any
  currentPath: String
  nodes: Map<Object, Object>
  store: Object
  uuid: String

  constructor(store: Object) {
    this.currentPath = ''
    this.nodes = new Map();
    this.store = store;
    this.uuid = uuid();
    return this;
  }

  del(path: string) {
    this.currentNode.del()
  }

  get(path: string, owner: string, readers: Array<string>, writers: Array<string>) {
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
    if (!this.nodes.has(this.currentPath)) {
      this.currentNode = new Vertex({
        owner,
        path: this.currentPath,
        readers,
        store: this.store,
        writers
      });
      this.nodes.set(this.currentPath, this.currentNode);
    }
  }

  on(callback: Function) {
    this.currentNode.on(callback)
  }

  once(callback: Function) {
    this.currentNode.once(callback)
  }

  map() {
    this.currentNode.map()
  }

  put(value: any) {
    this.currentNode.put(value)
  }

  set(value: any) {
    this.currentNode.set(value)
  }
}

const core = (store: Object) => makeChainable(new Core(store))

export default core



