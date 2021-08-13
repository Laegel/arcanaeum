export const objectToArray = (object: {}) => {
  return Object.entries(object).map(([key, value]: [string, any]) => {
    value.name = key;
    return value;
  });
};
