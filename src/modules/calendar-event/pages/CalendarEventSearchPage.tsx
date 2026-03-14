import { useState, useEffect, useCallback, useMemo } from 'react';

import { toast, Toaster } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import {
  type CalendarEventSearchMode,
  useCalendarEventStore,
  selectFiltersDisabled,
  selectSearchMode,
} from '@/modules/calendar-event/store';

import {
  type CalendarEventSearchFormByTerm,
  type CalendarEventQueryParams,
} from '@/modules/calendar-event/types';

import {
  getCalendarEvents,
  getCalendarEventsByFilters,
} from '@/modules/calendar-event/services/calendar-event.service';

import {
  CalendarEventSearchType,
  CalendarEventSearchTypeNames,
  CalendarEventSearchSelectOptionNames,
  CalendarEventCategoryNames,
  CalendarEventTargetGroupNames,
  CalendarEventCategory,
} from '@/modules/calendar-event/enums';

import { eventUnifiedColumns as columns } from '@/modules/calendar-event/components/tables/columns/base-columns';
import { GeneralSearchForm, SearchByTermForm } from '@/modules/calendar-event/components/forms';

import { useConditionalListQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleFormCard } from '@/shared/components/page-header/ModuleFormCard';
import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { cn } from '@/shared/lib/utils';

//* Static filter configuration
const FILTERS_CONFIG: FilterConfig[] = [
  { columnId: 'title', placeholder: 'Título...', type: 'text' },
];

//* Pre-built Maps for O(1) lookups
const searchTypeNamesMap = new Map(Object.entries(CalendarEventSearchTypeNames));
const searchSelectOptionNamesMap = new Map(Object.entries({
  ...CalendarEventSearchSelectOptionNames,
  ...CalendarEventCategoryNames,
  ...CalendarEventTargetGroupNames,
}));

export const CalendarEventSearchPage = (): JSX.Element => {
  //* Store
  const searchMode = useCalendarEventStore(selectSearchMode);
  const isFiltersDisabled = useCalendarEventStore(selectFiltersDisabled);
  const { setSearchMode, setFiltersDisabled, setSearchData } = useCalendarEventStore();

  //* Router
  const navigate = useNavigate();

  //* Local state
  const [generalSearchParams, setGeneralSearchParams] = useState<
    GeneralSearchFormType | undefined
  >();
  const [filterSearchParams, setFilterSearchParams] = useState<
    CalendarEventSearchFormByTerm | undefined
  >();
  const [dataForm, setDataForm] = useState<CalendarEventSearchFormByTerm>();

  useEffect(() => {
    document.title = 'Gestionar Eventos - IcupApp';
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
    queryKey: ['unified-calendar-events-general', generalSearchParams],
    queryFn: () => getCalendarEvents(generalSearchParams as CalendarEventQueryParams),
    enabled: searchMode === 'general' && !!generalSearchParams,
  });

  const filterQuery = useConditionalListQuery({
    queryKey: ['unified-calendar-events-filters', filterSearchParams],
    queryFn: () => getCalendarEventsByFilters(filterSearchParams as CalendarEventQueryParams),
    enabled: searchMode === 'filters' && !!filterSearchParams,
  });

  const activeQuery = searchMode === 'general' ? generalQuery : filterQuery;
  const currentSearchParams = searchMode === 'general' ? generalSearchParams : filterSearchParams;

  //* Sync query data to store
  useEffect(() => {
    setSearchData(activeQuery.data as any);
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
  }, [activeQuery?.error, searchMode, setGeneralSearchParams, setFilterSearchParams, setFiltersDisabled, navigate]);

  //* Handlers
  const handleModeChange = useCallback(
    (mode: CalendarEventSearchMode): void => {
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
        const defaultFilterParams: CalendarEventSearchFormByTerm = {
          searchType: CalendarEventSearchType.Category,
          selectTerm: CalendarEventCategory.WorshipService,
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
    (params: CalendarEventSearchFormByTerm, formData: CalendarEventSearchFormByTerm): void => {
      setFilterSearchParams(params);
      setDataForm(formData);
      setFiltersDisabled(false);
    },
    [setFiltersDisabled]
  );

  const handleNewSearch = useCallback((): void => {
    setFiltersDisabled(true);
  }, [setFiltersDisabled]);

  //* Memoized search term display
  const searchTermDisplay = useMemo((): string => {
    if (searchMode === 'general') return '';
    if (!dataForm?.searchType) return '';

    if (dataForm.searchType === CalendarEventSearchType.Title) {
      return dataForm.inputTerm ?? '';
    }

    if (
      dataForm.searchType === CalendarEventSearchType.Category ||
      dataForm.searchType === CalendarEventSearchType.TargetGroup ||
      dataForm.searchType === CalendarEventSearchType.Status
    ) {
      return searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
    }

    if (dataForm.searchType === CalendarEventSearchType.Date) {
      const dt = dataForm.dateTerm as { from: Date; to?: Date } | undefined;
      if (!dt?.from) return '';
      const fromStr = format(new Date(dt.from), 'dd/MM/yyyy', { locale: es });
      const toStr = dt.to ? format(new Date(dt.to), 'dd/MM/yyyy', { locale: es }) : fromStr;
      return `${fromStr} - ${toStr}`;
    }

    return '';
  }, [searchMode, dataForm]);

  //* Memoized search type display
  const searchTypeDisplay = useMemo((): string => {
    if (searchMode === 'general') return 'Eventos (Todos)';
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
          title='Gestionar Eventos'
          description='Busca, consulta, actualiza e inactiva registros de eventos en el sistema.'
          titleColor='teal'
          badge='Eventos'
          badgeColor='teal'
          icon={FiCalendar}
          accentColor='teal'
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
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent shadow-lg shadow-teal-500/25'
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
            title={searchMode === 'general' ? 'Parámetros de Búsqueda' : 'Filtros de Búsqueda'}
            description={
              searchMode === 'general'
                ? 'Configura los parámetros para realizar la búsqueda de eventos.'
                : 'Selecciona el tipo de búsqueda y configura los parámetros deseados.'
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
              showHeader={!isFiltersDisabled}
              showFilters={!isFiltersDisabled}
              showPagination={!isFiltersDisabled && !activeQuery?.error && !activeQuery.isPending}
            />
          </ModuleFormCard>
        </div>

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Eventos - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CalendarEventSearchPage;
