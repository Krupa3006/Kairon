import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="display-title text-5xl font-bold text-navy">Privacy</h1>
      <p className="mt-6 text-base leading-8 text-gray-500">
        Kairon stores only the information required to run your strategic job
        search workflows, tailor your materials, and deliver inbox-driven
        automations.
      </p>
      <p className="mt-4 text-base leading-8 text-gray-500">
        OAuth connections are user-controlled and can be revoked at any time.
        We use profile data to improve matching accuracy and never to fabricate
        credentials.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back home
      </Link>
    </main>
  );
}
