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

const yahooFinance = new YahooFinance()

const cache = new NodeCache({
  stdTTL: 15,    
  checkperiod: 20
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
              const quote = await yahooFinance.quote(stock.symbol)

              if (!quote || Object.keys(quote).length === 0) {
                throw new Error("Empty Yahoo response")
              }

              const price =
                quote.regularMarketPrice ??
                quote.regularMarketPreviousClose ??
                quote.previousClose ??
                0

              cachedData = {
                cmp: price ? Number(price.toFixed(2)) : 0,

                peRatio:
                  quote.trailingPE != null
                    ? Number(quote.trailingPE.toFixed(2))
                    : "N/A",

                earnings:
                  quote.epsTrailingTwelveMonths != null
                    ? "₹" + Number(quote.epsTrailingTwelveMonths.toFixed(2))
                    : "N/A"
              }

              if (price) {
                cache.set(stock.symbol, cachedData)
              }

            } catch (err) {
              console.error("Yahoo fetch error:", stock.symbol, err.message)

              cachedData = {
                cmp: 0,
                peRatio: "N/A",
                earnings: "N/A"
              }
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