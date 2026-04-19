import DashboardLayout from "@/components/DashboardLayout";
import SettingsView from "@/components/SettingsView";
import { getAppData } from "@/lib/data";

export default async function SettingsPage() {
  const { dashboardMetrics, profile } = await getAppData();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="display-title text-4xl font-bold text-navy">Settings</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage the strategic profile, agent behavior, and delivery channels.
          </p>
        </div>

        <SettingsView profile={profile} metrics={dashboardMetrics} />
      </div>
    </DashboardLayout>
  );
}
