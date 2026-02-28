import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import type { Stock } from "../types/stock"

export default function SectorBarChart({ data }: { data: Stock[] }) {

  const safeData: Stock[] = Array.isArray(data) ? data : []

  const grouped = safeData.reduce<Record<string, {
    investment: number
    present: number
  }>>((acc, stock) => {

    const sectorName = stock.sector || "Unknown"

    if (!acc[sectorName]) {
      acc[sectorName] = {
        investment: 0,
        present: 0
      }
    }

    acc[sectorName].investment += stock.investment || 0
    acc[sectorName].present += stock.presentValue || 0

    return acc
  }, {})

  const chartData = Object.keys(grouped).map((sector) => ({
    sector,
    gain:
      (grouped[sector].present || 0) -
      (grouped[sector].investment || 0)
  }))

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-xl p-6 h-[400px] transition hover:shadow-2xl">

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
          <Bar
            dataKey="gain"
            fill="#6366f1"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}