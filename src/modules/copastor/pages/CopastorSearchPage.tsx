import { useState, useEffect, useCallback, useMemo } from 'react';

import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import {
  type CopastorSearchMode,
  useCopastorStore,
  selectFiltersDisabled,
  selectSearchMode,
} from '@/modules/copastor/store';

import {
  type CopastorSearchFormByTerm,
  type CopastorQueryParams,
} from '@/modules/copastor/types';

import {
  getCopastors,
  getCopastorsByFilters,
  getGeneralCopastorsReport,
  getCopastorsReportByTerm,
} from '@/modules/copastor/services/copastor.service';

import {
  CopastorSearchType,
  CopastorSearchTypeNames,
  CopastorSearchNamesSelectOption,
} from '@/modules/copastor/enums';

import { copastorUnifiedColumns as columns } from '@/modules/copastor/components/tables/columns/base-columns';

import {
  GeneralSearchForm,
  SearchByTermForm,
} from '@/modules/copastor/components/forms';

import { useConditionalListQuery, useManualQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleFormCard } from '@/shared/components/page-header/ModuleFormCard';
import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { cn } from '@/shared/lib/utils';

//* Static filter configuration
const FILTERS_CONFIG: FilterConfig[] = [
  { columnId: 'firstNames', placeholder: 'Nombres...', type: 'text' },
  { columnId: 'lastNames', placeholder: 'Apellidos...', type: 'text' },
];

//* Pre-built Maps for O(1) lookups
const searchTypeNamesMap = new Map(Object.entries(CopastorSearchTypeNames));
const searchSelectOptionNamesMap = new Map(Object.entries(CopastorSearchNamesSelectOption));

export const CopastorSearchPage = (): JSX.Element => {
  //* Store
  const searchMode = useCopastorStore(selectSearchMode);
  const isFiltersDisabled = useCopastorStore(selectFiltersDisabled);
  const { setSearchMode, setFiltersDisabled, setSearchData } = useCopastorStore();

  //* Router
  const navigate = useNavigate();

  //* Local state
  const [generalSearchParams, setGeneralSearchParams] = useState<
    GeneralSearchFormType | undefined
  >();
  const [filterSearchParams, setFilterSearchParams] = useState<
    CopastorSearchFormByTerm | undefined
  >();
  const [dataForm, setDataForm] = useState<CopastorSearchFormByTerm>();

  //* Set document title
  useEffect(() => {
    document.title = 'Gestionar Co-Pastores - IcupApp';
  }, []);

  //* Reset to general mode and auto-execute search on mount
  useEffect(() => {
    setSearchMode('general');

    const defaultParams: GeneralSearchFormType = {
      order: RecordOrder.Descending,
      all: true,
    };

    setGeneralSearchParams(defaultParams);
    setFiltersDisabled(false);
  }, [setFiltersDisabled, setSearchMode]);

  //* Queries
  const generalQuery = useConditionalListQuery({
    queryKey: ['unified-copastors-general', generalSearchParams],
    queryFn: () => getCopastors(generalSearchParams as CopastorQueryParams),
    enabled: searchMode === 'general' && !!generalSearchParams,
  });

  const filterQuery = useConditionalListQuery({
    queryKey: ['unified-copastors-filters', filterSearchParams],
    queryFn: () => getCopastorsByFilters(filterSearchParams as CopastorQueryParams),
    enabled: searchMode === 'filters' && !!filterSearchParams,
  });

  const activeQuery = searchMode === 'general' ? generalQuery : filterQuery;
  const currentSearchParams = searchMode === 'general' ? generalSearchParams : filterSearchParams;

  //* Sync query data to store
  useEffect(() => {
    setSearchData(activeQuery.data);
  }, [activeQuery?.isFetching, activeQuery.data, setSearchData]);

  //* Handle query errors
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
    queryKey: ['unified-copastors-report-general', generalSearchParams],
    queryFn: () => getGeneralCopastorsReport(generalSearchParams as CopastorQueryParams),
  });

  const filterReportQuery = useManualQuery({
    queryKey: ['unified-copastors-report-filters', filterSearchParams],
    queryFn: () => getCopastorsReportByTerm(filterSearchParams as CopastorQueryParams),
  });

  const activeReportQuery = searchMode === 'general' ? generalReportQuery : filterReportQuery;

  //* Handlers
  const handleModeChange = useCallback(
    (mode: CopastorSearchMode): void => {
      if (mode === searchMode) return;

      setSearchMode(mode);

      if (mode === 'general') {
        const defaultGeneralParams: GeneralSearchFormType = {
          order: RecordOrder.Descending,
          all: true,
        };
        setFilterSearchParams(undefined);
        setDataForm(undefined);
        setGeneralSearchParams(defaultGeneralParams);
      } else {
        const defaultFilterParams: CopastorSearchFormByTerm = {
          searchType: CopastorSearchType.ResidenceCountry,
          inputTerm: 'Peru',
          all: true,
          order: RecordOrder.Descending,
        };
        setGeneralSearchParams(undefined);
        setFilterSearchParams(defaultFilterParams);
        setDataForm(defaultFilterParams);
      }

      setFiltersDisabled(false);
    },
    [searchMode, setSearchMode, setFiltersDisabled]
  );

  const handleGeneralSearch = useCallback(
    (params: GeneralSearchFormType): void => {
      setGeneralSearchParams(params);
      setFiltersDisabled(false);
    },
    [setFiltersDisabled]
  );

  const handleFilterSearch = useCallback(
    (params: CopastorSearchFormByTerm, formData: CopastorSearchFormByTerm): void => {
      setFilterSearchParams(params);
      setDataForm(formData);
      setFiltersDisabled(false);
    },
    [setFiltersDisabled]
  );

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
      dataForm.searchType === CopastorSearchType.OriginCountry ||
      dataForm.searchType === CopastorSearchType.ResidenceCountry ||
      dataForm.searchType === CopastorSearchType.ResidenceDepartment ||
      dataForm.searchType === CopastorSearchType.ResidenceProvince ||
      dataForm.searchType === CopastorSearchType.ResidenceDistrict ||
      dataForm.searchType === CopastorSearchType.ResidenceUrbanSector ||
      dataForm.searchType === CopastorSearchType.ResidenceAddress
    ) {
      return dataForm.inputTerm ?? '';
    }

    if (dataForm.searchType === CopastorSearchType.FirstNames) return dataForm.firstNamesTerm ?? '';
    if (dataForm.searchType === CopastorSearchType.LastNames) return dataForm.lastNamesTerm ?? '';
    if (dataForm.searchType === CopastorSearchType.FullNames) {
      return `${dataForm.firstNamesTerm ?? ''} ${dataForm.lastNamesTerm ?? ''}`.trim();
    }

    if (
      dataForm.searchType === CopastorSearchType.BirthMonth ||
      dataForm.searchType === CopastorSearchType.Gender ||
      dataForm.searchType === CopastorSearchType.MaritalStatus ||
      dataForm.searchType === CopastorSearchType.RecordStatus
    ) {
      return searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
    }

    return '';
  }, [searchMode, dataForm]);

  //* Memoized search type display
  const searchTypeDisplay = useMemo((): string => {
    if (searchMode === 'general') return 'Co-Pastores (Todos)';
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

  const isDisabledButton = activeQuery?.isPending;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1600px] mx-auto space-y-6'>
        <ModuleHeader
          title='Gestionar Co-Pastores'
          description='Busca, consulta, actualiza e inactiva registros de co-pastores en el sistema.'
          titleColor='blue'
          badge='Membresía'
          badgeColor='cyan'
          icon={FiUsers}
          accentColor='cyan'
        />

        {/* Mode Toggle */}
        <div
          className='flex justify-center gap-2 opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <button
            type='button'
            onClick={() => handleModeChange('general')}
            className={cn(
              'px-6 py-2.5 rounded-xl text-sm font-semibold font-inter',
              'transition-all duration-300',
              'border',
              searchMode === 'general'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-lg shadow-blue-500/25'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            )}
          >
            Busqueda Directa
          </button>
          <button
            type='button'
            onClick={() => handleModeChange('filters')}
            className={cn(
              'px-6 py-2.5 rounded-xl text-sm font-semibold font-inter',
              'transition-all duration-300',
              'border',
              searchMode === 'filters'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white border-transparent shadow-lg shadow-sky-500/25'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            )}
          >
            Busqueda por Filtros
          </button>
        </div>

        {/* Search Form */}
        {isFiltersDisabled && (
          <ModuleFormCard
            title={searchMode === 'general' ? 'Parametros de Busqueda' : 'Filtros de Busqueda'}
            description={
              searchMode === 'general'
                ? 'Configura los parametros para realizar la busqueda de co-pastores.'
                : 'Selecciona el tipo de busqueda y configura los parametros deseados.'
            }
          >
            {searchMode === 'general' ? (
              <GeneralSearchForm onSearch={handleGeneralSearch} />
            ) : (
              <SearchByTermForm onSearch={handleFilterSearch} />
            )}
          </ModuleFormCard>
        )}

        {/* Data Table */}
        <div
          className='opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <ModuleFormCard>
            <DataTable
              columns={columns}
              data={(activeQuery.data ?? []) as any[]}
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
          </ModuleFormCard>
        </div>

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Co-Pastor - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CopastorSearchPage;
