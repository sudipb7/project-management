import React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { api } from "@/lib/api";
import { useModal } from "@/components/providers/modal-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(1, "Workspace name is required"),
});

type Values = z.infer<typeof schema>;

export const CreateWorkpspaceModal = () => {
  const router = useRouter();
  const session = useSession();
  const { isOpen, onClose, type } = useModal();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: Values) => {
    try {
      const adminId = session.data?.user.userId;
      if (!adminId) {
        throw new Error("Unauthorized");
      }

      const {
        data: { workspace },
      } = await api.post(`/workspaces`, { ...values, adminId });

      toast.success("Workspace created successfully");
      router.push(`/workspace/${workspace.id}`);
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to create workspace.");
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
      <DialogContent className="max-w-sm">
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
                  <FormLabel className="text-sm">Workspace Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="My Workspace" disabled={isLoading} />
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
