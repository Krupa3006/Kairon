"use client";

import { useState } from "react";
import Link from "next/link";
import OnboardingLayout from "@/components/OnboardingLayout";

const targetRoles = [
  "Product Strategy",
  "VP of Operations",
  "Head of Growth",
  "Chief of Staff",
  "Engineering Director",
];

const workTypes = ["Remote", "Hybrid", "On-site"];

export default function PreferencesPage() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    "Product Strategy",
    "Head of Growth",
  ]);
  const [selectedWorkType, setSelectedWorkType] = useState("Remote");

  function toggleRole(role: string) {
    setSelectedRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role],
    );
  }

  return (
    <OnboardingLayout step={3}>
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="display-title text-5xl font-bold leading-none text-navy">
            Define your <span className="text-brand">high-velocity</span> targets.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-500">
            Precision is the foundation of speed. Refine your search parameters
            so Kairon identifies opportunities that match your strategic
            trajectory.
          </p>

          <div className="card mt-8">
            <div>
              <p className="text-sm font-semibold text-navy">Target roles</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {targetRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                      selectedRoles.includes(role)
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-surface-border bg-white text-gray-500"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-navy">Preferred locations</p>
                <input
                  className="input mt-3"
                  placeholder="e.g. New York, London, Remote"
                  defaultValue="New York, London, Remote"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">Work type</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {workTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedWorkType(type)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        selectedWorkType === type
                          ? "bg-brand text-white"
                          : "bg-surface text-gray-600"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Link href="/onboarding/profile" className="btn btn-secondary">
              Back
            </Link>
            <Link href="/onboarding/ready" className="btn btn-primary">
              Find My First Matches
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-navy text-white">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
              The timing advantage
            </p>
            <p className="mt-4 text-lg font-semibold">
              We scan premium boards and internal directories every 3 hours.
            </p>
            <div className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
              Next scan in 42m
            </div>
            <p className="mt-5 text-sm leading-7 text-white/70">
              Most executive roles are filled by applicants who move in the first
              24 hours after posting.
            </p>
          </div>

          <div className="card">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              Active leads
            </p>
            <p className="display-title mt-3 text-5xl font-bold text-navy">1,204</p>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              Your current filters match 75% of high-growth tech openings this week.
            </p>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
