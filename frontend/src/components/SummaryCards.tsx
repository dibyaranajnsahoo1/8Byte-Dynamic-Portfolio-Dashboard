import { Wallet, TrendingUp, TrendingDown } from "lucide-react"
import type { Stock } from "../types/stock"

export default function SummaryCards({ data }: { data: Stock[] }) {

  const safeData: Stock[] = Array.isArray(data) ? data : []

  const totalInvestment = safeData.reduce(
    (s, d) => s + (d.investment || 0),
    0
  )

  const totalPresent = safeData.reduce(
    (s, d) => s + (d.presentValue || 0),
    0
  )

  const totalGain = totalPresent - totalInvestment

  const gainPercent =
    totalInvestment > 0
      ? ((totalGain / totalInvestment) * 100).toFixed(2)
      : "0.00"

  return (
    <div className="grid md:grid-cols-3 gap-6">

      <div className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">

        <div className="flex items-center justify-between">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Invested
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-4">
          ₹{totalInvestment.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </h2>
      </div>

      <div className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">

        <div className="flex items-center justify-between">
          <div className="p-2 bg-green-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Current
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-4">
          ₹{totalPresent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </h2>
      </div>

      <div
        className={`group rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border ${
          totalGain >= 0
            ? "bg-green-50 border-green-100"
            : "bg-red-50 border-red-100"
        }`}
      >

        <div className="flex items-center justify-between">
          <div
            className={`p-2 rounded-xl ${
              totalGain >= 0
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            {totalGain >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>

          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Return
          </span>
        </div>

        <h2
          className={`text-xl font-bold mt-4 ${
            totalGain >= 0
              ? "text-green-700"
              : "text-red-700"
          }`}
        >
          ₹{totalGain.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </h2>

        <p
          className={`text-xs mt-1 ${
            totalGain >= 0
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {gainPercent}% overall
        </p>
      </div>

    </div>
  )
}