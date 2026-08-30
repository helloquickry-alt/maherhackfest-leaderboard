export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
      <div className="w-full max-w-md text-center">

        <div className="mb-6 text-xs font-bold tracking-[0.3em] text-white/25">
          MAHERHACKFEST 2026
        </div>

        <h1 className="text-7xl font-bold tracking-tight">
          404
        </h1>

        <h2 className="mt-4 text-xl font-semibold text-white/80">
          Page Not Found
        </h2>

        <p className="mt-3 text-sm leading-6 text-white/35">
          The page you're looking for doesn't
          exist or may have been moved.
        </p>

        <a
          href="/"
          className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90"
        >
          Back to Home
        </a>

      </div>
    </main>
  );
}