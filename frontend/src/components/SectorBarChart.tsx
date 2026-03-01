import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts"

interface SectorSummary {
  [key: string]: {
    totalInvestment: number
    totalPresentValue: number
    totalGainLoss: number
  }
}

export default function SectorBarChart({
  sectorSummary,
}: {
  sectorSummary: SectorSummary
}) {
  const chartData = Object.entries(
    sectorSummary || {}
  ).map(([sector, values]) => ({
    sector,
    gain: values.totalGainLoss,
  }))

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-xl p-6 h-[400px] hover:shadow-2xl transition">
      <h3 className="font-semibold mb-4 text-xl text-gray-700">
        Sector Gain / Loss
      </h3>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sector" />
          <YAxis />
          <Tooltip
            formatter={(value: number | undefined) =>
              `₹${Number(value || 0).toLocaleString("en-IN")}`
            }
          />
          <Bar dataKey="gain" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.gain >= 0
                    ? "#22c55e"
                    : "#ef4444"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}