"use client";

import React from "react";
import Image from "next/image";
import { SquarePen } from "lucide-react";
import { useParams } from "next/navigation";

import { Combobox, type ComboboxItem } from "@/components/ui/combobox";

export const SideNavigationHeader = ({ data }: { data: ComboboxItem[] }) => {
  const params = useParams();
  const workspaceId = params.workspaceId;
  const currentWorkspace = data?.find((item) => item.value === workspaceId);

  return (
    <div className="flex items-center justify-start gap-x-2.5 border-b px-5 h-14 transition-all">
      <div className="h-8 w-8 rounded-full relative overflow-hidden">
        {currentWorkspace?.image ? (
          <Image
            src={currentWorkspace.image}
            alt={currentWorkspace.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <span className="w-full h-full grid place-items-center bg-muted text-white text-xs font-medium">
            {currentWorkspace?.name[0]}
          </span>
        )}
      </div>
      <Combobox
        data={data}
        hideSearch
        initialValue={data.find((d) => d.value === workspaceId)?.value || data[0].value}
        onItemClicked={(currentValue) => console.log(currentValue)}
        emptyMessage="No workspace found"
        triggerText="Switch workspaces"
        triggerClasses="text-[13px]"
        action={{
          actionLabel: "Create",
          actionIcon: <SquarePen className="mr-2 h-3 w-3" />,
          onClick: () => {}, // TODO: Open create organization dialog
        }}
      />
    </div>
  );
};
