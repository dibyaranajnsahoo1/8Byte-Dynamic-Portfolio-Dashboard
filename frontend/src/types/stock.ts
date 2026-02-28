export interface Stock {
  symbol: string
  particulars: string
  sector: string
  exchange: string

  purchasePrice: number
  quantity: number

  cmp: number
  investment: number
  presentValue: number
  gainLoss: number
  gainLossPercent: number
  isProfit: boolean

  peRatio: number | string
  earnings: string
}