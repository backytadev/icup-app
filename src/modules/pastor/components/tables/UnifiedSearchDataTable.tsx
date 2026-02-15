import { useEffect, useMemo, useCallback } from 'react';

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';

import {
  getAllPastors,
  getPastorsByFilters,
  getGeneralPastorsReport,
  getPastorsReportByFilters,
} from '@/modules/pastor/services/pastor.service';

import {
  type PastorSearchFormByTerm,
  type PastorQueryParams,
} from '@/modules/pastor/types';

import {
  type PastorSearchMode,
  usePastorStore,
  selectFiltersDisabled,
} from '@/modules/pastor/store';

import { dateFormatterToDDMMYYYY } from '@/shared/helpers/date-formatter-to-ddmmyyyy.helper';

import {
  PastorSearchType,
  PastorSearchTypeNames,
  PastorSearchSelectOptionNames,
} from '@/modules/pastor/enums';

import { useConditionalListQuery, useManualQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';

//* Static filter configuration - hoisted outside component
const FILTERS_CONFIG: FilterConfig[] = [
  {
    columnId: 'firstNames',
    placeholder: 'Nombres...',
    type: 'text',
  },
  {
    columnId: 'lastNames',
    placeholder: 'Apellidos...',
    type: 'text',
  },
];

//* Pre-built Maps for O(1) lookups
const searchTypeNamesMap = new Map(Object.entries(PastorSearchTypeNames));
const searchSelectOptionNamesMap = new Map(Object.entries(PastorSearchSelectOptionNames));

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: Array<ColumnDef<TData, TValue>>;
  searchMode: PastorSearchMode;
  generalSearchParams: GeneralSearchForm | undefined;
  filterSearchParams: PastorSearchFormByTerm | undefined;
  dataForm: PastorSearchFormByTerm | undefined;
  setGeneralSearchParams: React.Dispatch<React.SetStateAction<GeneralSearchForm | undefined>>;
  setFilterSearchParams: React.Dispatch<React.SetStateAction<PastorSearchFormByTerm | undefined>>;
}

export function UnifiedPastorSearchDataTable<TData, TValue>({
  columns,
  searchMode,
  generalSearchParams,
  filterSearchParams,
  dataForm,
  setGeneralSearchParams,
  setFilterSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* Store selectors
  const isFiltersDisabled = usePastorStore(selectFiltersDisabled);
  const { setFiltersDisabled, setSearchData } = usePastorStore();

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Determine current search params based on mode
  const currentSearchParams = searchMode === 'general' ? generalSearchParams : filterSearchParams;

  //* Query for general search
  const generalQuery = useConditionalListQuery({
    queryKey: ['unified-pastors-general', generalSearchParams],
    queryFn: () => getAllPastors(generalSearchParams as PastorQueryParams),
    enabled: searchMode === 'general' && !!generalSearchParams,
  });

  //* Query for filter search
  const filterQuery = useConditionalListQuery({
    queryKey: ['unified-pastors-filters', filterSearchParams],
    queryFn: () => getPastorsByFilters(filterSearchParams as PastorQueryParams),
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
    queryKey: ['unified-pastors-report-general', generalSearchParams],
    queryFn: () => getGeneralPastorsReport(generalSearchParams as PastorQueryParams),
  });

  const filterReportQuery = useManualQuery({
    queryKey: ['unified-pastors-report-filters', filterSearchParams],
    queryFn: () => getPastorsReportByFilters(filterSearchParams as PastorQueryParams),
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
      dataForm.searchType === PastorSearchType.FirstNames ||
      dataForm.searchType === PastorSearchType.LastNames ||
      dataForm.searchType === PastorSearchType.ResidenceCountry ||
      dataForm.searchType === PastorSearchType.ResidenceDepartment ||
      dataForm.searchType === PastorSearchType.ResidenceProvince ||
      dataForm.searchType === PastorSearchType.ResidenceDistrict ||
      dataForm.searchType === PastorSearchType.ResidenceUrbanSector ||
      dataForm.searchType === PastorSearchType.ResidenceAddress
    ) {
      return dataForm.inputTerm ?? '';
    }

    if (dataForm.searchType === PastorSearchType.FullNames) {
      return `${dataForm.firstNamesTerm ?? ''} ${dataForm.lastNamesTerm ?? ''}`.trim();
    }

    if (dataForm.searchType === PastorSearchType.BirthDate) {
      const fromDate = dataForm.dateTerm?.from
        ? dateFormatterToDDMMYYYY(dataForm.dateTerm.from)
        : '';
      const toDate = dataForm.dateTerm?.to
        ? ` - ${dateFormatterToDDMMYYYY(dataForm.dateTerm.to)}`
        : '';
      return `${fromDate}${toDate}`;
    }

    if (
      dataForm.searchType === PastorSearchType.BirthMonth ||
      dataForm.searchType === PastorSearchType.Gender ||
      dataForm.searchType === PastorSearchType.MaritalStatus ||
      dataForm.searchType === PastorSearchType.RecordStatus
    ) {
      return searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
    }

    return '';
  }, [searchMode, dataForm]);

  //* Memoized search type display - O(1) lookup with Map
  const searchTypeDisplay = useMemo((): string => {
    if (searchMode === 'general') {
      return 'Pastores (Todas)';
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
