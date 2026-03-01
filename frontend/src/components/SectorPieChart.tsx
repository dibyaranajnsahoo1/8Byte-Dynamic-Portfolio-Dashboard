import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
]

interface SectorSummary {
  [key: string]: {
    totalInvestment: number
    totalPresentValue: number
    totalGainLoss: number
  }
}

export default function SectorPieChart({
  sectorSummary,
}: {
  sectorSummary: SectorSummary
}) {
  const chartData = Object.entries(sectorSummary || {}).map(
    ([sector, values]) => ({
      sector,
      value: values.totalInvestment,
    })
  )

  const totalInvestment = chartData.reduce(
    (sum, d) => sum + d.value,
    0
  )


  if (!chartData.length) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-xl p-6 h-[400px] flex items-center justify-center">
        <p className="text-gray-500 text-lg font-medium">
          No sector data available
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-xl p-6 h-[400px] relative hover:shadow-2xl transition-all duration-300">
      <h3 className="font-semibold mb-4 text-xl text-gray-700">
        Sector Allocation
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="sector"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={4}
            label={({ payload, percent }) =>
              `${payload?.sector} (${(
                (percent || 0) * 100
              ).toFixed(0)}%)`
            }
            labelLine={false}
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[index % COLORS.length]
                }
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number | undefined) =>
              `₹${Number(value || 0).toLocaleString(
                "en-IN"
              )}`
            }
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Total Investment
          </p>
          <p className="font-bold text-lg text-indigo-600">
            ₹{totalInvestment.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>
      </div>
    </div>
  )
}