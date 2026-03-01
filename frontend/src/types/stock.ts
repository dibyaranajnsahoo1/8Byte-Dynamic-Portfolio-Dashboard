export interface Stock {
  id?: number

  symbol: string
  particulars: string
  sector: string
  tradingCode: string

  purchasePrice: number
  quantity: number

  cmp: number
  investment: number
  presentValue: number
  gainLoss: number
  gainLossPercent: number
  portfolioPercent: number   // 🔥 ADD THIS
  isProfit: boolean

  peRatio: number | string
  earnings: string
}