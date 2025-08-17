
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <h1>Halbon SaaS Template</h1>
      <p>Vercel-ready Next.js starter with Prisma, Zod env, and Renovate.</p>
      <ul>
        <li><Link href="/api/healthz">API: /api/healthz</Link></li>
        <li><Link href="/status">Status page</Link></li>
      </ul>
    </main>
  );
}
