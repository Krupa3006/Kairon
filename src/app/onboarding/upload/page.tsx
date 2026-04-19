"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, FileText, Shield, UploadCloud } from "lucide-react";
import OnboardingLayout from "@/components/OnboardingLayout";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { getApiBaseUrl } from "@/lib/env";

export default function UploadCVPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  async function handleFile(file: File) {
    const supabase = getSupabaseBrowserClient();
    const apiBaseUrl = getApiBaseUrl();

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    if (!apiBaseUrl) {
      setError("Backend API URL is missing. Add NEXT_PUBLIC_API_URL in Vercel.");
      return;
    }

    setLoading(true);
    setError("");
    setUploaded(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You need to be signed in to upload a CV.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiBaseUrl}/api/v1/cv/parse`, {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail ?? payload.error ?? "CV parsing failed.");
      }

      const cvText = String(payload.cv_text ?? "").trim();

      const { error: updateError } = await supabase
        .from("users")
        .update({ cv_text: cvText })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      setSummary(cvText.slice(0, 220));
      setUploaded(true);
      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to parse and save your CV.",
      );
    } finally {
      setLoading(false);
    }
  }

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
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleFile(file);
                }
              }}
            />
            <button
              onClick={() => inputRef.current?.click()}
              className="btn btn-primary mt-8"
              disabled={loading}
            >
              {loading ? "Parsing CV..." : "Browse files"}
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
            {summary ? (
              <div className="mx-auto mt-4 max-w-2xl rounded-2xl bg-surface px-4 py-3 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Parsed preview
                </p>
                <p className="mt-2 text-sm leading-7 text-gray-600">{summary}...</p>
              </div>
            ) : null}
            {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
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
