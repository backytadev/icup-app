import { useState, useEffect, useCallback } from 'react';

import { Toaster } from 'sonner';

import {
  type OfferingExpenseSearchMode,
  useOfferingExpenseStore,
  selectFiltersDisabled,
  selectSetFiltersDisabled,
  selectSearchMode,
  selectSetSearchMode,
} from '@/modules/offering/expense/stores/offering-expenses.store';

import { offeringExpenseUnifiedColumns as columns } from '@/modules/offering/expense/components/tables/columns';
import { UnifiedOfferingExpenseSearchDataTable } from '@/modules/offering/expense/components/tables';

import { GiPayMoney } from 'react-icons/gi';

import { GeneralSearchForm, SearchByTermForm } from '@/modules/offering/expense/components/forms';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleFormCard } from '@/shared/components/page-header/ModuleFormCard';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';
import { type OfferingExpenseSearchFormByTerm } from '@/modules/offering/expense/interfaces/offering-expense-search-form-by-term.interface';
import { type OfferingExpenseResponse } from '@/modules/offering/expense/interfaces/offering-expense-response.interface';
import { OfferingExpenseSearchType } from '@/modules/offering/expense/enums/offering-expense-search-type.enum';

import { cn } from '@/shared/lib/utils';
import { endOfWeek, startOfWeek } from 'date-fns';
import { dateFormatterTermToTimestamp } from '@/shared/helpers/date-formatter-to-timestamp.helper';

//* Fictional data for initial render
const dataFictional: OfferingExpenseResponse[] = [
  {
    id: '',
    type: '',
    subType: '',
    amount: '',
    currency: '',
    date: new Date('2024-05-21'),
    comments: '',
    imageUrls: [],
    recordStatus: '',
    church: null,
  },
];

export const OfferingExpenseSearchPage = (): JSX.Element => {
  //* Store
  const searchMode = useOfferingExpenseStore(selectSearchMode);
  const setSearchMode = useOfferingExpenseStore(selectSetSearchMode);
  const isFiltersDisabled = useOfferingExpenseStore(selectFiltersDisabled);
  const setFiltersDisabled = useOfferingExpenseStore(selectSetFiltersDisabled);

  //* Local state
  const [generalSearchParams, setGeneralSearchParams] = useState<GeneralSearchFormType | undefined>();
  const [filterSearchParams, setFilterSearchParams] = useState<OfferingExpenseSearchFormByTerm | undefined>();
  const [dataForm, setDataForm] = useState<OfferingExpenseSearchFormByTerm | undefined>();

  //* Set document title
  useEffect(() => {
    document.title = 'Gestionar Salidas - IcupApp';
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
    (mode: OfferingExpenseSearchMode): void => {
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

        const defaultFilterParams: OfferingExpenseSearchFormByTerm = {
          searchType: OfferingExpenseSearchType.OperationalExpenses,
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
    (params: OfferingExpenseSearchFormByTerm, formData: OfferingExpenseSearchFormByTerm): void => {
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
          title='Gestionar Salidas'
          description='Busca, consulta, actualiza e inactiva registros de gastos de ofrendas en el sistema.'
          titleColor='red'
          badge='Ofrenda'
          badgeColor='amber'
          icon={GiPayMoney}
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
                ? 'Configura los parametros para realizar la busqueda de gastos de ofrendas.'
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
            <UnifiedOfferingExpenseSearchDataTable
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
            Modulo de Salida - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OfferingExpenseSearchPage;
