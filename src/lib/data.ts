import { formatRelative } from "@/lib/utils";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import {
  getSupabaseAdminClient,
  getSupabaseServerClient,
} from "@/lib/supabase-server";
import { buildDemoJobSeedsForUser } from "@/lib/demo-jobs";
import type {
  ActivityItem,
  DashboardMetric,
  InboxThread,
  InsightTile,
  Job,
  PipelineLane,
  TailorSuggestion,
  UserProfile,
} from "@/lib/types";

const fallbackInsightTiles: InsightTile[] = [
  {
    id: "momentum",
    label: "Momentum",
    value: "0%",
    description: "Load jobs into the pipeline to start tracking momentum.",
  },
  {
    id: "success",
    label: "Success rate",
    value: "0%",
    description: "Interview progression appears after applications begin moving.",
  },
  {
    id: "response",
    label: "Avg. response time",
    value: "-",
    description: "Response timing is calculated once the pipeline has activity.",
  },
];

async function seedStarterPipelineForUser(userId: string) {
  const client = getSupabaseAdminClient() ?? getSupabaseServerClient();

  if (!client) {
    return false;
  }

  const { count, error: countError } = await client
    .from("job_queue")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError || (count ?? 0) > 0) {
    return false;
  }

  const { error: insertError } = await client
    .from("job_queue")
    .insert(buildDemoJobSeedsForUser(userId));

  return !insertError;
}

export const tailorSuggestions: TailorSuggestion[] = [
  {
    id: "summary",
    title: "Professional summary",
    original:
      "Senior product leader with experience across fintech and platform teams.",
    revised:
      "Product strategy leader with a track record of aligning executive teams, scaling operating cadence, and translating market shifts into platform decisions.",
    reason:
      "This rewrite keeps the claim honest while making the positioning sharper.",
  },
  {
    id: "achievement",
    title: "Leadership evidence",
    original:
      "Led a cross-functional team of 15 to launch a new payment experience.",
    revised:
      "Led a cross-functional team of 15 to launch a flagship payment experience and turn stakeholder planning into a repeatable executive review cadence.",
    reason:
      "Use this pattern to emphasize signal without inventing metrics or experience.",
  },
];

function toJobStatus(status: string): Job["status"] {
  const allowed: Job["status"][] = [
    "saved",
    "approved",
    "applied",
    "queued",
    "applying",
    "submitted",
    "viewed",
    "response",
    "followed_up",
    "interview",
    "rejected",
    "offer",
  ];

  return allowed.includes(status as Job["status"])
    ? (status as Job["status"])
    : "queued";
}

function toPipelineStage(status: Job["status"]): PipelineLane["id"] {
  if (["interview", "offer"].includes(status)) {
    return "interview";
  }

  if (["submitted", "followed_up", "response", "applied"].includes(status)) {
    return "applied";
  }

  return "saved";
}

function mapJob(row: Record<string, unknown>): Job {
  const status = toJobStatus(String(row.status ?? "queued"));
  const matchScore = Number(row.match_score ?? 0);

  return {
    id: String(row.id),
    user_id: String(row.user_id),
    title: String(row.title ?? "Untitled role"),
    company: String(row.company ?? "Unknown company"),
    company_logo: (row.company_logo as string | undefined) ?? undefined,
    job_url: String(row.job_url ?? "#"),
    description: String(row.description ?? ""),
    location: String(row.location ?? "Remote"),
    salary_range: (row.salary_range as string | undefined) ?? undefined,
    job_type: (row.job_type as string | undefined) ?? undefined,
    source: String(row.source ?? "Manual"),
    match_score: matchScore,
    score_label: `${Math.round(matchScore * 10)}%`,
    match_reason: (row.match_reason as string | undefined) ?? undefined,
    status,
    stage: toPipelineStage(status),
    priority_label:
      status === "interview"
        ? "Interview active"
        : row.follow_up_due
          ? "Follow-up due"
          : status === "saved"
            ? "New lead"
            : undefined,
    follow_up_due: (row.follow_up_due as string | undefined) ?? undefined,
    applied_at: (row.applied_at as string | undefined) ?? undefined,
    posted_at: (row.posted_at as string | undefined) ?? undefined,
    recruiter_email: (row.recruiter_email as string | undefined) ?? undefined,
    tailored_cv: (row.tailored_cv as string | undefined) ?? undefined,
    tailored_cover_letter:
      (row.tailored_cover_letter as string | undefined) ?? undefined,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

function buildMetrics(profile: UserProfile | null, jobs: Job[]): DashboardMetric[] {
  const submittedCount = jobs.filter((job) =>
    ["applied", "submitted", "followed_up", "response", "interview", "offer"].includes(job.status),
  ).length;
  const pendingCount = jobs.filter((job) => job.stage === "saved").length;

  return [
    {
      label: "New matches",
      value: String(pendingCount),
      detail:
        pendingCount > 0
          ? `${pendingCount} roles are waiting for review.`
          : "No fresh matches yet. Use the demo seed or import your first jobs.",
    },
    {
      label: "Applications sent",
      value: String(submittedCount),
      detail:
        profile?.agent_active
          ? "Agent is active and ready for the next wave."
          : "Agent is paused until you switch it on.",
    },
    {
      label: "Pending approvals",
      value: String(pendingCount).padStart(2, "0"),
      detail:
        pendingCount > 0
          ? "Review these before launching the next batch."
          : "The approval queue is currently clear.",
    },
  ];
}

function buildActivity(jobs: Job[]): ActivityItem[] {
  return jobs.slice(0, 4).map((job) => ({
    id: job.id,
    title:
      job.status === "interview"
        ? `${job.company} moved this role into interview`
        : `${job.company} is now ${job.status.replace("_", " ")}`,
    detail: job.match_reason ?? "Kairon tracked this role in your active pipeline.",
    time: formatRelative(job.created_at),
    kind:
      job.status === "interview"
        ? "interview"
        : job.follow_up_due
          ? "followup"
          : "application",
  }));
}

function buildPipelineLanes(jobs: Job[]): PipelineLane[] {
  const savedJobs = jobs.filter((job) => job.stage === "saved");
  const appliedJobs = jobs.filter((job) => job.stage === "applied");
  const interviewJobs = jobs.filter((job) => job.stage === "interview");

  return [
    {
      id: "saved",
      label: "Saved",
      count: savedJobs.length,
      description: "Fresh roles waiting for approval.",
      color: "#E88B3C",
      jobs: savedJobs,
    },
    {
      id: "applied",
      label: "Applied",
      count: appliedJobs.length,
      description: "Submitted roles with active follow-up cycles.",
      color: "#2563EB",
      jobs: appliedJobs,
    },
    {
      id: "interview",
      label: "Interview",
      count: interviewJobs.length,
      description: "Processes that need prep and momentum.",
      color: "#1B1A58",
      jobs: interviewJobs,
    },
  ];
}

function buildInboxThreads(jobs: Job[]): InboxThread[] {
  return jobs
    .filter((job) =>
      ["interview", "followed_up", "response", "rejected"].includes(job.status),
    )
    .slice(0, 6)
    .map((job) => ({
      id: job.id,
      company: job.company,
      role: job.title,
      subject:
        job.status === "interview"
          ? `Interview update from ${job.company}`
          : job.status === "rejected"
            ? `Feedback from ${job.company}`
            : `Follow-up thread for ${job.company}`,
      preview:
        job.match_reason ??
        "This pipeline event can be connected to Gmail later for full inbox sync.",
      state:
        job.status === "interview"
          ? "interview"
          : job.status === "rejected"
            ? "feedback"
            : "followup",
      received_at: job.applied_at ?? job.created_at,
    }));
}

export async function getJobsForCurrentUser() {
  const user = await requireUser();
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("job_queue")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  let rows = data ?? [];

  if (rows.length === 0) {
    const seeded = await seedStarterPipelineForUser(user.id);

    if (seeded) {
      const { data: seededRows } = await supabase
        .from("job_queue")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      rows = seededRows ?? [];
    }
  }

  return rows.map((row) => mapJob(row));
}

export async function getJobForCurrentUser(jobId: string) {
  const user = await requireUser();
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("job_queue")
    .select("*")
    .eq("user_id", user.id)
    .eq("id", jobId)
    .single();

  return data ? mapJob(data) : null;
}

export async function getAppData() {
  const profile = await getCurrentProfile();
  const jobs = await getJobsForCurrentUser();

  return {
    profile,
    jobs,
    dashboardMetrics: buildMetrics(profile, jobs),
    dashboardActivity: buildActivity(jobs),
    pipelineLanes: buildPipelineLanes(jobs),
    inboxThreads: buildInboxThreads(jobs),
    insightTiles: fallbackInsightTiles,
  };
}
