/**
 * Returns data object without empty fields (empty strings or arrays)
 * @param data Data object
 * @returns Data without empty fields
 */
export function getNonEmptyFields<T extends Record<string, unknown>>(
    data: T,
): T {
  const newData = Object.entries(data).reduce((newObj, [key, val]) => {
    if ((Array.isArray(val) && val.length) || (!Array.isArray(val) && val)) {
      return {
        ...newObj,
        [key]: val,
      };
    } else {
      return newObj;
    }
  }, {} as T);
  return newData;
}
