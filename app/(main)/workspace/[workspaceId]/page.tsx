import { notFound } from 'next/navigation';

import { getWorkSpaceById } from '@/lib/api';

export default async function WorkspacePage({ params }: { params: { workspaceId: string } }) {
  const workspace = await getWorkSpaceById(params.workspaceId);
  if (!workspace) {
    notFound();
  }

  return (
    <pre className='whitespace-pre-wrap p-4 text-xs'>{JSON.stringify(workspace, null, 2)}</pre>
  );
}
