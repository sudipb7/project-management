'use client';

import * as React from 'react';
import Image from 'next/image';
import { ClassValue } from 'clsx';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  showPrimaryLogo?: boolean;
  action?: ComboboxAction;
}

export const Combobox = ({
  data,
  action,
  onItemClicked,
  initialValue = '',
  triggerClasses = '',
  showPrimaryLogo = false,
  hideSearch = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'Not items found.',
  triggerText = 'Select item..',
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);

  const currentValue = React.useMemo(() => {
    return data.find((d) => d.value === value);
  }, [data, value]);

  const triggerBtnText = React.useMemo(() => {
    if (value) {
      let label = data.find((d) => d.value === value)?.label;
      if (!label) {
        return triggerText;
      }
      return label.length > 17 ? label.slice(0, 17) + '...' : label;
    } else {
      return triggerText;
    }
  }, [data, triggerText, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-[210px] justify-between px-2.5', triggerClasses)}
        >
          <div className='flex items-center gap-2.5'>
            {showPrimaryLogo && currentValue && (
              <div className='h-[1.6rem] w-[1.6rem] rounded-full relative overflow-hidden grid place-items-center'>
                {currentValue.image ? (
                  <Image
                    src={currentValue.image}
                    alt={currentValue.label}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <span className='w-full h-full grid place-items-center bg-foreground text-background text-xs font-medium'>
                    {currentValue.label[0]}
                  </span>
                )}
              </div>
            )}
            {triggerBtnText}
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[210px] p-0'>
        <Command>
          {!hideSearch && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {data.map((d) => (
                <CommandItem
                  className='cursor-pointer px-1.5 text-xs justify-between h-8'
                  key={d.value}
                  value={d.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    onItemClicked(currentValue);
                    setOpen(false);
                  }}
                >
                  <div className='flex items-center gap-2'>
                    {showPrimaryLogo && (
                      <div className='h-6 w-6 rounded-full relative overflow-hidden'>
                        {d.image ? (
                          <Image src={d.image} alt={d.label} fill className='object-cover' />
                        ) : (
                          <span className='w-full h-full grid place-items-center bg-foreground text-background text-xs font-medium'>
                            {d?.label?.[0]}
                          </span>
                        )}
                      </div>
                    )}
                    {d?.label?.length > 17 ? d?.label?.slice(0, 17) + '...' : d?.label}
                  </div>
                  <Check
                    className={cn('mr-2 h-3 w-3', value === d?.value ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {action && (
              <CommandGroup>
                <CommandItem
                  className='cursor-pointer h-7 px-3 text-xs'
                  onSelect={() => {
                    action.onClick();
                    setOpen(false);
                  }}
                >
                  {action.actionIcon}
                  {action.actionLabel.length > 15
                    ? action.actionLabel.slice(0, 15) + '...'
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
