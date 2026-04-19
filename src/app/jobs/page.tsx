import DashboardLayout from "@/components/DashboardLayout";
import JobsListView from "@/components/JobsListView";
import { getJobsForCurrentUser } from "@/lib/data";

export default async function JobsPage() {
  const jobs = await getJobsForCurrentUser();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="display-title text-4xl font-bold text-navy">Jobs</h1>
            <p className="mt-2 text-sm text-gray-500">
              Strategic matches scored across timing, fit, and narrative strength.
            </p>
          </div>
        </div>

        <JobsListView jobs={jobs} />
      </div>
    </DashboardLayout>
  );
}
