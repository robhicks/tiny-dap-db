// src/utils/copy.ts
function copy(obj = {}) {
  return JSON.parse(JSON.stringify(obj));
}
export {
  copy as default
};
