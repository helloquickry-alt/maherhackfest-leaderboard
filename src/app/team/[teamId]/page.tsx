type TeamPageProps = {
  params: Promise<{
    teamId: string;
  }>;
};

export default async function TeamPage({
  params,
}: TeamPageProps) {
  const { teamId } = await params;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-zinc-500">
          Maher Hackfest 2026
        </p>

        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Team
        </h1>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Team ID
          </p>

          <p className="mt-2 break-all text-xl font-semibold">
            {teamId}
          </p>
        </div>
      </section>
    </main>
  );
}