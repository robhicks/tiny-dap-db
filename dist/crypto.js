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

// src/utils/isBrowser.ts
var isBrowser = typeof window !== "undefined";

// src/crypto.ts
var Crypto = class {
  subtle;
  constructor() {
    this.getSubtle();
    this.subtle = {};
  }
  async getSubtle() {
    if (!isBrowser) {
      const module = await import("crypto");
      const webcrypto = module.webcrypto;
      this.subtle = webcrypto.subtle;
    } else {
      this.subtle = globalThis.crypto.subtle;
    }
  }
  async work(data, keys) {
  }
  async generateKey() {
    const key = await this.subtle.generateKey({ name: "AES-CTR", length: 256 }, true, ["encrypt", "decrypt"]);
    return key;
  }
  async importKey() {
  }
  async exportKey() {
  }
  async encrypt() {
  }
  async decrypt() {
  }
  async wrapKey() {
  }
  async unwrapKey() {
  }
};
var crypto = () => makeChainable_default(new Crypto());
var crypto_default = crypto;
export {
  crypto_default as default
};
