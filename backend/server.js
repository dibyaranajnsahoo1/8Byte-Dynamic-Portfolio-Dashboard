require("dotenv").config()
const express = require("express")
const cors = require("cors")
const YahooFinance = require("yahoo-finance2").default
const NodeCache = require("node-cache")
const portfolio = require("./data/portfolio.json")

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET"],
  })
)

app.use(express.json())
app.set("trust proxy", 1)

const yahooFinance = new YahooFinance({
  fetchOptions: {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
  }
})

const cache = new NodeCache({
  stdTTL: 20,
  checkperiod: 25
})

app.get("/", (req, res) => {
  res.send("Portfolio API Running 🚀")
})

app.get("/api/portfolio", async (req, res) => {
  try {

    if (!Array.isArray(portfolio)) {
      return res.status(500).json({
        error: "Invalid portfolio format"
      })
    }

    const result = await Promise.all(
      portfolio
        .filter(stock => stock && stock.symbol)
        .map(async (stock) => {

          let cachedData = cache.get(stock.symbol)

          if (!cachedData) {
            try {

              
              const quote = await yahooFinance.quoteSummary(
                stock.symbol,
                {
                  modules: [
                    "price",
                    "summaryDetail",
                    "defaultKeyStatistics"
                  ]
                }
              )

              if (!quote || !quote.price) {
                throw new Error("Invalid Yahoo response")
              }

              const price =
                quote.price.regularMarketPrice ??
                quote.price.regularMarketPreviousClose ??
                0

              const pe =
                quote.summaryDetail?.trailingPE ??
                "N/A"

              const eps =
                quote.defaultKeyStatistics?.trailingEps ??
                "N/A"

              cachedData = {
                cmp: price ? Number(price.toFixed(2)) : 0,
                peRatio:
                  pe !== "N/A"
                    ? Number(pe.toFixed(2))
                    : "N/A",
                earnings:
                  eps !== "N/A"
                    ? "₹" + Number(eps.toFixed(2))
                    : "N/A"
              }


              if (price) {
                cache.set(stock.symbol, cachedData)
              }

            } catch (err) {
  console.error("Yahoo fetch error FULL:", err);
  console.error("Error message:", err.message);
  console.error("Error response:", err.response?.data);

  cachedData = {
    cmp: 0,
    peRatio: "N/A",
    earnings: "N/A"
  };
}
          }

          const investment = Number(
            (stock.purchasePrice * stock.quantity).toFixed(2)
          )

          const presentValue = Number(
            (cachedData.cmp * stock.quantity).toFixed(2)
          )

          const gainLoss = Number(
            (presentValue - investment).toFixed(2)
          )

          const gainLossPercent = investment
            ? Number(((gainLoss / investment) * 100).toFixed(2))
            : 0

          return {
            ...stock,
            cmp: cachedData.cmp,
            investment,
            presentValue,
            gainLoss,
            gainLossPercent,
            isProfit: gainLoss >= 0,
            peRatio: cachedData.peRatio,
            earnings: cachedData.earnings
          }

        })
    )

    res.json(result)

  } catch (error) {
    console.error("Server Error:", error.message)

    res.status(500).json({
      error: "Internal Server Error"
    })
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
)