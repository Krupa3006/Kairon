"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  Sparkles,
  Inbox,
  Settings,
  Search,
  LogOut,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { UserProfile } from "@/lib/types";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/applications", icon: KanbanSquare, label: "Applications" },
  { href: "/tailor-studio", icon: Sparkles, label: "Tailor Studio" },
  { href: "/inbox", icon: Inbox, label: "Inbox" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ profile }: { profile: UserProfile | null }) {
  const path = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      router.push("/login");
      router.refresh();
      return;
    }

    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/dashboard" className="block">
          <p className="text-white text-[22px] font-bold leading-none display-title">
            Kairon
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-white/45">
            Strategic mode
          </p>
        </Link>
      </div>

      {/* Agent status pill */}
      <div className="px-4 pt-4 pb-2">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
        >
          <span className="status-dot live" />
          <span className="text-xs font-semibold text-emerald-400">
            Strategic scan live
          </span>
          <span className="ml-auto text-xs text-emerald-400/60">3h lead</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Workspace
        </p>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href} className={`nav-item ${active ? "active" : ""}`}>
              <Icon size={17} className="nav-icon flex-shrink-0" />
              <span>{label}</span>
              {active && (
                <ChevronRight size={14} className="ml-auto opacity-40" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-3">
        <Link href="/jobs" className="mx-2 mb-2 btn btn-primary justify-center">
          <Search size={16} />
          New Search
        </Link>
        <Link href="/inbox" className="nav-item">
          <HelpCircle size={17} />
          <span>Help</span>
        </Link>
        <button className="nav-item w-full text-left" onClick={handleLogout}>
          <LogOut size={17} />
          <span>Logout</span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-2 rounded-lg bg-white/5">
          <div className="w-7 h-7 rounded-full bg-brand/40 flex items-center justify-center text-white text-xs font-bold">
            {profile?.initials ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">
              {profile?.full_name ?? "New User"}
            </p>
            <p className="text-white/40 text-[10px] truncate">
              {profile?.plan ?? "Free"} plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
