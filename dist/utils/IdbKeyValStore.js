// node_modules/.pnpm/safari-14-idb-fix@3.0.0/node_modules/safari-14-idb-fix/dist/index.js
function idbReady() {
  var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
  if (!isSafari || !indexedDB.databases)
    return Promise.resolve();
  var intervalId;
  return new Promise(function(resolve) {
    var tryIdb = function() {
      return indexedDB.databases().finally(resolve);
    };
    intervalId = setInterval(tryIdb, 100);
    tryIdb();
  }).finally(function() {
    return clearInterval(intervalId);
  });
}
var dist_default = idbReady;

// node_modules/.pnpm/idb-keyval@6.1.0/node_modules/idb-keyval/dist/index.js
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  const dbp = dist_default().then(() => {
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    return promisifyRequest(request);
  });
  return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
var defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
function get(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function set(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
function del(key, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
}
function clear(customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.clear();
    return promisifyRequest(store.transaction);
  });
}

// src/utils/IdbKeyValStore.ts
var defaultDbName = "xprDb";
var defaultStoreName = "xprStore";
var IdbKeyValStore = class {
  constructor(dbName, storeName) {
    this.store = createStore(dbName || defaultDbName, storeName || defaultStoreName);
  }
  async clear() {
    return clear(this.store);
  }
  async del(key) {
    return del(key, this.store);
  }
  async get(key) {
    return get(key, this.store);
  }
  async put(key, data) {
    return set(key, data, this.store);
  }
  async set(key, data) {
    return set(key, data, this.store);
  }
};
export {
  IdbKeyValStore
};
