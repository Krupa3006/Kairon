import Link from "next/link";
import { ArrowRight, Clock3, ShieldCheck, Sparkles, Target } from "lucide-react";
import { jobs, pricingTiers, userProfile } from "@/lib/mock-data";

const featureList = [
  {
    title: "Apply within the first 3 hours",
    description:
      "Kairon prioritizes timing so high-fit roles are surfaced before they disappear under the crowd.",
    icon: Clock3,
  },
  {
    title: "Honest AI tailoring",
    description:
      "Every rewrite stays rooted in verified experience. Kairon sharpens signal without inventing anything.",
    icon: ShieldCheck,
  },
  {
    title: "Approval-first workflow",
    description:
      "The agent drafts, scores, and explains each move so you stay in control of the pipeline.",
    icon: Target,
  },
];

const processSteps = [
  "Upload your CV and connect your inbox",
  "Define the strategic roles and markets you want",
  "Approve the best-fit opportunities before launch",
];

export default function LandingPage() {
  const heroJob = jobs[0];

  return (
    <div className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="display-title text-3xl font-bold text-navy">
          Kairon
        </Link>
        <div className="hidden items-center gap-8 text-sm font-semibold text-gray-500 md:flex">
          <a href="#platform" className="hover:text-navy">
            Platform
          </a>
          <a href="#workflow" className="hover:text-navy">
            Resources
          </a>
          <Link href="/pricing" className="hover:text-navy">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-brand">
            Log in
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            Get started
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <span className="badge badge-orange uppercase tracking-[0.16em] text-[10px]">
            Strategy command
          </span>
          <h1 className="display-title mt-6 text-5xl font-bold leading-[0.96] text-navy md:text-7xl">
            The early advantage,
            <br />
            within reach.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-500">
            Kairon is a strategic job search command center for candidates who
            want to move faster without sounding fake. It finds the right roles,
            tailors your story honestly, and keeps the pipeline moving.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Build your search <ArrowRight size={18} />
            </Link>
            <Link href="/pricing" className="btn btn-secondary btn-lg">
              See pricing
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-8 text-sm text-gray-500">
            <div>
              <p className="display-title text-3xl font-bold text-brand">82%</p>
              <p>Momentum score on high-velocity roles</p>
            </div>
            <div>
              <p className="display-title text-3xl font-bold text-navy">3h</p>
              <p>Average lead before the market crowds in</p>
            </div>
            <div>
              <p className="display-title text-3xl font-bold text-navy">0</p>
              <p>Fabricated skills, ever</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
          <div className="glass-panel relative rounded-[32px] p-5">
            <div className="rounded-[28px] bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="display-title text-3xl font-bold text-navy">
                    {heroJob.title}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-brand">
                    {heroJob.company} · {heroJob.location}
                  </p>
                </div>
                <div className="rounded-2xl bg-navy px-4 py-2 text-right text-white">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                    Match
                  </p>
                  <p className="display-title text-2xl font-bold">{heroJob.score_label}</p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl bg-navy p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">
                      Strategic note
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      {heroJob.match_reason}
                    </p>
                  </div>
                  <Sparkles className="text-brand" size={18} />
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
                    Candidate
                  </p>
                  <p className="mt-2 text-sm font-semibold text-navy">
                    {userProfile.full_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {userProfile.role_focus}
                  </p>
                </div>
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
                    Why now
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Posted in the last few hours and fits the active executive
                    strategy profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-6xl px-5 py-6">
        <div className="grid gap-5 md:grid-cols-3">
          {featureList.map(({ title, description, icon: Icon }) => (
            <div key={title} className="card">
              <div className="mb-4 inline-flex rounded-2xl bg-brand/10 p-3 text-brand">
                <Icon size={18} />
              </div>
              <h2 className="text-xl font-bold text-navy">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="badge badge-blue uppercase tracking-[0.16em] text-[10px]">
              Why early matters
            </span>
            <h2 className="display-title mt-5 text-4xl font-bold text-navy">
              The timing advantage compounds.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-gray-500">
              Most executive and senior roles are not truly open for long. Kairon
              keeps scanning, surfaces fresh opportunities, and lets you move
              while signal is still high.
            </p>
          </div>

          <div className="grid gap-4">
            {processSteps.map((step, index) => (
              <div key={step} className="card flex items-start gap-4">
                <div className="display-title flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="text-lg font-bold text-navy">{step}</p>
                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    This step is designed to preserve clarity and keep approvals
                    grounded in your real background.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <span className="badge badge-blue bg-white/10 text-white">
                Honest AI tailoring
              </span>
              <h2 className="display-title mt-5 text-4xl font-bold text-white">
                Honesty as a service.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-white/70">
                Kairon never pads your resume, inflates your scope, or inserts
                technologies you have not used. Every suggestion is traceable to
                real experience in your profile.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/6 p-6">
              <div className="rounded-[24px] bg-white p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                  Strategic verification
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  "We never add fake skills or experience. Kairon organizes your
                  strongest proof points and sharpens the narrative with the
                  honesty guardrail always on."
                </p>
                <div className="mt-6 h-2 rounded-full bg-surface">
                  <div className="h-2 w-[82%] rounded-full bg-brand" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 text-center">
          <span className="badge badge-orange uppercase tracking-[0.16em] text-[10px]">
            Pricing
          </span>
          <h2 className="display-title mt-4 text-4xl font-bold text-navy">
            Pick your pace.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`card flex flex-col ${
                tier.highlight ? "border-brand bg-navy text-white" : ""
              }`}
            >
              <div className="mb-6">
                {tier.badge ? (
                  <span className="badge badge-orange mb-3">{tier.badge}</span>
                ) : null}
                <p className={`text-lg font-bold ${tier.highlight ? "text-white" : "text-navy"}`}>
                  {tier.name}
                </p>
                <p className={`mt-1 text-sm ${tier.highlight ? "text-white/70" : "text-gray-500"}`}>
                  {tier.subtitle}
                </p>
                <p className="display-title mt-5 text-4xl font-bold">
                  {tier.price}
                </p>
              </div>
              <ul className={`flex-1 space-y-3 text-sm ${tier.highlight ? "text-white/80" : "text-gray-600"}`}>
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`mt-8 btn justify-center ${tier.highlight ? "btn-primary" : "btn-secondary"}`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="rounded-[32px] bg-navy px-8 py-10 text-white">
          <h2 className="display-title text-4xl font-bold">
            Your next career move starts two hours ago.
          </h2>
          <p className="mt-4 max-w-2xl text-white/70">
            Build your profile once, approve with confidence, and let Kairon
            keep the search moving with better timing and better story control.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup" className="btn btn-primary">
              Get started
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              Review plans
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-surface-border px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>Kairon strategic career command. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
