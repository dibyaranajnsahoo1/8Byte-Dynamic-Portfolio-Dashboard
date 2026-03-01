import { usePortfolio } from "../hooks/usePortfolio"
import SummaryCards from "./SummaryCards"
import SectorPieChart from "./SectorPieChart"
import SectorBarChart from "./SectorBarChart"
import SectorAccordion from "./SectorAccordion"

export default function Dashboard() {
  const {
    data,
    totals,
    sectorSummary,
    loading,
    error,
  } = usePortfolio()

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-500 text-lg font-semibold">
          {error}
        </p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        <SummaryCards totals={totals} />

        <SectorAccordion data={data} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectorPieChart sectorSummary={sectorSummary} />
          <SectorBarChart sectorSummary={sectorSummary} />
        </div>

      </div>
    </div>
  )
}