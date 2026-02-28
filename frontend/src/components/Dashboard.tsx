import { usePortfolio } from "../hooks/usePortfolio"
import SummaryCards from "./SummaryCards"
import SectorPieChart from "./SectorPieChart"
import SectorBarChart from "./SectorBarChart"

import SectorAccordion from "./SectorAccordion"

export default function Dashboard() {
  const { data, loading, error } = usePortfolio()

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )

  if (error)
    return (
      <p className="text-red-500 text-center mt-10 text-lg font-semibold">
        {error}
      </p>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        <SummaryCards data={data} />

        <SectorAccordion data={data} />

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectorPieChart data={data} />
        <SectorBarChart data={data} />
        </div>

      </div>
    </div>
  )
}