import { isJson } from "./isJson";

export const deserialize = (str: string): object => isJson(str) || {};
export const serialize = (obj: object): string => JSON.stringify(obj);
