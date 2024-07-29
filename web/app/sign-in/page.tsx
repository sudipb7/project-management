import { signIn } from "@/lib/auth";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default async function SignInPage() {
  const signInWithGoogle = async () => {
    "use server";
    await signIn("google");
  };

  const signInWithGithub = async () => {
    "use server";
    await signIn("github");
  };

  return (
    <main className="min-h-screen p-4 flex items-center justify-center">
      <section className="w-full max-w-[23rem] p-4">
        <div className="space-y-1">
          <h1 className="text-primary text-2xl md:text-3xl font-bold tracking-wide leading-normal">
            Almost There
          </h1>
          <p className="text-muted-foreground font-medium leading-snug font-mono">
            Sign in to continue with Columnz.
          </p>
        </div>
        <form className="space-y-3 mt-4">
          <Button
            formAction={signInWithGoogle}
            variant="outline"
            className="gap-4 w-full text-muted-foreground"
          >
            <Icons.google size={20} />
            Continue with Google
          </Button>
          <Button
            formAction={signInWithGithub}
            variant="outline"
            className="gap-4 w-full text-muted-foreground"
          >
            <Icons.github size={20} className="dark:invert" />
            Continue with Github
          </Button>
        </form>
      </section>
    </main>
  );
}
