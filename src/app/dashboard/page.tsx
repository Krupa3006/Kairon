import Link from "next/link";
import { ArrowRight, Bell, BriefcaseBusiness, Filter, Sparkles, Zap } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DemoSeedButton from "@/components/DemoSeedButton";
import { getAppData } from "@/lib/data";

export default async function DashboardPage() {
  const { dashboardActivity, dashboardMetrics, jobs, profile } = await getAppData();
  const featuredCards = jobs.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
              Executive strategy
            </p>
            <h1 className="display-title mt-2 text-4xl font-bold text-navy">
              Good morning, {profile?.first_name ?? "there"}
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start">
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-card">
              <Bell size={16} className="text-navy" />
            </button>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
              {profile?.initials ?? "U"}
            </div>
          </div>
        </div>

        <div className="card flex items-center justify-between bg-orange-50">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-2 text-orange-600">
              <Zap size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-700">
                {jobs.length > 0
                  ? `${jobs.length} roles are active in your pipeline`
                  : "Your strategic workspace is ready"}
              </p>
              <p className="text-xs text-orange-600/80">
                {jobs.length > 0
                  ? "Supabase-backed jobs are now driving the dashboard."
                  : "Seed demo jobs or import your first pipeline to bring the dashboard to life."}
              </p>
            </div>
          </div>
          <span className="badge badge-orange hidden md:inline-flex">Live data</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {dashboardMetrics.map((metric, index) => (
            <div key={metric.label} className={`card ${index === 1 ? "bg-navy text-white" : ""}`}>
              <p className={`text-[11px] uppercase tracking-[0.18em] ${index === 1 ? "text-white/55" : "text-gray-400"}`}>
                {metric.label}
              </p>
              <p className="display-title mt-3 text-5xl font-bold">{metric.value}</p>
              <p className={`mt-2 text-sm ${index === 1 ? "text-white/65" : "text-gray-500"}`}>
                {metric.detail}
              </p>
              {metric.label === "Pending approvals" ? (
                <Link
                  href="/applications"
                  className={`mt-4 inline-flex text-sm font-semibold ${index === 1 ? "text-white" : "text-brand"}`}
                >
                  Review now <ArrowRight size={14} className="ml-1" />
                </Link>
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="display-title text-3xl font-bold text-navy">Your Job Pipeline</h2>
            <p className="mt-1 text-sm text-gray-500">
              Strategic matches ordered by timing, fit, and narrative strength.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary btn-sm">
              <Filter size={14} />
              Filter
            </button>
            <Link href="/jobs" className="btn btn-primary btn-sm">
              New Search
            </Link>
          </div>
        </div>

        {featuredCards.length === 0 ? (
          <div className="card space-y-4">
            <h3 className="display-title text-3xl font-bold text-navy">No jobs yet</h3>
            <p className="max-w-2xl text-sm leading-7 text-gray-500">
              The product is now wired to real Supabase data. To make tomorrow's launch smooth,
              load the demo pipeline now or start inserting your own jobs into `job_queue`.
            </p>
            <DemoSeedButton />
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {featuredCards.map((job) => (
              <div key={job.id} className="card p-0 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-orange">{job.priority_label ?? "Active"}</span>
                    <div className="rounded-2xl bg-surface px-3 py-1 text-xs font-semibold text-brand">
                      {job.score_label}
                    </div>
                  </div>

                  <div className="mt-5 flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-sm font-bold text-white">
                      {job.company.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-brand">{job.company}</p>
                      <h3 className="display-title mt-2 text-3xl font-bold leading-tight text-navy">
                        {job.title}
                      </h3>
                      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-gray-400">
                        {job.location} · {job.salary_range}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-[84px_1fr]">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Match</p>
                      <p className="display-title mt-1 text-4xl font-bold text-brand">
                        {job.match_score.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-400">/10</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Why match</p>
                      <p className="mt-2 text-sm leading-7 text-gray-600">{job.match_reason}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-surface-border px-6 py-4">
                  <span className="badge badge-orange">{job.status.replace("_", " ")}</span>
                  <div className="flex gap-3">
                    <Link href={`/jobs/${job.id}`} className="text-sm font-semibold text-navy">
                      View
                    </Link>
                    <Link href="/applications" className="btn btn-primary btn-sm">
                      Open pipeline
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                Pipeline health
              </p>
              <p className="text-sm font-semibold text-brand">
                {jobs.length > 0 ? "Live" : "Waiting for data"}
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <div className="h-3 flex-[2.2] rounded-full bg-brand" />
              <div className="h-3 flex-[3.4] rounded-full bg-brand/60" />
              <div className="h-3 flex-[1.3] rounded-full bg-brand/35" />
              <div className="h-3 flex-[0.3] rounded-full bg-orange-500" />
              <div className="h-3 flex-[1.1] rounded-full bg-navy/10" />
            </div>
          </div>

          <div className="card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Live feed
            </p>
            <div className="mt-4 space-y-4">
              {dashboardActivity.length === 0 ? (
                <p className="text-sm text-gray-500">Activity appears here once jobs are flowing.</p>
              ) : null}
              {dashboardActivity.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="mt-1 rounded-2xl bg-brand/10 p-2 text-brand">
                    {item.kind === "interview" ? <Sparkles size={14} /> : <BriefcaseBusiness size={14} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{item.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{item.detail}</p>
                    <p className="mt-1 text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
