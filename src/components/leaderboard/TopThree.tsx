"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Crown,
  Trophy,
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

export default function TopThree({
  teams,
}: {
  teams: Team[];
}) {
  const first = teams[0];
  const second = teams[1];
  const third = teams[2];

  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:items-end">
      <PodiumCard
        team={second}
        position="2"
        className="lg:order-1"
        delay={0.15}
      />

      <PodiumCard
        team={first}
        position="1"
        winner
        className="lg:order-2"
        delay={0}
      />

      <PodiumCard
        team={third}
        position="3"
        className="lg:order-3"
        delay={0.3}
      />
    </div>
  );
}

function PodiumCard({
  team,
  position,
  winner = false,
  className = "",
  delay = 0,
}: {
  team?: Team;
  position: string;
  winner?: boolean;
  className?: string;
  delay?: number;
}) {
  if (!team) {
    return null;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.7,
        delay,
      }}
    >
      <Link
        href={`/team/${team.id}`}
        className={`group relative block overflow-hidden rounded-3xl border ${
          winner
            ? "border-white/20 bg-white/[0.075]"
            : "border-white/10 bg-white/[0.025]"
        } p-6 backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:border-white/30 ${className}`}
      >
        {/* Winner animated glow */}
        {winner && (
          <>
            <motion.div
              className="absolute -inset-20 rounded-full bg-white/[0.04] blur-3xl"
              animate={{
                scale: [0.8, 1.15, 0.8],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.07]"
              animate={{
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <Crown size={17} />
            </motion.div>
          </>
        )}

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-bold tracking-[0.25em] text-white/25">
                RANK
              </p>

              <motion.p
                className="mt-1 text-6xl font-black tracking-tight"
                animate={
                  winner
                    ? {
                        opacity: [0.7, 1, 0.7],
                      }
                    : undefined
                }
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              >
                {position}
              </motion.p>
            </div>

            <motion.div
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035]"
              animate={
                winner
                  ? {
                      y: [0, -5, 0],
                    }
                  : undefined
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
            >
              <Trophy
                size={17}
                className="text-white/50"
              />
            </motion.div>
          </div>

          <div className="mt-12">
            <p className="text-[9px] font-bold tracking-[0.2em] text-white/25">
              TEAM
            </p>

            <h3 className="mt-2 text-2xl font-bold tracking-tight">
              {team.name}
            </h3>

            <p className="mt-2 text-xs text-white/30">
              {team.code} • {team.theme}
            </p>
          </div>

          <div className="mt-8 flex items-end justify-between border-t border-white/[0.08] pt-5">
            <div>
              <p className="text-[8px] font-bold tracking-[0.2em] text-white/25">
                SCORE
              </p>

              <motion.p
                className="mt-1 text-3xl font-black"
                animate={
                  winner
                    ? {
                        scale: [1, 1.035, 1],
                      }
                    : undefined
                }
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              >
                {team.score.toFixed(2)}
              </motion.p>
            </div>

            <ArrowUpRight
              size={18}
              className="text-white/25 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}