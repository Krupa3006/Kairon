"use client";

import { useState } from "react";
import Link from "next/link";
import OnboardingLayout from "@/components/OnboardingLayout";
import { jobs } from "@/lib/mock-data";

export default function ReadyPage() {
  const [launching, setLaunching] = useState(false);

  function handleLaunch() {
    setLaunching(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1200);
  }

  const featuredJob = jobs[0];

  return (
    <OnboardingLayout step={4}>
      <div className="text-center">
        <span className="badge badge-blue uppercase tracking-[0.16em] text-[10px]">
          Strategy complete
        </span>
        <h1 className="display-title mt-6 text-6xl font-bold leading-none text-navy">
          Your first matches
          <br />
          <span className="text-brand">are ready.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500">
          We found 12 high-fit roles posted in the last 3 hours that match your
          strategy.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[0.25fr_0.5fr_0.25fr]">
        <div className="rounded-[32px] bg-brand/6" />
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-lg font-bold text-white">
              {featuredJob.company.slice(0, 1)}
            </div>
            <span className="badge badge-orange">Posted 1h ago</span>
          </div>
          <h2 className="mt-5 text-3xl font-bold text-navy">{featuredJob.title}</h2>
          <p className="mt-2 text-lg font-semibold text-brand">{featuredJob.company}</p>
          <div className="mt-6 flex items-center justify-between border-t border-surface-border pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                Match score
              </p>
              <p className="mt-2 text-lg font-semibold text-navy">{featuredJob.score_label}</p>
            </div>
            <p className="text-lg font-bold text-navy">{featuredJob.salary_range}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card">
            <p className="text-sm font-semibold text-navy">
              Your "Executive Presence" score is a primary driver for these matches.
            </p>
          </div>
          <div className="card">
            <p className="text-sm font-semibold text-navy">
              Auto-drafted personalized cover letters are ready for review.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-4">
        <Link href="/onboarding/preferences" className="btn btn-secondary">
          Back
        </Link>
        <button onClick={handleLaunch} className="btn btn-primary btn-lg" disabled={launching}>
          {launching ? "Launching..." : "View My Matches"}
        </button>
      </div>
    </OnboardingLayout>
  );
}
