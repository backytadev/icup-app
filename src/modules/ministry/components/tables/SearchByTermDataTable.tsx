import { useEffect, useMemo, useCallback } from 'react';

import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';

import {
  getMinistriesByFilters,
  getMinistriesReportByFilters,
} from '@/modules/ministry/services/ministry.service';
import { type MinistryQueryParams, type MinistrySearchFormByTerm } from '@/modules/ministry/types';

import {
  useMinistryStore,
  selectTermFilterDisabled,
  selectSetTermFilterDisabled,
  selectSetTermSearchData,
} from '@/modules/ministry/store';

import { dateFormatterToDDMMYYYY } from '@/shared/helpers/date-formatter-to-ddmmyyyy.helper';

import {
  MinistrySearchType,
  MinistrySearchTypeNames,
  MinistrySearchSelectOptionNames,
  MinistrySearchSubTypeNames,
} from '@/modules/ministry/enums';

import { useConditionalListQuery, useManualQuery, useSelectQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { getSimpleChurches } from '@/modules/church/services/church.service';

//* Static filter configuration - hoisted outside component
const FILTERS_CONFIG: FilterConfig[] = [
  {
    columnId: 'ministryType',
    placeholder: 'Tipo de ministerio...',
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
const searchSubTypeNamesMap = new Map(Object.entries(MinistrySearchSubTypeNames));
const searchSelectOptionNamesMap = new Map(Object.entries(MinistrySearchSelectOptionNames));

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: Array<ColumnDef<TData, TValue>>;
  dataForm: MinistrySearchFormByTerm | undefined;
  searchParams: MinistrySearchFormByTerm | undefined;
  setSearchParams: React.Dispatch<React.SetStateAction<MinistrySearchFormByTerm | undefined>>;
}

export function SearchByTermMinistryDataTable<TData, TValue>({
  columns,
  dataForm,
  searchParams,
  setSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* Store selectors
  const isTermFilterDisabled = useMinistryStore(selectTermFilterDisabled);
  const setTermFilterDisabled = useMinistryStore(selectSetTermFilterDisabled);
  const setTermSearchData = useMinistryStore(selectSetTermSearchData);

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Queries
  const query = useConditionalListQuery({
    queryKey: ['ministries-by-term', searchParams],
    queryFn: () => getMinistriesByFilters(searchParams as MinistryQueryParams),
    enabled: !!searchParams,
  });

  const churchesQuery = useSelectQuery({
    queryKey: ['churches-for-ministry-search'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
  });

  //* Derived state - no useState needed
  const isDisabledButton = query?.isPending;

  //* Set data result query
  useEffect(() => {
    setTermSearchData(query.data);
  }, [query?.isFetching, query.data, setTermSearchData]);

  useEffect(() => {
    if (query.error?.message && query.error?.message !== 'Unauthorized') {
      toast.error(query?.error?.message, {
        position: 'top-center',
        className: 'justify-center',
      });

      setSearchParams(undefined);
      setTermFilterDisabled(true);
    }

    if (query.error?.message === 'Unauthorized') {
      toast.error('Operación rechazada, el token expiro ingresa nuevamente.', {
        position: 'top-center',
        className: 'justify-center',
      });

      setSearchParams(undefined);
      setTermFilterDisabled(true);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [query?.error, setSearchParams, setTermFilterDisabled, navigate]);

  //* Query Report and Event trigger
  const generateReportQuery = useManualQuery({
    queryKey: ['ministries-report-by-term', searchParams],
    queryFn: () => getMinistriesReportByFilters(searchParams as MinistryQueryParams),
  });

  const handleGenerateReport = useCallback((): void => {
    generateReportQuery.refetch();
  }, [generateReportQuery]);

  const handleNewSearch = useCallback((): void => {
    setTermFilterDisabled(true);
  }, [setTermFilterDisabled]);

  //* Memoized search term display - O(1) lookups with Map
  const searchTermDisplay = useMemo((): string => {
    if (!dataForm?.searchType) return '';

    if (
      dataForm.searchType === MinistrySearchType.MinistryCustomName ||
      dataForm.searchType === MinistrySearchType.Department ||
      dataForm.searchType === MinistrySearchType.Province ||
      dataForm.searchType === MinistrySearchType.District ||
      dataForm.searchType === MinistrySearchType.UrbanSector ||
      dataForm.searchType === MinistrySearchType.Address
    ) {
      return dataForm.inputTerm ?? '';
    }

    if (dataForm.searchType === MinistrySearchType.FirstNames) {
      return dataForm.firstNamesTerm ?? '';
    }

    if (dataForm.searchType === MinistrySearchType.LastNames) {
      return dataForm.lastNamesTerm ?? '';
    }

    if (dataForm.searchType === MinistrySearchType.FullNames) {
      return `${dataForm.firstNamesTerm ?? ''} - ${dataForm.lastNamesTerm ?? ''}`;
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
  }, [dataForm]);

  //* Memoized search type display - O(1) lookup with Map
  const searchTypeDisplay = useMemo((): string => {
    const baseType = searchTypeNamesMap.get(dataForm?.searchType ?? '') ?? '';

    // Add subtype for name searches
    if (
      dataForm?.searchType === MinistrySearchType.FirstNames ||
      dataForm?.searchType === MinistrySearchType.LastNames ||
      dataForm?.searchType === MinistrySearchType.FullNames
    ) {
      const subType = searchSubTypeNamesMap.get(dataForm?.searchSubType ?? '');
      return subType ? `${baseType} - ${subType}` : baseType;
    }

    return baseType;
  }, [dataForm?.searchType, dataForm?.searchSubType]);

  //* Memoized church name display
  const churchNameDisplay = useMemo((): string => {
    return churchesQuery?.data?.find((church) => church.id === dataForm?.churchId)
      ?.abbreviatedChurchName ?? 'Todas las Iglesias';
  }, [churchesQuery?.data, dataForm?.churchId]);

  //* Memoized search metadata for table header
  const searchMetadata = useMemo(() => {
    if (isTermFilterDisabled) return undefined;

    return {
      title: searchTypeDisplay,
      subtitle: searchTermDisplay,
      recordCount: query.data?.length ?? 0,
      churchName: churchNameDisplay,
    };
  }, [isTermFilterDisabled, searchTypeDisplay, searchTermDisplay, query.data?.length, churchNameDisplay]);



  return (
    <div>
      <Toaster position='top-center' richColors />
      <DataTable
        columns={columns}
        data={(query.data as TData[]) ?? []}
        isLoading={!!searchParams && query?.isPending}
        isFiltersDisabled={isTermFilterDisabled || isDisabledButton}
        searchMetadata={searchMetadata}
        filters={FILTERS_CONFIG}
        onNewSearch={handleNewSearch}
        onGenerateReport={handleGenerateReport}
        isGeneratingReport={generateReportQuery.isFetching}
        showHeader={!isTermFilterDisabled}
        showFilters={!isTermFilterDisabled}
        showPagination={!isTermFilterDisabled && !query?.error && !query.isPending}
        showReportButton={!query.isPending}
      />
    </div>
  );
}
