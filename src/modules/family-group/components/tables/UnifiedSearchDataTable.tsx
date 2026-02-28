import { useEffect, useMemo, useCallback } from 'react';

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';

import {
  getFamilyGroups,
  getFamilyGroupsByFilters,
  getGeneralFamilyGroupsReport,
  getFamilyGroupsReportByTerm,
} from '@/modules/family-group/services/family-group.service';

import {
  type FamilyGroupSearchFormByTerm,
  type FamilyGroupQueryParams,
} from '@/modules/family-group/types';

import {
  type FamilyGroupSearchMode,
  useFamilyGroupStore,
  selectFiltersDisabled,
} from '@/modules/family-group/store';

import {
  FamilyGroupSearchType,
  FamilyGroupSearchTypeNames,
  FamilyGroupSearchSelectOptionNames,
} from '@/modules/family-group/enums';

import { useConditionalListQuery, useManualQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';

//* Static filter configuration
const FILTERS_CONFIG: FilterConfig[] = [
  {
    columnId: 'familyGroupName',
    placeholder: 'Nombre de grupo...',
    type: 'text',
  },
  {
    columnId: 'district',
    placeholder: 'Distrito...',
    type: 'text',
  },
];

//* Pre-built Maps for O(1) lookups
const searchTypeNamesMap = new Map(Object.entries(FamilyGroupSearchTypeNames));
const searchSelectOptionNamesMap = new Map(Object.entries(FamilyGroupSearchSelectOptionNames));

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: Array<ColumnDef<TData, TValue>>;
  searchMode: FamilyGroupSearchMode;
  generalSearchParams: GeneralSearchForm | undefined;
  filterSearchParams: FamilyGroupSearchFormByTerm | undefined;
  dataForm: FamilyGroupSearchFormByTerm | undefined;
  setGeneralSearchParams: React.Dispatch<React.SetStateAction<GeneralSearchForm | undefined>>;
  setFilterSearchParams: React.Dispatch<
    React.SetStateAction<FamilyGroupSearchFormByTerm | undefined>
  >;
}

export function UnifiedFamilyGroupSearchDataTable<TData, TValue>({
  columns,
  searchMode,
  generalSearchParams,
  filterSearchParams,
  dataForm,
  setGeneralSearchParams,
  setFilterSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* Store selectors
  const isFiltersDisabled = useFamilyGroupStore(selectFiltersDisabled);
  const { setFiltersDisabled, setSearchData } = useFamilyGroupStore();

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Determine current search params based on mode
  const currentSearchParams = searchMode === 'general' ? generalSearchParams : filterSearchParams;

  //* Query for general search
  const generalQuery = useConditionalListQuery({
    queryKey: ['unified-family-groups-general', generalSearchParams],
    queryFn: () => getFamilyGroups(generalSearchParams as FamilyGroupQueryParams),
    enabled: searchMode === 'general' && !!generalSearchParams,
  });

  //* Query for filter search
  const filterQuery = useConditionalListQuery({
    queryKey: ['unified-family-groups-filters', filterSearchParams],
    queryFn: () => getFamilyGroupsByFilters(filterSearchParams as FamilyGroupQueryParams),
    enabled: searchMode === 'filters' && !!filterSearchParams,
  });

  //* Select active query based on mode
  const activeQuery = searchMode === 'general' ? generalQuery : filterQuery;

  //* Derived state
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
    queryKey: ['unified-family-groups-report-general', generalSearchParams],
    queryFn: () => getGeneralFamilyGroupsReport(generalSearchParams as FamilyGroupQueryParams),
  });

  const filterReportQuery = useManualQuery({
    queryKey: ['unified-family-groups-report-filters', filterSearchParams],
    queryFn: () => getFamilyGroupsReportByTerm(filterSearchParams as FamilyGroupQueryParams),
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

    if (
      dataForm.searchType === FamilyGroupSearchType.FamilyGroupName ||
      dataForm.searchType === FamilyGroupSearchType.FamilyGroupCode ||
      dataForm.searchType === FamilyGroupSearchType.ZoneName ||
      dataForm.searchType === FamilyGroupSearchType.Country ||
      dataForm.searchType === FamilyGroupSearchType.Department ||
      dataForm.searchType === FamilyGroupSearchType.Province ||
      dataForm.searchType === FamilyGroupSearchType.District ||
      dataForm.searchType === FamilyGroupSearchType.UrbanSector ||
      dataForm.searchType === FamilyGroupSearchType.Address
    ) {
      return dataForm.inputTerm ?? '';
    }

    if (
      dataForm.searchType === FamilyGroupSearchType.FirstNames ||
      dataForm.searchType === FamilyGroupSearchType.LastNames
    ) {
      return dataForm.inputTerm ?? '';
    }

    if (dataForm.searchType === FamilyGroupSearchType.FullNames) {
      return `${dataForm.firstNamesTerm ?? ''} ${dataForm.lastNamesTerm ?? ''}`.trim();
    }

    if (dataForm.searchType === FamilyGroupSearchType.RecordStatus) {
      return searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
    }

    return '';
  }, [searchMode, dataForm]);

  //* Memoized search type display
  const searchTypeDisplay = useMemo((): string => {
    if (searchMode === 'general') return 'Grupos Familiares (Todos)';
    return searchTypeNamesMap.get(dataForm?.searchType ?? '') ?? '';
  }, [searchMode, dataForm?.searchType]);

  //* Memoized search metadata
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
