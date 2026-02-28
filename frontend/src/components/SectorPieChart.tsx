import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"
import type { Stock } from "../types/stock"

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#14b8a6"
]

export default function SectorPieChart({ data }: { data: Stock[] }) {

  const safeData: Stock[] = Array.isArray(data) ? data : []

  const grouped = safeData.reduce<Record<string, number>>(
    (acc, stock) => {
      const sectorName = stock.sector || "Unknown"
      acc[sectorName] =
        (acc[sectorName] || 0) + (stock.investment || 0)
      return acc
    },
    {}
  )

  const chartData = Object.keys(grouped).map((sector) => ({
    sector,
    value: grouped[sector]
  }))

  const totalInvestment = chartData.reduce(
    (sum, d) => sum + (d.value || 0),
    0
  )

  const renderLabel = ({
    name,
    percent,
    value
  }: any) => {
    return `${name}: ₹${Number(value || 0).toLocaleString()} (${(
      (percent || 0) * 100
    ).toFixed(0)}%)`
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-xl p-6 h-[400px] relative hover:shadow-2xl transition">

      <h3 className="font-semibold mb-4 text-xl text-gray-700">
        Sector Allocation
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="sector"
            innerRadius={70}
            outerRadius={130}
            paddingAngle={4}
            label={renderLabel}
            labelLine={false}
            animationDuration={1000}
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number) =>
              `₹${Number(value || 0).toLocaleString()}`
            }
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center mt-10">
          <p className="text-gray-500 text-sm">
            Total Investment
          </p>
          <p className="font-bold text-lg text-indigo-600">
            ₹{Number(totalInvestment || 0).toLocaleString()}
          </p>
        </div>
      </div>

    </div>
  )
}