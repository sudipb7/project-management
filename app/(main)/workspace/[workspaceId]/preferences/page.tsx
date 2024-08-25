import React from 'react';
import { notFound, redirect } from 'next/navigation';

import { currentUser, getUserWorkspaces } from '@/lib/api';
import { WorkspacePreferences } from '@/components/cards/workspace-preferences';

interface WorkspacePreferencesPageProps {
  params: {
    workspaceId: string;
  };
}

export const metadata = {
  title: 'Workspace Preferences',
};

export default async function WorkspacePreferencesPage({ params }: WorkspacePreferencesPageProps) {
  const user = await currentUser();
  if (!user) {
    return redirect('/sign-in');
  }

  const workspaces = await getUserWorkspaces(user.id, { includeMembers: true });
  if (!workspaces) {
    return redirect('/onboarding');
  }

  const workspace = workspaces.find((workspace: any) => workspace.id === params.workspaceId);
  if (!workspace) {
    notFound();
  }

  const members = workspace.members;
  const admins = members.filter((member: any) => member.role === 'ADMIN');
  const isMember = members.find((member: any) => member.userId === user.id);
  const isAdmin = admins.some((admin: any) => admin.userId === user.id);

  if (!isMember) {
    return notFound();
  }

  return (
    <div className='mx-auto w-full max-w-xl lg:max-w-2xl xl:max-w-4xl flex-1 pb-4 pt-2'>
      <h1 className='text-lg md:text-xl font-bold tracking-wide'>Workspace Preferences</h1>
      <WorkspacePreferences
        user={user}
        admins={admins}
        members={members}
        isAdmin={isAdmin}
        workspaces={workspaces}
        currentWorkspace={workspace}
      />
    </div>
  );
}
