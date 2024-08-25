import { redirect } from 'next/navigation';

import { SideNavigationList } from './navigation-list';
import { SideNavigationHeader } from './navigation-header';
import { currentUser, getUserWorkspaces } from '@/lib/api';
import { UserDropdownMenu } from '../user-dropdown-menu';

export default async function SideNavigation() {
  const user = await currentUser();
  if (!user) {
    return redirect('/sign-in');
  }

  const workspaces = await getUserWorkspaces(user.id, { includeMembers: true });
  if (!workspaces) {
    return redirect('/sign-in');
  }

  const comboboxData = workspaces.map((workspace: any) => ({
    value: workspace.id,
    label: workspace.name,
    ...workspace,
  }));

  return (
    <div className='border-r bg-background hidden md:block w-64 fixed inset-y-0 left-0 z-30 pb-3'>
      <div className='flex h-full max-h-screen flex-col gap-2'>
        <SideNavigationHeader data={comboboxData} />
        <div className='flex-1'>
          <SideNavigationList user={user} workspaces={workspaces} />
        </div>
        <div className='px-2'>
          <UserDropdownMenu user={user} />
        </div>
      </div>
    </div>
  );
}
