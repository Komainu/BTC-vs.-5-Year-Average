// app/.well-known/farcaster.json/route.ts
export const runtime = "edge";

const APP_URL = "https://btc-vs-5-year-average.vercel.app";

export async function GET() {
  // TODO: base.dev/preview?tab=account で作った accountAssociation をここに貼る
  const accountAssociation = {
    header: "",
    payload: "",
    signature: "",
  };

  const manifest = {
    accountAssociation,
    miniapp: {
      version: "1",
      name: "BTC vs 5Y Average",
      subtitle: "Valuation in one glance",
      description: "Shows whether BTC is expensive/neutral/cheap vs the 5-year average (USD).",
      iconUrl: `${APP_URL}/icon.png`,
      // screenshotUrls は可能なら入れる（後で /public に置けばOK）
      screenshotUrls: [`${APP_URL}/screenshot.png`],
      homeUrl: APP_URL,
      primaryCategory: "tools",
      tags: ["bitcoin", "analytics", "valuation", "base"],
      // なくても動きますが、埋め込み品質が上がるので推奨
      ogTitle: "BTC vs 5Y Average",
      ogDescription: "BTC valuation vs 5-year average in USD.",
      ogImageUrl: `${APP_URL}/og.png`,
    },
  };

  return Response.json(manifest);
}
