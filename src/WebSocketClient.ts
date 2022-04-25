import decode from "jwt-decode";
import { deserialize } from "./utils/deserialize";
import { serialize } from "./utils/serialize";
import { EventEmitter } from "./utils/EventEmitter";

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
    console.log("checking connection", this.socket.readyState);
    if (!this.socket || this.socket.readyState === 3) this.connect();
  }

  init({
    clientId,
    appId,
    nodeId,
  }: {
    clientId: string;
    appId: string;
    nodeId: string;
  }) {
    this.clientId = clientId;
    this.appId = appId;
    this.nodeId = nodeId;
  }

  async connect() {
    console.count(`connect`);

    try {
      await this.authenticate();
      this.socket = new WebSocket(this.socketUrl);
      console.log(`this.socket`, this.socket);
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
    console.log(`data`, data);
    // const decoded = decode(data);
    // console.log(`decoded`, decoded)
  }

  onopen() {
    setInterval(this.check.bind(this), autoReconnectInterval);
  }
}

export default WebSocketClient;
