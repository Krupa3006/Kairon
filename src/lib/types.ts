export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  initials?: string;
  plan?: string;
  role_focus?: string;
  telegram_id?: string;
  linkedin_url?: string;
  cv_text?: string;
  cover_letter?: string;
  job_title?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  remote_preference?: "remote" | "hybrid" | "onsite" | "any";
  visa_required?: boolean;
  avoid_companies?: string[];
  agent_active?: boolean;
  created_at: string;
};

export type JobStatus =
  | "saved"
  | "approved"
  | "applied"
  | "queued"
  | "applying"
  | "submitted"
  | "viewed"
  | "response"
  | "followed_up"
  | "interview"
  | "rejected"
  | "offer";

export type Job = {
  id: string;
  user_id: string;
  title: string;
  company: string;
  company_logo?: string;
  job_url: string;
  description: string;
  location: string;
  salary_range?: string;
  job_type?: string;
  source: string;
  match_score: number;
  score_label?: string;
  match_reason?: string;
  status: JobStatus;
  stage?: "saved" | "applied" | "interview" | "offer";
  priority_label?: string;
  company_note?: string;
  interviewer?: string;
  interview_at?: string;
  applied_at?: string;
  follow_up_due?: string;
  recruiter_email?: string;
  tailored_cv?: string;
  tailored_cover_letter?: string;
  posted_at?: string;
  created_at: string;
};

export type FollowUp = {
  id: string;
  user_id: string;
  application_id: string;
  type: "7day_followup" | "rejection_feedback" | "thank_you" | "interview_alert";
  sent_at: string;
  reply_received?: boolean;
  reply_content?: string;
};

export type FeedbackInsight = {
  id: string;
  user_id: string;
  application_id: string;
  raw_feedback: string;
  extracted_improvements: string[];
  applied_to_profile: boolean;
  created_at: string;
};

export type DashboardStats = {
  total_applied: number;
  interviews: number;
  in_progress: number;
  offers: number;
  response_rate: number;
  interview_rate: number;
  jobs_applied_today: number;
  follow_ups_sent: number;
};

export type KanbanColumn = {
  id: string;
  label: string;
  color: string;
  jobs: Job[];
};

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
  accent?: "navy" | "brand" | "success" | "warning";
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  kind: "search" | "application" | "followup" | "interview" | "signal";
};

export type PipelineLane = {
  id: "saved" | "applied" | "interview";
  label: string;
  count: number;
  description: string;
  color: string;
  jobs: Job[];
};

export type InsightTile = {
  id: string;
  label: string;
  value: string;
  description: string;
};

export type InboxThread = {
  id: string;
  company: string;
  role: string;
  subject: string;
  preview: string;
  state: "interview" | "feedback" | "followup";
  received_at: string;
};

export type TailorSuggestion = {
  id: string;
  title: string;
  original: string;
  revised: string;
  reason: string;
};

export type PricingTier = {
  name: string;
  price: string;
  subtitle: string;
  cta: string;
  href: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
};
