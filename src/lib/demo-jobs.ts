type DemoJobSeed = {
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
  match_reason: string;
  status: string;
  applied_at?: string;
  follow_up_due?: string;
  recruiter_email?: string;
  tailored_cv?: string;
  tailored_cover_letter?: string;
  posted_at?: string;
};

export const demoJobSeeds: DemoJobSeed[] = [
  {
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
    match_score: 9,
    match_reason:
      "Strong operating cadence experience, board-level communication, and cross-functional product strategy depth.",
    status: "saved",
    posted_at: new Date().toISOString(),
  },
  {
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
    match_score: 9,
    match_reason:
      "Excellent overlap in executive operating models, team leadership, and growth-stage planning systems.",
    status: "submitted",
    applied_at: new Date().toISOString(),
    follow_up_due: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    posted_at: new Date().toISOString(),
  },
  {
    title: "Senior Director of Engineering",
    company: "GitHub",
    company_logo: "https://logo.clearbit.com/github.com",
    job_url: "https://github.com/about/careers",
    description:
      "Guide strategy for a distributed engineering organization with strong product and platform collaboration.",
    location: "Remote",
    salary_range: "$275k - $330k",
    job_type: "Full-time",
    source: "Direct",
    match_score: 10,
    match_reason:
      "Leadership brand, executive presence, and distributed operating experience map directly to the mandate.",
    status: "interview",
    applied_at: new Date().toISOString(),
    posted_at: new Date().toISOString(),
  },
];
