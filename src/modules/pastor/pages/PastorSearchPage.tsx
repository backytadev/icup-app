import { useState, useEffect, useCallback } from 'react';

import { Toaster } from 'sonner';

import {
  type PastorSearchMode,
  usePastorStore,
  selectFiltersDisabled,
  selectSetFiltersDisabled,
  selectSearchMode,
  selectSetSearchMode,
} from '@/modules/pastor/store';

import { pastorUnifiedColumns as columns } from '@/modules/pastor/components/tables/columns/base-columns';
import { UnifiedPastorSearchDataTable } from '@/modules/pastor/components/tables/UnifiedSearchDataTable';

import { FcPodiumWithSpeaker } from 'react-icons/fc';

import {
  GeneralSearchForm,
  SearchByTermForm,
} from '@/modules/pastor/components';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleFormCard } from '@/shared/components/page-header/ModuleFormCard';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';
import { PastorSearchType } from '@/modules/pastor/enums/pastor-search-type.enum';
import { type PastorSearchFormByTerm, type PastorResponse } from '@/modules/pastor/types';

import { cn } from '@/shared/lib/utils';

//* Fictional data for initial render matching ministry pattern
const dataFictional: PastorResponse[] = [
  {
    id: '',
    member: {
      id: '',
      firstNames: '',
      lastNames: '',
      gender: '',
      originCountry: '',
      birthDate: new Date(),
      age: 0,
      conversionDate: new Date(),
      maritalStatus: '',
      numberChildren: '',
      email: '',
      phoneNumber: '',
      residenceCountry: '',
      residenceDepartment: '',
      residenceProvince: '',
      residenceDistrict: '',
      residenceUrbanSector: '',
      residenceAddress: '',
      referenceAddress: '',
      roles: [],
      recordStatus: '',
      ministries: [],
    },
    relationType: '',
    recordStatus: 'active',
  } as unknown as PastorResponse,
];

export const PastorSearchPage = (): JSX.Element => {
  //* Store
  const searchMode = usePastorStore(selectSearchMode);
  const setSearchMode = usePastorStore(selectSetSearchMode);
  const isFiltersDisabled = usePastorStore(selectFiltersDisabled);
  const setFiltersDisabled = usePastorStore(selectSetFiltersDisabled);

  //* Local state
  const [generalSearchParams, setGeneralSearchParams] = useState<GeneralSearchFormType | undefined>();
  const [filterSearchParams, setFilterSearchParams] = useState<PastorSearchFormByTerm | undefined>();
  const [dataForm, setDataForm] = useState<PastorSearchFormByTerm | undefined>();

  //* Set document title
  useEffect(() => {
    document.title = 'Gestionar Pastores - IcupApp';
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
    (mode: PastorSearchMode): void => {
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
        const defaultFilterParams: PastorSearchFormByTerm = {
          searchType: PastorSearchType.ResidenceDepartment,
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
    (params: PastorSearchFormByTerm, formData: PastorSearchFormByTerm): void => {
      setFilterSearchParams(params);
      setDataForm(formData);
      setFiltersDisabled(false);
    },
    [setFiltersDisabled]
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1600px] mx-auto space-y-6'>
        <ModuleHeader
          title='Gestionar Pastores'
          description='Busca, consulta, actualiza e inactiva registros de pastores en el sistema.'
          titleColor='blue'
          badge='Membresía'
          badgeColor='purple'
          icon={FcPodiumWithSpeaker}
          accentColor='purple'
        />

        {/* Mode Toggle - Same logic as Ministry module */}
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
            Búsqueda Directa
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
            Búsqueda por Filtros
          </button>
        </div>

        {/* Search Form Card */}
        {isFiltersDisabled && (
          <ModuleFormCard
            title={searchMode === 'general' ? 'Parámetros de Búsqueda' : 'Filtros de Búsqueda'}
            description={
              searchMode === 'general'
                ? 'Configura los parámetros para realizar la búsqueda de pastores.'
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

        {/* Results Section */}
        <div
          className='opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <ModuleFormCard>
            <UnifiedPastorSearchDataTable
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
            Módulo Pastor - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PastorSearchPage;
