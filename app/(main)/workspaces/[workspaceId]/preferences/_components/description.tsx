"use client";

import React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { WorkspaceVisibility } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkspacePreferencesProps } from "../page";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const schema = z.object({
  description: z
    .string()
    .min(100, "Description must be at least 100 characters long")
    .max(300, { message: "Description must be at most 300 characters long" }),
});

type FormValues = z.infer<typeof schema>;

export const WorkspaceDescription = ({
  profile,
  isAdmin,
  currentWorkspace,
}: WorkspacePreferencesProps) => {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: currentWorkspace.description || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const adminId = profile.id;
      if (!adminId || !isAdmin) {
        throw new Error("Unauthorized");
      }

      const { data: workspace } = await axios.get(`/api/workspaces/${currentWorkspace.id}`);
      if (!workspace) {
        throw new Error("Unauthorized");
      }

      await axios.patch(`/api/workspaces/${currentWorkspace.id}`, {
        ...values,
        adminId: profile.id,
        name: workspace.name,
        image: workspace.image,
        isPublic: workspace.visibility === WorkspaceVisibility.PUBLIC,
      });

      toast.success("Workspace description updated successfully.");
      router.refresh();
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      } else {
        toast.error(error?.message || "Failed to update workspace description.");
      }
    }
  };

  const requestSubmit = () => {
    formRef.current?.requestSubmit();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Card className="mt-4">
      <CardHeader className="space-y-0.5 pb-2">
        <CardTitle className="text-sm tracking-[0.01em] font-medium font-mono">
          Workspace Description
        </CardTitle>
        <CardDescription className="text-[0.8rem]">
          This is your workspace&apos;s description. You can change it anytime you want.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      readOnly={!isAdmin}
                      disabled={isLoading}
                      placeholder="Workspace Description"
                      className="max-w-xl text-[0.8rem] min-h-36 sm:min-h-28 md:min-h-[7.5rem] lg:min-h-24"
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
        <CardFooter className="border-t justify-between py-2">
          <p className="text-[0.8rem] text-muted-foreground">
            Please use 300 characters at maximum.
          </p>
          <Button
            size="sm"
            onClick={requestSubmit}
            className="text-[0.8rem]"
            disabled={isLoading || form.getValues("description") === currentWorkspace.description}
          >
            {isLoading ? <Loader className="h-[0.8rem] w-[0.8rem] animate-spin" /> : "Save"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
