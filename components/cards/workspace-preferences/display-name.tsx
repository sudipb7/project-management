'use client';

import React from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type WorkspacePreferencesProps } from '.';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const schema = z.object({
  name: z.string().min(1, 'Minimum 1 character').max(32, 'Maximum 32 characters'),
});

type FormValues = z.infer<typeof schema>;

export const WorkspaceDisplayName = ({
  user,
  isAdmin,
  currentWorkspace,
}: WorkspacePreferencesProps) => {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: currentWorkspace.name,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const adminId = user.id;
      if (!adminId || !isAdmin) {
        throw new Error('Unauthorized');
      }

      await api.patch(`/workspaces/${currentWorkspace.id}`, { ...values, adminId: user.id });

      toast.success('Workspace name updated successfully.');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update workspace name.');
    }
  };

  const requestSubmit = () => {
    formRef.current?.requestSubmit();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Card className='mt-4'>
      <CardHeader className='space-y-0.5 pb-2'>
        <CardTitle className='text-sm tracking-[0.01em] font-medium font-mono'>
          Workspace Name
        </CardTitle>
        <CardDescription className='text-[13px]'>
          This is your workspace&apos;s visible name within ColumnZ. For example, the name of your
          company or department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      readOnly={!isAdmin}
                      disabled={isLoading}
                      placeholder='Workspace Name'
                      className='max-w-xs text-[13px] h-9'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      {isAdmin && (
        <CardFooter className='border-t justify-between py-2 bg-muted/20'>
          <p className='text-[13px] text-muted-foreground'>Please use 32 characters at maximum.</p>
          <Button
            size='sm'
            onClick={requestSubmit}
            className='text-[13px] h-8'
            disabled={isLoading || form.getValues('name') === currentWorkspace.name}
          >
            {isLoading ? <Loader className='h-[13px] w-[13px] animate-spin' /> : 'Save'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
