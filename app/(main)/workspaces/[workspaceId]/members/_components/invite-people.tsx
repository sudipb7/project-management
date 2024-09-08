"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface InviteMembersProps {
  workspaceId: string;
  currentMemberId: string;
}

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type FormValues = z.infer<typeof schema>;

export const InvitePeople = ({ workspaceId, currentMemberId }: InviteMembersProps) => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: FormValues) => {
    try {
      await axios.post("/api/invites", { email, workspaceId, memberId: currentMemberId });

      toast.success("Invitation sent successfully.");

      router.refresh();
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      } else {
        toast.error(error?.message || "Failed to send invitation.");
      }
    } finally {
      form.reset();
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold font-mono">Invite People</CardTitle>
        <CardDescription className="text-[0.8rem]">
          Invite people to join your workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      disabled={isLoading}
                      placeholder="john.doe@example.com"
                      className="max-w-sm text-[0.8rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} size="sm" className="text-[0.8rem]">
              {isLoading && <Loader className="mr-2 h-[0.8rem] w-[0.8rem] animate-spin" />}
              {isLoading ? "Inviting" : "Invite"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
