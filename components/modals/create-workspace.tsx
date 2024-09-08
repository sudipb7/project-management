import React from "react";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useModal } from "@/components/providers/modal-provider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkspaceSchema } from "@/lib/schema";

type Values = z.infer<typeof WorkspaceSchema>;

export const CreateWorkpspaceModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();

  const form = useForm<Values>({
    resolver: zodResolver(WorkspaceSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
      isPublic: true,
    },
  });

  const onSubmit = async (values: Values) => {
    try {
      if (!data?.profile) {
        throw new Error("Profile not found.");
      }

      const { data: workspace } = await axios.post("/api/workspaces", {
        ...values,
        adminId: data?.profile?.id,
      });

      toast.success("Workspace created successfully");
      router.push(`/workspaces/${workspace.id}`);
      router.refresh();
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      } else {
        toast.error(error?.message || "Failed to create workspace.");
      }
    } finally {
      onModalClose();
    }
  };

  const isLoading = form.formState.isSubmitting;
  const isModalOpen = isOpen && type === "create-workspace";

  const onModalClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-w-xs sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Create Workspace</DialogTitle>
          <DialogDescription className="text-sm">
            Create a new workspace to start collaborating with your team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="My Workspace" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Workspace Description" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} size="sm" className="w-full text-[0.8rem]">
              {isLoading && <Loader className="mr-2 h-[0.8rem] w-[0.8rem] animate-spin" />}
              {isLoading ? "Creating Workspace" : "Create Workspace"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
