import { useEffect, useState } from "react"
import { fetchPortfolio } from "../services/api"
import type { Stock } from "../types/stock"

export const usePortfolio = () => {
  const [data, setData] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async (isInitial = false) => {
    if (isInitial) setLoading(true)

    try {
      const res = await fetchPortfolio()
      setData(res)
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

  return { data, loading, error }
}