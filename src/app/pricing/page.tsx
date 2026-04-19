import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pricingTiers } from "@/lib/mock-data";

const faqs = [
  {
    question: "How often does Kairon scan for new roles?",
    answer:
      "Starter scans daily. Pro increases scan frequency and pushes fresh opportunities into review much sooner.",
  },
  {
    question: "What does honest tailoring mean?",
    answer:
      "Kairon can reorder, reframe, and sharpen what already exists in your profile, but it never invents credentials or metrics.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Yes. Most people begin on Starter or Pro and upgrade once they want more speed, approvals, and concierge support.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="display-title text-3xl font-bold text-navy">
          Kairon
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-navy">
            Log in
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            Get started
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        <div className="text-center">
          <span className="badge badge-orange uppercase tracking-[0.16em] text-[10px]">
            Strategy command
          </span>
          <h1 className="display-title mt-5 text-5xl font-bold leading-none text-navy md:text-7xl">
            The early advantage,
            <br />
            within reach.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500">
            Choose the plan that matches your current career phase and the speed
            you want from your search.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`card flex flex-col ${
                tier.highlight ? "card-dark text-white" : ""
              }`}
            >
              {tier.badge ? (
                <span className="badge badge-orange mb-4 w-fit">{tier.badge}</span>
              ) : null}
              <p className={`text-lg font-bold ${tier.highlight ? "text-white" : "text-navy"}`}>
                {tier.name}
              </p>
              <p className={`mt-1 text-sm ${tier.highlight ? "text-white/65" : "text-gray-500"}`}>
                {tier.subtitle}
              </p>
              <p className="display-title mt-6 text-5xl font-bold">{tier.price}</p>
              <ul className={`mt-8 flex-1 space-y-3 text-sm ${tier.highlight ? "text-white/80" : "text-gray-600"}`}>
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`mt-8 btn justify-center ${
                  tier.highlight ? "btn-primary" : "btn-secondary"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <section className="mt-20 rounded-[32px] bg-navy px-8 py-12 text-white">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <h2 className="display-title text-4xl font-bold">
                Honesty as a service
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-white/70">
                Kairon keeps your profile believable, interview-ready, and
                consistent. That is not a side feature. It is the product.
              </p>
            </div>
            <div className="rounded-[28px] bg-white/8 p-6">
              <div className="rounded-[24px] bg-white p-5 text-navy">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                  Strategic verification
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  The system can emphasize, reorder, and refine, but it cannot
                  invent. That is how Kairon helps you enter interviews without
                  anxiety.
                </p>
                <div className="mt-5 h-2 rounded-full bg-surface">
                  <div className="h-2 w-[84%] rounded-full bg-brand" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="display-title text-4xl font-bold text-navy">
              Strategic Intel
            </h2>
            <p className="mt-4 text-base leading-8 text-gray-500">
              Common questions about the Kairon workflow.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="card">
                <p className="text-lg font-semibold text-navy">{faq.question}</p>
                <p className="mt-3 text-sm leading-7 text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 text-center">
          <Link href="/signup" className="btn btn-primary btn-lg">
            Get your first matches <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  );
}
