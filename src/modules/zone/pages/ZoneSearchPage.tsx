import { useState, useEffect, useCallback } from 'react';

import { Toaster } from 'sonner';
import { FiMap } from 'react-icons/fi';

import {
  type ZoneSearchMode,
  useZoneStore,
  selectFiltersDisabled,
  selectSearchMode,
} from '@/modules/zone/store';

import { type ZoneResponse, type ZoneSearchFormByTerm } from '@/modules/zone/types';
import { zoneUnifiedColumns as columns } from '@/modules/zone/components/tables/columns/base-columns';
import { UnifiedZoneSearchDataTable } from '@/modules/zone/components/tables/UnifiedSearchDataTable';

import {
  GeneralSearchForm,
  SearchByTermForm,
} from '@/modules/zone/components/forms';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleFormCard } from '@/shared/components/page-header/ModuleFormCard';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';
import { ZoneSearchType } from '@/modules/zone/enums/zone-search-type.enum';

import { cn } from '@/shared/lib/utils';

const dataFictional: ZoneResponse[] = [
  {
    id: '',
    zoneName: '',
    country: '',
    department: '',
    province: '',
    district: '',
    recordStatus: 'active',
    theirPastor: null,
    theirChurch: null,
    theirCopastor: null,
    theirSupervisor: null,
  },
];

export const ZoneSearchPage = (): JSX.Element => {
  //* Store
  const searchMode = useZoneStore(selectSearchMode);
  const isFiltersDisabled = useZoneStore(selectFiltersDisabled);
  const { setSearchMode, setFiltersDisabled } = useZoneStore();

  //* Local state
  const [generalSearchParams, setGeneralSearchParams] = useState<
    GeneralSearchFormType | undefined
  >();
  const [filterSearchParams, setFilterSearchParams] = useState<ZoneSearchFormByTerm | undefined>();
  const [dataForm, setDataForm] = useState<ZoneSearchFormByTerm>();

  //* Set document title
  useEffect(() => {
    document.title = 'Gestionar Zonas - IcupApp';
  }, []);

  //* Reset to general mode and auto-execute search on mount
  useEffect(() => {
    setSearchMode('general');

    const defaultParams: GeneralSearchFormType = {
      limit: '10',
      offset: '0',
      order: RecordOrder.Descending,
      all: false,
    };

    setGeneralSearchParams(defaultParams);
    setFiltersDisabled(false);
  }, [setFiltersDisabled, setSearchMode]);

  //* Handlers
  const handleModeChange = useCallback(
    (mode: ZoneSearchMode): void => {
      if (mode === searchMode) return;

      setSearchMode(mode);

      if (mode === 'general') {
        const defaultGeneralParams: GeneralSearchFormType = {
          limit: '10',
          offset: '0',
          order: RecordOrder.Descending,
          all: false,
        };
        setFilterSearchParams(undefined);
        setDataForm(undefined);
        setGeneralSearchParams(defaultGeneralParams);
      } else {
        const defaultFilterParams: ZoneSearchFormByTerm = {
          searchType: ZoneSearchType.Department,
          inputTerm: 'Lima',
          limit: '10',
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
    (params: ZoneSearchFormByTerm, formData: ZoneSearchFormByTerm): void => {
      setFilterSearchParams(params);
      setDataForm(formData);
      setFiltersDisabled(false);
    },
    [setFiltersDisabled]
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <ModuleHeader
          title='Gestionar Zonas'
          description='Busca, consulta, actualiza e inactiva registros de zonas en el sistema.'
          titleColor='blue'
          badge='Membresía'
          badgeColor='orange'
          icon={FiMap}
          accentColor='orange'
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
                ? 'Configura los parametros para realizar la busqueda de zonas.'
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
            <UnifiedZoneSearchDataTable
              columns={columns}
              data={dataFictional}
              searchMode={searchMode}
              generalSearchParams={generalSearchParams}
              filterSearchParams={filterSearchParams}
              dataForm={dataForm}
              setGeneralSearchParams={setGeneralSearchParams}
              setFilterSearchParams={setFilterSearchParams}
            />
          </ModuleFormCard>
        </div>

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Zona - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ZoneSearchPage;
