import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProfileForm } from '@/components/profile-form';

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return redirect('/auth/signin?callbackUrl=/profile');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return redirect('/auth/signin?callbackUrl=/profile');
  }

  const userData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    paymentMethod: user.paymentMethod,
    address: user.address as {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    } | null,
  };

  return (
    <div className="container mx-auto px-4">
      <ProfileForm user={userData} />
    </div>
  );
}
