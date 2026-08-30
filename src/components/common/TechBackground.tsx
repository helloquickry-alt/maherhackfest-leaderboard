"use client";

import { motion } from "framer-motion";

const binaryColumns = Array.from(
  { length: 22 },
  (_, index) => ({
    id: index,
    left: `${index * 4.8 + 1}%`,
    delay: (index % 7) * 0.7,
    duration: 8 + (index % 5) * 2,
  }),
);

const particles = Array.from(
  { length: 28 },
  (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    top: `${(index * 61) % 100}%`,
    delay: (index % 8) * 0.5,
    duration: 3 + (index % 5),
  }),
);

export default function TechBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-[#030305]" />

      {/* Top radial glow */}
      <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[70rem] -translate-x-1/2 rounded-full bg-white/[0.045] blur-[120px]" />

      {/* Purple glow */}
      <motion.div
        className="absolute left-[-15rem] top-[20%] h-[30rem] w-[30rem] rounded-full bg-violet-600/[0.07] blur-[130px]"
        animate={{
          x: [0, 100, 0],
          y: [0, -60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Cyan glow */}
      <motion.div
        className="absolute right-[-15rem] top-[35%] h-[32rem] w-[32rem] rounded-full bg-cyan-500/[0.06] blur-[140px]"
        animate={{
          x: [0, -100, 0],
          y: [0, 70, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Moving grid line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-white/10"
        animate={{
          top: ["0%", "100%"],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Binary rain */}
      <div className="absolute inset-x-0 top-0 h-[70vh] overflow-hidden opacity-[0.08]">
        {binaryColumns.map((column) => (
          <motion.div
            key={column.id}
            className="absolute top-[-180px] whitespace-pre text-[11px] font-mono leading-6 text-cyan-300"
            style={{
              left: column.left,
            }}
            initial={{
              y: -200,
            }}
            animate={{
              y: "110vh",
            }}
            transition={{
              duration: column.duration,
              delay: column.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {Array.from(
              { length: 24 },
              (_, index) =>
                `${(index + column.id) % 2}\n`,
            )}
          </motion.div>
        ))}
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-white/50 shadow-[0_0_12px_rgba(255,255,255,0.5)]"
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -35, 0],
            x: [0, 12, 0],
            opacity: [0.15, 0.7, 0.15],
            scale: [0.7, 1.3, 0.7],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Corner tech circles */}
      <motion.div
        className="absolute -left-32 top-1/3 h-64 w-64 rounded-full border border-violet-400/[0.08]"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute -right-40 top-1/2 h-80 w-80 rounded-full border border-cyan-300/[0.07]"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,.8) 4px)",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,.72)_100%)]" />
    </div>
  );
}