import { useEffect, useMemo, useCallback } from 'react';

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { FaRegFilePdf } from 'react-icons/fa6';

import {
  getOfferingsIncome,
  getOfferingsIncomeByTerm,
  getGeneralOfferingIncomeReport,
  getOfferingIncomeReportByTerm,
} from '@/modules/offering/income/services/offering-income.service';

import { type OfferingIncomeQueryParams } from '@/modules/offering/income/interfaces/offering-income-query-params.interface';
import { type OfferingIncomeSearchFormByTerm } from '@/modules/offering/income/interfaces/offering-income-search-form-by-term.interface';

import {
  type OfferingIncomeSearchMode,
  useOfferingIncomeStore,
  selectFiltersDisabled,
  selectSetFiltersDisabled,
  selectSetSearchData,
} from '@/modules/offering/income/stores/offering-income.store';

import { OfferingIncomeCreationTypeNames } from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import { OfferingIncomeCreationSubTypeNames } from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import { OfferingIncomeCreationCategoryNames } from '@/modules/offering/income/enums/offering-income-creation-category.enum';
import {
  OfferingIncomeSearchType,
  OfferingIncomeSearchTypeNames,
} from '@/modules/offering/income/enums/offering-income-search-type.enum';
import {
  OfferingIncomeSearchSubType,
  OfferingIncomeSearchSubTypeNames,
} from '@/modules/offering/income/enums/offering-income-search-sub-type.enum';
import { OfferingIncomeSearchSelectOptionNames } from '@/modules/offering/income/enums/offering-income-search-select-option.enum';

import { dateFormatterToDDMMYYYY } from '@/shared/helpers/date-formatter-to-ddmmyyyy.helper';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { useConditionalListQuery, useManualQuery } from '@/shared/hooks';
import { DataTable, type FilterConfig } from '@/shared/components/data-table';
import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';

import { OfferingIncomeSummaryCard } from '@/modules/offering/income/components';

//* Static filter configuration
const FILTERS_CONFIG: FilterConfig[] = [
  {
    columnId: 'subType',
    placeholder: 'Sub-tipo...',
    type: 'text',
  },
  {
    columnId: 'copastorOrPreacher',
    placeholder: 'Co-pastor o predicador...',
    type: 'text',
  },
];

//* Pre-built Maps for O(1) lookups
const searchTypeNamesMap = new Map(Object.entries(OfferingIncomeSearchTypeNames));
const searchSubTypeNamesMap = new Map(Object.entries(OfferingIncomeSearchSubTypeNames));
const searchSelectOptionNamesMap = new Map(Object.entries(OfferingIncomeSearchSelectOptionNames));
const creationTypeNamesMap = new Map(Object.entries(OfferingIncomeCreationTypeNames));
const creationSubTypeNamesMap = new Map(Object.entries(OfferingIncomeCreationSubTypeNames));
const creationCategoryNamesMap = new Map(Object.entries(OfferingIncomeCreationCategoryNames));

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: Array<ColumnDef<TData, TValue>>;
  searchMode: OfferingIncomeSearchMode;
  generalSearchParams: GeneralSearchForm | undefined;
  filterSearchParams: OfferingIncomeSearchFormByTerm | undefined;
  dataForm: OfferingIncomeSearchFormByTerm | undefined;
  setGeneralSearchParams: React.Dispatch<React.SetStateAction<GeneralSearchForm | undefined>>;
  setFilterSearchParams: React.Dispatch<
    React.SetStateAction<OfferingIncomeSearchFormByTerm | undefined>
  >;
}

export function UnifiedOfferingIncomeSearchDataTable<TData, TValue>({
  columns,
  searchMode,
  generalSearchParams,
  filterSearchParams,
  dataForm,
  setGeneralSearchParams,
  setFilterSearchParams,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* Store selectors
  const isFiltersDisabled = useOfferingIncomeStore(selectFiltersDisabled);
  const setFiltersDisabled = useOfferingIncomeStore(selectSetFiltersDisabled);
  const setSearchData = useOfferingIncomeStore(selectSetSearchData);

  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Determine current search params based on mode
  const currentSearchParams = searchMode === 'general' ? generalSearchParams : filterSearchParams;

  //* Query for general search
  const generalQuery = useConditionalListQuery({
    queryKey: ['unified-offering-income-general', generalSearchParams],
    queryFn: () => getOfferingsIncome(generalSearchParams as OfferingIncomeQueryParams),
    enabled: searchMode === 'general' && !!generalSearchParams,
  });

  //* Query for filter search
  const filterQuery = useConditionalListQuery({
    queryKey: ['unified-offering-income-filters', filterSearchParams],
    queryFn: () => getOfferingsIncomeByTerm(filterSearchParams as OfferingIncomeQueryParams),
    enabled: searchMode === 'filters' && !!filterSearchParams,
  });

  //* Select active query based on mode
  const activeQuery = searchMode === 'general' ? generalQuery : filterQuery;

  //* Derived state
  const isDisabledButton = activeQuery?.isPending;

  //* Translate data to Spanish
  const translatedData = useMemo(() => {
    if (!activeQuery.data) return [];

    return activeQuery.data.map((item: any) => ({
      ...item,
      type: creationTypeNamesMap.get(item.type) ?? item.type,
      subType: creationSubTypeNamesMap.get(item.subType) ?? '-',
      category: creationCategoryNamesMap.get(item.category) ?? '-',
    }));
  }, [activeQuery.data]);

  //* Set data result query
  useEffect(() => {
    setSearchData(activeQuery.data as any);
  }, [activeQuery?.isFetching, activeQuery.data, setSearchData]);

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

  //* Query Report and Event trigger
  const generalReportQuery = useManualQuery({
    queryKey: ['unified-offering-income-report-general', generalSearchParams],
    queryFn: () =>
      getGeneralOfferingIncomeReport(generalSearchParams as OfferingIncomeQueryParams),
  });

  const filterReportQuery = useManualQuery({
    queryKey: ['unified-offering-income-report-filters', filterSearchParams],
    queryFn: () =>
      getOfferingIncomeReportByTerm(filterSearchParams as OfferingIncomeQueryParams),
  });

  const activeReportQuery = searchMode === 'general' ? generalReportQuery : filterReportQuery;

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

    const st = dataForm.searchSubType;

    // Date-based search terms
    if (
      st === OfferingIncomeSearchSubType.OfferingByDate ||
      st === OfferingIncomeSearchSubType.OfferingByGroupCodeDate ||
      st === OfferingIncomeSearchSubType.OfferingByShiftDate ||
      st === OfferingIncomeSearchSubType.OfferingByZoneDate
    ) {
      const fromDate = dataForm.dateTerm?.from
        ? dateFormatterToDDMMYYYY(dataForm.dateTerm.from)
        : '';
      const toDate = dataForm.dateTerm?.to
        ? ` - ${dateFormatterToDDMMYYYY(dataForm.dateTerm.to)}`
        : '';

      // For combined terms (zone+date, group+date, shift+date)
      if (st === OfferingIncomeSearchSubType.OfferingByZoneDate ||
        st === OfferingIncomeSearchSubType.OfferingByGroupCodeDate) {
        return `${dataForm.inputTerm ?? ''} - ${fromDate}${toDate}`;
      }
      if (st === OfferingIncomeSearchSubType.OfferingByShiftDate) {
        const shiftName = searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
        return `${shiftName} - ${fromDate}${toDate}`;
      }
      return `${fromDate}${toDate}`;
    }

    // Zone or group code input terms
    if (
      st === OfferingIncomeSearchSubType.OfferingByZone ||
      st === OfferingIncomeSearchSubType.OfferingByGroupCode
    ) {
      return dataForm.inputTerm ?? '';
    }

    // Shift-only terms
    if (st === OfferingIncomeSearchSubType.OfferingByShift) {
      return searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
    }

    // First names terms
    if (
      st === OfferingIncomeSearchSubType.OfferingByPreacherFirstNames ||
      st === OfferingIncomeSearchSubType.OfferingBySupervisorFirstNames
    ) {
      return dataForm.firstNamesTerm ?? '';
    }

    // Last names terms
    if (
      st === OfferingIncomeSearchSubType.OfferingByPreacherLastNames ||
      st === OfferingIncomeSearchSubType.OfferingBySupervisorLastNames
    ) {
      return dataForm.lastNamesTerm ?? '';
    }

    // Full names terms
    if (
      st === OfferingIncomeSearchSubType.OfferingByPreacherFullNames ||
      st === OfferingIncomeSearchSubType.OfferingBySupervisorFullNames
    ) {
      return `${dataForm.firstNamesTerm ?? ''} ${dataForm.lastNamesTerm ?? ''}`.trim();
    }

    // Contributor terms (with select term prefix)
    if (
      st === OfferingIncomeSearchSubType.OfferingByContributorFirstNames
    ) {
      const memberType = searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
      return `${memberType} ~ ${dataForm.firstNamesTerm ?? ''}`;
    }

    if (
      st === OfferingIncomeSearchSubType.OfferingByContributorLastNames
    ) {
      const memberType = searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
      return `${memberType} ~ ${dataForm.lastNamesTerm ?? ''}`;
    }

    if (
      st === OfferingIncomeSearchSubType.OfferingByContributorFullNames
    ) {
      const memberType = searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
      return `${memberType} ~ ${dataForm.firstNamesTerm ?? ''} ${dataForm.lastNamesTerm ?? ''}`.trim();
    }

    // Record status
    if (dataForm.searchType === OfferingIncomeSearchType.RecordStatus) {
      return searchSelectOptionNamesMap.get(dataForm.selectTerm ?? '') ?? '';
    }

    return '';
  }, [searchMode, dataForm]);

  //* Memoized search type display
  const searchTypeDisplay = useMemo((): string => {
    if (searchMode === 'general') {
      return 'Ingresos de ofrendas (Todas)';
    }

    const typeName = searchTypeNamesMap.get(dataForm?.searchType ?? '') ?? '';
    const subTypeName = searchSubTypeNamesMap.get(dataForm?.searchSubType ?? '') ?? '';

    return subTypeName ? `${typeName} ~ ${subTypeName}` : typeName;
  }, [searchMode, dataForm?.searchType, dataForm?.searchSubType]);

  //* Memoized search metadata for table header
  const searchMetadata = useMemo(() => {
    if (isFiltersDisabled) return undefined;

    return {
      title: searchTypeDisplay,
      subtitle: searchTermDisplay || undefined,
      recordCount: activeQuery.data?.length ?? 0,
    };
  }, [isFiltersDisabled, searchTypeDisplay, searchTermDisplay, activeQuery.data?.length]);

  //* Custom pagination content with summary and report buttons
  const paginationContent = useMemo(() => {
    const isReportDisabled = activeQuery.isPending;
    const isSummaryDisabled = !activeQuery.data || activeQuery.data.length === 0;

    const reportButton = (
      <Button
        key='report-button'
        type='button'
        variant='ghost'
        disabled={isReportDisabled || activeReportQuery.isFetching}
        className={cn(
          'group relative overflow-hidden',
          'px-5 py-2.5 h-auto',
          'text-[13px] md:text-[14px] font-semibold font-inter',
          'rounded-xl',
          'transition-all duration-300 ease-out',
          !isReportDisabled && !activeReportQuery.isFetching && [
            'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600',
            'dark:from-amber-600 dark:via-amber-700 dark:to-orange-700',
            'text-white',
            'shadow-lg shadow-amber-500/25 dark:shadow-amber-900/30',
            'hover:shadow-xl hover:shadow-amber-500/30 dark:hover:shadow-amber-900/40',
            'hover:scale-[1.02]',
            'active:scale-[0.98]',
          ],
          (isReportDisabled || activeReportQuery.isFetching) && [
            'bg-slate-100 dark:bg-slate-800',
            'text-slate-400 dark:text-slate-500',
            'cursor-not-allowed',
          ]
        )}
        onClick={handleGenerateReport}
      >
        {!isReportDisabled && !activeReportQuery.isFetching && (
          <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
        )}
        <FaRegFilePdf
          className={cn(
            'mr-2 text-lg transition-transform duration-300',
            !isReportDisabled && !activeReportQuery.isFetching && 'group-hover:scale-110',
            activeReportQuery.isFetching && 'animate-pulse'
          )}
        />
        <span className='relative'>
          {activeReportQuery.isFetching ? 'Generando...' : 'Generar Reporte'}
        </span>
      </Button>
    );

    // Only show summary button in general search mode
    if (searchMode === 'general') {
      return (
        <div className='flex flex-wrap items-center gap-3'>
          <OfferingIncomeSummaryCard data={activeQuery.data} isDisabled={isSummaryDisabled} />
          {reportButton}
        </div>
      );
    }

    return reportButton;
  }, [searchMode, activeQuery.data, activeQuery.isPending, activeReportQuery.isFetching, handleGenerateReport]);

  return (
    <div>
      <DataTable
        columns={columns}
        data={(translatedData as TData[]) ?? []}
        isLoading={!!currentSearchParams && activeQuery?.isPending}
        isFiltersDisabled={isFiltersDisabled || isDisabledButton}
        searchMetadata={searchMetadata}
        filters={FILTERS_CONFIG}
        onNewSearch={handleNewSearch}
        showHeader={!isFiltersDisabled}
        showFilters={!isFiltersDisabled}
        showPagination={!isFiltersDisabled && !activeQuery?.error && !activeQuery.isPending}
        showReportButton={false}
        leftPaginationContent={paginationContent}
      />
    </div>
  );
}
