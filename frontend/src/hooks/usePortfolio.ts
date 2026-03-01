import { useEffect, useState } from "react"
import { fetchPortfolio } from "../services/api"
import type { Stock } from "../types/stock"

interface PortfolioResponse {
  totalInvestment: number
  totalPresentValue: number
  totalGainLoss: number
  stocks: Stock[]
  sectorSummary: Record<
    string,
    {
      totalInvestment: number
      totalPresentValue: number
      totalGainLoss: number
    }
  >
}

export const usePortfolio = () => {
  const [data, setData] = useState<Stock[]>([])
  const [totals, setTotals] = useState({
    totalInvestment: 0,
    totalPresentValue: 0,
    totalGainLoss: 0,
  })
  const [sectorSummary, setSectorSummary] = useState<
    PortfolioResponse["sectorSummary"]
  >({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async (isInitial = false) => {
    if (isInitial) setLoading(true)

    try {
      const res: PortfolioResponse = await fetchPortfolio()

      setData(res.stocks)
      setTotals({
        totalInvestment: res.totalInvestment,
        totalPresentValue: res.totalPresentValue,
        totalGainLoss: res.totalGainLoss,
      })
      setSectorSummary(res.sectorSummary)

      setError("")
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Failed to fetch portfolio")
    } finally {
      if (isInitial) setLoading(false)
    }
  }

  useEffect(() => {
    loadData(true)

    const interval = setInterval(() => {
      loadData(false)
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return {
    data,
    totals,
    sectorSummary,
    loading,
    error,
  }
}