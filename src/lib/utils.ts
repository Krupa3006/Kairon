import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelative(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function scoreColor(score: number): string {
  if (score >= 8) return "score-high";
  if (score >= 6) return "score-mid";
  return "score-low";
}

export function formatScore(score: number): string {
  return Number.isInteger(score) ? `${score}` : score.toFixed(1);
}

export function statusBadge(status: string): string {
  const map: Record<string, string> = {
    saved: "badge-orange",
    approved: "badge-purple",
    applied: "badge-blue",
    submitted: "badge-blue",
    viewed: "badge-purple",
    response: "badge-orange",
    followed_up: "badge-orange",
    interview: "badge-green",
    offer: "badge-green",
    rejected: "badge-red",
    queued: "badge-gray",
  };
  return map[status] ?? "badge-gray";
}

export function truncate(str: string, n: number): string {
  return str.length > n ? `${str.slice(0, n - 3)}...` : str;
}
