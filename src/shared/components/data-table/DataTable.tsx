import { useState, type ReactNode } from 'react';

import { FaRegFilePdf } from 'react-icons/fa6';
import { TbDatabaseOff } from 'react-icons/tb';

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
} from '@tanstack/react-table';

import { cn } from '@/shared/lib/utils';

import { DataTableHeader } from './DataTableHeader';
import { DataTableFilters, type FilterConfig } from './DataTableFilters';
import { DataTablePagination } from './DataTablePagination';
import { DataTableSkeleton } from './DataTableSkeleton';

import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';

interface SearchMetadata {
  title: string;
  subtitle?: string;
  recordCount: number;
  churchName?: string;
}

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: TData[];
  isLoading?: boolean;
  isFiltersDisabled?: boolean;
  searchMetadata?: SearchMetadata;
  filters?: FilterConfig[];
  onNewSearch?: () => void;
  onGenerateReport?: () => void;
  isGeneratingReport?: boolean;
  emptyMessage?: string;
  showHeader?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  showReportButton?: boolean;
  className?: string;
  leftPaginationContent?: ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  isFiltersDisabled = false,
  searchMetadata,
  filters = [],
  onNewSearch,
  onGenerateReport,
  isGeneratingReport = false,
  emptyMessage = 'Sin resultados.',
  showHeader = true,
  showFilters = true,
  showPagination = true,
  showReportButton = true,
  className,
  leftPaginationContent,
}: DataTableProps<TData, TValue>): JSX.Element {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    copastorOrPreacher: false,
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
  });

  const isDisabled = isLoading || isFiltersDisabled;

  // Show skeleton with spinner overlay while loading
  if (isLoading) {
    return (
      <div className={cn('relative', className)}>
        {/* Skeleton with reduced opacity */}
        <div className='opacity-30 pointer-events-none'>
          <DataTableSkeleton
            columns={columns.length}
            rows={5}
            showHeader={showHeader}
            showFilters={showFilters}
            showPagination={showPagination}
          />
        </div>
        {/* Spinner overlay centered on top */}
        <div className='absolute inset-0 flex items-center justify-center z-10'>
          <LoadingSpinner variant='overlay' />
        </div>
      </div>
    );
  }

  // Don't show anything if filters are disabled
  if (isFiltersDisabled) {
    return <div className={className} />;
  }

  const reportButton = showReportButton && onGenerateReport && (
    <Button
      type='button'
      variant='ghost'
      disabled={isGeneratingReport}
      className={cn(
        'group relative overflow-hidden',
        'px-5 py-2.5 h-auto',
        'text-[13px] md:text-[14px] font-semibold font-inter',
        'rounded-xl',
        'transition-all duration-300 ease-out',
        !isGeneratingReport && [
          'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600',
          'dark:from-amber-600 dark:via-amber-700 dark:to-orange-700',
          'text-white',
          'shadow-lg shadow-amber-500/25 dark:shadow-amber-900/30',
          'hover:shadow-xl hover:shadow-amber-500/30 dark:hover:shadow-amber-900/40',
          'hover:scale-[1.02]',
          'active:scale-[0.98]',
        ],
        isGeneratingReport && [
          'bg-slate-100 dark:bg-slate-800',
          'text-slate-400 dark:text-slate-500',
          'cursor-not-allowed',
        ]
      )}
      onClick={onGenerateReport}
    >
      {/* Shine effect */}
      {!isGeneratingReport && (
        <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
      )}

      <FaRegFilePdf
        className={cn(
          'mr-2 text-lg transition-transform duration-300',
          !isGeneratingReport && 'group-hover:scale-110',
          isGeneratingReport && 'animate-pulse'
        )}
      />
      <span className='relative'>
        {isGeneratingReport ? 'Generando...' : 'Generar Reporte'}
      </span>
    </Button>
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with search metadata */}
      {showHeader && searchMetadata && (
        <DataTableHeader searchMetadata={searchMetadata} />
      )}

      {/* Filters */}
      {showFilters && filters.length > 0 && (
        <DataTableFilters
          table={table}
          filters={filters}
          isDisabled={isDisabled}
          onNewSearch={onNewSearch}
        />
      )}

      {/* Table Container */}
      <div
        className={cn(
          'relative overflow-hidden',
          'rounded-xl',
          'border border-slate-200/80 dark:border-slate-700/50',
          'bg-white dark:bg-slate-900/80',
          'shadow-sm',
          'transition-shadow duration-300',
          'hover:shadow-md'
        )}
      >
        {/* Decorative top gradient line */}
        <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/50 via-amber-500/50 to-blue-500/50' />

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className='border-b border-slate-200/80 dark:border-slate-700/50 hover:bg-transparent'
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'text-center',
                      'text-[13px] md:text-[14px] font-semibold font-inter',
                      'text-slate-600 dark:text-slate-300',
                      'bg-slate-50/80 dark:bg-slate-800/50',
                      'py-4 px-3',
                      'first:rounded-tl-lg last:rounded-tr-lg'
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'text-center',
                    'text-[13px] md:text-[14px] font-inter',
                    'text-slate-700 dark:text-slate-300',
                    'border-b border-slate-100 dark:border-slate-800/50',
                    'transition-colors duration-200',
                    'hover:bg-slate-50/80 dark:hover:bg-slate-800/30',
                    index % 2 === 0 && 'bg-white dark:bg-slate-900/50',
                    index % 2 !== 0 && 'bg-slate-50/30 dark:bg-slate-800/20',
                    row.getIsSelected() && 'bg-blue-50/50 dark:bg-blue-900/20'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className='px-3 lg:px-4 py-3'
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-32'
                >
                  <div className='flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500'>
                    <div className='p-3 rounded-full bg-slate-100 dark:bg-slate-800'>
                      <TbDatabaseOff className='w-6 h-6' />
                    </div>
                    <span className='text-sm font-inter'>{emptyMessage}</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <DataTablePagination
          table={table}
          leftContent={leftPaginationContent ?? reportButton}
        />
      )}
    </div>
  );
}
