import { useEffect, useMemo, useCallback } from 'react';

import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';

import {
  getOfferingsExpenses,
  getOfferingsExpensesByTerm,
  getGeneralOfferingExpensesReport,
  getOfferingExpensesReportByTerm,
} from '@/modules/offering/expense/services/offering-expense.service';

import { type OfferingExpenseQueryParams } from '@/modules/offering/expense/interfaces/offering-expense-query-params.interface';
import { type OfferingExpenseSearchFormByTerm } from '@/modules/offering/expense/interfaces/offering-expense-search-form-by-term.interface';

import {
  type OfferingExpenseSearchMode,
  useOfferingExpenseStore,
  selectFiltersDisabled,
  selectSetFiltersDisabled,
  selectSetSearchData,
} from '@/modules/offering/expense/stores/offering-expenses.store';

import {
  OfferingExpenseSearchType,
  OfferingExpenseSearchTypeNames,
} from '@/modules/offering/expense/enums/offering-expense-search-type.enum';
import { OfferingExpenseSearchSubTypeNames } from '@/modules/offering/expense/enums/offering-expense-search-sub-type.enum';
import { OfferingExpenseSearchSelectOptionNames } from '@/modules/offering/expense/enums/offering-expense-search-select-option.enum';

import { dateFormatterToDDMMYYYY } from '@/shared/helpers/date-formatter-to-ddmmyyyy.helper';

import { useConditionalListQuery, useManualQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';

//* Static filter configuration
const FILTERS_CONFIG: FilterConfig[] = [
  {
    columnId: 'type',
    placeholder: 'Tipo...',
    type: 'text',
  },
  {
    columnId: 'subType',
    placeholder: 'Sub-tipo...',
    type: 'text',
  },
];

//* Pre-built Maps for O(1) lookups
const searchTypeNamesMap = new Map(Object.entries(OfferingExpenseSearchTypeNames));
const searchSubTypeNamesMap = new Map(Object.entries(OfferingExpenseSearchSubTypeNames));
const selectOptionNamesMap = new Map(Object.entries(OfferingExpenseSearchSelectOptionNames));

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: Array<ColumnDef<TData, TValue>>;
  searchMode: OfferingExpenseSearchMode;
  generalSearchParams: GeneralSearchForm | undefined;
  filterSearchParams: OfferingExpenseSearchFormByTerm | undefined;
  dataForm: OfferingExpenseSearchFormByTerm | undefined;
  setGeneralSearchParams: React.Dispatch<React.SetStateAction<GeneralSearchForm | undefined>>;
  setFilterSearchParams: React.Dispatch<
    React.SetStateAction<OfferingExpenseSearchFormByTerm | undefined>
  >;
}

export function UnifiedOfferingExpenseSearchDataTable<TData, TValue>({
  columns,
  searchMode,
  generalSearchParams,
  filterSearchParams,
  dataForm,
  setGeneralSearchParams,
  setFilterSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* Store selectors
  const isFiltersDisabled = useOfferingExpenseStore(selectFiltersDisabled);
  const setFiltersDisabled = useOfferingExpenseStore(selectSetFiltersDisabled);
  const setSearchData = useOfferingExpenseStore(selectSetSearchData);

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Determine current search params based on mode
  const currentSearchParams = searchMode === 'general' ? generalSearchParams : filterSearchParams;

  //* Query for general search
  const generalQuery = useConditionalListQuery({
    queryKey: ['unified-offering-expense-general', generalSearchParams],
    queryFn: () => getOfferingsExpenses(generalSearchParams as OfferingExpenseQueryParams),
    enabled: searchMode === 'general' && !!generalSearchParams,
  });

  //* Query for filter search
  const filterQuery = useConditionalListQuery({
    queryKey: ['unified-offering-expense-filters', filterSearchParams],
    queryFn: () => getOfferingsExpensesByTerm(filterSearchParams as OfferingExpenseQueryParams),
    enabled: searchMode === 'filters' && !!filterSearchParams,
  });

  //* Select active query based on mode
  const activeQuery = searchMode === 'general' ? generalQuery : filterQuery;

  //* Derived state
  const isDisabledButton = activeQuery?.isPending;

  //* Translate data to Spanish
  const translatedData = useMemo(() => {
    if (!activeQuery.data) return [];

    return activeQuery.data.map((item: any) => ({
      ...item,
      type: searchTypeNamesMap.get(item.type) ?? item.type,
      subType: searchSubTypeNamesMap.get(item.subType) ?? '-',
    }));
  }, [activeQuery.data]);

  //* Set data result query
  useEffect(() => {
    setSearchData(activeQuery.data as any);
  }, [activeQuery?.isFetching, activeQuery.data, setSearchData]);

  useEffect(() => {
    if (activeQuery.error?.message && activeQuery.error?.message !== 'Unauthorized') {
      toast.error(activeQuery?.error?.message, {
        position: 'top-center',
        className: 'justify-center',
      });

      if (searchMode === 'general') {
        setGeneralSearchParams(undefined);
      } else {
        setFilterSearchParams(undefined);
      }
      setFiltersDisabled(true);
    }

    if (activeQuery.error?.message === 'Unauthorized') {
      toast.error('Operacion rechazada, el token expiro ingresa nuevamente.', {
        position: 'top-center',
        className: 'justify-center',
      });

      if (searchMode === 'general') {
        setGeneralSearchParams(undefined);
      } else {
        setFilterSearchParams(undefined);
      }
      setFiltersDisabled(true);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [
    activeQuery?.error,
    searchMode,
    setGeneralSearchParams,
    setFilterSearchParams,
    setFiltersDisabled,
    navigate,
  ]);

  //* Query Report and Event trigger
  const generalReportQuery = useManualQuery({
    queryKey: ['unified-offering-expense-report-general', generalSearchParams],
    queryFn: () =>
      getGeneralOfferingExpensesReport(generalSearchParams as OfferingExpenseQueryParams),
  });

  const filterReportQuery = useManualQuery({
    queryKey: ['unified-offering-expense-report-filters', filterSearchParams],
    queryFn: () =>
      getOfferingExpensesReportByTerm(filterSearchParams as OfferingExpenseQueryParams),
  });

  const activeReportQuery = searchMode === 'general' ? generalReportQuery : filterReportQuery;

  const handleGenerateReport = useCallback((): void => {
    activeReportQuery.refetch();
  }, [activeReportQuery]);

  const handleNewSearch = useCallback((): void => {
    setFiltersDisabled(true);
  }, [setFiltersDisabled]);

  //* Memoized search term display
  const searchTermDisplay = useMemo((): string => {
    if (searchMode === 'general') return '';
    if (!dataForm?.searchType) return '';

    // Date-based search
    if (dataForm.searchType !== OfferingExpenseSearchType.RecordStatus) {
      const fromDate = dataForm.dateTerm?.from
        ? dateFormatterToDDMMYYYY(dataForm.dateTerm.from)
        : '';
      const toDate = dataForm.dateTerm?.to
        ? ` - ${dateFormatterToDDMMYYYY(dataForm.dateTerm.to)}`
        : '';
      return `${fromDate}${toDate}`;
    }

    // Record status
    if (dataForm.searchType === OfferingExpenseSearchType.RecordStatus) {
      return selectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
    }

    return '';
  }, [searchMode, dataForm]);

  //* Memoized search type display
  const searchTypeDisplay = useMemo((): string => {
    if (searchMode === 'general') {
      return 'Salidas de ofrendas (Todas)';
    }
    return searchTypeNamesMap.get(dataForm?.searchType ?? '') ?? '';
  }, [searchMode, dataForm?.searchType]);

  //* Memoized search metadata for table header
  const searchMetadata = useMemo(() => {
    if (isFiltersDisabled) return undefined;

    return {
      title: searchTypeDisplay,
      subtitle: searchTermDisplay || undefined,
      recordCount: activeQuery.data?.length ?? 0,
    };
  }, [isFiltersDisabled, searchTypeDisplay, searchTermDisplay, activeQuery.data?.length]);

  return (
    <div>
      <Toaster position='top-center' richColors />
      <DataTable
        columns={columns}
        data={(translatedData as TData[]) ?? []}
        isLoading={!!currentSearchParams && activeQuery?.isPending}
        isFiltersDisabled={isFiltersDisabled || isDisabledButton}
        searchMetadata={searchMetadata}
        filters={FILTERS_CONFIG}
        onNewSearch={handleNewSearch}
        onGenerateReport={handleGenerateReport}
        isGeneratingReport={activeReportQuery.isFetching}
        showHeader={!isFiltersDisabled}
        showFilters={!isFiltersDisabled}
        showPagination={!isFiltersDisabled && !activeQuery?.error && !activeQuery.isPending}
        showReportButton={!activeQuery.isPending}
      />
    </div>
  );
}
