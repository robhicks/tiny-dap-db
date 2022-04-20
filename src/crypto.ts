import { CLIENT_RENEG_WINDOW } from 'tls';
import makeChainable from './utils/makeChainable';
import { isBrowser } from './utils/isBrowser'

class Crypto {
  private subtle: Object
  constructor() {
    this.getSubtle()
    this.subtle = {}
  }
  private async getSubtle() {
    if (!isBrowser) {
      const module = await import('crypto')

      const webcrypto = module.webcrypto
      this.subtle = webcrypto.subtle
    } else {
      this.subtle = globalThis.crypto.subtle
    }
  }
  async work(data, keys) {

  }
  async generateKey() {
    const key = await this.subtle.generateKey({ name: 'AES-CTR', length: 256 }, true, ["encrypt", "decrypt"])
    return key
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
}

const crypto = () => makeChainable(new Crypto())

export default crypto