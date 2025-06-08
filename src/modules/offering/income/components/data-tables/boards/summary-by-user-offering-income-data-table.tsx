/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState } from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';

interface DataTableProps<TData, TValue> {
  churchId: string | undefined;
  dialogClose: () => void;
  data: TData[];
  columns: Array<ColumnDef<TData, TValue>>;
}

export function SummaryByUserOfferingIncomeDataTable<TData, TValue>({
  data,
  columns,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* States
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  //* Data Table
  const table = useReactTable({
    data: data as TData[],
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // todo: el church id si se necesita para el reporte pdf y el dialog close tmb
  //* Query Report and Event trigger
  // const generateReportQuery = useQuery({
  //   queryKey: ['member-metrics-report', church],
  //   queryFn: () =>
  //     getMemberMetricsReport({
  //       churchId: church ?? '',
  //       year: year ?? '',
  //       types,
  //       dialogClose,
  //     }),
  //   retry: false,
  //   enabled: false,
  // });

  //* Form handler
  // const handleSubmit = (): void => {
  //   generateReportQuery.refetch();
  // };

  return (
    <>
      <div className='rounded-md border overflow-x-auto'>
        <Table>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers?.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='text-center text-slate-700 dark:text-slate-200'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {table.getRowModel().rows?.length ? (
            <>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className='text-center font-normal text-[14px] md:text-[14px]'
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              {/* Fila de totales */}
              <TableRow className='border-t-2 border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 font-semibold hover:bg-gray-200'>
                {table.getAllLeafColumns().map((column) => {
                  const columnId = column.id;

                  if (['amountPEN', 'amountUSD', 'amountEUR'].includes(columnId)) {
                    const total = table.getRowModel().rows.reduce((sum, row) => {
                      const value = row.getValue(columnId) as number;
                      return sum + (typeof value === 'number' ? value : 0);
                    }, 0);

                    return (
                      <TableCell
                        key={columnId}
                        className='text-center text-[14.5px] md:text-[15px] font-semibold text-green-600 dark:text-green-400'
                      >
                        {total.toFixed(2)}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={columnId}
                      className='font-semibold text-right text-red-600 dark:text-red-400'
                    >
                      {columnId === 'offeringType' ? 'TOTALES' : ''}
                    </TableCell>
                  );
                })}
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </Table>
      </div>

      <div className='flex items-center justify-between space-x-2'>
        <div className='flex flex-col md:flex-row gap-y-2 items-center'>
          {/* {!query.isPending && (
            <Button
              type='submit'
              variant='ghost'
              className={cn(
                'px-4 py-3 text-[14px] font-semibold rounded-lg shadow-lg transition-transform transform focus:outline-none focus:ring-red-300',
                !generateReportQuery.isFetching &&
                  'text-white hover:text-white dark:text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800',
                generateReportQuery.isFetching &&
                  'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 cursor-not-allowed animate-pulse'
              )}
              onClick={handleGenerateReport}
            >
              <FaRegFilePdf
                className={cn(
                  'mr-2 text-[1.5rem] text-white',
                  generateReportQuery.isFetching && 'text-gray-600 dark:text-gray-200'
                )}
              />
              {generateReportQuery.isFetching ? 'Generando Reporte...' : 'Generar Reporte'}
            </Button>
          )}
       */}
          <div className='flex w-[100px] items-center justify-center text-[13px] md:text-sm font-medium text-center md:hidden'>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
        </div>

        <div className='w-[100px] items-center justify-center text-[13px] md:text-sm font-medium text-center hidden md:block'>
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>

        <div>
          <Button
            className='w-full sm:w-auto text-[14px] lg:text-[14px]'
            variant='outline'
            size='sm'
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            className='w-full sm:w-auto text-[14px] lg:text-[14px]'
            variant='outline'
            size='sm'
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </>
  );
}
