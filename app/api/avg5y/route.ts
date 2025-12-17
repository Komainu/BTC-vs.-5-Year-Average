export const runtime = "nodejs";

const UA = "btc-vs-5y-average/1.0 (vercel)";

async function fetchWithDebug(url: string) {
  const r = await fetch(url, {
    headers: { "User-Agent": UA, "Accept": "application/json" },
    cache: "no-store",
  });
  const text = await r.text(); // JSONでもまず text で取る（パース失敗を見える化）
  return { ok: r.ok, status: r.status, text };
}

export async function GET() {
  try {
    // ここ：あなたが使っている「5年レンジ取得URL」を入れる
    const url = "<<<YOUR_5Y_RANGE_URL_HERE>>>";

    const { ok, status, text } = await fetchWithDebug(url);
    if (!ok) {
      return Response.json(
        { error: "Failed to fetch 5y range", status, body: text.slice(0, 300) },
        { status: 200 }
      );
    }

    // ここ：text を JSON にして avg5y を計算
    const data = JSON.parse(text);

    // TODO: data から日次価格配列を作り avg を算出
    const avg5y = 0; // <- 実装に合わせる

    return Response.json({ avg5y, days: 0, from: "", to: "" });
  } catch (e: any) {
    return Response.json(
      { error: "avg5y exception", message: String(e?.message ?? e) },
      { status: 200 }
    );
  }
}
