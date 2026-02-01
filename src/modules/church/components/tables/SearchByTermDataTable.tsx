import { useEffect, useMemo, useCallback } from 'react';

import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';

import {
  getChurchesByFilters,
  getChurchesReportByFilters,
} from '@/modules/church/services/church.service';
import { type ChurchQueryParams, type ChurchSearchFormByTerm } from '@/modules/church/types';

import {
  useChurchStore,
  selectTermFilterDisabled,
  selectSetTermFilterDisabled,
  selectSetTermSearchData,
} from '@/modules/church/store';

import { dateFormatterToDDMMYYYY } from '@/shared/helpers/date-formatter-to-ddmmyyyy.helper';

import {
  ChurchSearchType,
  ChurchSearchTypeNames,
  ChurchSearchSelectOptionNames,
} from '@/modules/church/enums';

import { useConditionalListQuery, useManualQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';

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
  dataForm: ChurchSearchFormByTerm | undefined;
  searchParams: ChurchSearchFormByTerm | undefined;
  setSearchParams: React.Dispatch<React.SetStateAction<ChurchSearchFormByTerm | undefined>>;
}

export function SearchByTermChurchDataTable<TData, TValue>({
  columns,
  dataForm,
  searchParams,
  setSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* Store selectors
  const isTermFilterDisabled = useChurchStore(selectTermFilterDisabled);
  const setTermFilterDisabled = useChurchStore(selectSetTermFilterDisabled);
  const setTermSearchData = useChurchStore(selectSetTermSearchData);

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Queries
  const query = useConditionalListQuery({
    queryKey: ['churches-by-term', searchParams],
    queryFn: () => getChurchesByFilters(searchParams as ChurchQueryParams),
    enabled: !!searchParams,
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
    queryKey: ['churches-report-by-term', searchParams],
    queryFn: () => getChurchesReportByFilters(searchParams as ChurchQueryParams),
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
  }, [dataForm]);

  //* Memoized search type display - O(1) lookup with Map
  const searchTypeDisplay = useMemo((): string => {
    return searchTypeNamesMap.get(dataForm?.searchType ?? '') ?? '';
  }, [dataForm?.searchType]);

  //* Memoized search metadata for table header
  const searchMetadata = useMemo(() => {
    if (isTermFilterDisabled) return undefined;

    return {
      title: searchTypeDisplay,
      subtitle: searchTermDisplay,
      recordCount: query.data?.length ?? 0,
    };
  }, [isTermFilterDisabled, searchTypeDisplay, searchTermDisplay, query.data?.length]);

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
