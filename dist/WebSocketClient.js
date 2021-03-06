// src/utils/isJson.ts
function isJson(str) {
  try {
    const json = JSON.parse(str);
    return json;
  } catch (e) {
    return false;
  }
}

// src/utils/serializer.ts
var deserialize = (str) => isJson(str) || {};
var serialize = (obj) => JSON.stringify(obj);

// src/utils/EventEmitter.ts
var EventEmitter = class {
  constructor() {
    this.events = new Map();
  }
  clear() {
    this.events.clear();
  }
  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach((listener) => {
        listener(...args);
      });
    }
  }
  eventSize(event) {
    return this.events.get(event).size;
  }
  off(event, listener) {
    argValidator(event, listener);
    if (this.events.has(event) && this.events.get(event).has(listener)) {
      this.events.get(event).delete(listener);
      if (this.events.get(event).size === 0)
        this.events.delete(event);
    }
  }
  on(event, listener) {
    argValidator(event, listener);
    if (!this.events.has(event)) {
      const s = new Set();
      s.add(listener);
      this.events.set(event, s);
    } else {
      const s = this.events.get(event);
      s.add(listener);
    }
  }
  once(event, listener) {
    argValidator(event, listener);
    const self = this;
    this.on(event, function f() {
      self.off(event, f);
      listener.apply(this, arguments);
    });
  }
  get size() {
    return this.events.size;
  }
};

// src/vertices.ts
var vertices = new Map();
var vertices_default = vertices;

// src/WebSocketClient.ts
var autoReconnectInterval = 1e3;
var WebSocketClient = class extends EventEmitter {
  constructor(socketUrl) {
    super();
    this.clientId = "";
    this.appId = "";
    this.nodeId = "";
    this.socketUrl = socketUrl;
    this.listeners = new Map();
    this.init();
    this.connect();
  }
  async authenticate() {
    const url = `${this.socketUrl.replace("ws", "http")}/login`;
    try {
      const resp = await fetch(url, {
        method: "POST",
        body: serialize({
          clientId: this.clientId,
          appId: this.appId,
          nodeId: this.nodeId
        })
      });
      return resp;
    } catch (error) {
      console.log(`error`, error);
    }
  }
  check() {
    if (!this.socket || this.socket.readyState === 3)
      this.connect();
    if (this.socket.readyState === 1)
      console.log("connected and ready");
  }
  init({
    clientId,
    appId,
    nodeId
  } = {}) {
    this.clientId = clientId;
    this.appId = appId;
    this.nodeId = nodeId;
  }
  async connect() {
    console.count(`connect`);
    try {
      this.socket = new WebSocket(this.socketUrl);
      this.socket.onclose = this.onclose.bind(this);
      this.socket.onerror = this.onerror.bind(this);
      this.socket.onopen = this.onopen.bind(this);
      this.socket.onmessage = this.onmessage.bind(this);
    } catch (e) {
      console.log(`connect error ----------------------------------------`, e);
    }
  }
  onclose(e) {
    console.log(`onclose error:----`, e);
    switch (e) {
      case 1e3:
        console.log("WebSocket closed normally");
        break;
      default:
        break;
    }
  }
  onerror(e) {
    console.log(`onerror:--------------------------------------`, e);
    setTimeout(() => {
      this.connect();
    }, autoReconnectInterval);
  }
  onmessage(ev) {
    const data = ev.data ? deserialize(ev.data) : {};
    const vertex = vertices_default.get(data.path);
    if (vertex)
      vertex.onMessage(data);
  }
  onopen() {
    setInterval(this.check.bind(this), autoReconnectInterval);
  }
  send(message) {
    if (this.socket.readyState === 1) {
      this.socket.send(serialize(message));
    } else {
      setTimeout(() => this.send(message), 1e3);
    }
  }
};
var WebSocketClient_default = WebSocketClient;
export {
  WebSocketClient_default as default
};
