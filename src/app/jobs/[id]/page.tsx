import Link from "next/link";
import { ArrowLeft, CalendarClock, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getJobForCurrentUser, tailorSuggestions } from "@/lib/data";

type JobDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const job = await getJobForCurrentUser(params.id);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
          <ArrowLeft size={14} />
          Back to jobs
        </Link>

        {!job ? (
          <div className="card">
            <h1 className="display-title text-3xl font-bold text-navy">Role not found</h1>
            <p className="mt-3 text-sm text-gray-500">
              This role is not available for the current authenticated user.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
            <aside className="space-y-5">
              <div className="card">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-lg font-bold text-white">
                    {job.company.slice(0, 1)}
                  </div>
                  <div>
                    <h1 className="display-title text-3xl font-bold text-navy">{job.title}</h1>
                    <p className="mt-2 text-sm font-semibold text-brand">
                      {job.company} · {job.location}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] bg-orange-50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-orange-500">
                    Timing signal
                  </p>
                  <p className="mt-2 text-sm leading-7 text-orange-700">
                    {job.posted_at
                      ? "This role is still fresh enough to benefit from early action."
                      : "Add a posted timestamp later to power stronger timing intelligence."}
                  </p>
                </div>

                <div className="mt-6 rounded-[24px] bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-navy">Match insights</p>
                    <span className="badge badge-orange">{job.score_label}</span>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-white">
                    <div className="h-3 rounded-full bg-brand" style={{ width: `${Math.max(job.match_score * 10, 8)}%` }} />
                  </div>
                  <ul className="mt-5 space-y-3 text-sm text-gray-600">
                    <li>{job.match_reason ?? "Add a match reason to explain why this role fits."}</li>
                    <li>Status: {job.status.replace("_", " ")}</li>
                    <li>Source: {job.source}</li>
                  </ul>
                </div>

                <div className="mt-5 rounded-[24px] bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 text-emerald-600" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">Honesty validation badge</p>
                      <p className="mt-2 text-sm leading-7 text-emerald-700">
                        Every recommendation below should remain grounded in verified profile history.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <section className="card">
              <div className="flex flex-col gap-4 border-b border-surface-border pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Tailor studio</p>
                  <h2 className="display-title mt-2 text-3xl font-bold text-navy">What changed in your CV</h2>
                </div>
                <div className="flex gap-3">
                  <a href={job.job_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                    Original posting <ExternalLink size={14} />
                  </a>
                  <button className="btn btn-primary btn-sm">Approve &amp; apply</button>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {tailorSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="rounded-[24px] bg-surface p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-navy">{suggestion.title}</p>
                      <span className="badge badge-blue">
                        <Sparkles size={11} />
                        Suggested
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Original</p>
                        <p className="mt-2 text-sm leading-7 text-gray-500">{suggestion.original}</p>
                      </div>
                      <div className="rounded-2xl bg-brand/10 p-4">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-brand">Revised</p>
                        <p className="mt-2 text-sm leading-7 text-navy">{suggestion.revised}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-gray-500">{suggestion.reason}</p>
                  </div>
                ))}
              </div>

              {job.follow_up_due ? (
                <div className="mt-6 rounded-[24px] bg-navy p-5 text-white">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/55">
                    <CalendarClock size={12} />
                    Follow-up queued
                  </div>
                  <p className="mt-3 text-sm text-white/75">
                    A follow-up is scheduled for this role. Connect Gmail next to fully automate reply tracking.
                  </p>
                </div>
              ) : null}
            </section>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
