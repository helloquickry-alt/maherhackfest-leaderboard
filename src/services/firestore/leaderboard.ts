import {
  collection,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

/* ============================================================
   PUBLIC LEADERBOARD TYPE
============================================================ */

export type LeaderboardTeam = {
  id: string;

  teamId: string;

  teamName: string;

  teamCode: string;

  registrationId: string;

  teamLeader: string;

  college: string;

  city: string;

  state: string;

  theme: string;

  members: number;

  score: number;

  rank: number;

  evaluations: number;

  status: "LIVE" | "FINAL";
};

/* ============================================================
   RAW FIRESTORE DATA
============================================================ */

type RawData = Record<
  string,
  unknown
>;

/* ============================================================
   SAFE STRING
============================================================ */

function safeString(
  value: unknown,
): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
}

/* ============================================================
   SAFE NUMBER
============================================================ */

function safeNumber(
  value: unknown,
): number {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : 0;
  }

  if (typeof value === "string") {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  }

  return 0;
}

/* ============================================================
   SAFE MAP
============================================================ */

function safeMap(
  value: unknown,
): RawData {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as RawData;
  }

  return {};
}

/* ============================================================
   GET TEAM NAME
============================================================ */

function getTeamName(
  data: RawData,
): string {
  return (
    safeString(data.teamName) ||
    safeString(data.name) ||
    "Unnamed Team"
  );
}

/* ============================================================
   GET TEAM CODE
============================================================ */

function getTeamCode(
  data: RawData,
): string {
  return (
    safeString(data.teamCode) ||
    safeString(data.code) ||
    ""
  );
}

/* ============================================================
   GET TEAM ID
============================================================ */

function getTeamId(
  documentId: string,
  data: RawData,
): string {
  return (
    safeString(data.teamId) ||
    getTeamCode(data) ||
    safeString(
      data.registrationId,
    ) ||
    documentId
  );
}

/* ============================================================
   GET MEMBERS
============================================================ */

function getMemberCount(
  data: RawData,
): number {
  if (
    Array.isArray(
      data.teamMembers,
    )
  ) {
    return data.teamMembers.length;
  }

  if (
    Array.isArray(data.members)
  ) {
    return data.members.length;
  }

  /*
   * If admin has already stored
   * member count as a number.
   */

  if (
    typeof data.members ===
    "number"
  ) {
    return data.members;
  }

  return 0;
}

/* ============================================================
   GET SCORE
============================================================ */

function getScore(
  data: RawData,
): number {
  /*
   * Preferred public field:
   */

  if (
    data.score !== undefined
  ) {
    return safeNumber(
      data.score,
    );
  }

  /*
   * Alternative field names
   */

  if (
    data.totalScore !==
    undefined
  ) {
    return safeNumber(
      data.totalScore,
    );
  }

  if (
    data.total !== undefined
  ) {
    return safeNumber(
      data.total,
    );
  }

  return 0;
}

/* ============================================================
   GET EVALUATION COUNT
============================================================ */

function getEvaluationCount(
  data: RawData,
): number {
  if (
    data.evaluations !==
    undefined
  ) {
    return safeNumber(
      data.evaluations,
    );
  }

  if (
    data.evaluationCount !==
    undefined
  ) {
    return safeNumber(
      data.evaluationCount,
    );
  }

  if (
    data.judgeCount !==
    undefined
  ) {
    return safeNumber(
      data.judgeCount,
    );
  }

  return 0;
}

/* ============================================================
   CONVERT FIRESTORE DOCUMENT
============================================================ */

function convertLeaderboardDocument(
  documentId: string,
  data: RawData,
): LeaderboardTeam | null {
  const teamName =
    getTeamName(data);

  /*
   * Don't show invalid documents.
   */

  if (
    !teamName ||
    teamName ===
      "Unnamed Team"
  ) {
    return null;
  }

  const teamCode =
    getTeamCode(data);

  const registrationId =
    safeString(
      data.registrationId,
    );

  const teamId =
    getTeamId(
      documentId,
      data,
    );

  const teamSetup =
    safeMap(
      data.teamSetup,
    );

  const teamLeader =
    safeString(
      data.teamLeader,
    ) ||
    safeString(
      teamSetup.teamLeader,
    );

  const college =
    safeString(
      data.college,
    ) ||
    safeString(
      teamSetup.college,
    );

  const city =
    safeString(data.city) ||
    safeString(
      teamSetup.city,
    );

  const state =
    safeString(data.state) ||
    safeString(
      teamSetup.state,
    );

  const theme =
    safeString(data.theme) ||
    safeString(
      teamSetup.theme,
    );

  const score =
    getScore(data);

  const evaluations =
    getEvaluationCount(
      data,
    );

  /*
   * Status from published
   * leaderboard document.
   */

  const rawStatus =
    safeString(
      data.status,
    ).toLowerCase();

  const status =
    rawStatus === "final"
      ? "FINAL"
      : "LIVE";

  /*
   * Rank may already be
   * stored by admin.
   */

  const rank =
    safeNumber(data.rank);

  return {
    id: documentId,

    teamId,

    teamName,

    teamCode,

    registrationId,

    teamLeader,

    college,

    city,

    state,

    theme,

    members:
      getMemberCount(data),

    score,

    rank,

    evaluations,

    status,
  };
}

/* ============================================================
   SORT LEADERBOARD
============================================================ */

function sortLeaderboard(
  teams: LeaderboardTeam[],
): LeaderboardTeam[] {
  const sorted = [
    ...teams,
  ];

  /*
   * First use stored rank if
   * available.
   */

  sorted.sort(
    (a, b) => {
      if (
        a.rank > 0 &&
        b.rank > 0 &&
        a.rank !== b.rank
      ) {
        return a.rank - b.rank;
      }

      /*
       * Otherwise highest score first.
       */

      if (b.score !== a.score) {
        return b.score - a.score;
      }

      /*
       * Final tie breaker:
       * team name.
       */

      return a.teamName.localeCompare(
        b.teamName,
      );
    },
  );

  /*
   * Recalculate rank on client
   * so public board always has
   * a valid rank.
   */

  sorted.forEach(
    (team, index) => {
      team.rank =
        index + 1;
    },
  );

  return sorted;
}

/* ============================================================
   REALTIME PUBLIC LEADERBOARD
============================================================ */

export function subscribeLeaderboard(
  callback: (
    teams: LeaderboardTeam[],
  ) => void,

  onError?: (
    error: Error,
  ) => void,
): Unsubscribe {
  /*
   * IMPORTANT:
   *
   * PUBLIC WEBSITE READS ONLY:
   *
   * leaderboard
   *
   * It does NOT read:
   *
   * registrations
   * evaluations
   * judges
   * teams
   */

  const leaderboardRef =
    collection(
      db,
      "leaderboard",
    );

  const unsubscribe =
    onSnapshot(
      leaderboardRef,

      (snapshot) => {
        const teams: LeaderboardTeam[] =
          [];

        snapshot.forEach(
          (document) => {
            const data =
              document.data() as RawData;

            const team =
              convertLeaderboardDocument(
                document.id,
                data,
              );

            if (team) {
              teams.push(team);
            }
          },
        );

        const sorted =
          sortLeaderboard(
            teams,
          );

        console.log(
          "================================",
        );

        console.log(
          "PUBLIC LEADERBOARD",
        );

        console.log(
          "Collection: leaderboard",
        );

        console.log(
          "Total Teams:",
          sorted.length,
        );

        console.table(
          sorted.map(
            (team) => ({
              rank: team.rank,

              team:
                team.teamName,

              teamCode:
                team.teamCode,

              score:
                team.score,

              evaluations:
                team.evaluations,
            }),
          ),
        );

        console.log(
          "================================",
        );

        callback(sorted);
      },

      (error) => {
        console.error(
          "Public leaderboard error:",
          error,
        );

        onError?.(error);
      },
    );

  return unsubscribe;
}