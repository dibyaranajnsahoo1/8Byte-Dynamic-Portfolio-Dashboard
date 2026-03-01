import { Wallet, TrendingUp, TrendingDown } from "lucide-react"

interface Totals {
  totalInvestment: number
  totalPresentValue: number
  totalGainLoss: number
}

export default function SummaryCards({
  totals,
}: {
  totals?: Totals
}) {
  const totalInvestment = totals?.totalInvestment ?? 0
  const totalPresentValue = totals?.totalPresentValue ?? 0
  const totalGainLoss = totals?.totalGainLoss ?? 0

  const gainPercent =
    totalInvestment > 0
      ? ((totalGainLoss / totalInvestment) * 100).toFixed(2)
      : "0.00"

  return (
    <div className="grid md:grid-cols-3 gap-6">
    
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-xs text-gray-400 uppercase">
            Invested
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-4">
          ₹{totalInvestment.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </h2>
      </div>

 
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-green-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-xs text-gray-400 uppercase">
            Current
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-4">
          ₹{totalPresentValue.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </h2>
      </div>

   
      <div
        className={`rounded-2xl p-5 shadow-md border ${
          totalGainLoss >= 0
            ? "bg-green-50 border-green-100"
            : "bg-red-50 border-red-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`p-2 rounded-xl ${
              totalGainLoss >= 0
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            {totalGainLoss >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>

          <span className="text-xs text-gray-400 uppercase">
            Return
          </span>
        </div>

        <h2
          className={`text-xl font-bold mt-4 ${
            totalGainLoss >= 0
              ? "text-green-700"
              : "text-red-700"
          }`}
        >
          ₹{totalGainLoss.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </h2>

        <p
          className={`text-xs mt-1 ${
            totalGainLoss >= 0
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