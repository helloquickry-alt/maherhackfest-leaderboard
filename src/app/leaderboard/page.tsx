"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  subscribeLeaderboard,
  type LeaderboardTeam,
} from "@/services/firestore/leaderboard";

/* ============================================================
   PAGE
============================================================ */

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<LeaderboardTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Team IDs currently celebrating.
   *
   * Array is used instead of a single ID so that if multiple
   * teams move upward in the same realtime update, every team
   * can celebrate independently.
   */
  const [celebratingTeamIds, setCelebratingTeamIds] =
    useState<string[]>([]);

  /*
   * Previous ranking snapshot.
   */
  const previousRanksRef = useRef<
    Record<string, number>
  >({});

  /* ==========================================================
     REALTIME FIREBASE
  ========================================================== */

  useEffect(() => {
    const unsubscribe = subscribeLeaderboard(
      (data) => {
        setTeams(data);
        setLoading(false);
        setError("");
      },
      (firebaseError) => {
        console.error(
          "Public leaderboard error:",
          firebaseError,
        );

        setLoading(false);
        setError(
          "Unable to load live leaderboard.",
        );
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  /* ==========================================================
     SORT TEAMS
  ========================================================== */

  const rankedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const scoreA = Number(a.score ?? 0);
      const scoreB = Number(b.score ?? 0);

      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }

      const evaluationsA = Number(
        a.evaluations ?? 0,
      );

      const evaluationsB = Number(
        b.evaluations ?? 0,
      );

      if (evaluationsA !== evaluationsB) {
        return evaluationsB - evaluationsA;
      }

      return String(
        a.teamName ?? "",
      ).localeCompare(
        String(b.teamName ?? ""),
      );
    });
  }, [teams]);

  /* ==========================================================
     DETECT RANK IMPROVEMENT
  ========================================================== */

  useEffect(() => {
    if (rankedTeams.length === 0) {
      return;
    }

    const previousRanks =
      previousRanksRef.current;

    const improvedTeams: string[] = [];

    rankedTeams.forEach(
      (team, index) => {
        const currentRank = index + 1;
        const previousRank =
          previousRanks[team.id];

        /*
         * Don't celebrate initial page load.
         *
         * We only celebrate when an already-known team
         * actually moves upward.
         */
        if (
          previousRank !== undefined &&
          currentRank < previousRank
        ) {
          improvedTeams.push(team.id);
        }
      },
    );

    /*
     * Save current ranking snapshot.
     */

    const nextRanks: Record<
      string,
      number
    > = {};

    rankedTeams.forEach(
      (team, index) => {
        nextRanks[team.id] = index + 1;
      },
    );

    previousRanksRef.current = nextRanks;

    /*
     * Trigger celebration.
     */

    if (improvedTeams.length === 0) {
      return;
    }

    setCelebratingTeamIds(improvedTeams);

    const timer = window.setTimeout(() => {
      setCelebratingTeamIds([]);
    }, 2800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [rankedTeams]);

  /* ==========================================================
     TOP THREE
  ========================================================== */

  const topThree = rankedTeams.slice(0, 3);

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const evaluatedTeams = useMemo(() => {
    return rankedTeams.filter(
      (team) =>
        Number(team.evaluations ?? 0) > 0,
    ).length;
  }, [rankedTeams]);

  const totalEvaluations = useMemo(() => {
    return rankedTeams.reduce(
      (total, team) =>
        total +
        Number(team.evaluations ?? 0),
      0,
    );
  }, [rankedTeams]);

  const topScore =
    rankedTeams.length > 0
      ? formatScore(rankedTeams[0].score)
      : "—";

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return <LoadingScreen />;
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {
    return <ErrorScreen message={error} />;
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <main className="leaderboard-page">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="site-header">
        <div className="site-header-inner">
          <a
            href="/"
            className="site-brand"
          >
            <span className="site-brand-icon">
              🏆
            </span>

            <span className="site-brand-text">
              <strong>
                MAHERHACKFEST
              </strong>

              <small>
                2026
              </small>
            </span>
          </a>

          <nav className="desktop-nav">
            <a href="/">
              Home
            </a>

            <a
              href="/leaderboard"
              className="active"
            >
              Leaderboard
            </a>

            <a href="/results">
              Results
            </a>

            <a href="/about">
              About
            </a>
          </nav>

          <div className="header-live">
            <span className="live-dot" />

            <span>
              LIVE
            </span>
          </div>
        </div>
      </header>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="hero">
        <div className="hero-content">
          <div className="live-badge">
            <span>◉</span>

            <span>
              LEADERBOARD LIVE
            </span>
          </div>

          {/* ==================================================
              MAHERHACKFEST BRAND
          ================================================== */}

          <div className="main-brand">
            <h1>
              <span className="maher-word">
                MAHER
              </span>

              <span className="hackfest-word">
                HACKFEST
              </span>
            </h1>

            <div className="brand-year">
              2 0 2 6
            </div>
          </div>

          <p className="hero-description">
            Ideas. Innovation. Impact.
            <br />
            Watch the rankings unfold in
            real time.
          </p>

          <div className="hero-actions">
            <a
              href="#rankings"
              className="primary-button"
            >
              <span>
                VIEW LIVE LEADERBOARD
              </span>

              <span className="button-arrow">
                →
              </span>
            </a>

            <a
              href="/results"
              className="secondary-button"
            >
              FINAL RESULTS
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================
          STATS
      ====================================================== */}

      <section className="stats-section">
        <div className="stats-card">
          <StatItem
            label="TOTAL TEAMS"
            value={rankedTeams.length}
          />

          <StatItem
            label="EVALUATED"
            value={evaluatedTeams}
          />

          <StatItem
            label="EVALUATIONS"
            value={totalEvaluations}
          />

          <StatItem
            label="TOP SCORE"
            value={topScore}
          />
        </div>
      </section>

      {/* ======================================================
          LIVE STATUS
      ====================================================== */}

      <div className="live-message">
        <span className="live-message-dot" />

        <span>
          LIVE EVALUATION IN PROGRESS
        </span>
      </div>

      {/* ======================================================
          TOP THREE
      ====================================================== */}

      {topThree.length > 0 && (
        <section className="top-three-section">
          <div className="section-heading">
            <span>
              LEADING TEAMS
            </span>

            <h2>
              Current Leaders
            </h2>
          </div>

          <div className="top-three-grid">
            {topThree.map(
              (team, index) => (
                <TopThreeCard
                  key={team.id}
                  team={team}
                  position={index + 1}
                  celebrating={celebratingTeamIds.includes(
                    team.id,
                  )}
                />
              ),
            )}
          </div>
        </section>
      )}

      {/* ======================================================
          ALL RANKINGS
      ====================================================== */}

      <section
        id="rankings"
        className="rankings-section"
      >
        <div className="section-heading ranking-heading">
          <div>
            <span>
              OFFICIAL STANDINGS
            </span>

            <h2>
              All Teams
            </h2>
          </div>

          <small>
            {rankedTeams.length} TEAMS
          </small>
        </div>

        <div className="ranking-table">
          {/* HEADER */}

          <div className="ranking-header">
            <span>
              RANK
            </span>

            <span>
              TEAM
            </span>

            <span>
              COLLEGE
            </span>

            <span>
              SCORE
            </span>
          </div>

          {/* BODY */}

          {rankedTeams.length === 0 ? (
            <EmptyLeaderboard />
          ) : (
            rankedTeams.map(
              (team, index) => (
                <LeaderboardRow
                  key={team.id}
                  team={team}
                  rank={index + 1}
                  celebrating={celebratingTeamIds.includes(
                    team.id,
                  )}
                />
              ),
            )
          )}
        </div>
      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="site-footer">
        <span>
          MAHERHACKFEST 2026
        </span>

        <span>
          OFFICIAL LIVE RANKING SYSTEM
        </span>
      </footer>
    </main>
  );
}

/* ============================================================
   STAT ITEM
============================================================ */

function StatItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="stat-item">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

/* ============================================================
   TOP THREE CARD
============================================================ */

function TopThreeCard({
  team,
  position,
  celebrating,
}: {
  team: LeaderboardTeam;
  position: number;
  celebrating: boolean;
}) {
  const positionText =
    position === 1
      ? "01 / CHAMPION"
      : position === 2
        ? "02 / RUNNER UP"
        : "03 / TOP 3";

  return (
    <article
      className={[
        "top-card",
        `top-card-${position}`,
        celebrating
          ? "team-celebration"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="top-card-header">
        <span>
          {positionText}
        </span>

        {position === 1 && (
          <b>
            LEADER
          </b>
        )}
      </div>

      <div className="position-number">
        {position}
      </div>

      <div className="top-card-info">
        <h3>
          {team.teamName ||
            "Unnamed Team"}
        </h3>

        <p>
          {team.college ||
            "College not available"}
        </p>
      </div>

      <div className="top-card-bottom">
        <div>
          <span>
            AVERAGE SCORE
          </span>

          <strong>
            {formatScore(team.score)}
          </strong>
        </div>

        <small>
          {Number(
            team.evaluations ?? 0,
          )}{" "}
          JUDGE EVAL
        </small>
      </div>
    </article>
  );
}

/* ============================================================
   RANKING ROW
============================================================ */

function LeaderboardRow({
  team,
  rank,
  celebrating,
}: {
  team: LeaderboardTeam;
  rank: number;
  celebrating: boolean;
}) {
  const isTopThree = rank <= 3;

  return (
    <div
      className={[
        "ranking-row",
        isTopThree
          ? "ranking-top-three"
          : "",
        celebrating
          ? "team-celebration"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* RANK */}

      <div className="rank-cell">
        <span>
          {String(rank).padStart(2, "0")}
        </span>

        {rank === 1 && (
          <i className="rank-indicator" />
        )}
      </div>

      {/* TEAM */}

      <div className="team-cell">
        <strong>
          {team.teamName ||
            "Unnamed Team"}
        </strong>

        <small>
          {team.teamCode ||
            team.teamId ||
            "TEAM"}
        </small>
      </div>

      {/* COLLEGE */}

      <div className="college-cell">
        {team.college || "—"}
      </div>

      {/* SCORE */}

      <div className="score-cell">
        <strong>
          {formatScore(team.score)}
        </strong>

        <small>
          {Number(
            team.evaluations ?? 0,
          )}{" "}
          EVAL
        </small>
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY
============================================================ */

function EmptyLeaderboard() {
  return (
    <div className="empty-leaderboard">
      <div>
        —
      </div>

      <p>
        NO RANKINGS AVAILABLE
      </p>
    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function LoadingScreen() {
  return (
    <main className="screen-state">
      <div className="loading-box">
        <span className="loading-dot" />

        <p>
          LOADING LIVE LEADERBOARD
        </p>
      </div>
    </main>
  );
}

/* ============================================================
   ERROR
============================================================ */

function ErrorScreen({
  message,
}: {
  message: string;
}) {
  return (
    <main className="screen-state">
      <div className="error-box">
        <span>
          !
        </span>

        <small>
          CONNECTION ERROR
        </small>

        <h1>
          Leaderboard unavailable
        </h1>

        <p>
          {message}
        </p>
      </div>
    </main>
  );
}

/* ============================================================
   SCORE FORMAT
============================================================ */

function formatScore(
  value: number,
): string {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return "0";
  }

  if (Number.isInteger(score)) {
    return String(score);
  }

  return score.toFixed(2);
}