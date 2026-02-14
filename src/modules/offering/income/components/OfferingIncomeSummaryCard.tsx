import { useState, useCallback, useEffect, useMemo } from 'react';

import { es } from 'date-fns/locale';
import { cn } from '@/shared/lib/utils';
import { ChevronDown, ClipboardList } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { toZonedTime } from 'date-fns-tz';

import { FormModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';

import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';
import { columns } from '@/modules/offering/income/components/tables/columns/summary-columns';
import { SummaryByTypeDataTable as SummaryByTypeOfferingIncomeDataTable } from '@/modules/offering/income/components/tables/SummaryByTypeDataTable';
import { SummaryByUserDataTable as SummaryByUserOfferingIncomeDataTable } from '@/modules/offering/income/components/tables/SummaryByUserDataTable';
import { SummaryByShiftDataTable as SummaryByShiftOfferingIncomeDataTable } from '@/modules/offering/income/components/tables/SummaryByShiftDataTable';

import {
  OfferingIncomeCreationType,
  OfferingIncomeCreationTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import {
  OfferingIncomeCreationSubType,
  OfferingIncomeCreationSubTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';

interface Props {
  data: OfferingIncomeResponse[] | undefined;
  isDisabled: boolean;
}

type Totals = {
  totalPEN: number;
  totalUSD: number;
  totalEUR: number;
};

type GroupedItemByType = Totals & {
  type: string;
  subType?: string;
};

type GroupedItemByShift = Totals;

type GroupedItemByUser = Totals & {
  firstNames: string;
  lastNames: string;
};

export const OfferingIncomeSummaryCard = ({ data, isDisabled }: Props): JSX.Element => {
  //* States
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenSummaryByType, setIsOpenSummaryByType] = useState(true);
  const [isOpenSummaryByShift, setIsOpenSummaryByShift] = useState(false);
  const [isOpenSummaryByUser, setIsOpenSummaryByUser] = useState(false);
  const [initialDate, setInitialDate] = useState<string>('');
  const [finalDate, setFinalDate] = useState<string>('');

  //* Functions
  const handleClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  //* Effects
  useEffect(() => {
    if (data && data.length > 0) {
      const timeStamps = data.map((item) => new Date(item.date).getTime());
      const minDate = new Date(Math.min(...timeStamps));
      const maxDate = new Date(Math.max(...timeStamps));

      const formattedMinDate = formatInTimeZone(
        minDate,
        'UTC',
        "dd 'de' MMMM 'de' yyyy",
        { locale: es }
      );

      const formattedMaxDate = formatInTimeZone(
        maxDate,
        'UTC',
        "dd 'de' MMMM 'de' yyyy",
        { locale: es }
      );

      setInitialDate(formattedMinDate);
      setFinalDate(formattedMaxDate);
    }
  }, [data]);

  //* Format Data By Type
  const formatDataByType = data?.reduce(
    (acc: Record<string, GroupedItemByType>, item: OfferingIncomeResponse) => {
      const amount = Number(item.amount);
      const key = item.subType ?? item.type;

      if (!acc[key as string]) {
        acc[key] = {
          type: item.type,
          subType: item.subType,
          totalPEN: 0,
          totalUSD: 0,
          totalEUR: 0,
        };
      }

      if (item.currency === 'PEN') {
        acc[key].totalPEN += amount;
      } else if (item.currency === 'USD') {
        acc[key].totalUSD += amount;
      } else if (item.currency === 'EUR') {
        acc[key].totalEUR += amount;
      }

      return acc;
    },
    {} as Record<string, GroupedItemByType>
  );

  //* Format Data By Shift
  const formatDataByShift = data?.reduce(
    (acc: Record<'Día' | 'Tarde', GroupedItemByShift>, item: OfferingIncomeResponse) => {
      const timeZone = 'America/Lima';
      const zonedDate = toZonedTime(item.createdAt!, timeZone);
      const hour = zonedDate.getHours();

      const hourResult = hour < 13 ? 'Día' : 'Tarde';
      const amount = Number(item.amount) || 0;

      acc[hourResult] = acc[hourResult] || {
        totalPEN: 0,
        totalUSD: 0,
        totalEUR: 0,
      };

      switch (item.currency) {
        case 'PEN':
          acc[hourResult].totalPEN += amount;
          break;
        case 'USD':
          acc[hourResult].totalUSD += amount;
          break;
        case 'EUR':
          acc[hourResult].totalEUR += amount;
          break;
      }

      return acc;
    },
    {
      Día: { totalPEN: 0, totalUSD: 0, totalEUR: 0 },
      Tarde: { totalPEN: 0, totalUSD: 0, totalEUR: 0 },
    }
  );

  //* Format Data By User
  const formatDataByUser = data?.reduce(
    (acc: Record<string, GroupedItemByUser>, item: OfferingIncomeResponse) => {
      const amount = Number(item.amount) || 0;
      const userName = `${item.createdBy?.firstNames ?? ''} ${item.createdBy?.lastNames ?? ''}`
        .trim()
        .split(' ')
        .join('');

      if (!acc[userName]) {
        acc[userName] = {
          firstNames: item.createdBy?.firstNames ?? '',
          lastNames: item.createdBy?.lastNames ?? '',
          totalPEN: 0,
          totalUSD: 0,
          totalEUR: 0,
        };
      }

      switch (item.currency) {
        case 'PEN':
          acc[userName].totalPEN += amount;
          break;
        case 'USD':
          acc[userName].totalUSD += amount;
          break;
        case 'EUR':
          acc[userName].totalEUR += amount;
          break;
      }

      return acc;
    },
    {}
  );

  //* Convert to array Format Data
  const formattedDataByType = useMemo(
    () =>
      Object.values(formatDataByType ?? {}).map((item) => ({
        offeringType: OfferingIncomeCreationTypeNames[item.type as OfferingIncomeCreationType],
        offeringSubType:
          OfferingIncomeCreationSubTypeNames[item.subType as OfferingIncomeCreationSubType] ?? '-',
        amountPEN: item.totalPEN,
        amountUSD: item.totalUSD,
        amountEUR: item.totalEUR,
      })),
    [formatDataByType]
  );

  const formattedDataByShift = useMemo(
    () =>
      Object.entries(formatDataByShift ?? {}).map(([key, item]) => ({
        offeringType: 'Ofrenda',
        offeringSubType: key,
        amountPEN: item.totalPEN,
        amountUSD: item.totalUSD,
        amountEUR: item.totalEUR,
      })),
    [formatDataByShift]
  );

  const formattedDataByUser = useMemo(
    () =>
      Object.values(formatDataByUser ?? {}).map((item) => ({
        offeringType: 'Ofrenda',
        offeringSubType: `${item.firstNames} ${item.lastNames}`,
        amountPEN: item.totalPEN,
        amountUSD: item.totalUSD,
        amountEUR: item.totalEUR,
      })),
    [formatDataByUser]
  );

  return (
    <FormModal
      open={isOpen}
      onOpenChange={setIsOpen}
      maxWidth='lg'
      customMaxWidth={'max-w-[750px]'}
      trigger={
        <Button
          disabled={isDisabled}
          variant='outline'
          className='gap-2 bg-green-600 text-white hover:bg-green-700 hover:text-white dark:bg-green-700 dark:text-white dark:hover:bg-green-600 rounded-xl'
        >
          <ClipboardList className='h-4 w-4' />
          Ver Resumen
        </Button>
      }
    >
      <div className='w-full md:min-w-[700px] -mt-4'>
        {/* Header */}
        <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 dark:from-green-600 dark:via-emerald-600 dark:to-green-700 px-4 py-4'>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='px-2 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                Resumen
              </span>
              <span className='px-2 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                Ofrendas
              </span>
            </div>
            <h2 className='text-lg md:text-xl font-bold text-white font-outfit leading-tight'>
              Resumen de Ofrendas
            </h2>
            <p className='text-white/90 text-[12px] md:text-[13px] font-inter'>
              📅 Mostrando desde el{' '}
              <span className='font-bold'>{initialDate}</span> hasta el{' '}
              <span className='font-bold'>{finalDate}</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
          <div className='p-4 space-y-3'>
            {/* Collapsible By Type */}
            <Collapsible
              open={isOpenSummaryByType}
              onOpenChange={setIsOpenSummaryByType}
              className='border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden'
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant='ghost'
                  className='w-full justify-between px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800'
                >
                  <span className='font-semibold text-[13px] md:text-[14px]'>📌 Resumen por Tipo</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      isOpenSummaryByType && 'rotate-180'
                    )}
                  />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className='px-3 pb-3 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp'>
                <p className='text-[12px] md:text-[13px] text-slate-600 dark:text-slate-400 mb-3'>
                  Este informe muestra un resumen detallado de las ofrendas registradas, organizadas
                  por tipo y subtipo.
                </p>

                <div className='max-w-full overflow-x-auto'>
                  <SummaryByTypeOfferingIncomeDataTable
                    churchId={''}
                    dialogClose={handleClose}
                    data={formattedDataByType}
                    columns={columns}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Collapsible by Shift */}
            <Collapsible
              open={isOpenSummaryByShift}
              onOpenChange={setIsOpenSummaryByShift}
              className='border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden'
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant='ghost'
                  className='w-full justify-between px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800'
                >
                  <span className='font-semibold text-[13px] md:text-[14px]'>📌 Resumen por Turno</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      isOpenSummaryByShift && 'rotate-180'
                    )}
                  />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className='px-3 pb-3 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp'>
                <p className='text-[12px] md:text-[13px] text-slate-600 dark:text-slate-400 mb-3'>
                  Este informe muestra un resumen detallado de las ofrendas registradas, organizadas
                  por turno. Turno día: 00:00 AM a 12:59 PM, Turno tarde: 01:00 PM a 11:59 PM.
                </p>

                <div className='max-w-full overflow-x-auto'>
                  <SummaryByShiftOfferingIncomeDataTable
                    churchId={''}
                    dialogClose={handleClose}
                    data={formattedDataByShift}
                    columns={columns}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Collapsible by User */}
            <Collapsible
              open={isOpenSummaryByUser}
              onOpenChange={setIsOpenSummaryByUser}
              className='border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden'
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant='ghost'
                  className='w-full justify-between px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800'
                >
                  <span className='font-semibold text-[13px] md:text-[14px]'>📌 Resumen por Usuario</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      isOpenSummaryByUser && 'rotate-180'
                    )}
                  />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className='px-3 pb-3 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp'>
                <p className='text-[12px] md:text-[13px] text-slate-600 dark:text-slate-400 mb-3'>
                  Este informe muestra un resumen detallado de las ofrendas registradas, organizadas
                  por el usuario que realizó los registros.
                </p>

                <div className='max-w-full overflow-x-auto'>
                  <SummaryByUserOfferingIncomeDataTable
                    churchId={''}
                    dialogClose={handleClose}
                    data={formattedDataByUser}
                    columns={columns}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </FormModal>
  );
};
