import type { Stock } from "../types/stock"

export default function PortfolioTable({
  data,
  fullData
}: {
  data: Stock[]
  fullData: Stock[]
}) {
  const safeData: Stock[] = Array.isArray(data) ? data : []
  const safeFull: Stock[] = Array.isArray(fullData) ? fullData : []

  const totalInvestment = safeFull.reduce(
    (s, d) => s + (d.investment || 0),
    0
  )

  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <table className="min-w-[900px] w-full text-xs md:text-sm">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-2 md:p-3 text-left">Particulars</th>
            <th className="p-2 md:p-3">Purchase</th>
            <th className="p-2 md:p-3">Qty</th>
            <th className="p-2 md:p-3">Investment</th>
            <th className="p-2 md:p-3">Portfolio %</th>
            <th className="p-2 md:p-3">NSE/BSE</th>
            <th className="p-2 md:p-3">CMP</th>
            <th className="p-2 md:p-3">Present</th>
            <th className="p-2 md:p-3">Gain/Loss</th>
            <th className="p-2 md:p-3">P/E</th>
            <th className="p-2 md:p-3">Earnings</th>
          </tr>
        </thead>

        <tbody>
          {safeData.map((stock) => {

            const percent =
              totalInvestment > 0
                ? ((stock.investment || 0) / totalInvestment) * 100
                : 0

            return (
              <tr
                key={stock.symbol}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="p-2 md:p-3">
                  <p className="font-medium">
                    {stock.particulars}
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-500">
                    {stock.sector}
                  </p>
                </td>

                <td className="p-2 md:p-3 text-center">
                  ₹{Number(stock.purchasePrice || 0).toLocaleString("en-IN")}
                </td>

                <td className="p-2 md:p-3 text-center">
                  {Number(stock.quantity || 0).toLocaleString("en-IN")}
                </td>

                <td className="p-2 md:p-3 text-center">
                  ₹{Number(stock.investment || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                  })}
                </td>

                <td className="p-2 md:p-3 text-center">
                  {percent.toFixed(2)}%
                </td>

                <td className="p-2 md:p-3 text-center">
                  <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] md:text-xs">
                    {stock.exchange}
                  </span>
                </td>

                <td className="p-2 md:p-3 text-center">
                  ₹{Number(stock.cmp || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                  })}
                </td>

                <td className="p-2 md:p-3 text-center">
                  ₹{Number(stock.presentValue || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                  })}
                </td>

                <td
                  className={`p-2 md:p-3 text-center font-semibold ${
                    (stock.gainLoss || 0) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹{Number(stock.gainLoss || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                  })}
                </td>

                <td className="p-2 md:p-3 text-center">
                  {stock.peRatio}
                </td>

                <td className="p-2 md:p-3 text-center">
                  {stock.earnings}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}