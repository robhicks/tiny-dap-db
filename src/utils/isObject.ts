import { isArray } from "./isArray";

export function isObject(candidate: any, strict = true) {
  if (!candidate) return false;
  if (strict) return typeof candidate === "object" && !isArray(candidate);
  return typeof candidate === "object";
}
