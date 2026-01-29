import { Trash2, Search, RotateCcw } from 'lucide-react';
import { type Table } from '@tanstack/react-table';

import { cn } from '@/shared/lib/utils';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export interface FilterConfig {
  columnId: string;
  placeholder: string;
  type: 'text' | 'select';
  options?: { label: string; value: string }[];
}

interface DataTableFiltersProps<TData> {
  table: Table<TData>;
  filters: FilterConfig[];
  isDisabled?: boolean;
  onNewSearch?: () => void;
  className?: string;
}

export function DataTableFilters<TData>({
  table,
  filters,
  isDisabled = false,
  onNewSearch,
  className,
}: DataTableFiltersProps<TData>): JSX.Element {
  const handleClearFilters = (): void => {
    filters.forEach((filter) => {
      table.getColumn(filter.columnId)?.setFilterValue('');
    });
  };

  const handleNewSearch = (): void => {
    handleClearFilters();
    onNewSearch?.();
  };

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row gap-3 md:items-center',
        'p-4 md:p-5',
        'rounded-xl',
        'bg-slate-50/50 dark:bg-slate-800/30',
        'border border-slate-200/60 dark:border-slate-700/40',
        className
      )}
    >
      {/* Filter inputs */}
      <div className='flex flex-1 flex-wrap gap-3'>
        {filters.map((filter) => {
          if (filter.type === 'select' && filter.options) {
            return (
              <Select
                key={filter.columnId}
                disabled={isDisabled}
                value={(table.getColumn(filter.columnId)?.getFilterValue() as string) ?? ''}
                onValueChange={(value) =>
                  table.getColumn(filter.columnId)?.setFilterValue(value)
                }
              >
                <SelectTrigger
                  className={cn(
                    'min-w-[180px] flex-1 md:flex-none',
                    'text-[13px] md:text-[14px] font-inter',
                    'bg-white dark:bg-slate-900',
                    'border-slate-200 dark:border-slate-700',
                    'focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500',
                    'transition-all duration-200'
                  )}
                >
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className='text-[13px] md:text-[14px] font-inter'
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          return (
            <div key={filter.columnId} className='relative flex-1 min-w-[180px] md:min-w-[200px]'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <Input
                disabled={isDisabled}
                placeholder={filter.placeholder}
                value={(table.getColumn(filter.columnId)?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn(filter.columnId)?.setFilterValue(event.target.value)
                }
                className={cn(
                  'pl-10',
                  'text-[13px] md:text-[14px] font-inter',
                  'bg-white dark:bg-slate-900',
                  'border-slate-200 dark:border-slate-700',
                  'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                  'focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500',
                  'transition-all duration-200'
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className='flex gap-2 mt-2 md:mt-0'>
        {/* Clear Filters */}
        <Button
          disabled={isDisabled}
          variant='outline'
          size='sm'
          className={cn(
            'group',
            'px-3 py-2 h-auto',
            'text-[13px] font-medium font-inter',
            'border-rose-200 dark:border-rose-800/50',
            'text-rose-600 dark:text-rose-400',
            'bg-rose-50/50 dark:bg-rose-900/20',
            'hover:bg-rose-100 dark:hover:bg-rose-900/30',
            'hover:border-rose-300 dark:hover:border-rose-700',
            'transition-all duration-200'
          )}
          onClick={handleClearFilters}
        >
          <Trash2 className='w-4 h-4 mr-1.5 transition-transform group-hover:scale-110' />
          <span className='hidden sm:inline'>Limpiar</span>
        </Button>

        {/* New Search */}
        {onNewSearch && (
          <Button
            disabled={isDisabled}
            variant='outline'
            size='sm'
            className={cn(
              'group',
              'px-4 py-2 h-auto',
              'text-[13px] font-semibold font-inter',
              'border-emerald-200 dark:border-emerald-800/50',
              'text-emerald-600 dark:text-emerald-400',
              'bg-emerald-50/50 dark:bg-emerald-900/20',
              'hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
              'hover:border-emerald-300 dark:hover:border-emerald-700',
              'transition-all duration-200'
            )}
            onClick={handleNewSearch}
          >
            <RotateCcw className='w-4 h-4 mr-1.5 transition-transform group-hover:-rotate-180 duration-500' />
            Nueva Búsqueda
          </Button>
        )}
      </div>
    </div>
  );
}
