"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Sparkles } from "lucide-react";
import type { InsightTile, PipelineLane } from "@/lib/types";
import { formatScore } from "@/lib/utils";

type ApplicationsBoardProps = {
  lanes: PipelineLane[];
  insightTiles: InsightTile[];
};

export default function ApplicationsBoard({
  lanes,
  insightTiles,
}: ApplicationsBoardProps) {
  const [selectedLane, setSelectedLane] = useState<string>("all");

  const visibleLanes = useMemo(() => {
    if (selectedLane === "all") {
      return lanes;
    }

    return lanes.filter((lane) => lane.id === selectedLane);
  }, [lanes, selectedLane]);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedLane("all")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            selectedLane === "all"
              ? "bg-navy text-white"
              : "bg-white text-gray-500 shadow-card"
          }`}
        >
          All lanes
        </button>
        {lanes.map((lane) => (
          <button
            key={lane.id}
            onClick={() => setSelectedLane(lane.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              selectedLane === lane.id
                ? "bg-brand text-white"
                : "bg-white text-gray-500 shadow-card"
            }`}
          >
            {lane.label} ({lane.count})
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {visibleLanes.map((lane) => (
          <section key={lane.id} className="kanban-col">
            <div className="kanban-col-header">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: lane.color }}
                />
                {lane.label} ({lane.count})
              </div>
            </div>

            <div className="space-y-3">
              {lane.jobs.length === 0 ? (
                <div className="kanban-card">
                  <p className="text-sm text-gray-500">No roles in this lane yet.</p>
                </div>
              ) : null}

              {lane.jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block">
                  <div
                    className={`kanban-card ${
                      lane.id === "interview" ? "bg-navy text-white" : ""
                    }`}
                  >
                    {job.priority_label ? (
                      <span
                        className={`badge ${
                          lane.id === "interview"
                            ? "bg-brand text-white"
                            : job.priority_label.toLowerCase().includes("follow")
                              ? "badge-blue"
                              : "badge-orange"
                        }`}
                      >
                        {job.priority_label}
                      </span>
                    ) : null}

                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div>
                        <h2
                          className={`text-xl font-semibold leading-tight ${
                            lane.id === "interview" ? "text-white" : "text-navy"
                          }`}
                        >
                          {job.title}
                        </h2>
                        <p
                          className={`mt-2 text-sm font-semibold ${
                            lane.id === "interview" ? "text-white/70" : "text-brand"
                          }`}
                        >
                          {job.company} · {job.location}
                        </p>
                      </div>
                      <div
                        className={`score-ring ${
                          lane.id === "interview"
                            ? "border border-white/15 bg-white/10 text-white"
                            : ""
                        }`}
                      >
                        {job.score_label ?? formatScore(job.match_score)}
                      </div>
                    </div>

                    {job.follow_up_due ? (
                      <div
                        className={`mt-5 flex items-center gap-2 text-xs ${
                          lane.id === "interview" ? "text-white/75" : "text-orange-600"
                        }`}
                      >
                        <CalendarClock size={12} />
                        Follow-up queued
                      </div>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {insightTiles.map((tile) => (
          <div key={tile.id} className="card">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              {tile.label}
            </p>
            <p className="display-title mt-3 text-4xl font-bold text-navy">
              {tile.value}
            </p>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              {tile.description}
            </p>
          </div>
        ))}
      </div>

      <div className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
            Pipeline health
          </p>
          <div className="mt-4 flex gap-2">
            <div className="h-3 flex-[1.6] rounded-full bg-brand" />
            <div className="h-3 flex-[2.3] rounded-full bg-brand/65" />
            <div className="h-3 flex-[0.8] rounded-full bg-brand/35" />
            <div className="h-3 flex-[0.2] rounded-full bg-orange-500" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-brand">
          <Sparkles size={14} />
          Kairon prioritizes roles with stronger timing and lower review friction.
        </div>
      </div>
    </>
  );
}
