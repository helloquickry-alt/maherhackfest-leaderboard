export const siteConfig = {
  name: "MAHERHACKFEST 2026",

  shortName: "MAHERHACKFEST",

  tagline:
    "Think. Build. Innovate. Compete.",

  description:
    "Live leaderboard and official results for MAHERHACKFEST 2026.",

  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000",

  navigation: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
    },
    {
      label: "Results",
      href: "/results",
    },
    {
      label: "Awards",
      href: "/awards",
    },
    {
      label: "About",
      href: "/about",
    },
  ],

  footer: {
    copyright:
      "© 2026 MAHERHACKFEST. All rights reserved.",

    text:
      "Built for innovators, creators and problem solvers.",
  },
} as const;