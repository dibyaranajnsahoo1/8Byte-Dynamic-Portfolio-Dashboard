import axios from "axios"
import type { Stock } from "../types/stock"

const API_URL = import.meta.env.VITE_API_URL

export interface PortfolioResponse {
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

export const fetchPortfolio = async (): Promise<PortfolioResponse> => {
  const response = await axios.get(`${API_URL}/api/portfolio`)
  return response.data
}