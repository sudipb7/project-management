import { redirect } from 'next/navigation';

import { currentUser, getUserWorkspaces } from '@/lib/api';
import Onboarding from '@/components/onboarding';

export const metadata = {
  title: 'Onboarding',
};

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) {
    return redirect('/sign-in');
  }

  const userWorkspaces = await getUserWorkspaces(user.id);
  if (!userWorkspaces) {
    return redirect('/');
  }

  return <Onboarding user={user} />;
}
