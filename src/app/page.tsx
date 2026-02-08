export default function Home() {
  const statCategories = [
    {
      title: "200+ Stats",
      description: "Every metric from basic box scores to advanced analytics like Corsi, xG, and WAR.",
    },
    {
      title: "Sort & Filter",
      description: "Click any column to sort. Stack filters. Share your view via URL.",
    },
    {
      title: "Player Compare",
      description: "Side-by-side radar charts and stat tables for 2\u20135 players.",
    },
    {
      title: "Team Dashboards",
      description: "Rolling trends, lineup stats, special teams breakdowns.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Deep Sports Analytics
          <br />
          <span className="text-accent">for Everyone</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-text-secondary">
          Every stat imaginable, sortable by anything, with beautiful data
          visualization. Starting with the NHL.
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="/nhl/players"
            className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Explore NHL Stats
          </a>
          <a
            href="/nhl/compare"
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-bg-hover"
          >
            Compare Players
          </a>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCategories.map((cat) => (
          <div
            key={cat.title}
            className="rounded-lg border border-border bg-bg-card p-6 transition-colors hover:bg-bg-hover"
          >
            <h3 className="text-lg font-semibold">{cat.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">
              {cat.description}
            </p>
          </div>
        ))}
      </section>

      {/* Placeholder stat preview */}
      <section className="mt-24">
        <div className="rounded-lg border border-border bg-bg-card p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">NHL Scoring Leaders</h2>
            <span className="text-sm text-text-secondary">2025\u201326 Season</span>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary">
                  <th className="pb-3 pr-4 font-medium">Player</th>
                  <th className="pb-3 pr-4 font-medium">Team</th>
                  <th className="pb-3 pr-4 text-right font-medium">GP</th>
                  <th className="pb-3 pr-4 text-right font-medium">G</th>
                  <th className="pb-3 pr-4 text-right font-medium">A</th>
                  <th className="pb-3 pr-4 text-right font-medium">P</th>
                  <th className="pb-3 text-right font-medium">+/-</th>
                </tr>
              </thead>
              <tbody className="font-tabular">
                {[
                  { name: "Loading...", team: "---", gp: "--", g: "--", a: "--", p: "--", pm: "--" },
                  { name: "Loading...", team: "---", gp: "--", g: "--", a: "--", p: "--", pm: "--" },
                  { name: "Loading...", team: "---", gp: "--", g: "--", a: "--", p: "--", pm: "--" },
                  { name: "Loading...", team: "---", gp: "--", g: "--", a: "--", p: "--", pm: "--" },
                  { name: "Loading...", team: "---", gp: "--", g: "--", a: "--", p: "--", pm: "--" },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 transition-colors hover:bg-bg-hover"
                  >
                    <td className="py-3 pr-4 font-medium">{row.name}</td>
                    <td className="py-3 pr-4 text-text-secondary">{row.team}</td>
                    <td className="py-3 pr-4 text-right">{row.gp}</td>
                    <td className="py-3 pr-4 text-right">{row.g}</td>
                    <td className="py-3 pr-4 text-right">{row.a}</td>
                    <td className="py-3 pr-4 text-right font-semibold">{row.p}</td>
                    <td className="py-3 text-right">{row.pm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-sm text-text-secondary">
            Live data coming soon &mdash; connect the NHL API to see real stats
          </p>
        </div>
      </section>
    </div>
  );
}
