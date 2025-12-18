// app/layout.tsx
export const metadata = {
  other: {
    "base:app_id": "693df31bd19763ca26ddc296",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
