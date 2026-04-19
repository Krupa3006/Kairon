import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import ApplicationsBoard from "@/components/ApplicationsBoard";
import { getAppData } from "@/lib/data";

export default async function ApplicationsPage() {
  const { insightTiles, pipelineLanes } = await getAppData();
  const totalCount = pipelineLanes.reduce((sum, lane) => sum + lane.count, 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="display-title text-4xl font-bold text-navy">Strategic Pipeline</h1>
            <p className="mt-2 text-sm text-gray-500">
              Tracking {totalCount} active opportunities across review, applied, and interview stages.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary btn-sm">Refine view</button>
            <Link href="/tailor-studio" className="btn btn-primary btn-sm">
              AI + Me
            </Link>
          </div>
        </div>

        <ApplicationsBoard lanes={pipelineLanes} insightTiles={insightTiles} />
      </div>
    </DashboardLayout>
  );
}
