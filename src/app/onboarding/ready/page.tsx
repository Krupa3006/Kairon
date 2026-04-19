import Link from "next/link";
import OnboardingLayout from "@/components/OnboardingLayout";
import { getCurrentProfile } from "@/lib/auth";

export default async function ReadyPage() {
  const profile = await getCurrentProfile();
  const targetRoles = profile?.job_title?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
  const topRole = targetRoles[0] ?? "Strategic leadership roles";
  const location = profile?.location ?? "your selected locations";
  const cvReady = Boolean(profile?.cv_text);

  return (
    <OnboardingLayout step={4}>
      <div className="text-center">
        <span className="badge badge-blue uppercase tracking-[0.16em] text-[10px]">
          Strategy complete
        </span>
        <h1 className="display-title mt-6 text-6xl font-bold leading-none text-navy">
          Your strategy
          <br />
          <span className="text-brand">is live.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500">
          Kairon is now configured for {topRole.toLowerCase()} across {location}.
          Your profile is ready for live scoring, tailoring, and pipeline review.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[0.25fr_0.5fr_0.25fr]">
        <div className="rounded-[32px] bg-brand/6" />
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-lg font-bold text-white">
              {topRole.slice(0, 1)}
            </div>
            <span className="badge badge-orange">Setup complete</span>
          </div>
          <h2 className="mt-5 text-3xl font-bold text-navy">{topRole}</h2>
          <p className="mt-2 text-lg font-semibold text-brand">{location}</p>
          <div className="mt-6 flex items-center justify-between border-t border-surface-border pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                CV status
              </p>
              <p className="mt-2 text-lg font-semibold text-navy">
                {cvReady ? "Parsed and saved" : "Needs upload"}
              </p>
            </div>
            <p className="text-lg font-bold text-navy">{profile?.remote_preference ?? "any"}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card">
            <p className="text-sm font-semibold text-navy">
              Your target roles and location preferences are now saved to your profile.
            </p>
          </div>
          <div className="card">
            <p className="text-sm font-semibold text-navy">
              The next step is feeding real opportunities into your pipeline for scoring and review.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-4">
        <Link href="/onboarding/preferences" className="btn btn-secondary">
          Back
        </Link>
        <Link href="/dashboard" className="btn btn-primary btn-lg">
          Open Dashboard
        </Link>
      </div>
    </OnboardingLayout>
  );
}
