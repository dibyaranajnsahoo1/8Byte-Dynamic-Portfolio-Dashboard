import type { Stock } from "../types/stock"

export default function PortfolioTable({
  data,
}: {
  data: Stock[]
}) {
  const safeData: Stock[] = Array.isArray(data) ? data : []

  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-[1000px] w-full text-xs md:text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-[11px] md:text-xs tracking-wide">
          <tr>
            <th className="p-3 text-left">Particulars</th>
            <th className="p-3 text-center">Purchase</th>
            <th className="p-3 text-center">Qty</th>
            <th className="p-3 text-center">Investment</th>
            <th className="p-3 text-center">Portfolio %</th>
            <th className="p-3 text-center">NSE/BSE</th>
            <th className="p-3 text-center">CMP</th>
            <th className="p-3 text-center">Present Value</th>
            <th className="p-3 text-center">Gain/Loss</th>
            <th className="p-3 text-center">P/E</th>
            <th className="p-3 text-center">Earnings</th>
          </tr>
        </thead>

        <tbody>
          {safeData.map((stock) => (
            <tr
              key={stock.symbol}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-3">
                <p className="font-semibold text-gray-800">
                  {stock.particulars}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500">
                  {stock.sector}
                </p>
              </td>

              <td className="p-3 text-center">
                ₹{stock.purchasePrice.toLocaleString("en-IN")}
              </td>

              <td className="p-3 text-center">
                {stock.quantity.toLocaleString("en-IN")}
              </td>

              <td className="p-3 text-center">
                ₹
                {stock.investment.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>

              <td className="p-3 text-center font-medium text-indigo-600">
                {stock.portfolioPercent.toFixed(2)}%
              </td>

              <td className="p-3 text-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] md:text-xs">
                  {stock.tradingCode}
                </span>
              </td>

              <td className="p-3 text-center">
                ₹
                {stock.cmp.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>

              <td className="p-3 text-center">
                ₹
                {stock.presentValue.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td
                className={`p-3 text-center font-semibold ${
                  stock.isProfit
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ₹
                {stock.gainLoss.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
                <div className="text-[10px] md:text-xs">
                  ({stock.gainLossPercent.toFixed(2)}%)
                </div>
              </td>

              <td className="p-3 text-center">
                {stock.peRatio}
              </td>
              <td className="p-3 text-center">
                {stock.earnings}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}