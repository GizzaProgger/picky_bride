import { dirname } from "path";
import XLSX from "xlsx";

const __dirname = dirname(process.argv[1]);

(() => {
  let path = process.argv[2];
  if (!path) return console.log("Файл не введен");
  let currencyName = path.split("/")[path.split("/").length - 1].split(".")[0];
  let rows = getRows(path);
})();

function getRows(path) {
  let r = XLSX.readFile(__dirname + path);
  let arr = Object.values(r.Sheets.RC);
  arr = arr.slice(4, arr.length - 1).filter((i) => !(i.w == "1" && i.v == 1));
  arr = arr.map((i) => i.w);
  return getSubArays(arr, 3);
}

function getSubArays(array, size) {
  let subarray = []; //массив в который будет выведен результат.
  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    subarray[i] = array.slice(i * size, i * size + size);
  }
  return subarray;
}
