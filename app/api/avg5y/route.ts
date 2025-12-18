export const runtime = "nodejs";

const DAYS = 1826;
const UA = "btc-vs-5y-average/1.0 (vercel)";

export async function GET() {
  try {
    // CryptoCompare: 日次の終値(close)を返す
    // limit=2000 で5年分をカバー
    const url =
      `https://min-api.cryptocompare.com/data/v2/histoday` +
      `?fsym=BTC&tsym=USD&limit=2000`;

    const r = await fetch(url, {
      headers: { "User-Agent": UA, "Accept": "application/json" },
      cache: "no-store",
    });

    const text = await r.text();
    if (!r.ok) {
      return Response.json(
        { error: "Failed to fetch 5y range", status: r.status, body: text.slice(0, 300) },
        { status: 200 }
      );
    }

    const data = JSON.parse(text) as any;
    const arr: any[] = data?.Data?.Data ?? [];

    if (!Array.isArray(arr) || arr.length < 300) {
      return Response.json({ error: "Not enough data", count: arr?.length ?? 0 }, { status: 200 });
    }

    // 最新から DAYS 分を切り出し（念のため）
    const sliced = arr.slice(-DAYS);

    const closes = sliced.map((d) => Number(d.close)).filter((v) => Number.isFinite(v) && v > 0);
    const sum = closes.reduce((a, b) => a + b, 0);
    const avg5y = sum / closes.length;

    const from = new Date(sliced[0].time * 1000).toISOString().slice(0, 10);
    const to = new Date(sliced[sliced.length - 1].time * 1000).toISOString().slice(0, 10);

    return Response.json({
      avg5y: Number(avg5y.toFixed(2)),
      days: closes.length,
      from,
      to,
      source: "cryptocompare histoday close"
    });
  } catch (e: any) {
    return Response.json(
      { error: "avg5y exception", message: String(e?.message ?? e) },
      { status: 200 }
    );
  }
}
