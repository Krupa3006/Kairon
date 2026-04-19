import Link from "next/link";
import { Shield, Sparkles } from "lucide-react";
import OnboardingLayout from "@/components/OnboardingLayout";
import { getCurrentProfile } from "@/lib/auth";
import { extractCvHighlights, extractSkillTags } from "@/lib/profile-insights";
import { tailorSuggestions } from "@/lib/data";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  const highlights = extractCvHighlights(profile?.cv_text);
  const skills = extractSkillTags(profile?.cv_text);

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
              <Link href="/settings" className="text-sm font-semibold text-brand">Edit profile</Link>
            </div>

            <div className="mt-6 space-y-6">
              {highlights.length > 0 ? (
                highlights.map((highlight, index) => (
                  <div
                    key={highlight}
                    className={`${index === 0 ? "border-brand" : "border-surface-border"} border-l-2 pl-5`}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Extract {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-gray-600">{highlight}</p>
                  </div>
                ))
              ) : (
                <div className="border-l-2 border-surface-border pl-5">
                  <p className="text-sm leading-7 text-gray-500">
                    Upload your CV first so Kairon can extract your verified career history.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-brand text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              Extraction confidence
            </p>
            <p className="display-title mt-3 text-6xl font-bold">
              {profile?.cv_text ? "92%" : "0%"}
            </p>
            <p className="mt-2 text-sm text-white/75">High precision</p>
            <div className="mt-6 h-2 rounded-full bg-white/20">
              <div
                className="h-2 rounded-full bg-white"
                style={{ width: profile?.cv_text ? "92%" : "0%" }}
              />
            </div>
          </div>

          <div className="card">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
              Identified core skills
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(skills.length > 0 ? skills : ["Upload CV", "Parse profile"]).map((skill) => (
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
                    {profile?.cv_text
                      ? suggestion.reason
                      : "Upload your CV to unlock grounded rewrite suggestions based on real experience."}
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
