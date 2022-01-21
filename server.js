import express from "express";
import mysql from "mysql2/promise";
import moment from "moment";
import algorithm from "./js/algorithm.js";

const app = express();

(async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    database: "picky",
    password: "",
  });
  const driver = driverFactory(connection);

  app.get("/currency", async (req, res) => {
    if (!req.query.start || !req.query.end) return res.json({ error: true });
    return res.json(
      await driver.getCurrencyFromPeriod({
        start: req.query.start,
        end: req.query.end,
      })
    );
  });

  app.get("/transaction", async (req, res) => {
    if (!req.query.start || !req.query.end) return res.json({ error: true });
    return res.json(
      await driver.getTransactions({
        start: req.query.start,
        end: req.query.end,
      })
    );
  });

  app.post("/result", async (req, res) => {
    console.log(req.query);
    return res.json(
      await driver.addResult({
        result: req.query.result,
        buyDate: req.query.buyDate,
        saleDate: req.query.saleDate,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      })
    );
  });

  const simulate = async ({ start, maxBuyDate, maxSaleDate }) => {
    const currencycBuyed = await driver.getCurrencyFromPeriod({
      start,
      end: maxBuyDate,
    });
    const maxIndexBuy = algorithm(currencycBuyed.map((v) => v.value));
    const currencycSeled = await driver.getCurrencyFromPeriod({
      start: parseInt(maxBuyDate) + 86400000,
      end: maxSaleDate,
    });
    const maxIndexSale = algorithm(currencycSeled.map((v) => v.value));
    const maxSale = currencycSeled[maxIndexSale];
    const buyed = currencycBuyed[maxIndexBuy];
    if (!maxSale.value || !buyed.value)
      return console.error(
        "Error",
        `max index sale ${maxIndexSale}`,
        `max index buyed ${buyed}`,
        `array sales length ${currencycSeled}`,
        `array buyed length ${currencycBuyed}`
      );
    const absDiff = maxSale.value - buyed.value;
    const result = {
      buy: currencycBuyed[maxIndexBuy],
      sale: currencycSeled[maxIndexSale],
      diff: absDiff / currencycBuyed[maxIndexBuy].value,
    };
    driver.addResult({
      result: 1 + result.diff,
      buyDate: +new Date(result.buy.date),
      saleDate: +new Date(result.sale.date),
      startDate: start,
      endDate: maxSaleDate,
    });
    return result;
  };

  app.post("/sumulation", async (req, res) => {
    return res.json(
      await simulate({
        start: req.query.start,
        maxBuyDate: req.query.maxBuyDate,
        maxSaleDate: req.query.maxSaleDate,
      })
    );
  });

  app.post("/sumulationsRandom", async (req, res) => {
    const getRandomInt = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    };
    const getRandomValueBetween = (min, max) => {
      var r = Math.floor(Math.random() * (max - min));
      return r + min;
    };
    const promises = Array(parseInt(req.query.n))
      .fill()
      .map(() => {
        const minDate = 883612800000;
        let lastHistoryDate = 1638326762000;
        let start = getRandomValueBetween(minDate, lastHistoryDate);
        let maxBuyDate = getRandomValueBetween(start, lastHistoryDate);
        let maxSaleDate = getRandomValueBetween(maxBuyDate, lastHistoryDate);
        return simulate({
          start,
          maxBuyDate,
          maxSaleDate,
        });
      });
    await Promise.all(promises);
    res.json({ success: true });
  });
})();

const driverFactory = (connection) => {
  let wrapper = (fun) => fun;
  let d = (date) => moment(parseInt(date)).format("YYYY-MM-DD");
  let dbDriver = {
    // connection,
    async getCurrencyFromPeriod({ start, end }) {
      const sql = `SELECT date, value FROM currency_history WHERE date BETWEEN '${d(
        start
      )}' AND '${d(end)}'`;
      const [rows] = await connection.query(sql);
      return rows.reverse();
    },
    async addTransaction({ date, number, type }) {
      if (type !== "purchase" && type !== "sale")
        return console.error("type must beone of this values");
      return connection.query(
        `INSERT INTO transaction (traider_id, number, date, type) VALUES (0, ${number}, '${d(
          date
        )}', '${type}' )`
      );
    },
    async getTransactions({ start, end }) {
      const [rows] = await connection.query(`
        SELECT date FROM transaction WHERE date BETWEEN ${d(start)} AND ${d(
        end
      )}
      `);
      return rows;
    },
    async addResult({ result, buyDate, saleDate, startDate, endDate }) {
      const q = `
      INSERT INTO results (currency_id, result, buy_date, sale_date, start_date, end_date) VALUES (0, ${result}, '${d(
        buyDate
      )}', '${d(saleDate)}', '${d(startDate)}', '${d(endDate)}')
    `;
      return connection.query(q);
    },
  };
  dbDriver = Object.keys(dbDriver)
    .map((key) => {
      let o = {};
      if (typeof dbDriver[key] === "function") o[key] = wrapper(dbDriver[key]);
      else o[key] = dbDriver[key];
      return o;
    })
    .reduce((acc, obj) => {
      return { ...acc, ...obj };
    }, {});
  return dbDriver;
};

app.listen(5000);
