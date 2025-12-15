// app/layout.tsx
export const metadata = {
  other: {
    "base:app_id": "ここに新規AppのApp IDを入れる",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
