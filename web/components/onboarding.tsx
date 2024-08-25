"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Check, Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AnimatePresence, MotionSpan } from "./motion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const buttons = {
  idle: "Continue",
  loading: <Loader className="h-4 w-4 animate-spin" />,
  failed: "Something went wrong",
  success: <Check className="h-4 w-4" />,
};

export default function Onboarding({ user }: { user: any }) {
  const router = useRouter();
  const [buttonStatus, setButtonStatus] = useState<keyof typeof buttons>("idle");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: `${user?.name}'s Workspace` || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setButtonStatus("loading");
      const {
        data: { workspace },
      } = await api.post(`/workspaces`, { ...values, adminId: user.id });
      setButtonStatus("success");
      toast.success("Workspace created successfully");
      setTimeout(() => {
        router.push(`/workspace/${workspace.id}`);
      }, 1000);
    } catch (error) {
      setButtonStatus("failed");
      toast.error("Something went wrong");
      setTimeout(() => {
        setButtonStatus("idle");
      }, 1000);
    } finally {
      form.reset();
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <section className="min-h-screen w-full grid place-items-center bg-background">
      <div className="w-full overflow-hidden relative rounded-lg grid place-items-center">
        <div className="p-6 w-full max-w-sm">
          <h1 className="md:text-lg font-bold tracking-wide">Define Your Workspace</h1>
          <p className="text-xs md:text-sm font-medium text-muted-foreground font-mono">
            Create a workspace to get started
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 mt-3.5">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="My Workspace"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                size="sm"
                className={cn(
                  "w-full disabled:opacity-100",
                  buttonStatus === "failed" && "text-red-500"
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <MotionSpan
                    key={buttonStatus}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -25 }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  >
                    {buttons[buttonStatus]}
                  </MotionSpan>
                </AnimatePresence>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
