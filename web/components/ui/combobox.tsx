"use client";

import * as React from "react";
import { ClassValue } from "clsx";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ComboboxItem {
  value: string;
  label: string;
  [key: string]: string;
}

export interface ComboboxAction {
  onClick: () => void | Promise<void>;
  actionIcon: React.ReactNode;
  actionLabel: string;
}

export interface ComboboxProps {
  hideSearch?: boolean;
  triggerText?: string;
  emptyMessage?: string;
  initialValue?: string;
  searchPlaceholder?: string;
  triggerClasses?: ClassValue;
  data: ComboboxItem[];
  onItemClicked: (currentValue: string) => void;
  action?: ComboboxAction;
}

export const Combobox = ({
  data,
  action,
  onItemClicked,
  initialValue = "",
  triggerClasses = "",
  hideSearch = false,
  searchPlaceholder = "Search...",
  emptyMessage = "Not items found.",
  triggerText = "Select item..",
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);

  const triggerBtnText = React.useMemo(() => {
    if (value) {
      let label = data.find((d) => d.value === value)?.label;
      if (!label) {
        return triggerText;
      }
      return label.length > 12 ? label.slice(0, 12) + "..." : label;
    } else {
      return triggerText;
    }
  }, [data, triggerText, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          aria-expanded={open}
          className={cn("h-8 w-auto min-w-[150px] justify-between", triggerClasses)}
        >
          {triggerBtnText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[150px] p-0">
        <Command>
          {!hideSearch && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {data.map((d) => (
                <CommandItem
                  className="cursor-pointer h-7 px-3 text-xs"
                  key={d.value}
                  value={d.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onItemClicked(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-3 w-3", value === d.value ? "opacity-100" : "opacity-0")}
                  />
                  {d.label.length > 15 ? d.label.slice(0, 15) + "..." : d.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {action && (
              <CommandGroup>
                <CommandItem
                  className="cursor-pointer h-7 px-3 text-xs"
                  onSelect={() => {
                    action.onClick();
                    setOpen(false);
                  }}
                >
                  {action.actionIcon}
                  {action.actionLabel.length > 15
                    ? action.actionLabel.slice(0, 15) + "..."
                    : action.actionLabel}
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
