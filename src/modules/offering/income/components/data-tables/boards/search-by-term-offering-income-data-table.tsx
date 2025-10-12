/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
  OfferingIncomeSearchType,
  OfferingIncomeSearchTypeNames,
} from '@/modules/offering/income/enums/offering-income-search-type.enum';
import {
  OfferingIncomeSearchSubType,
  OfferingIncomeSearchSubTypeNames,
} from '@/modules/offering/income/enums/offering-income-search-sub-type.enum';
import { OfferingIncomeCreationTypeNames } from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import { OfferingIncomeCreationSubTypeNames } from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import { OfferingIncomeCreationCategoryNames } from '@/modules/offering/income/enums/offering-income-creation-category.enum';
import { OfferingIncomeSearchSelectOptionNames } from '@/modules/offering/income/enums/offering-income-search-select-option.enum';

import { type OfferingIncomeQueryParams } from '@/modules/offering/income/interfaces/offering-income-query-params.interface';
import { type OfferingIncomeSearchFormByTerm } from '@/modules/offering/income/interfaces/offering-income-search-form-by-term.interface';

import {
  getOfferingIncomeReportByTerm,
  getOfferingsIncomeByTerm,
} from '@/modules/offering/income/services/offering-income.service';

import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';
import { dateFormatterToDDMMYYYY } from '@/shared/helpers/date-formatter-to-ddmmyyyy.helper';

import { useOfferingIncomeStore } from '@/modules/offering/income/stores/offering-income.store';

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
  searchParams: OfferingIncomeSearchFormByTerm | undefined;
  setSearchParams: React.Dispatch<React.SetStateAction<OfferingIncomeSearchFormByTerm | undefined>>;
  dataForm: OfferingIncomeSearchFormByTerm | undefined;
}

export function SearchByTermOfferingIncomeDataTable<TData, TValue>({
  columns,
  searchParams,
  setSearchParams,
  dataForm,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* States
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    copastorOrPreacher: false,
  });

  const isFiltersSearchByTermDisabled = useOfferingIncomeStore(
    (state) => state.isFiltersSearchByTermDisabled
  );
  const setIsFiltersSearchByTermDisabled = useOfferingIncomeStore(
    (state) => state.setIsFiltersSearchByTermDisabled
  );
  const setDataSearchByTermResResponse = useOfferingIncomeStore(
    (state) => state.setDataSearchByTermResponse
  );

  const [translatedData, setTranslatedData] = useState([]);
  const [isDisabledButton, setIsDisabledButton] = useState(false);

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Queries
  const query = useQuery({
    queryKey: ['offering-income-by-term', searchParams],
    queryFn: () => getOfferingsIncomeByTerm(searchParams as OfferingIncomeQueryParams),
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

  //* Transform data to Spanish
  useEffect(() => {
    if (query.data) {
      const transformedData = query.data.map((item) => ({
        ...item,
        type: Object.entries(OfferingIncomeCreationTypeNames).find(
          ([key]) => key === item.type
        )?.[1],
        subType:
          Object.entries(OfferingIncomeCreationSubTypeNames).find(
            ([key]) => key === item.subType
          )?.[1] ?? '-',
        category:
          Object.entries(OfferingIncomeCreationCategoryNames).find(
            ([key]) => key === item.category
          )?.[1] ?? '-',
      }));
      setTranslatedData(transformedData as any);
    }
  }, [query.data]);

  //* Table
  const table = useReactTable({
    data: translatedData as TData[],
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
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  //* Query Report and Event trigger
  const generateReportQuery = useQuery({
    queryKey: ['offering-income-report-by-term', searchParams],
    queryFn: () => getOfferingIncomeReportByTerm(searchParams as OfferingIncomeQueryParams),
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
                Object.entries(OfferingIncomeSearchTypeNames).find(
                  ([key, value]) => key === dataForm?.searchType && value
                )?.[1]
              }`}
            </span>
            {(dataForm?.searchType === OfferingIncomeSearchType.Activities ||
              dataForm?.searchType === OfferingIncomeSearchType.ChurchGround ||
              dataForm?.searchType === OfferingIncomeSearchType.FamilyGroup ||
              dataForm?.searchType === OfferingIncomeSearchType.GeneralFasting ||
              dataForm?.searchType === OfferingIncomeSearchType.GeneralVigil ||
              dataForm?.searchType === OfferingIncomeSearchType.GeneralEvangelism ||
              dataForm?.searchType === OfferingIncomeSearchType.IncomeAdjustment ||
              dataForm?.searchType === OfferingIncomeSearchType.Special ||
              // dataForm?.searchType === OfferingIncomeSearchType.SundaySchool ||
              dataForm?.searchType === OfferingIncomeSearchType.SundayService ||
              dataForm?.searchType === OfferingIncomeSearchType.UnitedService ||
              // dataForm?.searchType === OfferingIncomeSearchType.YouthService ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalFasting ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalVigil ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalEvangelism) && (
              <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                {' '}
                ~{' '}
                {`${
                  Object.entries(OfferingIncomeSearchSubTypeNames).find(
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
            {(dataForm?.searchType === OfferingIncomeSearchType.ChurchGround ||
              dataForm?.searchType === OfferingIncomeSearchType.Special) &&
              // dataForm?.searchType === OfferingIncomeSearchType.SundaySchool ||
              // dataForm?.searchType === OfferingIncomeSearchType.YouthService
              (dataForm?.searchSubType ===
                OfferingIncomeSearchSubType.OfferingByContributorFirstNames ||
                dataForm?.searchSubType ===
                  OfferingIncomeSearchSubType.OfferingByContributorLastNames ||
                dataForm?.searchSubType ===
                  OfferingIncomeSearchSubType.OfferingByContributorFullNames) && (
                <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                  {`${
                    Object.entries(OfferingIncomeSearchSelectOptionNames).find(
                      ([key, value]) => key === dataForm?.selectTerm && value
                    )?.[1]
                  } ~ `}
                </span>
              )}
            {(dataForm?.searchType === OfferingIncomeSearchType.FamilyGroup ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalFasting ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalVigil ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalEvangelism) &&
              (dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCode ||
                dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate ||
                dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByZone ||
                dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate) && (
                <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                  {`${dataForm?.inputTerm}`}
                </span>
              )}
            {(dataForm?.searchType === OfferingIncomeSearchType.ChurchGround ||
              dataForm?.searchType === OfferingIncomeSearchType.FamilyGroup ||
              dataForm?.searchType === OfferingIncomeSearchType.Special ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalFasting ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalVigil ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalEvangelism) &&
              // dataForm?.searchType === OfferingIncomeSearchType.SundaySchool ||
              // dataForm?.searchType === OfferingIncomeSearchType.YouthService
              (dataForm?.searchSubType ===
                OfferingIncomeSearchSubType.OfferingByContributorFirstNames ||
                dataForm?.searchSubType ===
                  OfferingIncomeSearchSubType.OfferingByPreacherFirstNames ||
                dataForm?.searchSubType ===
                  OfferingIncomeSearchSubType.OfferingBySupervisorFirstNames) && (
                <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                  {`${dataForm?.firstNamesTerm ? dataForm?.firstNamesTerm : 'Todos'}`}
                </span>
              )}
            {(dataForm?.searchType === OfferingIncomeSearchType.ChurchGround ||
              dataForm?.searchType === OfferingIncomeSearchType.FamilyGroup ||
              dataForm?.searchType === OfferingIncomeSearchType.Special ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalFasting ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalVigil ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalEvangelism) &&
              // dataForm?.searchType === OfferingIncomeSearchType.SundaySchool ||
              // dataForm?.searchType === OfferingIncomeSearchType.YouthService
              (dataForm?.searchSubType ===
                OfferingIncomeSearchSubType.OfferingByContributorLastNames ||
                dataForm?.searchSubType ===
                  OfferingIncomeSearchSubType.OfferingByPreacherLastNames ||
                dataForm?.searchSubType ===
                  OfferingIncomeSearchSubType.OfferingBySupervisorLastNames) && (
                <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                  {`${dataForm?.lastNamesTerm ? dataForm?.lastNamesTerm : 'Todos'}`}
                </span>
              )}
            {(dataForm?.searchType === OfferingIncomeSearchType.ChurchGround ||
              dataForm?.searchType === OfferingIncomeSearchType.FamilyGroup ||
              dataForm?.searchType === OfferingIncomeSearchType.Special ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalFasting ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalVigil ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalEvangelism) &&
              // dataForm?.searchType === OfferingIncomeSearchType.SundaySchool ||
              // dataForm?.searchType === OfferingIncomeSearchType.YouthService
              (dataForm?.searchSubType ===
                OfferingIncomeSearchSubType.OfferingByContributorFullNames ||
                dataForm?.searchSubType ===
                  OfferingIncomeSearchSubType.OfferingByPreacherFullNames ||
                dataForm?.searchSubType ===
                  OfferingIncomeSearchSubType.OfferingBySupervisorFullNames) && (
                <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                  {`${dataForm?.firstNamesTerm ? dataForm?.firstNamesTerm : 'Todos'} ${dataForm?.lastNamesTerm ? dataForm?.lastNamesTerm : 'Todos'} `}
                </span>
              )}
            {(dataForm?.searchType === OfferingIncomeSearchType.Activities ||
              dataForm?.searchType === OfferingIncomeSearchType.ChurchGround ||
              dataForm?.searchType === OfferingIncomeSearchType.FamilyGroup ||
              dataForm?.searchType === OfferingIncomeSearchType.GeneralFasting ||
              dataForm?.searchType === OfferingIncomeSearchType.GeneralVigil ||
              dataForm?.searchType === OfferingIncomeSearchType.GeneralEvangelism ||
              dataForm?.searchType === OfferingIncomeSearchType.IncomeAdjustment ||
              dataForm?.searchType === OfferingIncomeSearchType.Special ||
              // dataForm?.searchType === OfferingIncomeSearchType.SundaySchool ||
              dataForm?.searchType === OfferingIncomeSearchType.SundayService ||
              dataForm?.searchType === OfferingIncomeSearchType.UnitedService ||
              // dataForm?.searchType === OfferingIncomeSearchType.YouthService ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalFasting ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalVigil ||
              dataForm?.searchType === OfferingIncomeSearchType.ZonalEvangelism) &&
              (dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByDate ||
                dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate ||
                dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate ||
                dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate) && (
                <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                  {dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate ||
                  dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate
                    ? ` - ${dataForm?.dateTerm?.from ? dateFormatterToDDMMYYYY(dataForm?.dateTerm?.from) : ''} ${dataForm?.dateTerm?.to ? ` - ${dateFormatterToDDMMYYYY(dataForm?.dateTerm?.to)}` : ''}`
                    : `${dataForm?.dateTerm?.from ? dateFormatterToDDMMYYYY(dataForm?.dateTerm?.from) : ''} ${dataForm?.dateTerm?.to ? ` - ${dateFormatterToDDMMYYYY(dataForm?.dateTerm?.to)}` : ''}`}
                </span>
              )}
            {
              // dataForm?.searchType === OfferingIncomeSearchType.SundaySchool ||
              ((dataForm?.searchType === OfferingIncomeSearchType.SundayService &&
                (dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByShift ||
                  dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate)) ||
                dataForm?.searchType === OfferingIncomeSearchType.RecordStatus) && (
                <span className='font-medium text-[14px] md:text-[14.5px] italic'>
                  {dataForm?.searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate
                    ? ` - ${
                        Object.entries(OfferingIncomeSearchSelectOptionNames).find(
                          ([key, value]) => key === dataForm?.selectTerm && value
                        )?.[1]
                      }`
                    : `${
                        Object.entries(OfferingIncomeSearchSelectOptionNames).find(
                          ([key, value]) => key === dataForm?.selectTerm && value
                        )?.[1]
                      }`}
                </span>
              )
            }
          </div>

          {/* Records Count*/}
          <div>
            <span className='text-purple-500 dark:text-purple-500 font-bold text-[14.5px] md:text-[16px]'>
              Cantidad de registros:
            </span>{' '}
            <span className='font-medium text-[14px] md:text-[15px] italic'>
              {query.data?.length} registros
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
            <div className='flex w-full flex-col md:flex-row col-span-2 gap-2 md:gap-3 md:row-start-1 md:row-end-2 border-b-2 md:border-none'>
              <div className='flex flex-col w-full'>
                <label className='text-[13px] text-slate-600 dark:text-slate-300 font-medium mb-1'>
                  Buscar por sub-tipo
                </label>
                <Input
                  disabled={isDisabledButton}
                  placeholder='Sub-tipo...'
                  value={(table.getColumn('subType')?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn('subType')?.setFilterValue(event.target.value)
                  }
                  className='text-[14px] lg:text-[14px] w-full'
                />
              </div>

              <div className='flex flex-col w-full'>
                <label className='text-[13px] text-slate-600 dark:text-slate-300 font-medium mb-1'>
                  Buscar por co-pastor o predicador
                </label>
                <Input
                  disabled={isDisabledButton}
                  placeholder='Buscar por co-pastor o predicador...'
                  value={(table.getColumn('copastorOrPreacher')?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn('copastorOrPreacher')?.setFilterValue(event.target.value)
                  }
                  className='text-[14px] lg:text-[14px] w-full'
                />
              </div>

              <Button
                disabled={isDisabledButton}
                variant='ghost'
                className='mt-1.5 md:mt-6 lg:mt-5 mb-4 w-full md:w-auto md:h-auto lg:h-auto px-4 py-2 border-1 border-red-500 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:text-red-100 hover:from-red-500 hover:via-red-600 hover:to-red-700  dark:from-red-600 dark:via-red-700 dark:to-red-800 dark:text-gray-100  dark:hover:text-gray-200 dark:hover:from-red-700 dark:hover:via-red-800  dark:hover:to-red-900'
              >
                <Trash />
              </Button>
            </div>

            <Button
              disabled={isDisabledButton}
              variant='ghost'
              className='col-start-1 col-end-3 row-start-2 row-end-3 md:row-start-1 md:row-end-2 md:col-start-3 w-full m-auto text-[14px] lg:text-[14px] md:h-auto lg:h-full md:w-[15rem] px-4 md:py-2.5 border-1 border-green-500 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:text-green-100 hover:from-green-500 hover:via-green-600 hover:to-green-700 dark:from-green-600 dark:via-green-700 dark:to-green-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-green-700 dark:hover:via-green-800 dark:hover:to-green-900'
              onClick={() => {
                setIsFiltersSearchByTermDisabled(true);
                table.getColumn('subType')?.setFilterValue('');
                table.getColumn('category')?.setFilterValue('');
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
          <div className='flex flex-col md:flex-row gap-y-2 items-center'>
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

            <div className='flex w-[100px] items-center justify-center text-sm font-medium text-center md:hidden'>
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </div>
          </div>

          <div className='w-[100px] items-center justify-center text-sm font-medium text-center hidden md:block'>
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
      )}

      {searchParams && query?.isPending && (
        <div className='py-10'>
          <LoadingSpinner isPendingRequest={query?.isPending} />
        </div>
      )}
    </div>
  );
}
