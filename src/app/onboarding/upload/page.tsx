"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, FileText, Shield, UploadCloud } from "lucide-react";
import OnboardingLayout from "@/components/OnboardingLayout";

export default function UploadCVPage() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <OnboardingLayout step={1}>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="card bg-navy text-white">
          <p className="text-sm font-semibold text-white/70">Onboarding</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
            Strategic setup
          </p>
          <ul className="mt-8 space-y-5 text-sm text-white/70">
            <li className="text-white">Identity</li>
            <li>Strategy</li>
            <li>Preferences</li>
            <li>Launch</li>
          </ul>
        </aside>

        <div className="space-y-6">
          <div>
            <h1 className="display-title text-5xl font-bold leading-none text-navy">
              Let's build your
              <br />
              <span className="text-brand">strategic profile.</span>
            </h1>
          </div>

          <div className="card p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-brand/10 text-brand">
              <UploadCloud size={30} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-navy">Drop your CV here</h2>
            <p className="mt-2 text-sm text-gray-500">PDF or DOCX up to 10MB</p>
            <button
              onClick={() => setUploaded(true)}
              className="btn btn-primary mt-8"
            >
              Browse files
            </button>

            {uploaded ? (
              <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-left">
                <CheckCircle className="text-emerald-600" size={18} />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    CV uploaded and parsed
                  </p>
                  <p className="text-xs text-emerald-700">
                    Your profile audit is ready for review.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="card">
              <Shield className="text-brand" size={18} />
              <p className="mt-4 text-sm font-semibold text-navy">
                We never add fake skills or experience.
              </p>
            </div>
            <div className="card">
              <FileText className="text-brand" size={18} />
              <p className="mt-4 text-sm font-semibold text-navy">
                Your original profile remains the source of truth.
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Link href="/signup" className="btn btn-secondary">
              Back
            </Link>
            <Link
              href="/onboarding/profile"
              className={`btn btn-primary ${uploaded ? "" : "pointer-events-none opacity-50"}`}
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
