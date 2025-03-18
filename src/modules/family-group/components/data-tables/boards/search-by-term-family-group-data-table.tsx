/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { Trash } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { useNavigate } from 'react-router-dom';
import { FaRegFilePdf } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';

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

import {
  FamilyGroupSearchType,
  FamilyGroupSearchTypeNames,
} from '@/modules/family-group/enums/family-group-search-type.enum';
import { FamilyGroupSearchSubTypeNames } from '@/modules/family-group/enums/family-group-search-sub-type.enum';
import { FamilyGroupSearchSelectOptionNames } from '@/modules/family-group/enums/family-group-search-select-option.enum';

import { type FamilyGroupQueryParams } from '@/modules/family-group/interfaces/family-group-query-params.interface';
import { type FamilyGroupSearchFormByTerm } from '@/modules/family-group/interfaces/family-group-search-by-term.interface';

import {
  getFamilyGroupsByTerm,
  getFamilyGroupsReportByTerm,
} from '@/modules/family-group/services/family-group.service';

import { useFamilyGroupStore } from '@/stores/family-group/family-group.store';

import { LoadingSpinner } from '@/shared/components/spinner/LoadingSpinner';

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/shared/components/ui/table';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { getSimpleChurches } from '@/modules/church/services/church.service';

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: TData[];
  searchParams: FamilyGroupSearchFormByTerm | undefined;
  setSearchParams: React.Dispatch<React.SetStateAction<FamilyGroupSearchFormByTerm | undefined>>;
  dataForm: FamilyGroupSearchFormByTerm | undefined;
}

export function SearchByTermFamilyGroupDataTable<TData, TValue>({
  columns,
  searchParams,
  setSearchParams,
  dataForm,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* States
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const isFiltersSearchByTermDisabled = useFamilyGroupStore(
    (state) => state.isFiltersSearchByTermDisabled
  );
  const setIsFiltersSearchByTermDisabled = useFamilyGroupStore(
    (state) => state.setIsFiltersSearchByTermDisabled
  );
  const setDataSearchByTermResResponse = useFamilyGroupStore(
    (state) => state.setDataSearchByTermResponse
  );

  const [isDisabledButton, setIsDisabledButton] = useState(false);

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Queries
  const query = useQuery({
    queryKey: ['family-groups-by-term', searchParams],
    queryFn: () => getFamilyGroupsByTerm(searchParams as FamilyGroupQueryParams),
    enabled: !!searchParams,
    retry: false,
  });

  const churchesQuery = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  //* Set data result query
  useEffect(() => {
    setDataSearchByTermResResponse(query.data);
  }, [query?.isFetching]);

  useEffect(() => {
    if (query.error?.message && query.error?.message !== 'Unauthorized') {
      toast.error(query?.error?.message, {
        position: 'top-center',
        className: 'justify-center',
      });

      setSearchParams(undefined);
      setIsFiltersSearchByTermDisabled(true);
    }

    if (query.error?.message === 'Unauthorized') {
      toast.error('Operación rechazada, el token expiro ingresa nuevamente.', {
        position: 'top-center',
        className: 'justify-center',
      });

      setSearchParams(undefined);
      setIsFiltersSearchByTermDisabled(true);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [query?.error]);

  //* Disabled button while query is pending
  useEffect(() => {
    if (query?.isPending) {
      setIsDisabledButton(true);
      return;
    }

    setIsDisabledButton(false);
  }, [query?.isPending]);

  //* Table
  const table = useReactTable({
    data: query.data as TData[],
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

  //* Query Report and Event trigger
  const generateReportQuery = useQuery({
    queryKey: ['family-groups-report-by-term', searchParams],
    queryFn: () => getFamilyGroupsReportByTerm(searchParams as FamilyGroupQueryParams),
    retry: false,
    enabled: false,
  });

  const handleGenerateReport = (): void => {
    generateReportQuery.refetch();
  };

  return (
    <div className='md:w-full m-auto lg:w-full'>
      <Toaster position='top-center' richColors />

      {!isFiltersSearchByTermDisabled && (
        <div>
          {/* Search Types */}
          <div>
            <span className='text-amber-500 dark:text-offering-color font-bold text-[14.5px] md:text-[15.5px]'>
              Tipo de búsqueda:
            </span>{' '}
            <span className='font-medium text-[14px] md:text-[14.5px] italic'>
              {`${
                Object.entries(FamilyGroupSearchTypeNames).find(
                  ([key, value]) => key === dataForm?.searchType && value
                )?.[1]
              }`}
            </span>
            {(dataForm?.searchType === FamilyGroupSearchType.FirstNames ||
              dataForm?.searchType === FamilyGroupSearchType.LastNames ||
              dataForm?.searchType === FamilyGroupSearchType.FullNames) && (
              <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                {' '}
                -{' '}
                {`${
                  Object.entries(FamilyGroupSearchSubTypeNames).find(
                    ([key, value]) => key === dataForm?.searchSubType && value
                  )?.[1]
                }`}
              </span>
            )}
          </div>

          {/* Search Terms */}
          <div>
            <span className='text-indigo-500 font-bold text-[14.5px] md:text-[15.5px]'>
              Término de búsqueda:
            </span>{' '}
            {(dataForm?.searchType === FamilyGroupSearchType.Department ||
              dataForm?.searchType === FamilyGroupSearchType.Country ||
              dataForm?.searchType === FamilyGroupSearchType.Province ||
              dataForm?.searchType === FamilyGroupSearchType.FamilyGroupCode ||
              dataForm?.searchType === FamilyGroupSearchType.FamilyGroupName ||
              dataForm?.searchType === FamilyGroupSearchType.ZoneName ||
              dataForm?.searchType === FamilyGroupSearchType.District ||
              dataForm?.searchType === FamilyGroupSearchType.UrbanSector ||
              dataForm?.searchType === FamilyGroupSearchType.Address) && (
              <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                {`${dataForm?.inputTerm}`}
              </span>
            )}
            {dataForm?.searchType === FamilyGroupSearchType.FirstNames && (
              <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                {`${dataForm?.firstNamesTerm}`}
              </span>
            )}
            {dataForm?.searchType === FamilyGroupSearchType.LastNames && (
              <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                {`${dataForm?.lastNamesTerm}`}
              </span>
            )}
            {dataForm?.searchType === FamilyGroupSearchType.FullNames && (
              <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                {`${dataForm?.firstNamesTerm} - ${dataForm?.lastNamesTerm} `}
              </span>
            )}
            {dataForm?.searchType === FamilyGroupSearchType.RecordStatus && (
              <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                {`${
                  Object.entries(FamilyGroupSearchSelectOptionNames).find(
                    ([key, value]) => key === dataForm?.selectTerm && value
                  )?.[1]
                }`}
              </span>
            )}
          </div>

          {/* Records Count */}
          <div>
            <span className='text-purple-500 dark:text-purple-500 font-bold text-[14.5px] md:text-[16px]'>
              Cantidad de registros:
            </span>{' '}
            <span className='font-medium text-[14px] md:text-[15px] italic'>
              {query.data?.length ?? 0} registros
            </span>
          </div>

          {/* Search Church */}
          <div>
            <span className='dark:text-emerald-500 text-emerald-600 font-bold text-[14.5px] md:text-[15.5px]'>
              Iglesia de búsqueda:
            </span>{' '}
            <span className='font-medium text-[14px] md:text-[14.5px] italic'>
              {`${
                churchesQuery?.data?.find((church) => church.id === dataForm?.churchId)
                  ?.abbreviatedChurchName ?? 'Todas las Iglesias'
              }`}
            </span>
          </div>

          {/* Inputs Filters */}
          <div className='pb-8 pt-4 lg:pb-8 grid grid-cols-2 gap-4 lg:flex lg:items-center lg:py-4 lg:gap-3'>
            <div className='flex w-full col-span-2 gap-2 md:gap-3 md:row-start-1 md:row-end-2'>
              <Input
                disabled={isDisabledButton}
                placeholder='Filtro por código...'
                value={(table.getColumn('familyGroupCode')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('familyGroupCode')?.setFilterValue(event.target.value)
                }
                className='text-[14px] lg:text-[14px] w-full col-start-1 col-end-2 row-start-1 row-end-2'
              />
              <Input
                disabled={isDisabledButton}
                placeholder='Filtro por sector urbano...'
                value={(table.getColumn('urbanSector')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('urbanSector')?.setFilterValue(event.target.value)
                }
                className='col-start-2 col-end-3 row-start-1 row-end-2 text-[14px] lg:text-[14px] w-full'
              />
              <Button
                disabled={isDisabledButton}
                variant='ghost'
                className='w-[15%] col-start-2 col-end-3 row-start-2 row-end-3 m-auto text-[14px] lg:text-[14px] h-full md:w-[5rem] px-4 py-2 border-1 border-red-500 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:text-red-100 hover:from-red-500 hover:via-red-600 hover:to-red-700 dark:from-red-600 dark:via-red-700 dark:to-red-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-red-700 dark:hover:via-red-800 dark:hover:to-red-900'
                onClick={() => {
                  table.getColumn('familyGroupCode')?.setFilterValue('');
                  table.getColumn('urbanSector')?.setFilterValue('');
                }}
              >
                <Trash />
              </Button>
            </div>

            <Button
              disabled={isDisabledButton}
              variant='ghost'
              className='col-start-1 col-end-3 row-start-2 row-end-3 md:row-start-1 md:row-end-2 md:col-start-3 w-full m-auto text-[14px] lg:text-[14px] h-full md:w-[15rem] px-4 py-2 border-1 border-green-500 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:text-green-100 hover:from-green-500 hover:via-green-600 hover:to-green-700 dark:from-green-600 dark:via-green-700 dark:to-green-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-green-700 dark:hover:via-green-800 dark:hover:to-green-900'
              onClick={() => {
                setIsFiltersSearchByTermDisabled(true);
                table.getColumn('familyGroupCode')?.setFilterValue('');
                table.getColumn('urbanSector')?.setFilterValue('');
              }}
            >
              Nueva Búsqueda
            </Button>
          </div>
        </div>
      )}

      {/* Render data table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader className='px-2'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className='text-center text-slate-700 dark:text-slate-200 font-bold text-[13px] lg:text-sm'
                      key={header.id}
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

          {!query?.error && !isFiltersSearchByTermDisabled && !query.isPending && (
            <TableBody>
              {table?.getRowModel()?.rows?.length ? (
                table?.getRowModel()?.rows.map((row) => (
                  <TableRow
                    className='text-center font-normal text-[14px] lg:text-[14px]'
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className='px-2 lg:px-4 py-2.5' key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    Sin resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      {!query?.error && !isFiltersSearchByTermDisabled && !query.isPending && (
        <div className='flex items-center justify-between space-x-2 py-4'>
          {!query.isPending && (
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
      )}

      {searchParams && query?.isPending && (
        <div className='py-10'>
          <LoadingSpinner isPendingRequest={query?.isPending} />
        </div>
      )}
    </div>
  );
}
