import { getCurrentProfile } from "@/lib/auth";
import Sidebar from "./Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar profile={profile} />
      <main className="main-content flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
