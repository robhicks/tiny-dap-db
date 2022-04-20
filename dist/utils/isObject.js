// src/utils/isArray.ts
function isArray(candidate) {
  return Array.isArray(candidate);
}

// src/utils/isObject.ts
function isObject(candidate, strict = true) {
  if (!candidate)
    return false;
  if (strict)
    return typeof candidate === "object" && !isArray(candidate);
  return typeof candidate === "object";
}
export {
  isObject
};
