import { headers } from "next/headers";

export const dynamic = "force-dynamic";

function getOrigin() {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL;
  if (explicit && explicit.startsWith("http")) return explicit.replace(/\/$/, "");

  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;

  return "https://btc-vs-5-year-average.vercel.app";
}

export default async function Page() {
  const origin = getOrigin();

  const [pRes, aRes] = await Promise.all([
    fetch(`${origin}/api/btc`, { cache: "no-store" }),
    fetch(`${origin}/api/avg5y`, { cache: "no-store" }),
  ]);

  if (!pRes.ok || !aRes.ok) {
    return (
      <main style={{ padding: 16, fontFamily: "system-ui" }}>
        <h1>BTC Valuation</h1>
        <p>Failed to fetch data. Please try again later.</p>
        <hr />
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          <div>origin: {origin}</div>
          <div>/api/btc status: {pRes.status}</div>
          <div>/api/avg5y status: {aRes.status}</div>
        </div>
      </main>
    );
  }

  const { price } = await pRes.json();
  const { avg5y, days, from, to } = await aRes.json();

  const d = price / avg5y - 1;

  let label = "Fair Value";
  if (d <= -0.2) label = "Undervalued";
  if (d >= 0.2) label = "Overvalued";

  const fmtUSD = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <main style={{ padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 18, marginBottom: 8 }}>BTC vs 5Y Average</h1>

      <div style={{ fontSize: 40, fontWeight: 700, margin: "10px 0" }}>
        {label}
      </div>

      <div style={{ lineHeight: 1.8 }}>
        <div>Current Price: <b>{fmtUSD(price)}</b></div>
        <div>5-Year Average: <b>{fmtUSD(avg5y)}</b></div>
        <div>Deviation: <b>{fmtPct(d)}</b></div>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
        Period: {from} – {to} ({days} daily data points)<br />
        The 5-year average is calculated as the simple average of daily prices.
        This is not investment advice.
      </div>
    </main>
  );
}
