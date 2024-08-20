export const objSort = (obj) => {
  const entries = Object.entries(obj);
  return entries.sort((a, b) => b[1] - a[1]);
};
