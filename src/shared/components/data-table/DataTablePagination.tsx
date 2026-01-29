import { type ReactNode } from 'react';
import { type Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { Button } from '@/shared/components/ui/button';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  leftContent?: ReactNode;
  className?: string;
}

export function DataTablePagination<TData>({
  table,
  leftContent,
  className,
}: DataTablePaginationProps<TData>): JSX.Element {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4',
        'p-4 rounded-xl',
        'bg-slate-50/50 dark:bg-slate-800/30',
        'border border-slate-200/60 dark:border-slate-700/40',
        className
      )}
    >
      {/* Left content (report button) */}
      <div className='flex flex-col sm:flex-row items-center gap-3'>
        {leftContent}
      </div>

      {/* Page info */}
      <div className='flex items-center gap-1.5'>
        <span className='text-[13px] font-medium text-slate-600 dark:text-slate-300 font-inter'>
          Página
        </span>
        <span className='px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[13px] font-semibold text-slate-700 dark:text-slate-200 font-inter'>
          {currentPage}
        </span>
        <span className='text-[13px] font-medium text-slate-600 dark:text-slate-300 font-inter'>
          de {totalPages || 1}
        </span>
      </div>

      {/* Navigation buttons */}
      <div className='flex items-center gap-1.5'>
        {/* First page */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className={cn(
            'h-9 w-9 p-0',
            'border-slate-200 dark:border-slate-700',
            'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600',
            'dark:hover:bg-blue-900/30 dark:hover:border-blue-700 dark:hover:text-blue-400',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-all duration-200'
          )}
        >
          <ChevronsLeft className='h-4 w-4' />
        </Button>

        {/* Previous page */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={cn(
            'h-9 px-3',
            'border-slate-200 dark:border-slate-700',
            'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600',
            'dark:hover:bg-blue-900/30 dark:hover:border-blue-700 dark:hover:text-blue-400',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-all duration-200',
            'text-[13px] font-medium font-inter'
          )}
        >
          <ChevronLeft className='h-4 w-4 mr-1' />
          <span className='hidden sm:inline'>Anterior</span>
        </Button>

        {/* Next page */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={cn(
            'h-9 px-3',
            'border-slate-200 dark:border-slate-700',
            'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600',
            'dark:hover:bg-blue-900/30 dark:hover:border-blue-700 dark:hover:text-blue-400',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-all duration-200',
            'text-[13px] font-medium font-inter'
          )}
        >
          <span className='hidden sm:inline'>Siguiente</span>
          <ChevronRight className='h-4 w-4 ml-1' />
        </Button>

        {/* Last page */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className={cn(
            'h-9 w-9 p-0',
            'border-slate-200 dark:border-slate-700',
            'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600',
            'dark:hover:bg-blue-900/30 dark:hover:border-blue-700 dark:hover:text-blue-400',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-all duration-200'
          )}
        >
          <ChevronsRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
