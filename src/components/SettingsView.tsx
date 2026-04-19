"use client";

import { useState } from "react";
import { Bell, CreditCard, Link2, Shield, User, Zap } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { DashboardMetric, UserProfile } from "@/lib/types";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "agent", label: "Agent", icon: Zap },
  { id: "connections", label: "Connections", icon: Link2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
];

type SettingsViewProps = {
  profile: UserProfile | null;
  metrics: DashboardMetric[];
};

export default function SettingsView({ profile, metrics }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [jobTitle, setJobTitle] = useState(profile?.job_title ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url ?? "");
  const [agentEnabled, setAgentEnabled] = useState(Boolean(profile?.agent_active));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function saveProfile() {
    if (!profile) {
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase keys are missing. Add env vars first.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        job_title: jobTitle,
        location,
        linkedin_url: linkedinUrl,
        agent_active: agentEnabled,
      })
      .eq("id", profile.id);

    setSaving(false);
    setMessage(error ? error.message : "Profile saved.");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
      <div className="card p-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                activeTab === tab.id ? "bg-brand text-white" : "text-gray-600 hover:bg-surface"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-5">
        {activeTab === "profile" ? (
          <div className="card">
            <div className="flex items-center gap-4 border-b border-surface-border pb-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                {profile?.initials ?? "U"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">
                  {profile?.full_name ?? "New User"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {profile?.job_title ?? "No job title yet"} · {profile?.location ?? "No location yet"}
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy">Full name</label>
                <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy">Email</label>
                <input className="input" defaultValue={profile?.email ?? ""} disabled />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy">Target role</label>
                <input className="input" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy">Location</label>
                <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-navy">LinkedIn</label>
                <input className="input" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              {message ? <p className="text-sm text-gray-500">{message}</p> : null}
            </div>
          </div>
        ) : null}

        {activeTab === "agent" ? (
          <>
            <div className="card flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy">Agent status</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Control whether Kairon is actively scanning and queuing high-fit opportunities.
                </p>
              </div>
              <button
                onClick={() => setAgentEnabled((value) => !value)}
                className={`relative h-7 w-14 rounded-full ${agentEnabled ? "bg-success" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                    agentEnabled ? "left-8" : "left-1"
                  }`}
                />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="card">
                  <p className="text-sm font-semibold text-gray-400">{metric.label}</p>
                  <p className="display-title mt-3 text-4xl font-bold text-navy">{metric.value}</p>
                  <p className="mt-2 text-sm text-gray-500">{metric.detail}</p>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="flex items-start gap-3">
                <Shield size={18} className="mt-1 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-bold text-navy">Honesty guardrail</h2>
                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    This stays on permanently. Kairon will not fabricate titles, skills, or metrics to boost a match.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "connections" ? (
          <div className="card space-y-4">
            {["LinkedIn", "Gmail", "Telegram"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-surface-border p-4"
              >
                <div>
                  <p className="text-lg font-semibold text-navy">{label}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Connection UI is ready. Back-end OAuth wiring is the next integration step.
                  </p>
                </div>
                <span className="badge badge-gray">Pending</span>
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === "notifications" ? (
          <div className="card space-y-4">
            {["Interview alerts", "Daily digest", "New lead notifications", "Follow-up reminders"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-surface-border pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-lg font-semibold text-navy">{label}</p>
                  <p className="mt-1 text-sm text-gray-500">Notification preferences can be persisted next.</p>
                </div>
                <button className="relative h-7 w-14 rounded-full bg-brand">
                  <span className="absolute left-8 top-1 h-5 w-5 rounded-full bg-white" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === "billing" ? (
          <div className="card">
            <h2 className="text-xl font-bold text-navy">Current plan</h2>
            <p className="mt-2 text-sm text-gray-500">
              {profile?.plan ?? "Free"} plan. Billing integration can be connected after launch.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-sm text-gray-400">Plan</p>
                <p className="mt-2 text-2xl font-bold text-navy">{profile?.plan ?? "Free"}</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-sm text-gray-400">Monthly limit</p>
                <p className="mt-2 text-2xl font-bold text-navy">Configurable</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-sm text-gray-400">Billing cycle</p>
                <p className="mt-2 text-2xl font-bold text-navy">Manual</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
