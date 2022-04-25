import { isJson } from "./isJson";

export const deserialize = (str: string): object => isJson(str) || {};
