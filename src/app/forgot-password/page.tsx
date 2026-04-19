import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto max-w-xl px-5 py-20">
      <div className="card text-center">
        <h1 className="display-title text-4xl font-bold text-navy">
          Reset password
        </h1>
        <p className="mt-4 text-sm leading-7 text-gray-500">
          This starter project ships the UI flow here. Hook this screen up to
          your auth provider when you wire real authentication.
        </p>
        <Link href="/login" className="btn btn-primary mt-8">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
