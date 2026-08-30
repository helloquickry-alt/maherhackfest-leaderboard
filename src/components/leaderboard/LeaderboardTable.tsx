"use client";

import LeaderboardRow from "./LeaderboardRow";

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

export default function LeaderboardTable({
  teams,
}: {
  teams: Team[];
}) {
  if (teams.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
        <p className="text-sm font-semibold">
          No teams found
        </p>

        <p className="mt-2 text-xs text-white/25">
          Try another team name, ID or theme.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
      {/* Desktop header */}
      <div className="hidden grid-cols-[80px_minmax(220px,1fr)_180px_110px_100px] gap-4 border-b border-white/[0.08] px-6 py-4 text-[9px] font-bold tracking-[0.2em] text-white/25 md:grid">
        <span>RANK</span>
        <span>TEAM</span>
        <span>THEME</span>
        <span>STATUS</span>
        <span className="text-right">
          SCORE
        </span>
      </div>

      <div>
        {teams.map((team) => (
          <LeaderboardRow
            key={team.id}
            team={team}
          />
        ))}
      </div>
    </div>
  );
}