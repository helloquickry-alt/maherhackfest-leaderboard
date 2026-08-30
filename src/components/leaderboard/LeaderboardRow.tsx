"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Users,
} from "lucide-react";

type Team = {
  id: string;
  rank: number;
  name: string;
  code: string;
  theme: string;
  score: number;
  members: number;
  status: "LIVE" | "FINAL";
};

export default function LeaderboardRow({
  team,
}: {
  team: Team;
}) {
  const topRank = team.rank <= 3;

  return (
    <Link
      href={`/team/${team.id}`}
      className="group block border-b border-white/[0.06] last:border-b-0"
    >
      {/* Desktop */}
      <div className="hidden min-h-[82px] grid-cols-[80px_minmax(220px,1fr)_180px_110px_100px] items-center gap-4 px-6 transition hover:bg-white/[0.035] md:grid">
        <div>
          <span
            className={`text-xl font-black ${
              topRank
                ? "text-white"
                : "text-white/25"
            }`}
          >
            {String(team.rank).padStart(2, "0")}
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold">
              {team.name
                .slice(0, 1)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {team.name}
              </p>

              <p className="mt-1 text-[10px] text-white/25">
                {team.code}
              </p>
            </div>
          </div>
        </div>

        <div className="truncate text-xs text-white/35">
          {team.theme}
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1.5 text-[8px] font-bold tracking-[0.15em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {team.status}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3">
          <span className="text-lg font-black">
            {team.score.toFixed(2)}
          </span>

          <ArrowUpRight
            size={15}
            className="text-white/20 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex items-center gap-4 px-4 py-5 transition hover:bg-white/[0.035] md:hidden">
        <div className="w-9 shrink-0 text-center">
          <span
            className={`text-lg font-black ${
              topRank
                ? "text-white"
                : "text-white/25"
            }`}
          >
            {String(team.rank).padStart(2, "0")}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold">
            {team.name
              .slice(0, 1)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {team.name}
            </p>

            <div className="mt-1 flex items-center gap-2 text-[9px] text-white/25">
              <span>{team.code}</span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <Users size={9} />
                {team.members}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-black">
            {team.score.toFixed(2)}
          </p>

          <p className="mt-1 text-[8px] font-bold tracking-[0.15em] text-white/25">
            {team.status}
          </p>
        </div>
      </div>
    </Link>
  );
}