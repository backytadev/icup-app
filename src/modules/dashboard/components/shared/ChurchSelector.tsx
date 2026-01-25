import { CheckIcon } from 'lucide-react';
import { CaretSortIcon } from '@radix-ui/react-icons';

import { cn } from '@/shared/lib/utils';
import type { ChurchResponse } from '@/modules/church/interfaces/church-response.interface';

import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/shared/components/ui/command';

interface ChurchSelectorProps {
  churches: ChurchResponse[] | undefined;
  selectedChurchId: string | undefined;
  selectedChurchCode: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (churchId: string) => void;
  isLoading?: boolean;
  className?: string;
}


export const ChurchSelector = ({
  churches,
  selectedChurchId,
  selectedChurchCode,
            isOpen,
  onOpenChange,
  onSelect,
  isLoading,
  className,
}: ChurchSelectorProps): JSX.Element => {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          disabled={isLoading}
          className={cn(
            'justify-between w-auto min-w-[120px] px-3',
            'text-sm font-medium',
            'border-slate-200 dark:border-slate-700',
            'hover:bg-slate-50 dark:hover:bg-slate-800',
            'transition-all duration-200',
            isLoading && 'opacity-70',
            className
          )}
        >
          <span className='truncate'>{selectedChurchCode}</span>
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-auto min-w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Buscar iglesia...' className='h-9 text-sm' />
          <CommandEmpty className='py-3 text-sm text-center text-slate-500'>
            Iglesia no encontrada.
          </CommandEmpty>
          <CommandGroup className='max-h-[200px] overflow-auto'>
            {churches?.map((church) => (
              <CommandItem
                key={church.id}
                value={church.churchCode}
                onSelect={() => onSelect(church.id)}
                className='text-sm cursor-pointer'
              >
                <span className='flex-1'>{church.abbreviatedChurchName}</span>
                <CheckIcon
                  className={cn(
                    'ml-2 h-4 w-4 transition-opacity',
                    church.id === selectedChurchId ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
