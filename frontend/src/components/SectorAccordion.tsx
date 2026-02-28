import { useState, useMemo } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { Stock } from "../types/stock"
import PortfolioTable from "./PortfolioTable"

export default function SectorAccordion({ data }: { data: Stock[] }) {
  const [openSector, setOpenSector] = useState<string | null>(null)

  const safeData: Stock[] = Array.isArray(data) ? data : []

  const grouped = useMemo(() => {
    return safeData.reduce<Record<string, Stock[]>>((acc, stock) => {
      const sectorName = stock.sector || "Unknown"

      if (!acc[sectorName]) acc[sectorName] = []

      acc[sectorName].push(stock)
      return acc
    }, {})
  }, [safeData])

  const totalPortfolioInvestment = useMemo(() => {
    return safeData.reduce((s, d) => s + (d.investment || 0), 0)
  }, [safeData])

  return (
    <div className="space-y-4 md:space-y-6">
      {Object.entries(grouped).map(([sector, stocks]) => {

        const totalInvestment = stocks.reduce(
          (s, d) => s + (d.investment || 0),
          0
        )

        const totalPresent = stocks.reduce(
          (s, d) => s + (d.presentValue || 0),
          0
        )

        const totalGain = totalPresent - totalInvestment

        const sectorPercent =
          totalPortfolioInvestment > 0
            ? (totalInvestment / totalPortfolioInvestment) * 100
            : 0

        const isOpen = openSector === sector

        return (
          <div
            key={sector}
            className="group relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl md:rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-2xl md:rounded-l-3xl"></div>

            <div
              onClick={() => setOpenSector(isOpen ? null : sector)}
              className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 md:p-6 cursor-pointer hover:bg-gray-50 rounded-2xl md:rounded-3xl transition"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 bg-blue-100 rounded-xl">
                  {isOpen ? (
                    <ChevronDown className="text-blue-600" />
                  ) : (
                    <ChevronRight className="text-blue-600" />
                  )}
                </div>

                <div>
                  <h2 className="font-semibold text-base md:text-lg text-gray-800">
                    {sector}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    {stocks.length} Stocks • {sectorPercent.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 md:flex gap-4 md:gap-10 text-xs md:text-sm text-center md:text-right">

                <div>
                  <p className="text-gray-400">Investment</p>
                  <p className="font-semibold text-gray-800">
                    ₹{totalInvestment.toLocaleString("en-IN", {
                      minimumFractionDigits: 2
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Present</p>
                  <p className="font-semibold text-gray-800">
                    ₹{totalPresent.toLocaleString("en-IN", {
                      minimumFractionDigits: 2
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Gain/Loss</p>
                  <p
                    className={`font-semibold ${
                      totalGain >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ₹{totalGain.toLocaleString("en-IN", {
                      minimumFractionDigits: 2
                    })}
                  </p>
                </div>

              </div>
            </div>

            <div
              className={`transition-all duration-500 overflow-hidden ${
                isOpen
                  ? "max-h-[2000px] opacity-100 p-4 md:p-6 pt-0"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-gray-50 rounded-2xl p-3 md:p-4 shadow-inner">
                <PortfolioTable data={stocks} fullData={safeData} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}