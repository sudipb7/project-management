import React from 'react';
import { redirect } from 'next/navigation';

import SideNavigation from '@/components/navigation';
import { currentUser, getUserWorkspaces } from '@/lib/api';
import { WorkspaceHeader } from '@/components/workspace-header';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) {
    return redirect('/sign-in');
  }

  const userWorkSpaces = await getUserWorkspaces(user.id);
  if (!userWorkSpaces) {
    return redirect('/onboarding');
  }

  return (
    <div className='relative'>
      <SideNavigation />
      <div className='relative md:pl-64 min-h-screen w-full'>
        <WorkspaceHeader user={user} />
        <main className='p-4'>{children}</main>
      </div>
    </div>
  );
}
