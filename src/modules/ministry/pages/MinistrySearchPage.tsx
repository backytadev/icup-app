import { useState, useEffect, useCallback } from 'react';

import { Toaster } from 'sonner';

import {
  type MinistrySearchMode,
  useMinistryStore,
  selectFiltersDisabled,
  selectSearchMode,
} from '@/modules/ministry/store';

import { type MinistryResponse, type MinistrySearchFormByTerm } from '@/modules/ministry/types';
import { ministryUnifiedColumns as columns } from '@/modules/ministry/components/tables/columns/base-columns';
import { UnifiedMinistrySearchDataTable } from '@/modules/ministry/components/tables/UnifiedSearchDataTable';

import { PiUsersThree } from 'react-icons/pi';

import {
  GeneralSearchForm,
  SearchByTermForm,
} from '@/modules/ministry/components/forms';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleFormCard } from '@/shared/components/page-header/ModuleFormCard';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';
import { MinistrySearchType } from '@/modules/ministry/enums/ministry-search-type.enum';

import { cn } from '@/shared/lib/utils';

const dataFictional: MinistryResponse[] = [
  {
    id: '',
    customMinistryName: '',
    ministryType: '',
    ministryCode: '',
    serviceTimes: [],
    foundingDate: new Date('2024-05-31'),
    email: '',
    phoneNumber: '',
    country: '',
    department: '',
    province: '',
    district: '',
    urbanSector: '',
    address: '',
    referenceAddress: '',
    recordStatus: 'active',
    theirPastor: null,
    theirChurch: null,
  },
];

export const MinistrySearchPage = (): JSX.Element => {
  //* Store
  const searchMode = useMinistryStore(selectSearchMode);
  const isFiltersDisabled = useMinistryStore(selectFiltersDisabled);
  const { setSearchMode, setFiltersDisabled } = useMinistryStore();

  //* Local state
  const [generalSearchParams, setGeneralSearchParams] = useState<GeneralSearchFormType | undefined>();
  const [filterSearchParams, setFilterSearchParams] = useState<MinistrySearchFormByTerm | undefined>();
  const [dataForm, setDataForm] = useState<MinistrySearchFormByTerm>();

  //* Set document title
  useEffect(() => {
    document.title = 'Gestionar Ministerios - IcupApp';
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
    (mode: MinistrySearchMode): void => {
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
        const defaultFilterParams: MinistrySearchFormByTerm = {
          searchType: MinistrySearchType.Department,
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
    (params: MinistrySearchFormByTerm, formData: MinistrySearchFormByTerm): void => {
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
          title='Gestionar Ministerios'
          description='Busca, consulta, actualiza e inactiva registros de ministerios en el sistema.'
          titleColor='blue'
          badge='Membresía'
          badgeColor='blue'
          icon={PiUsersThree}
          accentColor='blue'
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
                ? 'Configura los parametros para realizar la busqueda de ministerios.'
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
            <UnifiedMinistrySearchDataTable
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
            Modulo Ministerio - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MinistrySearchPage;
