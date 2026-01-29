import { useEffect, useState } from 'react';

import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

import { DataTable, type FilterConfig } from '@/shared/components/data-table';

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
  //* States
  const isTermFilterDisabled = useChurchStore(selectTermFilterDisabled);
  const setTermFilterDisabled = useChurchStore(selectSetTermFilterDisabled);
  const setTermSearchData = useChurchStore(selectSetTermSearchData);

  const [isDisabledButton, setIsDisabledButton] = useState(false);

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Queries
  const query = useQuery({
    queryKey: ['churches-by-term', searchParams],
    queryFn: () => getChurchesByFilters(searchParams as ChurchQueryParams),
    enabled: !!searchParams,
    retry: false,
  });

  //* Set data result query
  useEffect(() => {
    setTermSearchData(query.data);
  }, [query?.isFetching]);

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
  }, [query?.error]);

  //* Disabled button while query is pending
  useEffect(() => {
    if (query?.isPending) {
      setIsDisabledButton(true);
      return;
    }

    setIsDisabledButton(false);
  }, [query?.isPending]);

  //* Query Report and Event trigger
  const generateReportQuery = useQuery({
    queryKey: ['churches-report-by-term', searchParams],
    queryFn: () => getChurchesReportByFilters(searchParams as ChurchQueryParams),
    retry: false,
    enabled: false,
  });

  const handleGenerateReport = (): void => {
    generateReportQuery.refetch();
  };

  const handleNewSearch = (): void => {
    setTermFilterDisabled(true);
  };

  //* Get search term display
  const getSearchTermDisplay = (): string => {
    if (
      dataForm?.searchType === ChurchSearchType.ChurchName ||
      dataForm?.searchType === ChurchSearchType.Department ||
      dataForm?.searchType === ChurchSearchType.Province ||
      dataForm?.searchType === ChurchSearchType.Address ||
      dataForm?.searchType === ChurchSearchType.UrbanSector ||
      dataForm?.searchType === ChurchSearchType.District
    ) {
      return dataForm?.inputTerm ?? '';
    }

    if (dataForm?.searchType === ChurchSearchType.FoundingDate) {
      const fromDate = dataForm?.dateTerm?.from
        ? dateFormatterToDDMMYYYY(dataForm?.dateTerm?.from)
        : '';
      const toDate = dataForm?.dateTerm?.to
        ? ` - ${dateFormatterToDDMMYYYY(dataForm?.dateTerm?.to)}`
        : '';
      return `${fromDate}${toDate}`;
    }

    if (dataForm?.searchType === ChurchSearchType.RecordStatus) {
      return (
        Object.entries(ChurchSearchSelectOptionNames).find(
          ([key]) => key === dataForm?.selectTerm
        )?.[1] ?? ''
      );
    }

    return '';
  };

  //* Get search type display
  const getSearchTypeDisplay = (): string => {
    return (
      Object.entries(ChurchSearchTypeNames).find(
        ([key]) => key === dataForm?.searchType
      )?.[1] ?? ''
    );
  };

  //* Filter configuration
  const filters: FilterConfig[] = [
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

  //* Build search metadata for table header
  const searchMetadata = !isTermFilterDisabled
    ? {
        title: getSearchTypeDisplay(),
        subtitle: getSearchTermDisplay(),
        recordCount: query.data?.length ?? 0,
      }
    : undefined;

  return (
    <div>
      <Toaster position='top-center' richColors />
      <DataTable
        columns={columns}
        data={(query.data as TData[]) ?? []}
        isLoading={!!searchParams && query?.isPending}
        isFiltersDisabled={isTermFilterDisabled || isDisabledButton}
        searchMetadata={searchMetadata}
        filters={filters}
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
