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

export function SummaryByTypeDataTable<TData, TValue>({
  data,
  columns,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* States
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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
        <Table className='min-w-full'>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers?.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='text-center text-slate-700 dark:text-slate-200 px-1 py-2'
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
                      className='text-center font-normal'
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className='px-1 py-2'>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-24 text-center text-[12px]'>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              {/* Row Totals */}
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
                        className='text-center text-[11px] md:text-[12px] font-semibold text-green-600 dark:text-green-400 px-1 py-2'
                      >
                        {total.toFixed(2)}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={columnId}
                      className='font-semibold text-right text-red-600 dark:text-red-400 text-[11px] md:text-[12px] px-1 py-2'
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

      <div className='flex items-center justify-between space-x-2 mt-2'>
        <div className='flex flex-col md:flex-row gap-y-1 items-center'>
          <div className='flex w-[80px] items-center justify-center text-[11px] md:text-[12px] font-medium text-center md:hidden'>
            Pág. {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
        </div>

        <div className='w-[80px] items-center justify-center text-[11px] md:text-[12px] font-medium text-center hidden md:block'>
          Pág. {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>

        <div className='flex gap-1'>
          <Button
            className='w-auto text-[11px] md:text-[12px] px-2 py-1 h-7'
            variant='outline'
            size='sm'
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Ant
          </Button>
          <Button
            className='w-auto text-[11px] md:text-[12px] px-2 py-1 h-7'
            variant='outline'
            size='sm'
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Sig
          </Button>
        </div>
      </div>
    </>
  );
}
