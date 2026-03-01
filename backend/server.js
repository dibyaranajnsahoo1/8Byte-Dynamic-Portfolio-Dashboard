require("dotenv").config()
const express = require("express")
const cors = require("cors")
const axios = require("axios")
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
  suppressNotices: ["yahooSurvey"],
})

const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 30,
})

app.get("/", (req, res) => {
  res.send("Portfolio API Running ")
})

app.get("/api/portfolio", async (req, res) => {
  try {
    if (!Array.isArray(portfolio)) {
      return res.status(500).json({
        error: "Invalid portfolio format",
      })
    }

    const enrichedStocks = await Promise.all(
      portfolio
        .filter((stock) => stock?.symbol)
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
                    "defaultKeyStatistics",
                  ],
                }
              )

              if (!quote?.price) {
                throw new Error("Invalid Yahoo response")
              }

              const price =
                quote.price.regularMarketPrice ??
                quote.price.regularMarketPreviousClose ??
                0

              const pe =
                quote.summaryDetail?.trailingPE ?? "N/A"

              const eps =
                quote.defaultKeyStatistics?.trailingEps ??
                "N/A"

              let exchangeCode = "NSE"
              if (stock.symbol.endsWith(".BO")) {
                exchangeCode = "BSE"
              }

              const cleanSymbol = stock.symbol
                .replace(".NS", "")
                .replace(".BO", "")

              const googleUrl = `https://www.google.com/finance/quote/${cleanSymbol}:${exchangeCode}`

              try {
                await axios.get(googleUrl, {
                  headers: {
                    "User-Agent": "Mozilla/5.0",
                  },
                  timeout: 3000,
                })
              } catch {
             
              }

              cachedData = {
                cmp: Number(price.toFixed(2)),
                peRatio:
                  pe !== "N/A"
                    ? Number(pe.toFixed(2))
                    : "N/A",
                earnings:
                  eps !== "N/A"
                    ? "₹" +
                      Number(eps.toFixed(2))
                    : "N/A",
              }

              cache.set(stock.symbol, cachedData)
            } catch (err) {
              console.error(
                "Fetch error:",
                stock.symbol,
                err.message
              )

              cachedData = {
                cmp: 0,
                peRatio: "N/A",
                earnings: "N/A",
              }
            }
          }

          const investment = Number(
            (
              stock.purchasePrice *
              stock.quantity
            ).toFixed(2)
          )

          const presentValue = Number(
            (
              cachedData.cmp *
              stock.quantity
            ).toFixed(2)
          )

          const gainLoss = Number(
            (presentValue - investment).toFixed(2)
          )

          return {
            ...stock,
            cmp: cachedData.cmp,
            investment,
            presentValue,
            gainLoss,
            peRatio: cachedData.peRatio,
            earnings: cachedData.earnings,
          }
        })
    )

   
    const totalInvestment = enrichedStocks.reduce(
      (sum, s) => sum + s.investment,
      0
    )

    const totalPresentValue =
      enrichedStocks.reduce(
        (sum, s) => sum + s.presentValue,
        0
      )

    const totalGainLoss = Number(
      (totalPresentValue - totalInvestment).toFixed(2)
    )

   
    const finalStocks = enrichedStocks.map(
      (stock) => ({
        ...stock,
        portfolioPercent:
          totalInvestment > 0
            ? Number(
                (
                  (stock.investment /
                    totalInvestment) *
                  100
                ).toFixed(2)
              )
            : 0,
        gainLossPercent:
          stock.investment > 0
            ? Number(
                (
                  (stock.gainLoss /
                    stock.investment) *
                  100
                ).toFixed(2)
              )
            : 0,
        isProfit: stock.gainLoss >= 0,
      })
    )

    
    const sectorSummary = {}

    finalStocks.forEach((stock) => {
      if (!sectorSummary[stock.sector]) {
        sectorSummary[stock.sector] = {
          totalInvestment: 0,
          totalPresentValue: 0,
          totalGainLoss: 0,
        }
      }

      sectorSummary[stock.sector].totalInvestment +=
        stock.investment
      sectorSummary[stock.sector].totalPresentValue +=
        stock.presentValue
      sectorSummary[stock.sector].totalGainLoss +=
        stock.gainLoss
    })

    res.json({
      totalInvestment: Number(
        totalInvestment.toFixed(2)
      ),
      totalPresentValue: Number(
        totalPresentValue.toFixed(2)
      ),
      totalGainLoss,
      stocks: finalStocks,
      sectorSummary,
    })
  } catch (error) {
    console.error(
      "Server Error:",
      error.message
    )
    res.status(500).json({
      error: "Internal Server Error",
    })
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(
    ` Server running on port ${PORT}`
  )
)