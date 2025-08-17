
import { env } from '@/src/env';

export default function StatusPage() {
  return (
    <main>
      <h2>Status</h2>
      <ul>
        <li>NODE_ENV: {env.NODE_ENV}</li>
        <li>DATABASE_URL set: {Boolean(env.DATABASE_URL).toString()}</li>
        <li>NEXT_RUNTIME: edge/server depends on route</li>
      </ul>
    </main>
  );
}
