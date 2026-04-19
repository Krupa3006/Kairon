import Link from "next/link";
import { MapPin, Clock, Shield } from "lucide-react";
import { Job } from "@/lib/types";
import {
  formatRelative,
  formatScore,
  scoreColor,
  statusBadge,
  truncate,
} from "@/lib/utils";

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="card hover:shadow-card-hover transition-all cursor-pointer group">
        <div className="flex items-start gap-3">
          {/* Company logo */}
          <div className="w-10 h-10 rounded-lg bg-surface border border-surface-border flex items-center justify-center flex-shrink-0 overflow-hidden">
            {job.company_logo ? (
              <img src={job.company_logo} alt={job.company} className="w-full h-full object-contain p-1" />
            ) : (
              <span className="text-sm font-bold text-gray-400">
                {job.company[0]}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-brand transition-colors leading-tight">
                  {job.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{job.company}</p>
              </div>
              <div className={`score-ring flex-shrink-0 ${scoreColor(job.match_score)}`}>
                {formatScore(job.match_score)}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {job.location && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={11} /> {job.location}
                </span>
              )}
              {job.posted_at && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={11} /> {formatRelative(job.posted_at)}
                </span>
              )}
              {job.salary_range && (
                <span className="text-xs font-medium text-gray-600">
                  {job.salary_range}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className={`badge ${statusBadge(job.status)}`}>
                {job.status}
              </span>
              <span className="badge badge-gray">{job.source}</span>
              {job.match_score >= 8 && (
                <span className="badge badge-orange">Top match</span>
              )}
              <span className="honesty-badge ml-auto flex-shrink-0">
                <Shield size={9} /> Honest AI
              </span>
            </div>

            {job.match_reason && (
              <p className="text-xs text-gray-400 mt-2 italic">
                {truncate(job.match_reason, 80)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
