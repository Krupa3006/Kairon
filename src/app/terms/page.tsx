import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="display-title text-5xl font-bold text-navy">Terms</h1>
      <p className="mt-6 text-base leading-8 text-gray-500">
        Kairon is designed to support job search execution, not replace your
        judgment. You remain responsible for the accuracy of your materials and
        approval of any application that goes out.
      </p>
      <p className="mt-4 text-base leading-8 text-gray-500">
        The honesty guardrail is a core product rule and cannot be disabled.
        Using the service means agreeing not to attempt to bypass that policy.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back home
      </Link>
    </main>
  );
}
