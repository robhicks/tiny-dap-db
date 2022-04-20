export function isJson(str: any): any {
  try {
    const json = JSON.parse(str);
    return json;
  } catch (e) {
    return false;
  }
}
