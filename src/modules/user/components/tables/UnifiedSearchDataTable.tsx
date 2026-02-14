import { useEffect, useMemo, useCallback } from 'react';

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';

import {
  getAllUsers,
  getUsersByFilters,
  getGeneralUsersReport,
  getUsersReportByFilters,
} from '@/modules/user/services/user.service';

import {
  type UserSearchFormByTerm,
  type UserQueryParams,
} from '@/modules/user/types';

import {
  type UserSearchMode,
  useUserStore,
  selectFiltersDisabled,
  selectSetFiltersDisabled,
  selectSetSearchData,
} from '@/modules/user/store';

import {
  UserSearchType,
  UserSearchTypeNames,
  UserSearchSelectOptionNames,
} from '@/modules/user/enums';

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
const searchTypeNamesMap = new Map(Object.entries(UserSearchTypeNames));
const searchSelectOptionNamesMap = new Map(Object.entries(UserSearchSelectOptionNames));

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: Array<ColumnDef<TData, TValue>>;
  searchMode: UserSearchMode;
  generalSearchParams: GeneralSearchForm | undefined;
  filterSearchParams: UserSearchFormByTerm | undefined;
  dataForm: UserSearchFormByTerm | undefined;
  setGeneralSearchParams: React.Dispatch<React.SetStateAction<GeneralSearchForm | undefined>>;
  setFilterSearchParams: React.Dispatch<React.SetStateAction<UserSearchFormByTerm | undefined>>;
}

export function UnifiedUserSearchDataTable<TData, TValue>({
  columns,
  searchMode,
  generalSearchParams,
  filterSearchParams,
  dataForm,
  setGeneralSearchParams,
  setFilterSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* Store selectors
  const isFiltersDisabled = useUserStore(selectFiltersDisabled);
  const setFiltersDisabled = useUserStore(selectSetFiltersDisabled);
  const setSearchData = useUserStore(selectSetSearchData);

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Determine current search params based on mode
  const currentSearchParams = searchMode === 'general' ? generalSearchParams : filterSearchParams;

  //* Query for general search
  const generalQuery = useConditionalListQuery({
    queryKey: ['unified-users-general', generalSearchParams],
    queryFn: () => getAllUsers(generalSearchParams as UserQueryParams),
    enabled: searchMode === 'general' && !!generalSearchParams,
  });

  //* Query for filter search
  const filterQuery = useConditionalListQuery({
    queryKey: ['unified-users-filters', filterSearchParams],
    queryFn: () => getUsersByFilters(filterSearchParams as UserQueryParams),
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
    queryKey: ['unified-users-report-general', generalSearchParams],
    queryFn: () => getGeneralUsersReport(generalSearchParams as UserQueryParams),
  });

  const filterReportQuery = useManualQuery({
    queryKey: ['unified-users-report-filters', filterSearchParams],
    queryFn: () => getUsersReportByFilters(filterSearchParams as UserQueryParams),
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
      dataForm.searchType === UserSearchType.FirstNames ||
      dataForm.searchType === UserSearchType.LastNames
    ) {
      return dataForm.firstNamesTerm ?? dataForm.lastNamesTerm ?? '';
    }

    if (dataForm.searchType === UserSearchType.FullNames) {
      return `${dataForm.firstNamesTerm ?? ''} ${dataForm.lastNamesTerm ?? ''}`.trim();
    }

    if (
      dataForm.searchType === UserSearchType.Gender ||
      dataForm.searchType === UserSearchType.RecordStatus
    ) {
      return searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
    }

    if (dataForm.searchType === UserSearchType.Roles) {
      return Array.isArray(dataForm.multiSelectTerm)
        ? dataForm.multiSelectTerm.join(', ')
        : dataForm.multiSelectTerm ?? '';
    }

    return '';
  }, [searchMode, dataForm]);

  //* Memoized search type display - O(1) lookup with Map
  const searchTypeDisplay = useMemo((): string => {
    if (searchMode === 'general') {
      return 'Usuarios (Todos)';
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
