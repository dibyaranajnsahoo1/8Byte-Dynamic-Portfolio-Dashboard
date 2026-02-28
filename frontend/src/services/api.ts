import axios from "axios"
import type { Stock } from "../types/stock"

const API_URL = import.meta.env.VITE_API_URL

export const fetchPortfolio = async (): Promise<Stock[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/portfolio`)

    if (Array.isArray(response.data)) {
      return response.data
    }

    return []
  } catch (error) {
    console.error("API Fetch Error:", error)
    return []
  }
}