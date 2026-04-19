import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  getSupabaseAdminClient,
  getSupabaseServerClient,
} from "@/lib/supabase-server";
import type { UserProfile } from "@/lib/types";

function splitName(fullName: string | null | undefined) {
  const value = fullName?.trim() ?? "";

  if (!value) {
    return { firstName: "", lastName: "" };
  }

  const [firstName, ...rest] = value.split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

function getInitials(fullName: string | null | undefined) {
  const value = fullName?.trim() ?? "";

  if (!value) {
    return "U";
  }

  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatNameFromEmail(email: string | null | undefined) {
  const value = email?.split("@")[0]?.replace(/[._-]+/g, " ").trim() ?? "";

  if (!value) {
    return "New User";
  }

  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function deriveFullName(user: User) {
  return (
    (user.user_metadata.full_name as string | undefined) ??
    (user.user_metadata.name as string | undefined) ??
    formatNameFromEmail(user.email)
  );
}

function mapProfileRow(row: Record<string, unknown>): UserProfile {
  const fullName = (row.full_name as string | null | undefined) ?? "";
  const { firstName, lastName } = splitName(fullName);

  return {
    id: String(row.id),
    email: String(row.email ?? ""),
    full_name: fullName || "New User",
    first_name: firstName,
    last_name: lastName,
    initials: getInitials(fullName || String(row.email ?? "User")),
    avatar_url: (row.avatar_url as string | undefined) ?? undefined,
    linkedin_url: (row.linkedin_url as string | undefined) ?? undefined,
    telegram_id: (row.telegram_id as string | undefined) ?? undefined,
    cover_letter: (row.cover_letter as string | undefined) ?? undefined,
    cv_text: (row.cv_text as string | undefined) ?? undefined,
    job_title: (row.job_title as string | undefined) ?? undefined,
    location: (row.location as string | undefined) ?? undefined,
    salary_min: (row.salary_min as number | undefined) ?? undefined,
    salary_max: (row.salary_max as number | undefined) ?? undefined,
    remote_preference:
      (row.remote_preference as UserProfile["remote_preference"]) ?? "any",
    visa_required: Boolean(row.visa_required),
    avoid_companies: (row.avoid_companies as string[] | undefined) ?? [],
    agent_active: Boolean(row.agent_active),
    plan: ((row.plan as string | undefined) ?? "free").replace(/^./, (value) =>
      value.toUpperCase(),
    ),
    role_focus:
      (row.job_title as string | undefined) ??
      "Strategic profile still being configured",
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

function buildFallbackProfile(user: User): UserProfile {
  const fullName = deriveFullName(user);
  const { firstName, lastName } = splitName(fullName);

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: fullName,
    first_name: firstName,
    last_name: lastName,
    initials: getInitials(fullName),
    avatar_url: (user.user_metadata.avatar_url as string | undefined) ?? undefined,
    linkedin_url: undefined,
    telegram_id: undefined,
    cover_letter: undefined,
    cv_text: undefined,
    job_title: undefined,
    location: undefined,
    salary_min: undefined,
    salary_max: undefined,
    remote_preference: "any",
    visa_required: false,
    avoid_companies: [],
    agent_active: false,
    plan: "Free",
    role_focus: "Strategic profile still being configured",
    created_at: new Date().toISOString(),
  };
}

export async function getCurrentUser() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function ensureUserProfile(user: User) {
  const fullName = deriveFullName(user);
  const payload = {
    id: user.id,
    email: user.email,
    full_name: fullName,
    avatar_url: (user.user_metadata.avatar_url as string | undefined) ?? null,
    plan: "free",
  };

  const supabase = getSupabaseServerClient();

  if (supabase) {
    const { error: upsertError } = await supabase
      .from("users")
      .upsert(payload, { onConflict: "id" });

    if (!upsertError) {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        return mapProfileRow(data);
      }
    }
  }

  const admin = getSupabaseAdminClient();

  if (admin) {
    const { error: adminUpsertError } = await admin
      .from("users")
      .upsert(payload, { onConflict: "id" });

    if (!adminUpsertError) {
      const { data } = await admin
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        return mapProfileRow(data);
      }
    }
  }

  return buildFallbackProfile(user);
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return ensureUserProfile(user);
}
