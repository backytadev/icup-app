import { useEffect, useMemo, useCallback } from 'react';

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';

import {
  getZones,
  getZonesByFilters,
  getGeneralZonesReport,
  getZonesReportByTerm,
} from '@/modules/zone/services/zone.service';

import {
  type ZoneSearchFormByTerm,
  type ZoneQueryParams,
} from '@/modules/zone/types';

import {
  type ZoneSearchMode,
  useZoneStore,
  selectFiltersDisabled,
} from '@/modules/zone/store';

import {
  ZoneSearchType,
  ZoneSearchTypeNames,
  ZoneSearchSelectOptionNames,
} from '@/modules/zone/enums';

import { useConditionalListQuery, useManualQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';

//* Static filter configuration - hoisted outside component
const FILTERS_CONFIG: FilterConfig[] = [
  {
    columnId: 'zoneName',
    placeholder: 'Nombre de zona...',
    type: 'text',
  },
  {
    columnId: 'district',
    placeholder: 'Distrito...',
    type: 'text',
  },
];

//* Pre-built Maps for O(1) lookups
const searchTypeNamesMap = new Map(Object.entries(ZoneSearchTypeNames));
const searchSelectOptionNamesMap = new Map(Object.entries(ZoneSearchSelectOptionNames));

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: Array<ColumnDef<TData, TValue>>;
  searchMode: ZoneSearchMode;
  generalSearchParams: GeneralSearchForm | undefined;
  filterSearchParams: ZoneSearchFormByTerm | undefined;
  dataForm: ZoneSearchFormByTerm | undefined;
  setGeneralSearchParams: React.Dispatch<React.SetStateAction<GeneralSearchForm | undefined>>;
  setFilterSearchParams: React.Dispatch<React.SetStateAction<ZoneSearchFormByTerm | undefined>>;
}

export function UnifiedZoneSearchDataTable<TData, TValue>({
  columns,
  searchMode,
  generalSearchParams,
  filterSearchParams,
  dataForm,
  setGeneralSearchParams,
  setFilterSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* Store selectors
  const isFiltersDisabled = useZoneStore(selectFiltersDisabled);
  const { setFiltersDisabled, setSearchData } = useZoneStore();

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Determine current search params based on mode
  const currentSearchParams = searchMode === 'general' ? generalSearchParams : filterSearchParams;

  //* Query for general search
  const generalQuery = useConditionalListQuery({
    queryKey: ['unified-zones-general', generalSearchParams],
    queryFn: () => getZones(generalSearchParams as ZoneQueryParams),
    enabled: searchMode === 'general' && !!generalSearchParams,
  });

  //* Query for filter search
  const filterQuery = useConditionalListQuery({
    queryKey: ['unified-zones-filters', filterSearchParams],
    queryFn: () => getZonesByFilters(filterSearchParams as ZoneQueryParams),
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

  //* Report queries
  const generalReportQuery = useManualQuery({
    queryKey: ['unified-zones-report-general', generalSearchParams],
    queryFn: () => getGeneralZonesReport(generalSearchParams as ZoneQueryParams),
  });

  const filterReportQuery = useManualQuery({
    queryKey: ['unified-zones-report-filters', filterSearchParams],
    queryFn: () => getZonesReportByTerm(filterSearchParams as ZoneQueryParams),
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
      dataForm.searchType === ZoneSearchType.ZoneName ||
      dataForm.searchType === ZoneSearchType.Country ||
      dataForm.searchType === ZoneSearchType.Department ||
      dataForm.searchType === ZoneSearchType.Province ||
      dataForm.searchType === ZoneSearchType.District
    ) {
      return dataForm.inputTerm ?? '';
    }

    if (
      dataForm.searchType === ZoneSearchType.FirstNames ||
      dataForm.searchType === ZoneSearchType.LastNames
    ) {
      return dataForm.inputTerm ?? '';
    }

    if (dataForm.searchType === ZoneSearchType.FullNames) {
      return `${dataForm.firstNamesTerm ?? ''} ${dataForm.lastNamesTerm ?? ''}`.trim();
    }

    if (dataForm.searchType === ZoneSearchType.RecordStatus) {
      return searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
    }

    return '';
  }, [searchMode, dataForm]);

  //* Memoized search type display - O(1) lookup with Map
  const searchTypeDisplay = useMemo((): string => {
    if (searchMode === 'general') {
      return 'Zonas (Todas)';
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
