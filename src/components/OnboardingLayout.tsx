import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  { label: "Identity", href: "/onboarding/upload" },
  { label: "Strategy", href: "/onboarding/profile" },
  { label: "Preferences", href: "/onboarding/preferences" },
  { label: "Launch", href: "/onboarding/ready" },
];

export default function OnboardingLayout({
  children,
  step = 1,
}: {
  children: React.ReactNode;
  step?: number;
}) {
  const pct = (step / STEPS.length) * 100;
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-surface-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-navy text-[28px] leading-none display-title">Kairon</span>
          <span className="badge badge-blue uppercase tracking-[0.16em] text-[9px]">Onboarding</span>
        </Link>
        <div className="hidden lg:flex items-center gap-6">
          {STEPS.map((s, i) => (
            <div key={s.label} className="hidden md:flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i + 1 <= step ? "bg-brand text-white" : "bg-surface-border text-gray-400"}`}>
                {i + 1}
              </div>
              <span className={`text-xs font-medium ${i + 1 <= step ? "text-gray-900" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <span className="text-xs text-gray-400">Save &amp; Exit</span>
      </header>

      {/* Progress */}
      <main className="flex-1 flex items-start justify-center py-10 px-4 md:px-6">
        <div className="w-full max-w-5xl animate-slide-up">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="w-full max-w-sm">
              <div className="onboarding-progress">
                <div className="onboarding-progress-bar" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-brand font-semibold">
                Step {String(step).padStart(2, "0")} of {String(STEPS.length).padStart(2, "0")}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-orange-600 font-semibold">
              Temporal advantage active
              <ArrowRight size={12} />
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
