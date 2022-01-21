const algorithm = (dataset) => {
  let n = dataset.length;
  let max = Math.max(...dataset.slice(0, Math.floor(n / Math.E)));
  let r = dataset.slice(Math.floor(n / Math.E), n).findIndex((v) => v > max);
  return r === -1 ? n - 1 : r + Math.floor(n / Math.E);
};

export default algorithm;

export const tests = () => {
  console.log(algorithm([0, 1, 2, 3, 0, 1, 2, 3, 8, 9, 10]) === 8);
  console.log(algorithm([0, 1, 2, 3, 0, 1, 2, 2, 2, 2, 2]) === 10);
  console.log(algorithm([0, 1, 2, 3, 0, 1, 2, 2, 8, 9, 10]) === 8);
};
