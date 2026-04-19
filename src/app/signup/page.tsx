"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const perks = [
  "Priority timing on fresh roles",
  "Honest AI tailoring",
  "Approval-first workflow",
];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase keys are missing. Add .env.local before signing up.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (!data.session) {
      setMessage("Account created. Check your email to confirm the account, then sign in.");
      return;
    }

    window.location.href = "/dashboard";
  }

  async function handleGoogleSignup() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase keys are missing. Add .env.local before signing up.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (oauthError) {
      setLoading(false);
      setError(oauthError.message);
    }
  }

  return (
    <div className="min-h-screen px-5 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="card bg-navy text-white">
          <p className="display-title text-4xl font-bold">Kairon</p>
          <h1 className="display-title mt-8 text-5xl font-bold leading-none">Build your strategic profile.</h1>
          <p className="mt-5 max-w-md text-base leading-8 text-white/70">
            Upload once, define the target, and let Kairon help you move with more speed and less noise.
          </p>
          <ul className="mt-8 space-y-4">
            {perks.map((perk) => (
              <li key={perk} className="text-sm text-white/80">
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="card mx-auto w-full max-w-md">
          <div>
            <p className="display-title text-4xl font-bold text-navy">Create account</p>
            <p className="mt-2 text-sm text-gray-500">Start free and calibrate the search before launch.</p>
          </div>

          <button className="btn btn-secondary mt-8 w-full justify-center" onClick={handleGoogleSignup} disabled={loading}>
            Sign up with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-surface-border" />
            <span className="text-xs uppercase tracking-[0.18em] text-gray-400">or</span>
            <div className="h-px flex-1 bg-surface-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input pl-11"
                  placeholder="Alex Morgan"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input pl-11"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input pl-11 pr-11"
                  type={showPassword ? "text" : "password"}
                  placeholder="Choose a secure password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            {message ? <p className="text-sm text-success">{message}</p> : null}
            <button className="btn btn-primary w-full justify-center" disabled={loading}>
              {loading ? "Creating account..." : "Start building"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-6 text-gray-500">
            By continuing you agree to the{" "}
            <Link href="/terms" className="font-semibold text-brand">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-brand">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
