import {
  ActivityItem,
  DashboardMetric,
  InboxThread,
  InsightTile,
  Job,
  PipelineLane,
  PricingTier,
  TailorSuggestion,
  UserProfile,
} from "@/lib/types";

export const userProfile: UserProfile = {
  id: "alex-morgan",
  email: "alex@kairon.ai",
  full_name: "Alex Morgan",
  first_name: "Alex",
  last_name: "Morgan",
  initials: "AM",
  plan: "Executive",
  role_focus: "Product, operations, and growth leadership",
  linkedin_url: "https://linkedin.com/in/alexmorgan",
  job_title: "Senior Product Strategist",
  location: "London, UK",
  salary_min: 180000,
  salary_max: 320000,
  remote_preference: "hybrid",
  avoid_companies: ["Meta", "Amazon"],
  agent_active: true,
  created_at: "2026-04-08T08:00:00Z",
};

export const jobs: Job[] = [
  {
    id: "director-product-strategy",
    user_id: userProfile.id,
    title: "Director of Product Strategy",
    company: "Stripe",
    company_logo: "https://logo.clearbit.com/stripe.com",
    job_url: "https://stripe.com/jobs",
    description:
      "Own strategic pipeline planning across platform products and partner closely with operations, finance, and go-to-market leaders.",
    location: "Seattle",
    salary_range: "$240k - $285k",
    job_type: "Full-time",
    source: "LinkedIn",
    match_score: 9.4,
    score_label: "94%",
    match_reason:
      "Strong operating cadence experience, board-level communication, and cross-functional product strategy depth.",
    status: "saved",
    stage: "saved",
    priority_label: "New lead",
    company_note: "Freshly posted and aligned with Alex's executive strategy signal.",
    posted_at: "2026-04-08T06:10:00Z",
    created_at: "2026-04-08T06:15:00Z",
  },
  {
    id: "head-of-operations",
    user_id: userProfile.id,
    title: "Head of Operations",
    company: "Figma",
    company_logo: "https://logo.clearbit.com/figma.com",
    job_url: "https://figma.com/careers",
    description:
      "Lead planning systems, executive reporting, and operational rhythm across a scaling product organization.",
    location: "San Francisco",
    salary_range: "$230k - $270k",
    job_type: "Full-time",
    source: "Wellfound",
    match_score: 9.1,
    score_label: "91%",
    match_reason:
      "Excellent overlap in executive operating models, team leadership, and growth-stage planning systems.",
    status: "applied",
    stage: "applied",
    priority_label: "Follow-up due",
    follow_up_due: "2026-04-10T08:00:00Z",
    applied_at: "2026-04-06T14:00:00Z",
    posted_at: "2026-04-06T07:00:00Z",
    created_at: "2026-04-06T13:40:00Z",
  },
  {
    id: "senior-director-engineering",
    user_id: userProfile.id,
    title: "Senior Director of Engineering",
    company: "GitHub",
    company_logo: "https://logo.clearbit.com/github.com",
    job_url: "https://github.com/about/careers",
    description:
      "Guide strategy for a distributed engineering org with strong product and platform collaboration.",
    location: "Remote",
    salary_range: "$275k - $330k",
    job_type: "Full-time",
    source: "Direct",
    match_score: 9.8,
    score_label: "Round 3",
    match_reason:
      "Leadership brand, executive presence, and distributed operating experience map directly to the mandate.",
    status: "interview",
    stage: "interview",
    interviewer: "Mina Alvarez",
    interview_at: "2026-04-09T07:00:00Z",
    applied_at: "2026-04-03T10:30:00Z",
    posted_at: "2026-04-03T06:00:00Z",
    created_at: "2026-04-03T08:00:00Z",
  },
  {
    id: "vp-growth-marketing",
    user_id: userProfile.id,
    title: "VP Growth Marketing",
    company: "Linear",
    company_logo: "https://logo.clearbit.com/linear.app",
    job_url: "https://linear.app/careers",
    description:
      "Own executive growth strategy and connect product insight to go-to-market systems.",
    location: "Remote",
    salary_range: "$210k - $250k",
    job_type: "Full-time",
    source: "LinkedIn",
    match_score: 8.8,
    score_label: "88%",
    match_reason:
      "Strong strategic narrative and category-building work; slight gap on pure paid-growth depth.",
    status: "saved",
    stage: "saved",
    company_note: "Review recommended before approval.",
    posted_at: "2026-04-08T04:30:00Z",
    created_at: "2026-04-08T05:00:00Z",
  },
  {
    id: "chief-financial-officer",
    user_id: userProfile.id,
    title: "Chief Financial Officer",
    company: "Vercel",
    company_logo: "https://logo.clearbit.com/vercel.com",
    job_url: "https://vercel.com/careers",
    description:
      "Partner with product and operating leaders to drive strategic planning, forecasting, and board readiness.",
    location: "Hybrid",
    salary_range: "$260k - $320k",
    job_type: "Full-time",
    source: "Indeed",
    match_score: 8.4,
    score_label: "84%",
    match_reason:
      "Strategic planning is strong, but this role leans more finance-heavy than the current profile emphasis.",
    status: "applied",
    stage: "applied",
    applied_at: "2026-04-05T11:00:00Z",
    posted_at: "2026-04-05T05:00:00Z",
    created_at: "2026-04-05T06:15:00Z",
  },
  {
    id: "chief-operating-officer",
    user_id: userProfile.id,
    title: "Chief Operating Officer",
    company: "ScaleUp Partners",
    company_logo: "https://logo.clearbit.com/scalefast.com",
    job_url: "https://example.com/jobs/coo",
    description:
      "Build operating rhythm, leadership systems, and execution visibility for a high-growth scale-up.",
    location: "New York",
    salary_range: "$300k + equity",
    job_type: "Full-time",
    source: "Board search",
    match_score: 9.8,
    score_label: "9.8/10",
    match_reason:
      "Board-facing strategy, systems leadership, and hyper-growth readiness make this an elite fit.",
    status: "applied",
    stage: "applied",
    applied_at: "2026-04-07T08:00:00Z",
    posted_at: "2026-04-07T05:30:00Z",
    created_at: "2026-04-07T06:00:00Z",
  },
  {
    id: "director-growth-marketing",
    user_id: userProfile.id,
    title: "Director of Growth Marketing",
    company: "Omnia Global",
    company_logo: "https://logo.clearbit.com/omnigroup.com",
    job_url: "https://example.com/jobs/growth",
    description:
      "Drive executive growth initiatives with a data-led testing culture across product and lifecycle teams.",
    location: "Remote (US)",
    salary_range: "$210k - $250k",
    job_type: "Full-time",
    source: "LinkedIn",
    match_score: 8.9,
    score_label: "8.9/10",
    match_reason:
      "Network adjacency and broad strategic growth leadership offset a narrower direct acquisition background.",
    status: "approved",
    stage: "saved",
    posted_at: "2026-04-08T02:00:00Z",
    created_at: "2026-04-08T02:30:00Z",
  },
  {
    id: "senior-product-strategist",
    user_id: userProfile.id,
    title: "Senior Product Strategist",
    company: "Global FinTech Solutions",
    company_logo: "https://logo.clearbit.com/plaid.com",
    job_url: "https://example.com/jobs/product-strategist",
    description:
      "Shape platform strategy, coordinate executive stakeholders, and translate market signals into roadmap decisions.",
    location: "New York (Remote)",
    salary_range: "$220k - $260k",
    job_type: "Full-time",
    source: "Exec board",
    match_score: 9.0,
    score_label: "Priority match",
    match_reason:
      "The role values strategy execution, executive briefings, and regulatory nuance already present in the profile.",
    status: "approved",
    stage: "saved",
    posted_at: "2026-04-08T05:45:00Z",
    created_at: "2026-04-08T05:50:00Z",
  },
];

export const pipelineLanes: PipelineLane[] = [
  {
    id: "saved",
    label: "Saved",
    count: 8,
    description: "Fresh high-fit opportunities waiting for approval.",
    color: "#E88B3C",
    jobs: jobs.filter((job) => job.stage === "saved").slice(0, 3),
  },
  {
    id: "applied",
    label: "Applied",
    count: 12,
    description: "Recently shipped applications with active follow-up timers.",
    color: "#2563EB",
    jobs: jobs.filter((job) => job.stage === "applied").slice(0, 3),
  },
  {
    id: "interview",
    label: "Interview",
    count: 3,
    description: "Processes with concrete momentum and prep needs.",
    color: "#1B1A58",
    jobs: jobs.filter((job) => job.stage === "interview").slice(0, 1),
  },
];

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "New matches",
    value: "12",
    detail: "3 high-velocity roles landed in the last hour.",
    accent: "brand",
  },
  {
    label: "Applications sent",
    value: "24",
    detail: "Target: 40 this month",
    accent: "navy",
  },
  {
    label: "Pending approvals",
    value: "08",
    detail: "Review now for today's next wave.",
    accent: "warning",
  },
];

export const dashboardActivity: ActivityItem[] = [
  {
    id: "signal-1",
    title: "6 new jobs posted in the last 3 hours",
    detail: "Kairon scanned premium boards and re-ranked the pipeline.",
    time: "just now",
    kind: "signal",
  },
  {
    id: "apply-1",
    title: "COO application shipped to ScaleUp Partners",
    detail: "Tailored summary emphasized board prep and operating cadence.",
    time: "52m ago",
    kind: "application",
  },
  {
    id: "followup-1",
    title: "Follow-up draft ready for Figma",
    detail: "Due in 2 days. Suggested tone: concise and executive.",
    time: "1h ago",
    kind: "followup",
  },
  {
    id: "interview-1",
    title: "GitHub round 3 confirmed",
    detail: "Prep brief assembled with interviewer signals and company talking points.",
    time: "3h ago",
    kind: "interview",
  },
];

export const insightTiles: InsightTile[] = [
  {
    id: "momentum",
    label: "Momentum",
    value: "82%",
    description: "Your profile is matching with unusually strong velocity this week.",
  },
  {
    id: "success",
    label: "Success rate",
    value: "12.4%",
    description: "Interview progression per approved application.",
  },
  {
    id: "response",
    label: "Avg. response time",
    value: "14d",
    description: "Median time from apply to meaningful reply.",
  },
];

export const inboxThreads: InboxThread[] = [
  {
    id: "github",
    company: "GitHub",
    role: "Senior Director of Engineering",
    subject: "Round 3 prep and availability",
    preview: "We would love to move you forward and align on the final conversation.",
    state: "interview",
    received_at: "2026-04-08T05:15:00Z",
  },
  {
    id: "figma",
    company: "Figma",
    role: "Head of Operations",
    subject: "Checking in on your application",
    preview: "We are still reviewing and expect to share an update early next week.",
    state: "followup",
    received_at: "2026-04-08T03:00:00Z",
  },
  {
    id: "vercel",
    company: "Vercel",
    role: "Chief Financial Officer",
    subject: "Thanks for taking the time",
    preview: "We went in a different direction, but we appreciate the clarity of your story.",
    state: "feedback",
    received_at: "2026-04-07T18:30:00Z",
  },
];

export const tailorSuggestions: TailorSuggestion[] = [
  {
    id: "summary",
    title: "Professional summary",
    original:
      "Senior product leader with experience across fintech and platform teams.",
    revised:
      "Product strategy leader with a track record of aligning executive teams, scaling operating cadence, and translating market shifts into platform decisions.",
    reason: "Pulled executive strategy language directly from the role brief without inventing new experience.",
  },
  {
    id: "achievement",
    title: "Leadership evidence",
    original:
      "Led a cross-functional team of 15 to launch a new payment experience.",
    revised:
      "Led a cross-functional team of 15 to launch a flagship payment experience and turned stakeholder planning into a repeatable executive review cadence.",
    reason: "Keeps the original achievement while emphasizing strategic operating impact.",
  },
  {
    id: "skills",
    title: "Skills map",
    original: "Product Strategy, Agile, SaaS, Team Leadership",
    revised:
      "Product Strategy, Market Expansion, Regulatory Compliance, Executive Briefings, Team Leadership",
    reason: "Reordered and highlighted only capabilities already supported elsewhere in the profile.",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "Free",
    subtitle: "For focused explorers",
    cta: "Start for free",
    href: "/signup",
    features: [
      "24 job scans a day",
      "Basic CV tailoring",
      "Limited applications",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    subtitle: "The 3-hour timing advantage",
    cta: "Get your first matches",
    href: "/signup?plan=pro",
    highlight: true,
    badge: "Most popular",
    features: [
      "3x real-time scanning",
      "Priority access",
      "Unlimited honest tailoring",
      "Follow-up assistant",
    ],
  },
  {
    name: "Executive",
    price: "$99",
    subtitle: "Concierge strategy command",
    cta: "Go executive",
    href: "/signup?plan=executive",
    features: [
      "AI prep features",
      "Dedicated career strategy sessions",
      "Early trial deploys for invited roles",
    ],
  },
];

export const dashboardStats = {
  total_applied: 24,
  interviews: 3,
  in_progress: 12,
  offers: 0,
  response_rate: 12.4,
  interview_rate: 8.3,
  jobs_applied_today: 6,
  follow_ups_sent: 2,
};

export function getJobById(id: string) {
  return jobs.find((job) => job.id === id);
}
