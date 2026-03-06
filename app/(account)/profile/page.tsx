import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return redirect('/auth/signin');
  }

  const user = session.user;

  return (
    <div>
      <h1>Profile</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
