import { useEffect, useMemo, useCallback } from 'react';

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';

import {
  getAllMinistries,
  getMinistriesByFilters,
  getGeneralMinistriesReport,
  getMinistriesReportByFilters,
} from '@/modules/ministry/services/ministry.service';

import {
  type MinistrySearchFormByTerm,
  type MinistryQueryParams,
} from '@/modules/ministry/types';

import {
  type MinistrySearchMode,
  useMinistryStore,
  selectFiltersDisabled,
} from '@/modules/ministry/store';

import { dateFormatterToDDMMYYYY } from '@/shared/helpers/date-formatter-to-ddmmyyyy.helper';

import {
  MinistrySearchType,
  MinistrySearchTypeNames,
  MinistrySearchSelectOptionNames,
} from '@/modules/ministry/enums';

import { useConditionalListQuery, useManualQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';

//* Static filter configuration - hoisted outside component
const FILTERS_CONFIG: FilterConfig[] = [
  {
    columnId: 'ministryCustomName',
    placeholder: 'Nombre de ministerio...',
    type: 'text',
  },
  {
    columnId: 'district',
    placeholder: 'Distrito...',
    type: 'text',
  },
];

//* Pre-built Maps for O(1) lookups
const searchTypeNamesMap = new Map(Object.entries(MinistrySearchTypeNames));
const searchSelectOptionNamesMap = new Map(Object.entries(MinistrySearchSelectOptionNames));

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: Array<ColumnDef<TData, TValue>>;
  searchMode: MinistrySearchMode;
  generalSearchParams: GeneralSearchForm | undefined;
  filterSearchParams: MinistrySearchFormByTerm | undefined;
  dataForm: MinistrySearchFormByTerm | undefined;
  setGeneralSearchParams: React.Dispatch<React.SetStateAction<GeneralSearchForm | undefined>>;
  setFilterSearchParams: React.Dispatch<React.SetStateAction<MinistrySearchFormByTerm | undefined>>;
}

export function UnifiedMinistrySearchDataTable<TData, TValue>({
  columns,
  searchMode,
  generalSearchParams,
  filterSearchParams,
  dataForm,
  setGeneralSearchParams,
  setFilterSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* Store selectors
  const isFiltersDisabled = useMinistryStore(selectFiltersDisabled);
  const { setFiltersDisabled, setSearchData } = useMinistryStore();

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Determine current search params based on mode
  const currentSearchParams = searchMode === 'general' ? generalSearchParams : filterSearchParams;

  //* Query for general search
  const generalQuery = useConditionalListQuery({
    queryKey: ['unified-ministries-general', generalSearchParams],
    queryFn: () => getAllMinistries(generalSearchParams as MinistryQueryParams),
    enabled: searchMode === 'general' && !!generalSearchParams,
  });

  //* Query for filter search
  const filterQuery = useConditionalListQuery({
    queryKey: ['unified-ministries-filters', filterSearchParams],
    queryFn: () => getMinistriesByFilters(filterSearchParams as MinistryQueryParams),
    enabled: searchMode === 'filters' && !!filterSearchParams,
  });

  //* Select active query based on mode
  const activeQuery = searchMode === 'general' ? generalQuery : filterQuery;

  //* Derived state - no useState needed
  const isDisabledButton = activeQuery?.isPending;

  //* Set data result query
  useEffect(() => {
    setSearchData(activeQuery.data);
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
    queryKey: ['unified-ministries-report-general', generalSearchParams],
    queryFn: () => getGeneralMinistriesReport(generalSearchParams as MinistryQueryParams),
  });

  const filterReportQuery = useManualQuery({
    queryKey: ['unified-ministries-report-filters', filterSearchParams],
    queryFn: () => getMinistriesReportByFilters(filterSearchParams as MinistryQueryParams),
  });

  const activeReportQuery = searchMode === 'general' ? generalReportQuery : filterReportQuery;

  const handleGenerateReport = useCallback((): void => {
    activeReportQuery.refetch();
  }, [activeReportQuery]);

  const handleNewSearch = useCallback((): void => {
    setFiltersDisabled(true);
  }, [setFiltersDisabled]);

  //* Memoized search term display - O(1) lookups with Map
  const searchTermDisplay = useMemo((): string => {
    if (searchMode === 'general') {
      return '';
    }

    if (!dataForm?.searchType) return '';

    if (
      dataForm.searchType === MinistrySearchType.MinistryCustomName ||
      dataForm.searchType === MinistrySearchType.Department ||
      dataForm.searchType === MinistrySearchType.Province ||
      dataForm.searchType === MinistrySearchType.Address ||
      dataForm.searchType === MinistrySearchType.UrbanSector ||
      dataForm.searchType === MinistrySearchType.District
    ) {
      return dataForm.inputTerm ?? '';
    }

    if (
      dataForm.searchType === MinistrySearchType.FirstNames ||
      dataForm.searchType === MinistrySearchType.LastNames
    ) {
      return dataForm.inputTerm ?? '';
    }

    if (dataForm.searchType === MinistrySearchType.FullNames) {
      return `${dataForm.firstNamesTerm ?? ''} ${dataForm.lastNamesTerm ?? ''}`.trim();
    }

    if (dataForm.searchType === MinistrySearchType.FoundingDate) {
      const fromDate = dataForm.dateTerm?.from
        ? dateFormatterToDDMMYYYY(dataForm.dateTerm.from)
        : '';
      const toDate = dataForm.dateTerm?.to
        ? ` - ${dateFormatterToDDMMYYYY(dataForm.dateTerm.to)}`
        : '';
      return `${fromDate}${toDate}`;
    }

    if (
      dataForm.searchType === MinistrySearchType.RecordStatus ||
      dataForm.searchType === MinistrySearchType.MinistryType
    ) {
      return searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
    }

    return '';
  }, [searchMode, dataForm]);

  //* Memoized search type display - O(1) lookup with Map
  const searchTypeDisplay = useMemo((): string => {
    if (searchMode === 'general') {
      return 'Ministerios (Todas)';
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
      <DataTable
        columns={columns}
        data={(activeQuery.data as TData[]) ?? []}
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
