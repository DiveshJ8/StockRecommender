const AppError = require("../utils/appError");
const conn = require("../services/db");
const res = require("express/lib/response");
const pool = require("../services/db");

const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "ca24ediad3iaqnc2nnqg" // API Key
const finnhubClient = new finnhub.DefaultApi()

//Quote
exports.getQuote = (req, res, next) => {
    pool.query("Select symbol from Symbols", (err, output) => {
        if (err)
            console.log("Error :" + err.stack)
        var list = output.rows;

        list.forEach(element => {
            finnhubClient.quote(element.symbol, (error, data, response) => {
                pool.query("INSERT INTO QUOTES (symbol, Currentprice, Change, Percentchange, Highpriceoftheday, Lowpriceoftheday,	Openpriceoftheday, Previouscloseprice) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
                    [element.symbol, data.c, data.d, data.dp, data.h, data.l, data.o, data.pc], (err, res) => {
                        if (err)
                            console.log("Error :" + err.stack)
                    });
            });
        });
    });

    pool.query("select symbol from QUOTES", (err, reply) => {

        if (err)
            console.log("Error :" + err.stack)
        else {
            res.status(200).json({
                response_id: "200",
                status: "success",
                data: reply.rows,
            });
        }
    });

    return res;
};

// Recommendation trends
exports.getTrends = (req, res, next) => {
    pool.query("Select symbol from Symbols", (err, output) => {
        if (err)
            console.log("Error :" + err.stack)
        var list = output.rows;

        list.forEach(element => {
            finnhubClient.recommendationTrends(element.symbol, (error, data, response) => {
                data.forEach(temp => {
                    pool.query("INSERT INTO TRENDS (symbol, buy, hold, period, sell, strongBuy, strongSell) VALUES ($1,$2,$3,$4,$5,$6,$7)",
                        [temp.symbol, temp.buy, temp.hold, temp.period, temp.sell, temp.strongBuy, temp.strongSell], (err, res) => {
                            if (err)
                                console.log("Error :" + err.stack)
                        });
                });
            });
        });
    });

    pool.query("select symbol from trends", (err, reply) => {
        if (err)
            console.log("Error :" + err.stack)
        else {
            res.status(200).json({
                response_id: "200",
                status: "success",
                data: reply.rows,
            });
        }
    });

    return res;
};

// Stock symbols
/*exports.getSymbols = (req, res, next) => {
finnhubClient.stockSymbols("US", (error, data, response) => {
    console.log(data);
    res.status(200).json({
        response_id: "200",
        status: "success",
        user: data,
      });
});
  return res;
};*/
exports.getSymbols = (req, res, next) => {
    data = ["F", "NUE", "MSFT", "T", "CLR", "CVX", "GOOG", "OXY", "BRK.B"];
    data.forEach(element => {
        pool.query("INSERT INTO Symbols (currency, symbol, displaySymbol) VALUES ($1,$2,$3) ON CONFLICT (symbol) DO NOTHING",
            ["USD", element, element], (err, res) => {
                if (err)
                    console.log("Error :" + err.stack)
            });
    });
    pool.query("Select symbol from Symbols", (err, reply) => {
        if (err)
            console.log("Error :" + err.stack)
        else {
            res.status(200).json({
                response_id: "200",
                status: "success",
                data: reply.rows,
            });
        }
    });
    return res;
};

// Basic financials
exports.getBasicFin = (req, res, next) => {
    pool.query("Select symbol from Symbols", (err, output) => {
        if (err)
            console.log("Error :" + err.stack)
        var list = output.rows;

        list.forEach(element => {
            finnhubClient.companyBasicFinancials(element.symbol, "margin", (error, data, response) => {
                var details = data.metric;
                var key = Object.keys(details);
                pool.query("INSERT INTO METRICS (symbol, Average10DayTradingVolume, PriceReturnDaily13WeeK, PriceReturnDaily26Week, Average3MonthTradingVolume, High52Week, High52WeekDate, Low52Week, Low52WeekDate, PriceReturnDaily52Week, PriceReturnDaily5Day , currentRatioAnnual , currentRatioQuarterly , dividendGrowthRate5Y , dividendPerShare5Y , dividendPerShareAnnual , dividendYield5Y , dividendYieldIndicatedAnnual , monthToDatePriceReturnDaily , yearToDatePriceReturnDaily) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)",
                    [element.symbol, details[key[0]], details[key[1]], details[key[2]], details[key[3]], details[key[4]], details[key[5]], details[key[6]], details[key[7]], details[key[8]], details[key[9]], details[key[24]], details[key[25]], details[key[26]], details[key[27]], details[key[28]], details[key[29]], details[key[30]], details[key[57]], details[key[122]]], (err, res) => {
                        if (err)
                            console.log("Error :" + err.stack)
                    });
            });
        });

        pool.query("Select symbol from Metrics", (err, reply) => {
            if (err)
                console.log("Error :" + err.stack)
            else {
                res.status(200).json({
                    response_id: "200",
                    status: "success",
                    user: reply.rows,
                });
            }
        });
        return res;
    });
};