import { useEffect, useMemo, useCallback } from 'react';

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';

import {
  getAllChurches,
  getChurchesByFilters,
  getGeneralChurchesReport,
  getChurchesReportByFilters,
} from '@/modules/church/services/church.service';
import {
  type ChurchQueryParams,
  type ChurchSearchFormByTerm,
} from '@/modules/church/types';

import {
  type ChurchSearchMode,
  useChurchStore,
  selectFiltersDisabled,
  selectSetFiltersDisabled,
  selectSetSearchData,
} from '@/modules/church/store';

import { dateFormatterToDDMMYYYY } from '@/shared/helpers/date-formatter-to-ddmmyyyy.helper';

import {
  ChurchSearchType,
  ChurchSearchTypeNames,
  ChurchSearchSelectOptionNames,
} from '@/modules/church/enums';

import { useConditionalListQuery, useManualQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';

//* Static filter configuration - hoisted outside component
const FILTERS_CONFIG: FilterConfig[] = [
  {
    columnId: 'abbreviatedChurchName',
    placeholder: 'Nombre abreviado de iglesia...',
    type: 'text',
  },
  {
    columnId: 'district',
    placeholder: 'Distrito...',
    type: 'text',
  },
];

//* Pre-built Maps for O(1) lookups
const searchTypeNamesMap = new Map(Object.entries(ChurchSearchTypeNames));
const searchSelectOptionNamesMap = new Map(Object.entries(ChurchSearchSelectOptionNames));

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: Array<ColumnDef<TData, TValue>>;
  searchMode: ChurchSearchMode;
  generalSearchParams: GeneralSearchForm | undefined;
  filterSearchParams: ChurchSearchFormByTerm | undefined;
  dataForm: ChurchSearchFormByTerm | undefined;
  setGeneralSearchParams: React.Dispatch<React.SetStateAction<GeneralSearchForm | undefined>>;
  setFilterSearchParams: React.Dispatch<React.SetStateAction<ChurchSearchFormByTerm | undefined>>;
}

export function UnifiedChurchSearchDataTable<TData, TValue>({
  columns,
  searchMode,
  generalSearchParams,
  filterSearchParams,
  dataForm,
  setGeneralSearchParams,
  setFilterSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* Store selectors
  const isFiltersDisabled = useChurchStore(selectFiltersDisabled);
  const setFiltersDisabled = useChurchStore(selectSetFiltersDisabled);
  const setSearchData = useChurchStore(selectSetSearchData);

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Determine current search params based on mode
  const currentSearchParams = searchMode === 'general' ? generalSearchParams : filterSearchParams;

  //* Query for general search
  const generalQuery = useConditionalListQuery({
    queryKey: ['unified-churches-general', generalSearchParams],
    queryFn: () => getAllChurches(generalSearchParams as ChurchQueryParams),
    enabled: searchMode === 'general' && !!generalSearchParams,
  });

  //* Query for filter search
  const filterQuery = useConditionalListQuery({
    queryKey: ['unified-churches-filters', filterSearchParams],
    queryFn: () => getChurchesByFilters(filterSearchParams as ChurchQueryParams),
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
    queryKey: ['unified-churches-report-general', generalSearchParams],
    queryFn: () => getGeneralChurchesReport(generalSearchParams as ChurchQueryParams),
  });

  const filterReportQuery = useManualQuery({
    queryKey: ['unified-churches-report-filters', filterSearchParams],
    queryFn: () => getChurchesReportByFilters(filterSearchParams as ChurchQueryParams),
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
      dataForm.searchType === ChurchSearchType.ChurchName ||
      dataForm.searchType === ChurchSearchType.Department ||
      dataForm.searchType === ChurchSearchType.Province ||
      dataForm.searchType === ChurchSearchType.Address ||
      dataForm.searchType === ChurchSearchType.UrbanSector ||
      dataForm.searchType === ChurchSearchType.District
    ) {
      return dataForm.inputTerm ?? '';
    }

    if (dataForm.searchType === ChurchSearchType.FoundingDate) {
      const fromDate = dataForm.dateTerm?.from
        ? dateFormatterToDDMMYYYY(dataForm.dateTerm.from)
        : '';
      const toDate = dataForm.dateTerm?.to
        ? ` - ${dateFormatterToDDMMYYYY(dataForm.dateTerm.to)}`
        : '';
      return `${fromDate}${toDate}`;
    }

    if (dataForm.searchType === ChurchSearchType.RecordStatus) {
      return searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
    }

    return '';
  }, [searchMode, dataForm]);

  //* Memoized search type display - O(1) lookup with Map
  const searchTypeDisplay = useMemo((): string => {
    if (searchMode === 'general') {
      return 'Iglesias y anexos (Todas)';
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
