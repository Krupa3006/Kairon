import Link from "next/link";
import { Shield, Sparkles } from "lucide-react";
import OnboardingLayout from "@/components/OnboardingLayout";
import { tailorSuggestions } from "@/lib/data";

export default function ProfilePage() {
  return (
    <OnboardingLayout step={2}>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div>
            <h1 className="display-title text-5xl font-bold leading-none text-navy">
              Review &amp; edit
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-gray-500">
              Our AI has analyzed your career trajectory. Refine these details so
              your Strategic Mode is calibrated correctly.
            </p>
          </div>

          <div className="card bg-navy text-white">
            <div className="flex items-start gap-3">
              <Shield className="mt-1 text-brand" size={18} />
              <div>
                <p className="text-lg font-semibold">The integrity guarantee</p>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Kairon highlights authentic impact through a strategic lens.
                  It never adds fake skills or experience.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-navy">Extracted experience</h2>
              <button className="text-sm font-semibold text-brand">Add role</button>
            </div>

            <div className="mt-6 space-y-6">
              <div className="border-l-2 border-brand pl-5">
                <p className="text-2xl font-bold text-navy">Senior Strategic Architect</p>
                <p className="mt-1 text-sm font-semibold text-brand">
                  Velocity Dynamics · 2021 - Present
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-500">
                  Led the transformation of operational frameworks into cloud-native
                  delivery systems, achieving a 40% reduction in deployment latency.
                </p>
              </div>
              <div className="border-l-2 border-surface-border pl-5">
                <p className="text-2xl font-bold text-navy">Systems Lead</p>
                <p className="mt-1 text-sm font-semibold text-gray-400">
                  Prism Global · 2018 - 2021
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-500">
                  Orchestrated multi-region infrastructure scaling for enterprise
                  clients during peak demand cycles.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-brand text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              Extraction confidence
            </p>
            <p className="display-title mt-3 text-6xl font-bold">94%</p>
            <p className="mt-2 text-sm text-white/75">High precision</p>
            <div className="mt-6 h-2 rounded-full bg-white/20">
              <div className="h-2 w-[94%] rounded-full bg-white" />
            </div>
          </div>

          <div className="card">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
              Identified core skills
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Cloud Strategy",
                "Architecture Design",
                "Team Leadership",
                "SaaS Scaling",
                "Agile Ops",
              ].map((skill) => (
                <span key={skill} className="badge badge-purple">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand" />
              <p className="text-lg font-semibold text-navy">What changed</p>
            </div>
            <div className="mt-5 space-y-4">
              {tailorSuggestions.slice(0, 2).map((suggestion) => (
                <div key={suggestion.id} className="rounded-2xl bg-surface p-4">
                  <p className="text-sm font-semibold text-navy">{suggestion.title}</p>
                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    {suggestion.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Link href="/onboarding/upload" className="btn btn-secondary">
              Back
            </Link>
            <Link href="/onboarding/preferences" className="btn btn-primary">
              Next: Define Preferences
            </Link>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
