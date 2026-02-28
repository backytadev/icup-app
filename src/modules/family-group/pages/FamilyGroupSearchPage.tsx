import { useState, useEffect, useCallback } from 'react';

import { Toaster } from 'sonner';

import {
  type FamilyGroupSearchMode,
  useFamilyGroupStore,
  selectFiltersDisabled,
  selectSearchMode,
} from '@/modules/family-group/store';

import { type FamilyGroupResponse, type FamilyGroupSearchFormByTerm } from '@/modules/family-group/types';
import { familyGroupUnifiedColumns as columns } from '@/modules/family-group/components/tables/columns/base-columns';
import { UnifiedFamilyGroupSearchDataTable } from '@/modules/family-group/components/tables/UnifiedSearchDataTable';

import {
  GeneralSearchForm,
  SearchByTermForm,
} from '@/modules/family-group/components/forms';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleFormCard } from '@/shared/components/page-header/ModuleFormCard';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';
import { FamilyGroupSearchType } from '@/modules/family-group/enums/family-group-search-type.enum';

import { cn } from '@/shared/lib/utils';
import { FiHome } from 'react-icons/fi';

const dataFictional: FamilyGroupResponse[] = [
  {
    id: '',
    familyGroupName: '',
    familyGroupNumber: 0,
    familyGroupCode: '',
    serviceTime: '',
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
    theirCopastor: null,
    theirSupervisor: null,
    theirPreacher: null,
    theirZone: null,
  },
];

export const FamilyGroupSearchPage = (): JSX.Element => {
  //* Store
  const searchMode = useFamilyGroupStore(selectSearchMode);
  const isFiltersDisabled = useFamilyGroupStore(selectFiltersDisabled);
  const { setSearchMode, setFiltersDisabled } = useFamilyGroupStore();

  //* Local state
  const [generalSearchParams, setGeneralSearchParams] = useState<
    GeneralSearchFormType | undefined
  >();
  const [filterSearchParams, setFilterSearchParams] = useState<
    FamilyGroupSearchFormByTerm | undefined
  >();
  const [dataForm, setDataForm] = useState<FamilyGroupSearchFormByTerm>();

  //* Set document title
  useEffect(() => {
    document.title = 'Gestionar Grupos Familiares - IcupApp';
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
    (mode: FamilyGroupSearchMode): void => {
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
        const defaultFilterParams: FamilyGroupSearchFormByTerm = {
          searchType: FamilyGroupSearchType.District,
          inputTerm: 'Independencia',
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
    (params: FamilyGroupSearchFormByTerm, formData: FamilyGroupSearchFormByTerm): void => {
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
          title='Gestionar Grupos Familiares'
          description='Busca, consulta, actualiza e inactiva registros de grupos familiares en el sistema.'
          titleColor='blue'
          badge='Membresía'
          badgeColor='amber'
          icon={FiHome}
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
                ? 'Configura los parametros para realizar la busqueda de grupos familiares.'
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
            <UnifiedFamilyGroupSearchDataTable
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
            Modulo Grupo Familiar - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FamilyGroupSearchPage;
