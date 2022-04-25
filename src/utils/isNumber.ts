export const isNumber = (can: any): Boolean =>
  typeof can === "number" && Number.isFinite(can);
