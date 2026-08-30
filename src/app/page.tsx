import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">

      <section className="flex min-h-screen items-center justify-center px-6">

        <div className="w-full max-w-4xl text-center">

          <p className="mb-5 text-[10px] font-bold tracking-[0.35em] text-white/25">
            MAHERHACKFEST 2026
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Live Leaderboard
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/35 sm:text-base">
            Follow the live rankings, team scores
            and official results of
            MAHERHACKFEST 2026.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/leaderboard"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90"
            >
              View Leaderboard
            </Link>

            <Link
              href="/results"
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/[0.05] hover:text-white"
            >
              View Results
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}