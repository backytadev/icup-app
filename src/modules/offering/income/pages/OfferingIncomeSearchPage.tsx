import { useState, useEffect, useCallback } from 'react';

import { Toaster } from 'sonner';

import {
  type OfferingIncomeSearchMode,
  useOfferingIncomeStore,
  selectFiltersDisabled,
  selectSetFiltersDisabled,
  selectSearchMode,
  selectSetSearchMode,
} from '@/modules/offering/income/stores/offering-income.store';

import { offeringIncomeUnifiedColumns as columns } from '@/modules/offering/income/components/tables/columns';
import { UnifiedOfferingIncomeSearchDataTable } from '@/modules/offering/income/components/tables';

import { GiReceiveMoney } from 'react-icons/gi';

import { GeneralSearchForm, SearchByTermForm } from '@/modules/offering/income/components';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleFormCard } from '@/shared/components/page-header/ModuleFormCard';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';
import { type OfferingIncomeSearchFormByTerm } from '@/modules/offering/income/interfaces/offering-income-search-form-by-term.interface';
import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';
import { OfferingIncomeSearchType } from '@/modules/offering/income/enums/offering-income-search-type.enum';
import { OfferingIncomeSearchSubType } from '@/modules/offering/income/enums/offering-income-search-sub-type.enum';

import { cn } from '@/shared/lib/utils';
import { endOfWeek, startOfWeek } from 'date-fns';
import { dateFormatterTermToTimestamp } from '@/shared/helpers/date-formatter-to-timestamp.helper';

//* Fictional data for initial render
const dataFictional: OfferingIncomeResponse[] = [
  {
    id: '',
    type: '',
    subType: '',
    category: '',
    amount: '',
    currency: '',
    shift: '',
    date: new Date('2024-05-21'),
    comments: '',
    imageUrls: [],
    recordStatus: '',
    memberType: '',
    familyGroup: null,
    zone: null,
    disciple: null,
    preacher: null,
    supervisor: null,
    copastor: null,
    pastor: null,
    church: null,
  },
];

export const OfferingIncomeSearchPage = (): JSX.Element => {
  //* Store
  const searchMode = useOfferingIncomeStore(selectSearchMode);
  const setSearchMode = useOfferingIncomeStore(selectSetSearchMode);
  const isFiltersDisabled = useOfferingIncomeStore(selectFiltersDisabled);
  const setFiltersDisabled = useOfferingIncomeStore(selectSetFiltersDisabled);

  //* Local state
  const [generalSearchParams, setGeneralSearchParams] = useState<GeneralSearchFormType | undefined>();
  const [filterSearchParams, setFilterSearchParams] = useState<OfferingIncomeSearchFormByTerm | undefined>();
  const [dataForm, setDataForm] = useState<OfferingIncomeSearchFormByTerm | undefined>();

  //* Set document title
  useEffect(() => {
    document.title = 'Gestionar Ingresos - IcupApp';
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
    (mode: OfferingIncomeSearchMode): void => {
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
        const from = startOfWeek(new Date(), { weekStartsOn: 1 });
        const to = endOfWeek(new Date(), { weekStartsOn: 1 });

        const dateTermTimestamp = dateFormatterTermToTimestamp({
          from,
          to,
        });

        const defaultFilterParams: OfferingIncomeSearchFormByTerm = {
          searchType: OfferingIncomeSearchType.FamilyGroup,
          searchSubType: OfferingIncomeSearchSubType.OfferingByDate,
          limit: '10',
          dateTerm: dateTermTimestamp as any,
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
    (params: OfferingIncomeSearchFormByTerm, formData: OfferingIncomeSearchFormByTerm): void => {
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
          title='Gestionar Ingresos'
          description='Busca, consulta, actualiza e inactiva registros de ingresos de ofrendas en el sistema.'
          titleColor='green'
          badge='Ofrenda'
          badgeColor='amber'
          icon={GiReceiveMoney}
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

        {/* Search Form Card */}
        {isFiltersDisabled && (
          <ModuleFormCard
            title={searchMode === 'general' ? 'Parametros de Busqueda' : 'Filtros de Busqueda'}
            description={
              searchMode === 'general'
                ? 'Configura los parametros para realizar la busqueda de ingresos de ofrendas.'
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

        {/* Results Section */}
        <div
          className='opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <ModuleFormCard>
            <UnifiedOfferingIncomeSearchDataTable
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
            Modulo de Ingreso - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OfferingIncomeSearchPage;
