'use client';

import React from 'react';
import { SquarePen } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { useModal } from '@/components/providers/modal-provider';
import { Combobox, type ComboboxItem } from '@/components/ui/combobox';

export const SideNavigationHeader = React.memo(({ data }: { data: ComboboxItem[] }) => {
  const modal = useModal();
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId;
  const initialValue = data.find((d) => d.value === workspaceId)?.value;

  const onItemClicked = (currentValue: string) => {
    if (currentValue === workspaceId) return;
    router.push(`/workspace/${currentValue}`);
  };

  return (
    <div className='border-b flex items-center px-4 h-[3.75rem] transition-all'>
      <Combobox
        data={data}
        hideSearch
        initialValue={initialValue}
        onItemClicked={onItemClicked}
        emptyMessage='No workspace found'
        triggerText='Switch workspaces'
        triggerClasses='text-[13px] w-full'
        showPrimaryLogo
        action={{
          actionLabel: 'Create',
          actionIcon: <SquarePen className='mr-2 h-3 w-3' />,
          onClick: () => modal.onOpen('create-workspace'),
        }}
      />
    </div>
  );
});

SideNavigationHeader.displayName = 'SideNavigationHeader';
