// import Algorithm from "./algorithm.js";

// const CURs = {
//   usd: 71,
// };

// const buyer = (currency, val) => {
//   let h = {};
//   h[currency] = {
//     date: 0,
//     value: val,
//   };
//   const s = {
//     _history: h,
//     add(currency, val) {
//       if (!s._history.currency) s._history.currency = [0];
//       s._history[currency].push(val);
//     },
//     buy(from, to, num) {
//       if (!s._history.from) s.add(from, 0);
//       if (!s._history.to) s.add(to, 0);
//       return s;
//     },
//     value(currency, startTime = 0, endTime = +new Date() + 10000) {
//       if (!s._history[currency]) return 0;
//       return s._history
//         .filter((e) => startTime <= e.date && e.date <= endTime)
//         .reduce((acc, e) => (acc += e.value), 0);
//     },
//   };
//   return s;
// };

// buyer("usd", 1);
