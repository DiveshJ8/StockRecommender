const {Pool} = require("pg");

const credentials = {
  user: "postgres",
  host: "localhost",
  password: "secretpassword",
  port: 5432,
};

const pool = new Pool(credentials);

pool.query("SELECT 'CREATE DATABASE mydb' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mydb')", (err, res) => {
  if (err) {
      throw err;
  }
  console.log("Database created");
});

var sql = "CREATE TABLE IF NOT EXISTS SYMBOLS (SYMBOLID SERIAL PRIMARY KEY, currency TEXT, symbol TEXT NOT NULL UNIQUE, description text, displaySymbol text, figi text, mic text, type text, CreatedOnDate timestamp NOT NULL DEFAULT NOW(), UpdatedOnDate timestamp NOT NULL DEFAULT NOW())";
pool.query(sql, function(err, result) {
  if (err) {
      throw err;
  }
  console.log("Table SYMBOLS created");
});

var sql = "CREATE TABLE IF NOT EXISTS TRENDS (TRENDID SERIAL PRIMARY KEY, symbol TEXT NOT NULL,buy REAL, hold REAL,	period TIMESTAMP, sell REAL, strongBuy REAL, strongSell REAL, CreatedOnDate timestamp NOT NULL DEFAULT NOW(), UpdatedOnDate timestamp NOT NULL DEFAULT NOW())";
pool.query(sql, function(err, result) {
  if (err) {
      throw err;
  }
  console.log("Table TRENDS created");
});

var sql = "CREATE TABLE IF NOT EXISTS QUOTES (QUOTEID SERIAL PRIMARY KEY, symbol TEXT NOT NULL,Currentprice real,	Change real, Percentchange real, Highpriceoftheday real, Lowpriceoftheday real,	Openpriceoftheday	real, Previouscloseprice real, CreatedOnDate timestamp NOT NULL DEFAULT NOW(), UpdatedOnDate timestamp NOT NULL DEFAULT NOW())";
pool.query(sql, function(err, result) {
  if (err) {
      throw err;
  }
  console.log("Table QUOTES created");
});

var sql = "CREATE TABLE IF NOT EXISTS METRICS (METRICID SERIAL PRIMARY KEY, symbol TEXT NOT NULL, Average10DayTradingVolume REAL, PriceReturnDaily13Week REAL, PriceReturnDaily26Week	REAL, Average3MonthTradingVolume REAL, High52Week	REAL, High52WeekDate TIMESTAMP, Low52Week REAL, Low52WeekDate TIMESTAMP, PriceReturnDaily52Week REAL, PriceReturnDaily5Day REAL, currentRatioAnnual REAL, currentRatioQuarterly REAL, dividendGrowthRate5Y REAL, dividendPerShare5Y REAL, dividendPerShareAnnual REAL, dividendYield5Y REAL, dividendYieldIndicatedAnnual REAL, monthToDatePriceReturnDaily REAL, yearToDatePriceReturnDaily REAL, CreatedOnDate timestamp NOT NULL DEFAULT NOW(), UpdatedOnDate timestamp NOT NULL DEFAULT NOW())";
pool.query(sql, function(err, result) {
  if (err) {
      throw err;
  }
  console.log("Table METRICS created");
});

module.exports = pool;