import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile-form';
import { requireAuth } from '@/lib/roles';

export default async function ProfilePage() {
  const user = await requireAuth('/profile');

  const userData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    paymentMethod: user.paymentMethod,
    address: user.address as
      | {
          line1?: string;
          line2?: string;
          city?: string;
          state?: string;
          postalCode?: string;
          country?: string;
        }
      | undefined,
  };

  return (
    <div className="container mx-auto px-4">
      <ProfileForm user={userData} />
    </div>
  );
}
