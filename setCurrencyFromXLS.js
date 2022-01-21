import { dirname } from "path";
import XLSX from "xlsx";
import fs from "fs";

const __dirname = dirname(process.argv[1]);

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (
      Object.prototype.toString.call(str).toLowerCase() === "[object regexp]"
    ) {
      return this.replace(str, newStr);
    }

    // If a string
    return this.replace(new RegExp(str, "g"), newStr);
  };
}

(() => {
  let path = process.argv[2];
  if (!path) return console.log("Файл не введен");
  let currencyName = path.split("/")[path.split("/").length - 1].split(".")[0];
  let rows = getRows(path);
  let sql = "";
  rows.forEach((row) => {
    let date = row[0].replaceAll("/", "-");
    let dateParts = date.split("-");
    let y = dateParts[2] > 21 ? `19${dateParts[2]}` : `20${dateParts[2]}`;
    date = `${y}-${dateParts[0]}-${dateParts[1]}`;
    sql += `INSERT INTO currency_history (date, value)
    VALUES
    (
    '${date}', ${row[1]}
    );

  `;
  });
  // console.log(sql);
  fs.writeFile("query.sql", sql, console.log);
})();

function getRows(path) {
  let r = XLSX.readFile(__dirname + "/" + path);
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
