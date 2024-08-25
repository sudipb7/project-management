import { signIn } from '@/lib/auth';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Sign in | ColumnZ',
};

export default async function SignInPage() {
  const redirectTo = '/onboarding';

  const signInWithGoogle = async () => {
    'use server';
    await signIn('google', { redirectTo });
  };

  const signInWithGithub = async () => {
    'use server';
    await signIn('github', { redirectTo });
  };

  return (
    <main className='min-h-screen p-4 flex items-center justify-center'>
      <section className='w-full max-w-sm p-4'>
        <h1 className='md:text-lg font-bold tracking-wide text-primary'>Almost There</h1>
        <p className='text-xs md:text-sm font-medium text-muted-foreground font-mono'>
          Sign in to continue with Columnz.
        </p>
        <form className='space-y-2.5 mt-3.5'>
          <Button
            formAction={signInWithGoogle}
            variant='outline'
            size='sm'
            className='gap-3 w-full text-muted-foreground'
          >
            <Icons.google size={18} />
            Continue with Google
          </Button>
          <Button
            formAction={signInWithGithub}
            variant='outline'
            size='sm'
            className='gap-3 w-full text-muted-foreground'
          >
            <Icons.github size={18} className='dark:invert' />
            Continue with Github
          </Button>
        </form>
      </section>
    </main>
  );
}
