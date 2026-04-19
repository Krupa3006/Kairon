"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase keys are missing. Add .env.local before logging in.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    window.location.href = nextPath;
  }

  async function handleGoogleLogin() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase keys are missing. Add .env.local before logging in.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    if (oauthError) {
      setLoading(false);
      setError(oauthError.message);
    }
  }

  return (
    <div className="min-h-screen px-5 py-10">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="card bg-navy text-white">
          <p className="display-title text-4xl font-bold">Kairon</p>
          <h1 className="display-title mt-8 text-5xl font-bold leading-none">Welcome back.</h1>
          <p className="mt-5 max-w-md text-base leading-8 text-white/70">
            Pick up where the strategic search left off. Your approvals, inbox signals, and active matches are ready.
          </p>
        </div>

        <div className="card mx-auto w-full max-w-md">
          <div className="text-center">
            <p className="display-title text-4xl font-bold text-navy">Sign in</p>
            <p className="mt-2 text-sm text-gray-500">Access your strategic command center.</p>
          </div>

          <button className="btn btn-secondary mt-8 w-full justify-center" onClick={handleGoogleLogin} disabled={loading}>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-surface-border" />
            <span className="text-xs uppercase tracking-[0.18em] text-gray-400">or</span>
            <div className="h-px flex-1 bg-surface-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-navy">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-brand">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input pl-11 pr-11"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
            <button className="btn btn-primary w-full justify-center" disabled={loading}>
              {loading ? "Signing in..." : "Enter Kairon"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-brand">
              Create your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
