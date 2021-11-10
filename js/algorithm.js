export default (dataset) => {
  let n = dataset.length;
  let max = Math.max(...dataset.slice(0, Math.floor(n / Math.E)));
  let r = dataset.slice(Math.floor(n / Math.E), n).findIndex((v) => v > max);
  return r === -1 ? n - 1 : r;
};
