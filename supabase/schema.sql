-- ═══════════════════════════════════════════════════════
-- Kairon — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users ──────────────────────────────────────────────
create table if not exists public.users (
  id                  uuid primary key default uuid_generate_v4(),
  email               text unique not null,
  full_name           text,
  avatar_url          text,
  telegram_id         text,
  linkedin_url        text,
  cv_text             text,
  cover_letter        text,
  job_title           text,
  location            text,
  salary_min          integer,
  salary_max          integer,
  remote_preference   text check (remote_preference in ('remote','hybrid','onsite','any')) default 'any',
  visa_required       boolean default false,
  avoid_companies     text[] default '{}',
  agent_active        boolean default false,
  plan                text check (plan in ('free','pro','premium','teams')) default 'free',
  daily_app_limit     integer default 5,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ── Job Queue ──────────────────────────────────────────
create table if not exists public.job_queue (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references public.users(id) on delete cascade,
  title                 text not null,
  company               text not null,
  company_logo          text,
  job_url               text not null,
  description           text,
  location              text,
  salary_range          text,
  job_type              text,
  source                text,
  match_score           integer check (match_score between 0 and 10),
  match_reason          text,
  status                text check (status in (
                          'saved','approved','applied','queued','applying',
                          'submitted','viewed','response','followed_up',
                          'interview','rejected','offer'
                        )) default 'queued',
  applied_at            timestamptz,
  follow_up_due         timestamptz,
  recruiter_email       text,
  tailored_cv           text,
  tailored_cover_letter text,
  posted_at             text,
  created_at            timestamptz default now()
);

alter table public.job_queue
  drop constraint if exists job_queue_status_check;

alter table public.job_queue
  add constraint job_queue_status_check
  check (status in (
    'saved','approved','applied','queued','applying',
    'submitted','viewed','response','followed_up',
    'interview','rejected','offer'
  ));

create index if not exists idx_job_queue_user_status
  on public.job_queue(user_id, status);

create index if not exists idx_job_queue_followup_due
  on public.job_queue(follow_up_due)
  where status = 'submitted';

-- ── Gmail Tokens ───────────────────────────────────────
create table if not exists public.gmail_tokens (
  user_id     uuid primary key references public.users(id) on delete cascade,
  token_data  jsonb not null,
  updated_at  timestamptz default now()
);

-- ── Follow-ups ─────────────────────────────────────────
create table if not exists public.followups (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references public.users(id) on delete cascade,
  application_id   uuid references public.job_queue(id) on delete cascade,
  type             text check (type in (
                     '7day_followup','rejection_feedback',
                     'thank_you','interview_alert'
                   )),
  sent_at          timestamptz default now(),
  reply_received   boolean default false,
  reply_content    text
);

-- ── Feedback Insights ──────────────────────────────────
create table if not exists public.feedback_insights (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references public.users(id) on delete cascade,
  application_id        uuid references public.job_queue(id) on delete cascade,
  raw_feedback          text,
  extracted_improvements text[],
  applied_to_profile    boolean default false,
  created_at            timestamptz default now()
);

-- ═══════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════

alter table public.users enable row level security;
alter table public.job_queue enable row level security;
alter table public.gmail_tokens enable row level security;
alter table public.followups enable row level security;
alter table public.feedback_insights enable row level security;

-- Users: own row only
drop policy if exists "users_own" on public.users;
create policy "users_own" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Job queue: own rows only
drop policy if exists "job_queue_own" on public.job_queue;
create policy "job_queue_own" on public.job_queue
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Gmail tokens: own row only
drop policy if exists "gmail_tokens_own" on public.gmail_tokens;
create policy "gmail_tokens_own" on public.gmail_tokens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Follow-ups: own rows only
drop policy if exists "followups_own" on public.followups;
create policy "followups_own" on public.followups
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Feedback insights: own rows only
drop policy if exists "feedback_insights_own" on public.feedback_insights;
create policy "feedback_insights_own" on public.feedback_insights
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════
-- Helper: update updated_at on users
-- ═══════════════════════════════════════════════════════
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at();

-- ═══════════════════════════════════════════════════════
-- Useful views
-- ═══════════════════════════════════════════════════════

create or replace view public.user_dashboard_stats as
select
  u.id as user_id,
  count(jq.id) filter (where jq.status != 'queued') as total_applied,
  count(jq.id) filter (where jq.status = 'interview') as interviews,
  count(jq.id) filter (where jq.status = 'offer') as offers,
  count(jq.id) filter (where jq.status = 'rejected') as rejections,
  count(jq.id) filter (where jq.status in ('submitted','followed_up')) as in_progress,
  round(
    100.0 * count(jq.id) filter (where jq.status in ('interview','offer','response'))
    / nullif(count(jq.id) filter (where jq.status != 'queued'), 0), 1
  ) as response_rate
from public.users u
left join public.job_queue jq on jq.user_id = u.id
group by u.id;
