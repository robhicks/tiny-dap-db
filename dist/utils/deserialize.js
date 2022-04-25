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
export {
  deserialize
};
