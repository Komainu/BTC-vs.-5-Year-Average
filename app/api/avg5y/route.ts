// app/api/avg5y/route.ts
export const runtime = "edge";

function unixSeconds(d: Date) {
  return Math.floor(d.getTime() / 1000);
}

export async function GET() {
  // 「今日から5年前」(うるう年等も自然に吸収される)
  const to = new Date();
  const from = new Date(to);
  from.setFullYear(to.getFullYear() - 5);

  // CoinGecko: market_chart/range は [timestamp, price] 配列が返る
  const url =
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range` +
    `?vs_currency=usd&from=${unixSeconds(from)}&to=${unixSeconds(to)}`;

  const res = await fetch(url, {
    // 5年平均は頻繁に変わらない → 1日キャッシュで十分
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) {
    return Response.json({ error: "Failed to fetch 5y range" }, { status: 500 });
  }

  const data = await res.json();
  const prices: [number, number][] = data?.prices;

  if (!Array.isArray(prices) || prices.length < 100) {
    return Response.json({ error: "Unexpected historical format" }, { status: 500 });
  }

  // 返り値は細かい間隔の点が混ざることがあるので、
  // 「日ごとに1点だけ使う」(最初に現れた日付の点を採用) で安定化
  const seen = new Set<string>();
  let sum = 0;
  let count = 0;

  for (const [tsMs, price] of prices) {
    if (typeof tsMs !== "number" || typeof price !== "number") continue;

    const dayKey = new Date(tsMs).toISOString().slice(0, 10); // YYYY-MM-DD
    if (seen.has(dayKey)) continue;
    seen.add(dayKey);

    sum += price;
    count += 1;
  }

  const avg5y = sum / count;

  return Response.json({
    avg5y,
    days: count,
    updatedAt: Date.now(),
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  });
}
