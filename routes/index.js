const express = require("express");
const controllers = require("../controllers");
const router = express.Router();

router.route("/Quotes").get(controllers.getQuote); //API route for the quotes
router.route("/Trends").get(controllers.getTrends); //API route for the recommendationed trends
router.route("/Symbols").get(controllers.getSymbols); //API route for the stock symbols
router.route("/BasicFinancials").get(controllers.getBasicFin); //API route for the basic financials

module.exports = router;