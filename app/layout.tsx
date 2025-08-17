
export const metadata = {
  title: 'Halbon SaaS Template',
  description: 'Vercel-ready SaaS starter'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>{children}</body>
    </html>
  );
}
