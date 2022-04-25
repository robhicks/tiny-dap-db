var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module) => () => {
  if (!module) {
    module = {exports: {}};
    callback(module.exports, module);
  }
  return module.exports;
};
var __exportStar = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module) => {
  return __exportStar(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
};

// node_modules/.pnpm/mock-socket@9.1.3/node_modules/mock-socket/dist/mock-socket.js
var require_mock_socket = __commonJS((exports, module) => {
  (function(global2, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global2.Mock = global2.Mock || {});
  })(exports, function(exports2) {
    "use strict";
    var commonjsGlobal = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    var requiresPort = function required(port, protocol) {
      protocol = protocol.split(":")[0];
      port = +port;
      if (!port) {
        return false;
      }
      switch (protocol) {
        case "http":
        case "ws":
          return port !== 80;
        case "https":
        case "wss":
          return port !== 443;
        case "ftp":
          return port !== 21;
        case "gopher":
          return port !== 70;
        case "file":
          return false;
      }
      return port !== 0;
    };
    var has = Object.prototype.hasOwnProperty;
    var undef;
    function decode(input) {
      try {
        return decodeURIComponent(input.replace(/\+/g, " "));
      } catch (e) {
        return null;
      }
    }
    function encode(input) {
      try {
        return encodeURIComponent(input);
      } catch (e) {
        return null;
      }
    }
    function querystring(query) {
      var parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
      while (part = parser.exec(query)) {
        var key = decode(part[1]), value = decode(part[2]);
        if (key === null || value === null || key in result) {
          continue;
        }
        result[key] = value;
      }
      return result;
    }
    function querystringify(obj, prefix) {
      prefix = prefix || "";
      var pairs = [], value, key;
      if (typeof prefix !== "string") {
        prefix = "?";
      }
      for (key in obj) {
        if (has.call(obj, key)) {
          value = obj[key];
          if (!value && (value === null || value === undef || isNaN(value))) {
            value = "";
          }
          key = encode(key);
          value = encode(value);
          if (key === null || value === null) {
            continue;
          }
          pairs.push(key + "=" + value);
        }
      }
      return pairs.length ? prefix + pairs.join("&") : "";
    }
    var stringify = querystringify;
    var parse = querystring;
    var querystringify_1 = {
      stringify,
      parse
    };
    var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;
    var protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i;
    var whitespace = "[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]";
    var left = new RegExp("^" + whitespace + "+");
    function trimLeft(str) {
      return (str ? str : "").toString().replace(left, "");
    }
    var rules = [
      ["#", "hash"],
      ["?", "query"],
      function sanitize(address, url) {
        return isSpecial(url.protocol) ? address.replace(/\\/g, "/") : address;
      },
      ["/", "pathname"],
      ["@", "auth", 1],
      [NaN, "host", void 0, 1, 1],
      [/:(\d+)$/, "port", void 0, 1],
      [NaN, "hostname", void 0, 1, 1]
    ];
    var ignore = {hash: 1, query: 1};
    function lolcation(loc) {
      var globalVar;
      if (typeof window !== "undefined") {
        globalVar = window;
      } else if (typeof commonjsGlobal !== "undefined") {
        globalVar = commonjsGlobal;
      } else if (typeof self !== "undefined") {
        globalVar = self;
      } else {
        globalVar = {};
      }
      var location = globalVar.location || {};
      loc = loc || location;
      var finaldestination = {}, type = typeof loc, key;
      if (loc.protocol === "blob:") {
        finaldestination = new Url(unescape(loc.pathname), {});
      } else if (type === "string") {
        finaldestination = new Url(loc, {});
        for (key in ignore) {
          delete finaldestination[key];
        }
      } else if (type === "object") {
        for (key in loc) {
          if (key in ignore) {
            continue;
          }
          finaldestination[key] = loc[key];
        }
        if (finaldestination.slashes === void 0) {
          finaldestination.slashes = slashes.test(loc.href);
        }
      }
      return finaldestination;
    }
    function isSpecial(scheme) {
      return scheme === "file:" || scheme === "ftp:" || scheme === "http:" || scheme === "https:" || scheme === "ws:" || scheme === "wss:";
    }
    function extractProtocol(address, location) {
      address = trimLeft(address);
      location = location || {};
      var match = protocolre.exec(address);
      var protocol = match[1] ? match[1].toLowerCase() : "";
      var forwardSlashes = !!match[2];
      var otherSlashes = !!match[3];
      var slashesCount = 0;
      var rest;
      if (forwardSlashes) {
        if (otherSlashes) {
          rest = match[2] + match[3] + match[4];
          slashesCount = match[2].length + match[3].length;
        } else {
          rest = match[2] + match[4];
          slashesCount = match[2].length;
        }
      } else {
        if (otherSlashes) {
          rest = match[3] + match[4];
          slashesCount = match[3].length;
        } else {
          rest = match[4];
        }
      }
      if (protocol === "file:") {
        if (slashesCount >= 2) {
          rest = rest.slice(2);
        }
      } else if (isSpecial(protocol)) {
        rest = match[4];
      } else if (protocol) {
        if (forwardSlashes) {
          rest = rest.slice(2);
        }
      } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
        rest = match[4];
      }
      return {
        protocol,
        slashes: forwardSlashes || isSpecial(protocol),
        slashesCount,
        rest
      };
    }
    function resolve(relative, base) {
      if (relative === "") {
        return base;
      }
      var path2 = (base || "/").split("/").slice(0, -1).concat(relative.split("/")), i = path2.length, last = path2[i - 1], unshift = false, up = 0;
      while (i--) {
        if (path2[i] === ".") {
          path2.splice(i, 1);
        } else if (path2[i] === "..") {
          path2.splice(i, 1);
          up++;
        } else if (up) {
          if (i === 0) {
            unshift = true;
          }
          path2.splice(i, 1);
          up--;
        }
      }
      if (unshift) {
        path2.unshift("");
      }
      if (last === "." || last === "..") {
        path2.push("");
      }
      return path2.join("/");
    }
    function Url(address, location, parser) {
      address = trimLeft(address);
      if (!(this instanceof Url)) {
        return new Url(address, location, parser);
      }
      var relative, extracted, parse2, instruction, index, key, instructions = rules.slice(), type = typeof location, url = this, i = 0;
      if (type !== "object" && type !== "string") {
        parser = location;
        location = null;
      }
      if (parser && typeof parser !== "function") {
        parser = querystringify_1.parse;
      }
      location = lolcation(location);
      extracted = extractProtocol(address || "", location);
      relative = !extracted.protocol && !extracted.slashes;
      url.slashes = extracted.slashes || relative && location.slashes;
      url.protocol = extracted.protocol || location.protocol || "";
      address = extracted.rest;
      if (url.protocol === "file:" || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url.protocol))) {
        instructions[3] = [/(.*)/, "pathname"];
      }
      for (; i < instructions.length; i++) {
        instruction = instructions[i];
        if (typeof instruction === "function") {
          address = instruction(address, url);
          continue;
        }
        parse2 = instruction[0];
        key = instruction[1];
        if (parse2 !== parse2) {
          url[key] = address;
        } else if (typeof parse2 === "string") {
          if (~(index = address.indexOf(parse2))) {
            if (typeof instruction[2] === "number") {
              url[key] = address.slice(0, index);
              address = address.slice(index + instruction[2]);
            } else {
              url[key] = address.slice(index);
              address = address.slice(0, index);
            }
          }
        } else if (index = parse2.exec(address)) {
          url[key] = index[1];
          address = address.slice(0, index.index);
        }
        url[key] = url[key] || (relative && instruction[3] ? location[key] || "" : "");
        if (instruction[4]) {
          url[key] = url[key].toLowerCase();
        }
      }
      if (parser) {
        url.query = parser(url.query);
      }
      if (relative && location.slashes && url.pathname.charAt(0) !== "/" && (url.pathname !== "" || location.pathname !== "")) {
        url.pathname = resolve(url.pathname, location.pathname);
      }
      if (url.pathname.charAt(0) !== "/" && isSpecial(url.protocol)) {
        url.pathname = "/" + url.pathname;
      }
      if (!requiresPort(url.port, url.protocol)) {
        url.host = url.hostname;
        url.port = "";
      }
      url.username = url.password = "";
      if (url.auth) {
        instruction = url.auth.split(":");
        url.username = instruction[0] || "";
        url.password = instruction[1] || "";
      }
      url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
      url.href = url.toString();
    }
    function set(part, value, fn) {
      var url = this;
      switch (part) {
        case "query":
          if (typeof value === "string" && value.length) {
            value = (fn || querystringify_1.parse)(value);
          }
          url[part] = value;
          break;
        case "port":
          url[part] = value;
          if (!requiresPort(value, url.protocol)) {
            url.host = url.hostname;
            url[part] = "";
          } else if (value) {
            url.host = url.hostname + ":" + value;
          }
          break;
        case "hostname":
          url[part] = value;
          if (url.port) {
            value += ":" + url.port;
          }
          url.host = value;
          break;
        case "host":
          url[part] = value;
          if (/:\d+$/.test(value)) {
            value = value.split(":");
            url.port = value.pop();
            url.hostname = value.join(":");
          } else {
            url.hostname = value;
            url.port = "";
          }
          break;
        case "protocol":
          url.protocol = value.toLowerCase();
          url.slashes = !fn;
          break;
        case "pathname":
        case "hash":
          if (value) {
            var char = part === "pathname" ? "/" : "#";
            url[part] = value.charAt(0) !== char ? char + value : value;
          } else {
            url[part] = value;
          }
          break;
        default:
          url[part] = value;
      }
      for (var i = 0; i < rules.length; i++) {
        var ins = rules[i];
        if (ins[4]) {
          url[ins[1]] = url[ins[1]].toLowerCase();
        }
      }
      url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
      url.href = url.toString();
      return url;
    }
    function toString(stringify2) {
      if (!stringify2 || typeof stringify2 !== "function") {
        stringify2 = querystringify_1.stringify;
      }
      var query, url = this, protocol = url.protocol;
      if (protocol && protocol.charAt(protocol.length - 1) !== ":") {
        protocol += ":";
      }
      var result = protocol + (url.slashes || isSpecial(url.protocol) ? "//" : "");
      if (url.username) {
        result += url.username;
        if (url.password) {
          result += ":" + url.password;
        }
        result += "@";
      }
      result += url.host + url.pathname;
      query = typeof url.query === "object" ? stringify2(url.query) : url.query;
      if (query) {
        result += query.charAt(0) !== "?" ? "?" + query : query;
      }
      if (url.hash) {
        result += url.hash;
      }
      return result;
    }
    Url.prototype = {set, toString};
    Url.extractProtocol = extractProtocol;
    Url.location = lolcation;
    Url.trimLeft = trimLeft;
    Url.qs = querystringify_1;
    var urlParse = Url;
    function delay(callback, context) {
      setTimeout(function(timeoutContext) {
        return callback.call(timeoutContext);
      }, 4, context);
    }
    function log(method, message) {
      if (typeof process !== "undefined" && process.env.NODE_ENV !== "test") {
        console[method].call(null, message);
      }
    }
    function reject(array, callback) {
      if (array === void 0)
        array = [];
      var results = [];
      array.forEach(function(itemInArray) {
        if (!callback(itemInArray)) {
          results.push(itemInArray);
        }
      });
      return results;
    }
    function filter(array, callback) {
      if (array === void 0)
        array = [];
      var results = [];
      array.forEach(function(itemInArray) {
        if (callback(itemInArray)) {
          results.push(itemInArray);
        }
      });
      return results;
    }
    var EventTarget = function EventTarget2() {
      this.listeners = {};
    };
    EventTarget.prototype.addEventListener = function addEventListener(type, listener) {
      if (typeof listener === "function") {
        if (!Array.isArray(this.listeners[type])) {
          this.listeners[type] = [];
        }
        if (filter(this.listeners[type], function(item) {
          return item === listener;
        }).length === 0) {
          this.listeners[type].push(listener);
        }
      }
    };
    EventTarget.prototype.removeEventListener = function removeEventListener(type, removingListener) {
      var arrayOfListeners = this.listeners[type];
      this.listeners[type] = reject(arrayOfListeners, function(listener) {
        return listener === removingListener;
      });
    };
    EventTarget.prototype.dispatchEvent = function dispatchEvent(event) {
      var this$1 = this;
      var customArguments = [], len = arguments.length - 1;
      while (len-- > 0)
        customArguments[len] = arguments[len + 1];
      var eventName = event.type;
      var listeners = this.listeners[eventName];
      if (!Array.isArray(listeners)) {
        return false;
      }
      listeners.forEach(function(listener) {
        if (customArguments.length > 0) {
          listener.apply(this$1, customArguments);
        } else {
          listener.call(this$1, event);
        }
      });
      return true;
    };
    function trimQueryPartFromURL(url) {
      var queryIndex = url.indexOf("?");
      return queryIndex >= 0 ? url.slice(0, queryIndex) : url;
    }
    var NetworkBridge = function NetworkBridge2() {
      this.urlMap = {};
    };
    NetworkBridge.prototype.attachWebSocket = function attachWebSocket(websocket, url) {
      var serverURL = trimQueryPartFromURL(url);
      var connectionLookup = this.urlMap[serverURL];
      if (connectionLookup && connectionLookup.server && connectionLookup.websockets.indexOf(websocket) === -1) {
        connectionLookup.websockets.push(websocket);
        return connectionLookup.server;
      }
    };
    NetworkBridge.prototype.addMembershipToRoom = function addMembershipToRoom(websocket, room) {
      var connectionLookup = this.urlMap[trimQueryPartFromURL(websocket.url)];
      if (connectionLookup && connectionLookup.server && connectionLookup.websockets.indexOf(websocket) !== -1) {
        if (!connectionLookup.roomMemberships[room]) {
          connectionLookup.roomMemberships[room] = [];
        }
        connectionLookup.roomMemberships[room].push(websocket);
      }
    };
    NetworkBridge.prototype.attachServer = function attachServer(server, url) {
      var serverUrl = trimQueryPartFromURL(url);
      var connectionLookup = this.urlMap[serverUrl];
      if (!connectionLookup) {
        this.urlMap[serverUrl] = {
          server,
          websockets: [],
          roomMemberships: {}
        };
        return server;
      }
    };
    NetworkBridge.prototype.serverLookup = function serverLookup(url) {
      var serverURL = trimQueryPartFromURL(url);
      var connectionLookup = this.urlMap[serverURL];
      if (connectionLookup) {
        return connectionLookup.server;
      }
    };
    NetworkBridge.prototype.websocketsLookup = function websocketsLookup(url, room, broadcaster) {
      var serverURL = trimQueryPartFromURL(url);
      var websockets;
      var connectionLookup = this.urlMap[serverURL];
      websockets = connectionLookup ? connectionLookup.websockets : [];
      if (room) {
        var members = connectionLookup.roomMemberships[room];
        websockets = members || [];
      }
      return broadcaster ? websockets.filter(function(websocket) {
        return websocket !== broadcaster;
      }) : websockets;
    };
    NetworkBridge.prototype.removeServer = function removeServer(url) {
      delete this.urlMap[trimQueryPartFromURL(url)];
    };
    NetworkBridge.prototype.removeWebSocket = function removeWebSocket(websocket, url) {
      var serverURL = trimQueryPartFromURL(url);
      var connectionLookup = this.urlMap[serverURL];
      if (connectionLookup) {
        connectionLookup.websockets = reject(connectionLookup.websockets, function(socket) {
          return socket === websocket;
        });
      }
    };
    NetworkBridge.prototype.removeMembershipFromRoom = function removeMembershipFromRoom(websocket, room) {
      var connectionLookup = this.urlMap[trimQueryPartFromURL(websocket.url)];
      var memberships = connectionLookup.roomMemberships[room];
      if (connectionLookup && memberships !== null) {
        connectionLookup.roomMemberships[room] = reject(memberships, function(socket) {
          return socket === websocket;
        });
      }
    };
    var networkBridge = new NetworkBridge();
    var CLOSE_CODES = {
      CLOSE_NORMAL: 1e3,
      CLOSE_GOING_AWAY: 1001,
      CLOSE_PROTOCOL_ERROR: 1002,
      CLOSE_UNSUPPORTED: 1003,
      CLOSE_NO_STATUS: 1005,
      CLOSE_ABNORMAL: 1006,
      UNSUPPORTED_DATA: 1007,
      POLICY_VIOLATION: 1008,
      CLOSE_TOO_LARGE: 1009,
      MISSING_EXTENSION: 1010,
      INTERNAL_ERROR: 1011,
      SERVICE_RESTART: 1012,
      TRY_AGAIN_LATER: 1013,
      TLS_HANDSHAKE: 1015
    };
    var ERROR_PREFIX = {
      CONSTRUCTOR_ERROR: "Failed to construct 'WebSocket':",
      CLOSE_ERROR: "Failed to execute 'close' on 'WebSocket':",
      EVENT: {
        CONSTRUCT: "Failed to construct 'Event':",
        MESSAGE: "Failed to construct 'MessageEvent':",
        CLOSE: "Failed to construct 'CloseEvent':"
      }
    };
    var EventPrototype = function EventPrototype2() {
    };
    EventPrototype.prototype.stopPropagation = function stopPropagation() {
    };
    EventPrototype.prototype.stopImmediatePropagation = function stopImmediatePropagation() {
    };
    EventPrototype.prototype.initEvent = function initEvent(type, bubbles, cancelable) {
      if (type === void 0)
        type = "undefined";
      if (bubbles === void 0)
        bubbles = false;
      if (cancelable === void 0)
        cancelable = false;
      this.type = "" + type;
      this.bubbles = Boolean(bubbles);
      this.cancelable = Boolean(cancelable);
    };
    var Event = function(EventPrototype$$1) {
      function Event2(type, eventInitConfig) {
        if (eventInitConfig === void 0)
          eventInitConfig = {};
        EventPrototype$$1.call(this);
        if (!type) {
          throw new TypeError(ERROR_PREFIX.EVENT_ERROR + " 1 argument required, but only 0 present.");
        }
        if (typeof eventInitConfig !== "object") {
          throw new TypeError(ERROR_PREFIX.EVENT_ERROR + " parameter 2 ('eventInitDict') is not an object.");
        }
        var bubbles = eventInitConfig.bubbles;
        var cancelable = eventInitConfig.cancelable;
        this.type = "" + type;
        this.timeStamp = Date.now();
        this.target = null;
        this.srcElement = null;
        this.returnValue = true;
        this.isTrusted = false;
        this.eventPhase = 0;
        this.defaultPrevented = false;
        this.currentTarget = null;
        this.cancelable = cancelable ? Boolean(cancelable) : false;
        this.cancelBubble = false;
        this.bubbles = bubbles ? Boolean(bubbles) : false;
      }
      if (EventPrototype$$1)
        Event2.__proto__ = EventPrototype$$1;
      Event2.prototype = Object.create(EventPrototype$$1 && EventPrototype$$1.prototype);
      Event2.prototype.constructor = Event2;
      return Event2;
    }(EventPrototype);
    var MessageEvent = function(EventPrototype$$1) {
      function MessageEvent2(type, eventInitConfig) {
        if (eventInitConfig === void 0)
          eventInitConfig = {};
        EventPrototype$$1.call(this);
        if (!type) {
          throw new TypeError(ERROR_PREFIX.EVENT.MESSAGE + " 1 argument required, but only 0 present.");
        }
        if (typeof eventInitConfig !== "object") {
          throw new TypeError(ERROR_PREFIX.EVENT.MESSAGE + " parameter 2 ('eventInitDict') is not an object");
        }
        var bubbles = eventInitConfig.bubbles;
        var cancelable = eventInitConfig.cancelable;
        var data = eventInitConfig.data;
        var origin = eventInitConfig.origin;
        var lastEventId = eventInitConfig.lastEventId;
        var ports = eventInitConfig.ports;
        this.type = "" + type;
        this.timeStamp = Date.now();
        this.target = null;
        this.srcElement = null;
        this.returnValue = true;
        this.isTrusted = false;
        this.eventPhase = 0;
        this.defaultPrevented = false;
        this.currentTarget = null;
        this.cancelable = cancelable ? Boolean(cancelable) : false;
        this.canncelBubble = false;
        this.bubbles = bubbles ? Boolean(bubbles) : false;
        this.origin = "" + origin;
        this.ports = typeof ports === "undefined" ? null : ports;
        this.data = typeof data === "undefined" ? null : data;
        this.lastEventId = "" + (lastEventId || "");
      }
      if (EventPrototype$$1)
        MessageEvent2.__proto__ = EventPrototype$$1;
      MessageEvent2.prototype = Object.create(EventPrototype$$1 && EventPrototype$$1.prototype);
      MessageEvent2.prototype.constructor = MessageEvent2;
      return MessageEvent2;
    }(EventPrototype);
    var CloseEvent = function(EventPrototype$$1) {
      function CloseEvent2(type, eventInitConfig) {
        if (eventInitConfig === void 0)
          eventInitConfig = {};
        EventPrototype$$1.call(this);
        if (!type) {
          throw new TypeError(ERROR_PREFIX.EVENT.CLOSE + " 1 argument required, but only 0 present.");
        }
        if (typeof eventInitConfig !== "object") {
          throw new TypeError(ERROR_PREFIX.EVENT.CLOSE + " parameter 2 ('eventInitDict') is not an object");
        }
        var bubbles = eventInitConfig.bubbles;
        var cancelable = eventInitConfig.cancelable;
        var code = eventInitConfig.code;
        var reason = eventInitConfig.reason;
        var wasClean = eventInitConfig.wasClean;
        this.type = "" + type;
        this.timeStamp = Date.now();
        this.target = null;
        this.srcElement = null;
        this.returnValue = true;
        this.isTrusted = false;
        this.eventPhase = 0;
        this.defaultPrevented = false;
        this.currentTarget = null;
        this.cancelable = cancelable ? Boolean(cancelable) : false;
        this.cancelBubble = false;
        this.bubbles = bubbles ? Boolean(bubbles) : false;
        this.code = typeof code === "number" ? parseInt(code, 10) : 0;
        this.reason = "" + (reason || "");
        this.wasClean = wasClean ? Boolean(wasClean) : false;
      }
      if (EventPrototype$$1)
        CloseEvent2.__proto__ = EventPrototype$$1;
      CloseEvent2.prototype = Object.create(EventPrototype$$1 && EventPrototype$$1.prototype);
      CloseEvent2.prototype.constructor = CloseEvent2;
      return CloseEvent2;
    }(EventPrototype);
    function createEvent(config) {
      var type = config.type;
      var target = config.target;
      var eventObject = new Event(type);
      if (target) {
        eventObject.target = target;
        eventObject.srcElement = target;
        eventObject.currentTarget = target;
      }
      return eventObject;
    }
    function createMessageEvent(config) {
      var type = config.type;
      var origin = config.origin;
      var data = config.data;
      var target = config.target;
      var messageEvent = new MessageEvent(type, {
        data,
        origin
      });
      if (target) {
        messageEvent.target = target;
        messageEvent.srcElement = target;
        messageEvent.currentTarget = target;
      }
      return messageEvent;
    }
    function createCloseEvent(config) {
      var code = config.code;
      var reason = config.reason;
      var type = config.type;
      var target = config.target;
      var wasClean = config.wasClean;
      if (!wasClean) {
        wasClean = code === CLOSE_CODES.CLOSE_NORMAL || code === CLOSE_CODES.CLOSE_NO_STATUS;
      }
      var closeEvent = new CloseEvent(type, {
        code,
        reason,
        wasClean
      });
      if (target) {
        closeEvent.target = target;
        closeEvent.srcElement = target;
        closeEvent.currentTarget = target;
      }
      return closeEvent;
    }
    function closeWebSocketConnection(context, code, reason) {
      context.readyState = WebSocket$1.CLOSING;
      var server = networkBridge.serverLookup(context.url);
      var closeEvent = createCloseEvent({
        type: "close",
        target: context.target,
        code,
        reason
      });
      delay(function() {
        networkBridge.removeWebSocket(context, context.url);
        context.readyState = WebSocket$1.CLOSED;
        context.dispatchEvent(closeEvent);
        if (server) {
          server.dispatchEvent(closeEvent, server);
        }
      }, context);
    }
    function failWebSocketConnection(context, code, reason) {
      context.readyState = WebSocket$1.CLOSING;
      var server = networkBridge.serverLookup(context.url);
      var closeEvent = createCloseEvent({
        type: "close",
        target: context.target,
        code,
        reason,
        wasClean: false
      });
      var errorEvent = createEvent({
        type: "error",
        target: context.target
      });
      delay(function() {
        networkBridge.removeWebSocket(context, context.url);
        context.readyState = WebSocket$1.CLOSED;
        context.dispatchEvent(errorEvent);
        context.dispatchEvent(closeEvent);
        if (server) {
          server.dispatchEvent(closeEvent, server);
        }
      }, context);
    }
    function normalizeSendData(data) {
      if (Object.prototype.toString.call(data) !== "[object Blob]" && !(data instanceof ArrayBuffer)) {
        data = String(data);
      }
      return data;
    }
    var proxies = new WeakMap();
    function proxyFactory(target) {
      if (proxies.has(target)) {
        return proxies.get(target);
      }
      var proxy = new Proxy(target, {
        get: function get(obj, prop) {
          if (prop === "close") {
            return function close(options) {
              if (options === void 0)
                options = {};
              var code = options.code || CLOSE_CODES.CLOSE_NORMAL;
              var reason = options.reason || "";
              closeWebSocketConnection(proxy, code, reason);
            };
          }
          if (prop === "send") {
            return function send(data) {
              data = normalizeSendData(data);
              target.dispatchEvent(createMessageEvent({
                type: "message",
                data,
                origin: this.url,
                target
              }));
            };
          }
          if (prop === "on") {
            return function onWrapper(type, cb) {
              target.addEventListener("server::" + type, cb);
            };
          }
          if (prop === "target") {
            return target;
          }
          return obj[prop];
        }
      });
      proxies.set(target, proxy);
      return proxy;
    }
    function lengthInUtf8Bytes(str) {
      var m = encodeURIComponent(str).match(/%[89ABab]/g);
      return str.length + (m ? m.length : 0);
    }
    function urlVerification(url) {
      var urlRecord = new urlParse(url);
      var pathname = urlRecord.pathname;
      var protocol = urlRecord.protocol;
      var hash = urlRecord.hash;
      if (!url) {
        throw new TypeError(ERROR_PREFIX.CONSTRUCTOR_ERROR + " 1 argument required, but only 0 present.");
      }
      if (!pathname) {
        urlRecord.pathname = "/";
      }
      if (protocol === "") {
        throw new SyntaxError(ERROR_PREFIX.CONSTRUCTOR_ERROR + " The URL '" + urlRecord.toString() + "' is invalid.");
      }
      if (protocol !== "ws:" && protocol !== "wss:") {
        throw new SyntaxError(ERROR_PREFIX.CONSTRUCTOR_ERROR + " The URL's scheme must be either 'ws' or 'wss'. '" + protocol + "' is not allowed.");
      }
      if (hash !== "") {
        throw new SyntaxError(ERROR_PREFIX.CONSTRUCTOR_ERROR + " The URL contains a fragment identifier ('" + hash + "'). Fragment identifiers are not allowed in WebSocket URLs.");
      }
      return urlRecord.toString();
    }
    function protocolVerification(protocols) {
      if (protocols === void 0)
        protocols = [];
      if (!Array.isArray(protocols) && typeof protocols !== "string") {
        throw new SyntaxError(ERROR_PREFIX.CONSTRUCTOR_ERROR + " The subprotocol '" + protocols.toString() + "' is invalid.");
      }
      if (typeof protocols === "string") {
        protocols = [protocols];
      }
      var uniq = protocols.map(function(p) {
        return {count: 1, protocol: p};
      }).reduce(function(a, b) {
        a[b.protocol] = (a[b.protocol] || 0) + b.count;
        return a;
      }, {});
      var duplicates = Object.keys(uniq).filter(function(a) {
        return uniq[a] > 1;
      });
      if (duplicates.length > 0) {
        throw new SyntaxError(ERROR_PREFIX.CONSTRUCTOR_ERROR + " The subprotocol '" + duplicates[0] + "' is duplicated.");
      }
      return protocols;
    }
    var WebSocket$1 = function(EventTarget$$1) {
      function WebSocket3(url, protocols) {
        EventTarget$$1.call(this);
        this.url = urlVerification(url);
        protocols = protocolVerification(protocols);
        this.protocol = protocols[0] || "";
        this.binaryType = "blob";
        this.readyState = WebSocket3.CONNECTING;
        var client = proxyFactory(this);
        var server = networkBridge.attachWebSocket(client, this.url);
        delay(function delayCallback() {
          if (server) {
            if (server.options.verifyClient && typeof server.options.verifyClient === "function" && !server.options.verifyClient()) {
              this.readyState = WebSocket3.CLOSED;
              log("error", "WebSocket connection to '" + this.url + "' failed: HTTP Authentication failed; no valid credentials available");
              networkBridge.removeWebSocket(client, this.url);
              this.dispatchEvent(createEvent({type: "error", target: this}));
              this.dispatchEvent(createCloseEvent({type: "close", target: this, code: CLOSE_CODES.CLOSE_NORMAL}));
            } else {
              if (server.options.selectProtocol && typeof server.options.selectProtocol === "function") {
                var selectedProtocol = server.options.selectProtocol(protocols);
                var isFilled = selectedProtocol !== "";
                var isRequested = protocols.indexOf(selectedProtocol) !== -1;
                if (isFilled && !isRequested) {
                  this.readyState = WebSocket3.CLOSED;
                  log("error", "WebSocket connection to '" + this.url + "' failed: Invalid Sub-Protocol");
                  networkBridge.removeWebSocket(client, this.url);
                  this.dispatchEvent(createEvent({type: "error", target: this}));
                  this.dispatchEvent(createCloseEvent({type: "close", target: this, code: CLOSE_CODES.CLOSE_NORMAL}));
                  return;
                }
                this.protocol = selectedProtocol;
              }
              this.readyState = WebSocket3.OPEN;
              this.dispatchEvent(createEvent({type: "open", target: this}));
              server.dispatchEvent(createEvent({type: "connection"}), client);
            }
          } else {
            this.readyState = WebSocket3.CLOSED;
            this.dispatchEvent(createEvent({type: "error", target: this}));
            this.dispatchEvent(createCloseEvent({type: "close", target: this, code: CLOSE_CODES.CLOSE_NORMAL}));
            log("error", "WebSocket connection to '" + this.url + "' failed");
          }
        }, this);
      }
      if (EventTarget$$1)
        WebSocket3.__proto__ = EventTarget$$1;
      WebSocket3.prototype = Object.create(EventTarget$$1 && EventTarget$$1.prototype);
      WebSocket3.prototype.constructor = WebSocket3;
      var prototypeAccessors = {onopen: {}, onmessage: {}, onclose: {}, onerror: {}};
      prototypeAccessors.onopen.get = function() {
        return this.listeners.open;
      };
      prototypeAccessors.onmessage.get = function() {
        return this.listeners.message;
      };
      prototypeAccessors.onclose.get = function() {
        return this.listeners.close;
      };
      prototypeAccessors.onerror.get = function() {
        return this.listeners.error;
      };
      prototypeAccessors.onopen.set = function(listener) {
        delete this.listeners.open;
        this.addEventListener("open", listener);
      };
      prototypeAccessors.onmessage.set = function(listener) {
        delete this.listeners.message;
        this.addEventListener("message", listener);
      };
      prototypeAccessors.onclose.set = function(listener) {
        delete this.listeners.close;
        this.addEventListener("close", listener);
      };
      prototypeAccessors.onerror.set = function(listener) {
        delete this.listeners.error;
        this.addEventListener("error", listener);
      };
      WebSocket3.prototype.send = function send(data) {
        var this$1 = this;
        if (this.readyState === WebSocket3.CLOSING || this.readyState === WebSocket3.CLOSED) {
          throw new Error("WebSocket is already in CLOSING or CLOSED state");
        }
        var messageEvent = createMessageEvent({
          type: "server::message",
          origin: this.url,
          data: normalizeSendData(data)
        });
        var server = networkBridge.serverLookup(this.url);
        if (server) {
          delay(function() {
            this$1.dispatchEvent(messageEvent, data);
          }, server);
        }
      };
      WebSocket3.prototype.close = function close(code, reason) {
        if (code !== void 0) {
          if (typeof code !== "number" || code !== 1e3 && (code < 3e3 || code > 4999)) {
            throw new TypeError(ERROR_PREFIX.CLOSE_ERROR + " The code must be either 1000, or between 3000 and 4999. " + code + " is neither.");
          }
        }
        if (reason !== void 0) {
          var length = lengthInUtf8Bytes(reason);
          if (length > 123) {
            throw new SyntaxError(ERROR_PREFIX.CLOSE_ERROR + " The message must not be greater than 123 bytes.");
          }
        }
        if (this.readyState === WebSocket3.CLOSING || this.readyState === WebSocket3.CLOSED) {
          return;
        }
        var client = proxyFactory(this);
        if (this.readyState === WebSocket3.CONNECTING) {
          failWebSocketConnection(client, code || CLOSE_CODES.CLOSE_ABNORMAL, reason);
        } else {
          closeWebSocketConnection(client, code || CLOSE_CODES.CLOSE_NO_STATUS, reason);
        }
      };
      Object.defineProperties(WebSocket3.prototype, prototypeAccessors);
      return WebSocket3;
    }(EventTarget);
    WebSocket$1.CONNECTING = 0;
    WebSocket$1.prototype.CONNECTING = WebSocket$1.CONNECTING;
    WebSocket$1.OPEN = 1;
    WebSocket$1.prototype.OPEN = WebSocket$1.OPEN;
    WebSocket$1.CLOSING = 2;
    WebSocket$1.prototype.CLOSING = WebSocket$1.CLOSING;
    WebSocket$1.CLOSED = 3;
    WebSocket$1.prototype.CLOSED = WebSocket$1.CLOSED;
    var dedupe = function(arr) {
      return arr.reduce(function(deduped, b) {
        if (deduped.indexOf(b) > -1) {
          return deduped;
        }
        return deduped.concat(b);
      }, []);
    };
    function retrieveGlobalObject() {
      if (typeof window !== "undefined") {
        return window;
      }
      return typeof process === "object" && true && typeof global === "object" ? global : this;
    }
    var defaultOptions = {
      mock: true,
      verifyClient: null,
      selectProtocol: null
    };
    var Server$1 = function(EventTarget$$1) {
      function Server3(url, options) {
        if (options === void 0)
          options = defaultOptions;
        EventTarget$$1.call(this);
        var urlRecord = new urlParse(url);
        if (!urlRecord.pathname) {
          urlRecord.pathname = "/";
        }
        this.url = urlRecord.toString();
        this.originalWebSocket = null;
        var server = networkBridge.attachServer(this, this.url);
        if (!server) {
          this.dispatchEvent(createEvent({type: "error"}));
          throw new Error("A mock server is already listening on this url");
        }
        this.options = Object.assign({}, defaultOptions, options);
        if (this.options.mock) {
          this.mockWebsocket();
        }
      }
      if (EventTarget$$1)
        Server3.__proto__ = EventTarget$$1;
      Server3.prototype = Object.create(EventTarget$$1 && EventTarget$$1.prototype);
      Server3.prototype.constructor = Server3;
      Server3.prototype.mockWebsocket = function mockWebsocket() {
        var globalObj = retrieveGlobalObject();
        this.originalWebSocket = globalObj.WebSocket;
        globalObj.WebSocket = WebSocket$1;
      };
      Server3.prototype.restoreWebsocket = function restoreWebsocket() {
        var globalObj = retrieveGlobalObject();
        if (this.originalWebSocket !== null) {
          globalObj.WebSocket = this.originalWebSocket;
        }
        this.originalWebSocket = null;
      };
      Server3.prototype.stop = function stop(callback) {
        if (callback === void 0)
          callback = function() {
          };
        if (this.options.mock) {
          this.restoreWebsocket();
        }
        networkBridge.removeServer(this.url);
        if (typeof callback === "function") {
          callback();
        }
      };
      Server3.prototype.on = function on(type, callback) {
        this.addEventListener(type, callback);
      };
      Server3.prototype.close = function close(options) {
        if (options === void 0)
          options = {};
        var code = options.code;
        var reason = options.reason;
        var wasClean = options.wasClean;
        var listeners = networkBridge.websocketsLookup(this.url);
        networkBridge.removeServer(this.url);
        listeners.forEach(function(socket) {
          socket.readyState = WebSocket$1.CLOSED;
          socket.dispatchEvent(createCloseEvent({
            type: "close",
            target: socket.target,
            code: code || CLOSE_CODES.CLOSE_NORMAL,
            reason: reason || "",
            wasClean
          }));
        });
        this.dispatchEvent(createCloseEvent({type: "close"}), this);
      };
      Server3.prototype.emit = function emit(event, data, options) {
        var this$1 = this;
        if (options === void 0)
          options = {};
        var websockets = options.websockets;
        if (!websockets) {
          websockets = networkBridge.websocketsLookup(this.url);
        }
        if (typeof options !== "object" || arguments.length > 3) {
          data = Array.prototype.slice.call(arguments, 1, arguments.length);
          data = data.map(function(item) {
            return normalizeSendData(item);
          });
        } else {
          data = normalizeSendData(data);
        }
        websockets.forEach(function(socket) {
          if (Array.isArray(data)) {
            socket.dispatchEvent.apply(socket, [createMessageEvent({
              type: event,
              data,
              origin: this$1.url,
              target: socket.target
            })].concat(data));
          } else {
            socket.dispatchEvent(createMessageEvent({
              type: event,
              data,
              origin: this$1.url,
              target: socket.target
            }));
          }
        });
      };
      Server3.prototype.clients = function clients() {
        return networkBridge.websocketsLookup(this.url);
      };
      Server3.prototype.to = function to(room, broadcaster, broadcastList) {
        var this$1 = this;
        if (broadcastList === void 0)
          broadcastList = [];
        var self2 = this;
        var websockets = dedupe(broadcastList.concat(networkBridge.websocketsLookup(this.url, room, broadcaster)));
        return {
          to: function(chainedRoom, chainedBroadcaster) {
            return this$1.to.call(this$1, chainedRoom, chainedBroadcaster, websockets);
          },
          emit: function emit(event, data) {
            self2.emit(event, data, {websockets});
          }
        };
      };
      Server3.prototype.in = function in$1() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return this.to.apply(null, args);
      };
      Server3.prototype.simulate = function simulate(event) {
        var listeners = networkBridge.websocketsLookup(this.url);
        if (event === "error") {
          listeners.forEach(function(socket) {
            socket.readyState = WebSocket$1.CLOSED;
            socket.dispatchEvent(createEvent({type: "error"}));
          });
        }
      };
      return Server3;
    }(EventTarget);
    Server$1.of = function of(url) {
      return new Server$1(url);
    };
    var SocketIO$1 = function(EventTarget$$1) {
      function SocketIO2(url, protocol) {
        var this$1 = this;
        if (url === void 0)
          url = "socket.io";
        if (protocol === void 0)
          protocol = "";
        EventTarget$$1.call(this);
        this.binaryType = "blob";
        var urlRecord = new urlParse(url);
        if (!urlRecord.pathname) {
          urlRecord.pathname = "/";
        }
        this.url = urlRecord.toString();
        this.readyState = SocketIO2.CONNECTING;
        this.protocol = "";
        this.target = this;
        if (typeof protocol === "string" || typeof protocol === "object" && protocol !== null) {
          this.protocol = protocol;
        } else if (Array.isArray(protocol) && protocol.length > 0) {
          this.protocol = protocol[0];
        }
        var server = networkBridge.attachWebSocket(this, this.url);
        delay(function delayCallback() {
          if (server) {
            this.readyState = SocketIO2.OPEN;
            server.dispatchEvent(createEvent({type: "connection"}), server, this);
            server.dispatchEvent(createEvent({type: "connect"}), server, this);
            this.dispatchEvent(createEvent({type: "connect", target: this}));
          } else {
            this.readyState = SocketIO2.CLOSED;
            this.dispatchEvent(createEvent({type: "error", target: this}));
            this.dispatchEvent(createCloseEvent({
              type: "close",
              target: this,
              code: CLOSE_CODES.CLOSE_NORMAL
            }));
            log("error", "Socket.io connection to '" + this.url + "' failed");
          }
        }, this);
        this.addEventListener("close", function(event) {
          this$1.dispatchEvent(createCloseEvent({
            type: "disconnect",
            target: event.target,
            code: event.code
          }));
        });
      }
      if (EventTarget$$1)
        SocketIO2.__proto__ = EventTarget$$1;
      SocketIO2.prototype = Object.create(EventTarget$$1 && EventTarget$$1.prototype);
      SocketIO2.prototype.constructor = SocketIO2;
      var prototypeAccessors = {broadcast: {}};
      SocketIO2.prototype.close = function close() {
        if (this.readyState !== SocketIO2.OPEN) {
          return void 0;
        }
        var server = networkBridge.serverLookup(this.url);
        networkBridge.removeWebSocket(this, this.url);
        this.readyState = SocketIO2.CLOSED;
        this.dispatchEvent(createCloseEvent({
          type: "close",
          target: this,
          code: CLOSE_CODES.CLOSE_NORMAL
        }));
        if (server) {
          server.dispatchEvent(createCloseEvent({
            type: "disconnect",
            target: this,
            code: CLOSE_CODES.CLOSE_NORMAL
          }), server);
        }
        return this;
      };
      SocketIO2.prototype.disconnect = function disconnect() {
        return this.close();
      };
      SocketIO2.prototype.emit = function emit(event) {
        var data = [], len = arguments.length - 1;
        while (len-- > 0)
          data[len] = arguments[len + 1];
        if (this.readyState !== SocketIO2.OPEN) {
          throw new Error("SocketIO is already in CLOSING or CLOSED state");
        }
        var messageEvent = createMessageEvent({
          type: event,
          origin: this.url,
          data
        });
        var server = networkBridge.serverLookup(this.url);
        if (server) {
          server.dispatchEvent.apply(server, [messageEvent].concat(data));
        }
        return this;
      };
      SocketIO2.prototype.send = function send(data) {
        this.emit("message", data);
        return this;
      };
      prototypeAccessors.broadcast.get = function() {
        if (this.readyState !== SocketIO2.OPEN) {
          throw new Error("SocketIO is already in CLOSING or CLOSED state");
        }
        var self2 = this;
        var server = networkBridge.serverLookup(this.url);
        if (!server) {
          throw new Error("SocketIO can not find a server at the specified URL (" + this.url + ")");
        }
        return {
          emit: function emit(event, data) {
            server.emit(event, data, {websockets: networkBridge.websocketsLookup(self2.url, null, self2)});
            return self2;
          },
          to: function to(room) {
            return server.to(room, self2);
          },
          in: function in$1(room) {
            return server.in(room, self2);
          }
        };
      };
      SocketIO2.prototype.on = function on(type, callback) {
        this.addEventListener(type, callback);
        return this;
      };
      SocketIO2.prototype.off = function off(type, callback) {
        this.removeEventListener(type, callback);
      };
      SocketIO2.prototype.hasListeners = function hasListeners(type) {
        var listeners = this.listeners[type];
        if (!Array.isArray(listeners)) {
          return false;
        }
        return !!listeners.length;
      };
      SocketIO2.prototype.join = function join(room) {
        networkBridge.addMembershipToRoom(this, room);
      };
      SocketIO2.prototype.leave = function leave(room) {
        networkBridge.removeMembershipFromRoom(this, room);
      };
      SocketIO2.prototype.to = function to(room) {
        return this.broadcast.to(room);
      };
      SocketIO2.prototype.in = function in$1() {
        return this.to.apply(null, arguments);
      };
      SocketIO2.prototype.dispatchEvent = function dispatchEvent(event) {
        var this$1 = this;
        var customArguments = [], len = arguments.length - 1;
        while (len-- > 0)
          customArguments[len] = arguments[len + 1];
        var eventName = event.type;
        var listeners = this.listeners[eventName];
        if (!Array.isArray(listeners)) {
          return false;
        }
        listeners.forEach(function(listener) {
          if (customArguments.length > 0) {
            listener.apply(this$1, customArguments);
          } else {
            listener.call(this$1, event.data ? event.data : event);
          }
        });
      };
      Object.defineProperties(SocketIO2.prototype, prototypeAccessors);
      return SocketIO2;
    }(EventTarget);
    SocketIO$1.CONNECTING = 0;
    SocketIO$1.OPEN = 1;
    SocketIO$1.CLOSING = 2;
    SocketIO$1.CLOSED = 3;
    var IO = function ioConstructor(url, protocol) {
      return new SocketIO$1(url, protocol);
    };
    IO.connect = function ioConnect(url, protocol) {
      return IO(url, protocol);
    };
    var Server2 = Server$1;
    var WebSocket2 = WebSocket$1;
    var SocketIO = IO;
    exports2.Server = Server2;
    exports2.WebSocket = WebSocket2;
    exports2.SocketIO = SocketIO;
    Object.defineProperty(exports2, "__esModule", {value: true});
  });
});

// src/utils/isArray.ts
function isArray(candidate) {
  return Array.isArray(candidate);
}

// src/utils/uuid.ts
function uuid() {
  let d = new Date().getTime();
  const uid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : r & 3 | 8).toString(16);
  });
  return uid;
}

// src/Vertex.ts
var utc = () => Date.now();
var Vertex = class {
  constructor(path2, store, socket) {
    this.listeners = new Set();
    this.uuid = uuid();
    this.path = path2;
    this.pending;
    this.socket = socket;
    this.store = store;
    this.storageObject = {
      path: this.path,
      timestamp: utc(),
      uuid: uuid()
    };
  }
  addListener(listener) {
    this.listeners.add(listener);
  }
  delete() {
    this.value = void 0;
    this.emit(void 0);
  }
  emit(val) {
    this.listeners.forEach((listener) => listener(val));
  }
  on(listener) {
    this.addListener(listener);
  }
  once(listener) {
    setTimeout(async () => {
      this.addListener(listener);
      const val = await this.value;
      this.emit(val);
      this.removeListener(listener);
    }, 0);
  }
  pop() {
    setTimeout(async () => {
      const value = await this.value;
      if (isArray(value)) {
        const array = [...value];
        const popped = array.pop();
        this.value = array;
        this.emit(popped);
      }
    }, 0);
  }
  push(val) {
    setTimeout(async () => {
      const value = await this.value;
      let nVal;
      if (!value)
        nVal = [val];
      else if (!isArray(value))
        nVal = [nVal];
      else
        nVal = [...value, val];
      this.value = nVal;
      this.emit(nVal);
    }, 0);
  }
  put(val, update = true) {
    setTimeout(async () => {
      const value = await this.value;
      let nVal = val;
      if (!value || !update)
        nVal = val;
      else if (update)
        nVal = {...value, ...val};
      this.value = nVal;
      if (this.pending)
        await this.pending;
      this.emit(nVal);
    }, 0);
  }
  removeListener(listener) {
    this.listeners.delete(listener);
  }
  reverse() {
    setTimeout(async () => {
      const value = await this.value;
      if (isArray(value)) {
        const array = [...value].reverse();
        this.value = array;
        this.emit(array);
      }
    }, 0);
  }
  set(val) {
    this.put(val, false);
  }
  shift() {
    setTimeout(async () => {
      const value = await this.value;
      if (isArray(value)) {
        const array = [...value];
        array.shift();
        this.value = array;
        this.emit(array);
      }
    }, 0);
  }
  get value() {
    return (async () => {
      if (this.pending)
        await this.pending;
      this.pending = this.store.get(this.path);
      const storageObject = await this.pending;
      const value = storageObject?.value;
      return value;
    })();
  }
  set value(val) {
    return (async () => {
      this.pending = this.store.set(this.path, {
        ...this.storageObject,
        ...{timestamp: utc(), value: val}
      });
    })();
  }
};
var Vertex_default = Vertex;

// src/utils/MemoryStore.ts
var MemoryStore = class {
  constructor() {
    this.db = new Map();
  }
  async clear() {
    this.db.clear();
  }
  async del(path2) {
    this.db.delete(path2);
  }
  async get(path2) {
    return this.db.get(path2);
  }
  async put(path2, value) {
    return this.db.set(path2, value);
  }
  async set(path2, value) {
    return this.db.set(path2, value);
  }
};

// src/utils/isJson.ts
function isJson(str) {
  try {
    const json = JSON.parse(str);
    return json;
  } catch (e) {
    return false;
  }
}

// src/utils/deserialize.ts
var deserialize = (str) => isJson(str) || {};

// src/utils/serialize.ts
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
    const self2 = this;
    this.on(event, function f() {
      self2.off(event, f);
      listener.apply(this, arguments);
    });
  }
  get size() {
    return this.events.size;
  }
};

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
    console.log("checking connection", this.socket.readyState);
    if (!this.socket || this.socket.readyState === 3)
      this.connect();
  }
  init({
    clientId,
    appId,
    nodeId
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
    console.log(`data`, data);
  }
  onopen() {
    setInterval(this.check.bind(this), autoReconnectInterval);
  }
};
var WebSocketClient_default = WebSocketClient;

// src/tests/Vertex.spec.ts
var import_mock_socket = __toModule(require_mock_socket());
var v;
var path = "root.vertex";
var sandbox;
describe("Vertex", () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  describe("addListener()", () => {
    it("should add a listener", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      v = new Vertex_default(path, store);
      v.addListener(spy);
      expect(v.listeners.size).to.be.equal(1);
    });
    it("should add a listener only once", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      v = new Vertex_default(path, store);
      v.addListener(spy);
      v.addListener(spy);
      v.addListener(spy);
      expect(v.listeners.size).to.be.equal(1);
    });
  });
  describe("removeListener()", () => {
    it("should delete a listener", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      v = new Vertex_default(path, store);
      v.addListener(spy);
      expect(v.listeners.size).to.be.equal(1);
      v.removeListener(spy);
      expect(v.listeners.size).to.be.equal(0);
    });
  });
  describe("emit()", () => {
    it("should emit a value to a single listener", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      v = new Vertex_default(path, store);
      v.listeners.add(spy);
      v.emit({name: "foot"});
      expect(spy.calledOnce).to.be.true;
    });
    it("should emit a value to several listeners", () => {
      const store = new MemoryStore();
      const spy = sandbox.spy();
      const spy1 = sandbox.spy();
      const spy2 = sandbox.spy();
      v = new Vertex_default(path, store);
      v.listeners.add(spy);
      v.listeners.add(spy1);
      v.listeners.add(spy2);
      v.emit({name: "foo"});
      expect(spy.calledOnce).to.be.true;
      expect(spy1.calledOnce).to.be.true;
      expect(spy2.calledOnce).to.be.true;
    });
  });
  describe("delete()", () => {
    it("should delete the vertex storageObject", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.value = {name: "foobar"};
      v.once((val) => {
        expect(val).to.be.undefined;
      });
      await v.delete();
    });
  });
  describe("put()", () => {
    it("should set the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.put({name: "baz"});
      v.once((val) => {
        expect(val?.name).to.be.equal("baz");
      });
    });
    it("should update the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.put({name: "baz"});
      v.put({address: "foo"});
      v.put({city: "bar"});
      v.put({state: "foobar"});
      v.once((val) => {
        expect(val.name).to.be.equal("baz");
        expect(val.address).to.be.equal("foo");
      });
    });
  });
  describe("set()", () => {
    it("should set the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.set({name: "baz"});
      v.once((val) => {
        expect(val?.name).to.be.equal("baz");
      });
    });
    it("should replace the initial value of the vertex", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.set({name: "baz"});
      v.set({address: "foo"});
      v.once((val) => {
        expect(val.address).to.be.equal("foo");
      });
    });
  });
  describe("push()", () => {
    it("should create an array and push a value into it", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      v.push(obj);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
      });
    });
    it("should push a value into an existing array", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      v.put([]);
      v.push(obj);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
      });
    });
    it("should push several values into an existing array", async () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      const obj1 = {name: "crystal"};
      const obj2 = {name: "brandon"};
      const obj3 = {name: "candace"};
      const obj4 = {name: "camille"};
      v.put([]);
      v.push(obj);
      v.push(obj1);
      v.push(obj2);
      v.push(obj3);
      v.push(obj4);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
        expect(val[1].name).to.be.equal("crystal");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("candace");
        expect(val[4].name).to.be.equal("camille");
      });
    });
  });
  describe("pop()", () => {
    it("should pop an element of an array", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      const obj1 = {name: "crystal"};
      const obj2 = {name: "brandon"};
      const obj3 = {name: "candace"};
      const obj4 = {name: "camille"};
      v.put([]);
      v.push(obj);
      v.push(obj1);
      v.push(obj2);
      v.push(obj3);
      v.push(obj4);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
        expect(val[1].name).to.be.equal("crystal");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("candace");
        expect(val[4].name).to.be.equal("camille");
      });
      v.pop();
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
        expect(val[1].name).to.be.equal("crystal");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("candace");
      });
    });
  });
  describe("shift()", () => {
    it("should shift an element of an array", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      const obj1 = {name: "crystal"};
      const obj2 = {name: "brandon"};
      const obj3 = {name: "candace"};
      const obj4 = {name: "camille"};
      v.put([]);
      v.push(obj);
      v.push(obj1);
      v.push(obj2);
      v.push(obj3);
      v.push(obj4);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
        expect(val[1].name).to.be.equal("crystal");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("candace");
        expect(val[4].name).to.be.equal("camille");
      });
      v.shift();
      v.once((val) => {
        expect(val[0].name).to.be.equal("crystal");
        expect(val[1].name).to.be.equal("brandon");
        expect(val[2].name).to.be.equal("candace");
        expect(val[3].name).to.be.equal("camille");
      });
    });
  });
  describe("reverse()", () => {
    it("should reverse the elements of an array", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      const obj1 = {name: "crystal"};
      const obj2 = {name: "brandon"};
      const obj3 = {name: "candace"};
      const obj4 = {name: "camille"};
      v.put([]);
      v.push(obj);
      v.push(obj1);
      v.push(obj2);
      v.push(obj3);
      v.push(obj4);
      v.once((val) => {
        expect(val[0].name).to.be.equal("rob");
        expect(val[1].name).to.be.equal("crystal");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("candace");
        expect(val[4].name).to.be.equal("camille");
      });
      v.reverse();
      v.once((val) => {
        expect(val[0].name).to.be.equal("camille");
        expect(val[1].name).to.be.equal("candace");
        expect(val[2].name).to.be.equal("brandon");
        expect(val[3].name).to.be.equal("crystal");
        expect(val[4].name).to.be.equal("rob");
      });
    });
  });
  describe("on()", () => {
    it("should listen for changes to an object", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.on((val) => {
      });
      v.put({name: "baz"});
      v.put({address: "foo"});
      v.put({city: "bar"});
      v.put({state: "foobar"});
    });
    it("should listen for changes to an array", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      const obj = {name: "rob"};
      const obj1 = {name: "crystal"};
      const obj2 = {name: "brandon"};
      const obj3 = {name: "candace"};
      const obj4 = {name: "camille"};
      v.on((val) => {
      });
      v.put([]);
      v.push(obj);
      v.push(obj1);
      v.push(obj2);
      v.push(obj3);
      v.push(obj4);
    });
  });
  describe("once()", () => {
    it("should get the value of the vertex", () => {
      const store = new MemoryStore();
      v = new Vertex_default(path, store);
      v.value = {name: "foobar"};
      v.once((val) => {
        expect(val?.name).to.be.equal("foobar");
      });
    });
  });
  describe.only("network interactions", () => {
    let fakeUrl = "ws://localhost:8080";
    before(() => {
      const mockServer = new import_mock_socket.Server(fakeUrl);
    });
    describe("get()", () => {
      it("should get data from server", () => {
        const store = new MemoryStore();
        const socket = new WebSocketClient_default(fakeUrl);
        v = new Vertex_default(path, store, socket);
        v.once((val) => {
          console.log(`val`, val);
        });
      });
    });
  });
});
