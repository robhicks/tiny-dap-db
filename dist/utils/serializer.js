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
export {
  deserialize,
  serialize
};
