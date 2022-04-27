import decode from "jwt-decode";
import { deserialize, serialize } from "./utils/serializer";
import { EventEmitter } from "./utils/EventEmitter";
import vertices from "./vertices";

const autoReconnectInterval = 1000;
const sendRetryTimeout = 1000;

class WebSocketClient extends EventEmitter {
  listeners: Map<Object, Object>;
  socketUrl: string;
  socket: any;
  clientId: string;
  appId: string;
  nodeId: string;
  constructor(socketUrl: string) {
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
          nodeId: this.nodeId,
        }),
      });
      return resp;
    } catch (error) {
      console.log(`error`, error);
    }
  }

  check() {
    // console.log("checking connection", this.socket.readyState);
    if (!this.socket || this.socket.readyState === 3) this.connect();
    if (this.socket.readyState === 1) console.log("connected and ready");
  }

  init({
    clientId,
    appId,
    nodeId,
  }: {
    clientId?: string;
    appId?: string;
    nodeId?: string;
  } = {}) {
    this.clientId = clientId;
    this.appId = appId;
    this.nodeId = nodeId;
  }

  async connect() {
    console.count(`connect`);

    try {
      // await this.authenticate();
      this.socket = new WebSocket(this.socketUrl);
      this.socket.onclose = this.onclose.bind(this);
      this.socket.onerror = this.onerror.bind(this);
      this.socket.onopen = this.onopen.bind(this);
      this.socket.onmessage = this.onmessage.bind(this);
    } catch (e) {
      console.log(`connect error ----------------------------------------`, e);
    }
  }

  onclose(e: any) {
    console.log(`onclose error:----`, e);
    switch (e) {
      case 1000:
        console.log("WebSocket closed normally");
        break;
      default:
        break;
    }
  }

  onerror(e: any) {
    console.log(`onerror:--------------------------------------`, e);
    setTimeout(() => {
      this.connect();
    }, autoReconnectInterval);
  }

  onmessage(ev: any) {
    const data = ev.data ? deserialize(ev.data) : {};
    const vertex = vertices.get(data.path);
    if (vertex) vertex.onMessage(data);
  }

  onopen() {
    setInterval(this.check.bind(this), autoReconnectInterval);
  }

  send(message) {
    if (this.socket.readyState === 1) {
      this.socket.send(serialize(message));
    } else {
      setTimeout(() => this.send(message), 1000);
    }
  }
}

export default WebSocketClient;
