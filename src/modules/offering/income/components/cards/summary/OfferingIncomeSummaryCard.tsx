/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { es } from 'date-fns/locale';
import { cn } from '@/shared/lib/utils';
import { ChevronDown } from 'lucide-react';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import { Button } from '@/shared/components/ui/button';

import { OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';
import { columns } from '@/modules/offering/income/components/data-tables/columns/offering-income-summary-columns';
import { SummaryByTypeOfferingIncomeDataTable } from '@/modules/offering/income/components/data-tables/boards/summary-by-type-offering-income-data-table';

import { SummaryByUserOfferingIncomeDataTable } from '@/modules/offering/income/components/data-tables/boards/summary-by-user-offering-income-data-table';
import { SummaryByShiftOfferingIncomeDataTable } from '@/modules/offering/income/components/data-tables/boards/summary-by-shift-offering-income-data-table';

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
  // churchId: string | undefined;
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

export const OfferingIncomeResumeCard = ({ data, isDisabled }: Props): JSX.Element => {
  //* States
  const [isOpen, setIsOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const [isOpenSummaryByType, setIsOpenSummaryByType] = useState(true);
  const [isOpenSummaryByShift, setIsOpenSummaryByShift] = useState(false);
  const [isOpenSummaryByUser, setIsOpenSummaryByUser] = useState(false);
  const [initialDate, setInitialDate] = useState<string>('');
  const [finalDate, setFinalDate] = useState<string>('');

  //* Functions
  const handleContainerClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  //* Effects
  useEffect(() => {
    if (data) {
      const timeStamps = data.map((item) => new Date(item.date).getTime());
      const minDate = new Date(Math.min(...timeStamps));
      const maxDate = new Date(Math.max(...timeStamps));
      const formattedMinDate = formatInTimeZone(
        minDate ?? new Date(),
        'UTC',
        "dd 'de' MMMM 'de' yyyy",
        {
          locale: es,
        }
      );

      const formattedMaxDate = formatInTimeZone(
        maxDate ?? new Date(),
        'UTC',
        "dd 'de' MMMM 'de' yyyy",
        {
          locale: es,
        }
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
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className='relative inline-block w-full'>
            <Button
              disabled={isDisabled}
              variant='outline'
              className='w-full px-3 py-3 bg-gray-600 text-white hover:bg-gray-700 hover:text-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white rounded-md transition-colors'
            >
              <span className='flex items-center gap-2'>
                Ver Resumen <HiOutlineClipboardList className='text-2xl' />
              </span>
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent
          ref={topRef}
          className='w-full gap-0 max-h-[80vh] md:max-w-[700px] lg:max-w-[700px] xl:max-w-[750px] justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto'
        >
          <DialogTitle className='text-center text-amber-500 leading-6 pb-1 font-bold text-[25px] sm:text-[28px] md:text-[30px]'>
            Resumen de Ofrendas
          </DialogTitle>
          <DialogDescription className='py-3 px-3'>
            <span className='text-[13.5px] md:text-[14px] font-medium text-slate-500 dark:text-slate-400'>
              👋🏻 ¡Hola! Bienvenido al generador de resúmenes de ofrendas. Se mostrará el resumen de
              acuerdo a los datos obtenidos en la búsqueda inicial.
            </span>
            <p className='w-full text-sm md:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed'>
              📅 Mostrando el{' '}
              <span className='font-semibold text-slate-700 dark:text-slate-100'>
                resumen de ofrendas
              </span>{' '}
              desde el{' '}
              <span className='font-bold text-indigo-600 dark:text-indigo-400'>{initialDate}</span>{' '}
              hasta el{' '}
              <span className='font-bold text-indigo-600 dark:text-indigo-400'>{finalDate}</span>.
            </p>
          </DialogDescription>

          <div className='flex flex-col gap-y-4 w-full max-h-auto md:max-w-[700px] lg:max-w-[700px] xl:max-w-[750px] justify-center mb-1 overflow-x-hidden'>
            {/* Collapsible By Type */}
            <Collapsible
              open={isOpenSummaryByType}
              onOpenChange={setIsOpenSummaryByType}
              className='flex w-full flex-col'
            >
              <CollapsibleTrigger asChild>
                <Button className='text-[15px] md:text-base font-semibold tracking-wide mb-1 px-2 bg-slate-100 text-black dark:bg-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 w-full justify-between'>
                  📌 Resumen por Tipo
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 md:h-6 md:w-6 transition-transform duration-300',
                      isOpenSummaryByType && 'rotate-180'
                    )}
                  />
                  <span className='sr-only'>Toggle</span>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className='space-y-3 px-3 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden'>
                <p className='text-sm text-slate-600 dark:text-slate-300'>
                  Este informe muestra un resumen detallado de las ofrendas registradas, organizadas
                  por tipo y subtipo.
                </p>

                <SummaryByTypeOfferingIncomeDataTable
                  churchId={'0092932312sd'}
                  dialogClose={handleContainerClose}
                  data={formattedDataByType}
                  columns={columns}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* Collapsible by Shift */}
            <Collapsible
              open={isOpenSummaryByShift}
              onOpenChange={setIsOpenSummaryByShift}
              className='flex w-full flex-col'
            >
              <CollapsibleTrigger asChild>
                <Button className='text-[15px] md:text-base font-semibold tracking-wide mb-1 px-2 bg-slate-100 text-black dark:bg-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 w-full justify-between'>
                  📌 Resumen por Turno
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 md:h-6 md:w-6 transition-transform duration-300',
                      isOpenSummaryByShift && 'rotate-180'
                    )}
                  />
                  <span className='sr-only'>Toggle</span>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className='space-y-3 px-3 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden'>
                <p className='text-sm text-slate-600 dark:text-slate-300 mb-4'>
                  Este informe muestra un resumen detallado de las ofrendas registradas, organizadas
                  por turno, considerar turno día de 00:00 AM a 12:59 PM y turno tarde de 01:00 PM a
                  11:59 PM.
                </p>

                <SummaryByShiftOfferingIncomeDataTable
                  churchId={'0092932312sd'}
                  dialogClose={handleContainerClose}
                  data={formattedDataByShift}
                  columns={columns}
                />
              </CollapsibleContent>
            </Collapsible>

            {/*  Collapsible by User */}
            <Collapsible
              open={isOpenSummaryByUser}
              onOpenChange={setIsOpenSummaryByUser}
              className='flex w-full flex-col'
            >
              <CollapsibleTrigger asChild>
                <Button className='text-[15px] md:text-base font-semibold tracking-wide mb-1 px-2 bg-slate-100 text-black dark:bg-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 w-full justify-between'>
                  📌 Resumen por Usuario
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 md:h-6 md:w-6 transition-transform duration-300',
                      isOpenSummaryByUser && 'rotate-180'
                    )}
                  />
                  <span className='sr-only'>Toggle</span>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className='space-y-3 px-3 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden'>
                <p className='text-sm text-slate-600 dark:text-slate-300 mb-4'>
                  Este informe muestra un resumen detallado de las ofrendas registradas, organizadas
                  por el usuario que realizo los registros.
                </p>
                <SummaryByUserOfferingIncomeDataTable
                  churchId={'0092932312sd'}
                  dialogClose={handleContainerClose}
                  data={formattedDataByUser}
                  columns={columns}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
