import { useEffect, useState } from 'react';

import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';

import { getAllChurches, getGeneralChurchesReport } from '@/modules/church/services/church.service';
import { type ChurchQueryParams } from '@/modules/church/types';

import {
  useChurchStore,
  selectGeneralFilterDisabled,
  selectSetGeneralFilterDisabled,
  selectSetGeneralSearchData,
} from '@/modules/church/store';

import { useConditionalListQuery, useManualQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: TData[];
  searchParams: GeneralSearchForm | undefined;
  setSearchParams: React.Dispatch<React.SetStateAction<GeneralSearchForm | undefined>>;
}

export function GeneralChurchSearchDataTable<TData, TValue>({
  columns,
  searchParams,
  setSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* States
  const isGeneralFilterDisabled = useChurchStore(selectGeneralFilterDisabled);
  const setGeneralFilterDisabled = useChurchStore(selectSetGeneralFilterDisabled);
  const setGeneralSearchData = useChurchStore(selectSetGeneralSearchData);

  const [isDisabledButton, setIsDisabledButton] = useState(false);

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Queries
  const query = useConditionalListQuery({
    queryKey: ['general-churches', searchParams],
    queryFn: () => getAllChurches(searchParams as ChurchQueryParams),
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
    queryFn: () => getGeneralChurchesReport(searchParams as ChurchQueryParams),
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
              title: 'Iglesias y anexos (Todas)',
              recordCount: query.data?.length ?? 0,
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
