"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Profile } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(32, { message: "Name must be at most 32 characters long" }),
});

type Values = z.infer<typeof schema>;
export const Onboarding = ({ profile }: { profile: Profile }) => {
  const router = useRouter();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile?.name ? `${profile.name}'s Workspace` : "My Workspace",
    },
  });

  const onSubmit = async (values: Values) => {
    try {
      if (!profile.id) {
        throw new Error("Profile not found.");
      }

      const body = {
        ...values,
        description:
          "This is your personal workspace, where you can create, manage, and share your projects. Additionally, you have the option to invite others to collaborate with you. It's worth noting that this workspace is private by default. As this is your personal workspace, it cannot be deleted or abandoned.",
        isPublic: false,
        image: "",
        adminId: profile?.id,
      };

      const { data: workspace } = await axios.post("/api/workspaces", body);

      toast.success("Workspace created successfully");
      router.push(`/workspace/${workspace.id}`);
      router.refresh();
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      } else {
        toast.error(error?.message || "Failed to create workspace.");
      }
    } finally {
      form.reset();
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Dialog open>
      <DialogContent className="max-w-xs sm:max-w-sm" hideClosebtn>
        <DialogHeader>
          <DialogTitle className="text-base">Create Workspace</DialogTitle>
          <DialogDescription className="text-sm">
            Create your first workspace to get started.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="Workspace Name"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} size="sm" className="w-full text-[13px]">
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating Workspace..." : "Create Workspace"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
