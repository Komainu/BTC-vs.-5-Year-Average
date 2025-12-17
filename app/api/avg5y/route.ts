export const runtime = "nodejs";

const UA = "btc-vs-5y-average/1.0 (vercel)";

// 5年 ≒ 1826日（うるう年考慮で少し多め）
const DAYS = 1826;

async function fetchJson(url: string) {
  const r = await fetch(url, {
    headers: { "User-Agent": UA, "Accept": "application/json" },
    cache: "no-store",
  });
  const text = await r.text();
  return { ok: r.ok, status: r.status, text };
}

export async function GET() {
  try {
    // CoinGecko: BTCの過去N日（USD）の価格配列を返す
    // 返却形式: { prices: [[ms, price], ...], ... }
    const url =
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart` +
      `?vs_currency=usd&days=${DAYS}&interval=daily`;

    const { ok, status, text } = await fetchJson(url);

    if (!ok) {
      return Response.json(
        { error: "Failed to fetch 5y range", status, body: text.slice(0, 300) },
        { status: 200 }
      );
    }

    const data = JSON.parse(text) as { prices?: [number, number][] };

    const prices = Array.isArray(data.prices) ? data.prices : [];
    if (prices.length < 300) {
      return Response.json(
        { error: "Not enough price points", count: prices.length },
        { status: 200 }
      );
    }

    const values = prices.map((p) => p[1]).filter((v) => Number.isFinite(v));
    const sum = values.reduce((a, b) => a + b, 0);
    const avg5y = sum / values.length;

    const fromMs = prices[0][0];
    const toMs = prices[prices.length - 1][0];

    const toISO = (ms: number) => new Date(ms).toISOString().slice(0, 10);

    return Response.json({
      avg5y: Number(avg5y.toFixed(2)),
      days: values.length,
      from: toISO(fromMs),
      to: toISO(toMs),
      source: "coingecko market_chart daily"
    });
  } catch (e: any) {
    return Response.json(
      { error: "avg5y exception", message: String(e?.message ?? e) },
      { status: 200 }
    );
  }
}
