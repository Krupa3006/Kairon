"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import JobCard from "@/components/JobCard";
import type { Job } from "@/lib/types";

const statusFilters = ["All", "Saved", "Applied", "Interview", "Approved"];
const sourceFilters = ["All sources", "LinkedIn", "Wellfound", "Indeed", "Direct", "Manual"];

export default function JobsListView({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [source, setSource] = useState("All sources");
  const [minScore, setMinScore] = useState(7);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (
        query &&
        !`${job.title} ${job.company}`.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }

      if (status !== "All" && job.status !== status.toLowerCase()) {
        return false;
      }

      if (source !== "All sources" && job.source !== source) {
        return false;
      }

      if (job.match_score < minScore) {
        return false;
      }

      return true;
    });
  }, [jobs, minScore, query, source, status]);

  return (
    <>
      <div className="card">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="input pl-11"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search companies, roles, or strategic themes"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setStatus(filter)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  status === filter
                    ? "bg-brand text-white"
                    : "bg-surface text-gray-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-surface-border pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <SlidersHorizontal size={15} />
            Min score
          </div>
          {[7, 8, 9].map((value) => (
            <button
              key={value}
              onClick={() => setMinScore(value)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                minScore === value ? "bg-navy text-white" : "bg-surface text-gray-600"
              }`}
            >
              {value}+
            </button>
          ))}
          <select
            className="input ml-auto max-w-[180px] py-2 text-sm"
            value={source}
            onChange={(event) => setSource(event.target.value)}
          >
            {sourceFilters.map((filter) => (
              <option key={filter}>{filter}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="card">
          <div className="flex items-center gap-3 text-brand">
            <Sparkles size={16} />
            <p className="text-sm font-semibold">No jobs match the current filters.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </>
  );
}
