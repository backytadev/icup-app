import { useEffect, useState } from 'react';

import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';

import {
  getAllMinistries,
  getGeneralMinistriesReport,
} from '@/modules/ministry/services/ministry.service';
import { type MinistryQueryParams } from '@/modules/ministry/types';

import {
  useMinistryStore,
  selectGeneralFilterDisabled,
  selectSetGeneralFilterDisabled,
  selectSetGeneralSearchData,
} from '@/modules/ministry/store';

import { useConditionalListQuery, useManualQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: TData[];
  searchParams: GeneralSearchForm | undefined;
  setSearchParams: React.Dispatch<React.SetStateAction<GeneralSearchForm | undefined>>;
}

export function GeneralMinistrySearchDataTable<TData, TValue>({
  columns,
  searchParams,
  setSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* States
  const isGeneralFilterDisabled = useMinistryStore(selectGeneralFilterDisabled);
  const setGeneralFilterDisabled = useMinistryStore(selectSetGeneralFilterDisabled);
  const setGeneralSearchData = useMinistryStore(selectSetGeneralSearchData);

  const [isDisabledButton, setIsDisabledButton] = useState(false);

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Queries
  const query = useConditionalListQuery({
    queryKey: ['general-ministries', searchParams],
    queryFn: () => getAllMinistries(searchParams as MinistryQueryParams),
    enabled: !!searchParams,
  });

  //* Set data result query
  useEffect(() => {
    setGeneralSearchData(query.data);
  }, [query?.isFetching]);

  useEffect(() => {
    if (query.error?.message && query.error?.message !== 'Unauthorized') {
      toast.error(query?.error?.message, {
        position: 'top-center',
        className: 'justify-center',
      });

      setSearchParams(undefined);
      setGeneralFilterDisabled(true);
    }

    if (query.error?.message === 'Unauthorized') {
      toast.error('Operación rechazada, el token expiro ingresa nuevamente.', {
        position: 'top-center',
        className: 'justify-center',
      });

      setSearchParams(undefined);
      setGeneralFilterDisabled(true);

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
  const generateReportQuery = useManualQuery({
    queryKey: ['general-churches-report', searchParams],
    queryFn: () => getGeneralMinistriesReport(searchParams as MinistryQueryParams),
  });

  const handleGenerateReport = (): void => {
    generateReportQuery.refetch();
  };

  const handleNewSearch = (): void => {
    setGeneralFilterDisabled(true);
  };

  //* Filter configuration
  const filters: FilterConfig[] = [
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

  return (
    <div>
      <Toaster position='top-center' richColors />
      <DataTable
        columns={columns}
        data={(query.data as TData[]) ?? []}
        isLoading={!!searchParams && query?.isPending}
        isFiltersDisabled={isGeneralFilterDisabled || isDisabledButton}
        searchMetadata={
          !isGeneralFilterDisabled
            ? {
              title: 'Ministerios (Todos)',
              recordCount: query.data?.length ?? 0,
              churchName: query?.data?.[0]?.theirChurch?.abbreviatedChurchName ?? 'Todas las Iglesias',
            }
            : undefined
        }
        filters={filters}
        onNewSearch={handleNewSearch}
        onGenerateReport={handleGenerateReport}
        isGeneratingReport={generateReportQuery.isFetching}
        showHeader={!isGeneralFilterDisabled}
        showFilters={!isGeneralFilterDisabled}
        showPagination={!isGeneralFilterDisabled && !query?.error && !query.isPending}
        showReportButton={!query.isPending}
      />
    </div>
  );
}
