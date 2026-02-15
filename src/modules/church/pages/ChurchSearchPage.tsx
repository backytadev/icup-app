import { useState, useEffect, useCallback } from 'react';

import { Toaster } from 'sonner';

import {
  type ChurchSearchMode,
  useChurchStore,
  selectFiltersDisabled,
  selectSearchMode,
} from '@/modules/church/store';

import { type ChurchResponse, type ChurchSearchFormByTerm } from '@/modules/church/types';
import { churchUnifiedColumns as columns } from '@/modules/church/components/tables/columns/base-columns';
import { UnifiedChurchSearchDataTable } from '@/modules/church/components/tables/UnifiedSearchDataTable';

import { PiChurch } from 'react-icons/pi';

import {
  GeneralSearchForm,
  SearchByTermForm,
} from '@/modules/church/components/forms';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleFormCard } from '@/shared/components/page-header/ModuleFormCard';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';
import { ChurchSearchType } from '@/modules/church/enums/church-search-type.enum';

import { cn } from '@/shared/lib/utils';

const dataFictional: ChurchResponse[] = [
  {
    id: '',
    churchName: '',
    abbreviatedChurchName: '',
    churchCode: '',
    isAnexe: false,
    serviceTimes: ['16:00'],
    foundingDate: new Date('2024-05-31'),
    email: 'iglesia.central@gmail.com',
    phoneNumber: '',
    country: '',
    department: '',
    province: '',
    district: '',
    urbanSector: '',
    address: '',
    referenceAddress: '',
    recordStatus: 'active',
    theirMainChurch: null,
  },
];

export const ChurchSearchPage = (): JSX.Element => {
  //* Store
  const searchMode = useChurchStore(selectSearchMode);
  const isFiltersDisabled = useChurchStore(selectFiltersDisabled);
  const { setSearchMode, setFiltersDisabled } = useChurchStore();

  //* Local state
  const [generalSearchParams, setGeneralSearchParams] = useState<GeneralSearchFormType | undefined>();
  const [filterSearchParams, setFilterSearchParams] = useState<ChurchSearchFormByTerm | undefined>();
  const [dataForm, setDataForm] = useState<ChurchSearchFormByTerm>();

  //* Set document title
  useEffect(() => {
    document.title = 'Gestionar Iglesias - IcupApp';
  }, []);

  //* Reset to general mode and auto-execute search on mount
  useEffect(() => {
    // Always reset to general mode when mounting to prevent stale state
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
    (mode: ChurchSearchMode): void => {
      if (mode === searchMode) return;

      setSearchMode(mode);

      // Set default search params for the new mode to trigger auto-search
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
        const defaultFilterParams: ChurchSearchFormByTerm = {
          searchType: ChurchSearchType.ChurchName,
          inputTerm: 'iglesia',
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
    (params: ChurchSearchFormByTerm, formData: ChurchSearchFormByTerm): void => {
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
          title='Gestionar Iglesias'
          description='Busca, consulta, actualiza e inactiva registros de iglesias y anexos en el sistema.'
          titleColor='blue'
          badge='Membresía'
          badgeColor='amber'
          icon={PiChurch}
          accentColor='amber'
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
                ? 'Configura los parametros para realizar la busqueda de iglesias.'
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
            <UnifiedChurchSearchDataTable
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
            Modulo Iglesia - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ChurchSearchPage;
