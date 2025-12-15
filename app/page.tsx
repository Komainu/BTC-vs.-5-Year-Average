// app/page.tsx
export default async function Page() {
  const [pRes, aRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/btc`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/avg5y`, { cache: "no-store" }),
  ]);

  if (!pRes.ok || !aRes.ok) {
    return (
      <main style={{ padding: 16 }}>
        <h1>BTC Valuation</h1>
        <p>データ取得に失敗しました。しばらくして再試行してください。</p>
      </main>
    );
  }

  const { price } = await pRes.json();
  const { avg5y, days, from, to } = await aRes.json();

  const d = price / avg5y - 1;

  let label = "中立";
  if (d <= -0.2) label = "割安";
  if (d >= 0.2) label = "割高";

  const fmtUSD = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const fmtPct = (n: number) =>
    `${(n * 100).toFixed(1)}%`;

  return (
    <main style={{ padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 18, marginBottom: 8 }}>BTC vs 5Y Average</h1>

      <div style={{ fontSize: 40, fontWeight: 700, margin: "10px 0" }}>
        {label}
      </div>

      <div style={{ lineHeight: 1.8 }}>
        <div>現在価格: <b>{fmtUSD(price)}</b></div>
        <div>過去5年平均: <b>{fmtUSD(avg5y)}</b></div>
        <div>乖離: <b>{fmtPct(d)}</b></div>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
        対象期間: {from} 〜 {to}（日次 {days} 日）<br />
        5年平均＝日次価格の単純平均。投資助言ではありません。
      </div>
    </main>
  );
}
