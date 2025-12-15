// app/api/farcaster/route.ts
export const runtime = "edge";

const APP_URL = "https://btc-vs-5-year-average.vercel.app";

export async function GET() {
  return Response.json({
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },
    miniapp: {
      version: "1",
      name: "BTC vs 5Y Average",
      subtitle: "Valuation in one glance",
      description:
        "Shows whether BTC is expensive, neutral, or cheap compared to the 5-year average (USD).",
      iconUrl: `${APP_URL}/icon.png`,
      homeUrl: APP_URL,
      primaryCategory: "tools",
      tags: ["bitcoin", "valuation", "analytics"],
    },
  });
}
