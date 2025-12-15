// app/api/btc/route.ts
export const runtime = "edge";

export async function GET() {
  // CoinGecko: simple price
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

  const res = await fetch(url, {
    // 現在価格は少し頻繁に更新してOK
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    return Response.json({ error: "Failed to fetch BTC price" }, { status: 500 });
  }

  const data = await res.json();
  const price = data?.bitcoin?.usd;

  if (typeof price !== "number") {
    return Response.json({ error: "Unexpected price format" }, { status: 500 });
  }

  return Response.json({ price, ts: Date.now() });
}
