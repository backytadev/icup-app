/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

import {
  OfferingIncomeCreationSubType,
  OfferingIncomeCreationSubTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import {
  OfferingIncomeCreationType,
  OfferingIncomeCreationTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-type.enum';

import { getFirstNameAndLastNames } from '@/shared/helpers/get-full-names.helper';
import { OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';
import { useState } from 'react';

import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';

interface Props {
  churchId: string | undefined;
  dialogClose: () => void;
  data: OfferingIncomeResponse[] | undefined;
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

export const OfferingIncomeSummaryTable = ({ data }: Props): JSX.Element => {
  //* States
  const [isOpenSummaryByType, setIsOpenSummaryByType] = useState(true);
  const [isOpenSummaryByShift, setIsOpenSummaryByShift] = useState(false);
  const [isOpenSummaryByUser, setIsOpenSummaryByUser] = useState(false);

  // todo: el church id si se necesita para el reporte pdf y el dialog close tmb
  //* Query Report and Event trigger
  // const generateReportQuery = useQuery({
  //   queryKey: ['member-metrics-report', church],
  //   queryFn: () =>
  //     getMemberMetricsReport({
  //       churchId: church ?? '',
  //       year: year ?? '',
  //       types,
  //       dialogClose,
  //     }),
  //   retry: false,
  //   enabled: false,
  // });

  //* Form handler
  // const handleSubmit = (): void => {
  //   generateReportQuery.refetch();
  // };

  const timeZone = 'America/Lima';
  const initialZonedDate = toZonedTime(data?.at(-1)?.createdAt!, timeZone);
  const finalZonedDate = toZonedTime(data?.at(0)?.createdAt!, timeZone);

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

  const totalByRowType = Object.values(formatDataByType ?? {}).reduce(
    (acc, curr) => {
      acc.totalPEN += curr.totalPEN;
      acc.totalUSD += curr.totalUSD;
      acc.totalEUR += curr.totalEUR;
      return acc;
    },
    { totalPEN: 0, totalUSD: 0, totalEUR: 0 }
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

  const totalByRowShift = Object.values(formatDataByShift ?? {}).reduce(
    (acc, curr) => {
      acc.totalPEN += curr.totalPEN;
      acc.totalUSD += curr.totalUSD;
      acc.totalEUR += curr.totalEUR;
      return acc;
    },
    { totalPEN: 0, totalUSD: 0, totalEUR: 0 }
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

  const totalByRowUser = Object.values(formatDataByUser ?? {}).reduce(
    (acc, curr) => {
      acc.totalPEN += curr.totalPEN;
      acc.totalUSD += curr.totalUSD;
      acc.totalEUR += curr.totalEUR;
      return acc;
    },
    { totalPEN: 0, totalUSD: 0, totalEUR: 0 }
  );

  console.log(data);
  console.log(formatDataByShift);
  console.log(formatDataByType);
  console.log(formatDataByUser);

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[580px] md:w-[650px] lg:w-[650px] xl:w-[700px]'
    >
      <h2 className='text-center text-amber-500 leading-6 pb-1 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Resumen de Ofrendas
      </h2>

      <TabsContent value='general-info' className='overflow-y-auto'>
        <Card className='w-full'>
          <CardContent className='py-3 px-3'>
            <span className='text-[13.5px] md:text-[14px] font-medium text-slate-500 dark:text-slate-400'>
              👋🏻 ¡Hola! Bienvenido al generador de resúmenes de ofrendas. Se mostrará el resumen de
              acuerdo a los datos obtenidos en la búsqueda inicial.
            </span>

            <p className='w-full text-sm md:text-base text-slate-600 dark:text-slate-300 my-3 leading-relaxed'>
              📅 Mostrando el{' '}
              <span className='font-semibold text-slate-700 dark:text-slate-100'>
                resumen de ofrendas
              </span>{' '}
              desde el{' '}
              <span className='font-bold text-indigo-600 dark:text-indigo-400'>
                {format(initialZonedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}
              </span>{' '}
              hasta el{' '}
              <span className='font-bold text-indigo-600 dark:text-indigo-400'>
                {format(finalZonedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}
              </span>
              .
            </p>

            <Collapsible
              open={isOpenSummaryByType}
              onOpenChange={setIsOpenSummaryByType}
              className='flex w-full flex-col'
            >
              <CollapsibleTrigger asChild>
                <Button className='text-sm md:text-base font-semibold tracking-wide mb-1 px-2 bg-slate-100 text-black dark:bg-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 w-full justify-between'>
                  📌 Resumen por Tipo
                  {isOpenSummaryByType ? <ChevronUp /> : <ChevronDown />}
                  <span className='sr-only'>Toggle</span>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className='space-y-3 px-3'>
                <p className='text-sm text-slate-600 dark:text-slate-300'>
                  Este informe muestra un resumen detallado de las ofrendas registradas, organizadas
                  por tipo y subtipo.
                </p>

                <table className='min-w-full text-sm text-left border border-gray-200 dark:border-slate-700 rounded-lg'>
                  <thead className='bg-gray-100 dark:bg-slate-800 text-xs uppercase text-gray-700 dark:text-slate-300'>
                    <tr>
                      <th className='px-4 py-2'>#</th>
                      <th className='px-4 py-2'>Tipo</th>
                      <th className='px-4 py-2'>Subtipo</th>
                      <th className='px-4 py-2 text-right'>Total PEN</th>
                      <th className='px-4 py-2 text-right'>Total USD</th>
                      <th className='px-4 py-2 text-right'>Total EUR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formatDataByType &&
                      Object.entries(formatDataByType).map(([key, item], index) => (
                        <tr
                          key={key}
                          className='border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                        >
                          <td className='px-4 py-2'>{index + 1}</td>
                          <td className='px-4 py-2 capitalize w-[8rem]'>
                            {OfferingIncomeCreationTypeNames[
                              item?.type as OfferingIncomeCreationType
                            ] ?? ''}
                          </td>
                          <td className='px-4 py-2 capitalize'>
                            {item?.subType
                              ? OfferingIncomeCreationSubTypeNames[
                                  item?.subType as OfferingIncomeCreationSubType
                                ].replace(/_/g, ' ')
                              : '—'}
                          </td>
                          <td className='px-4 py-2 text-right'>S/ {item?.totalPEN.toFixed(2)}</td>
                          <td className='px-4 py-2 text-right'>$ {item?.totalUSD.toFixed(2)}</td>
                          <td className='px-4 py-2 text-right'>€ {item?.totalEUR.toFixed(2)}</td>
                        </tr>
                      ))}

                    <tr className='border-t-2 border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 font-semibold'>
                      <td colSpan={3} className='px-4 py-2 text-right'>
                        Total
                      </td>
                      <td className='px-4 py-2 text-right text-green-700 dark:text-green-400'>
                        S/ {totalByRowType.totalPEN.toFixed(2)}
                      </td>
                      <td className='px-4 py-2 text-right text-green-700 dark:text-green-400'>
                        $ {totalByRowType.totalUSD.toFixed(2)}
                      </td>
                      <td className='px-4 py-2 text-right text-green-700 dark:text-green-400'>
                        € {totalByRowType.totalEUR.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={isOpenSummaryByShift}
              onOpenChange={setIsOpenSummaryByShift}
              className='flex w-full flex-col mt-4'
            >
              <CollapsibleTrigger asChild>
                <Button className='text-sm md:text-base font-semibold tracking-wide mb-1 px-2 bg-slate-100 text-black dark:bg-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 w-full justify-between'>
                  📌 Resumen por Turno
                  {isOpenSummaryByShift ? <ChevronUp /> : <ChevronDown />}
                  <span className='sr-only'>Toggle</span>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className='space-y-3 px-3'>
                <p className='text-sm text-slate-600 dark:text-slate-300 mb-4'>
                  Este informe muestra un resumen detallado de las ofrendas registradas, organizadas
                  por turno, considerar turno día de 00:00 AM a 12:59 PM y turno tarde de 01:00 PM a
                  11:59 PM.
                </p>
                <table className='min-w-full text-sm text-left border border-gray-200 rounded-lg'>
                  <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                    <tr>
                      <th className='px-4 py-2'>#</th>
                      <th className='px-4 py-2'>Tipo</th>
                      <th className='px-4 py-2 '>Turno</th>
                      <th className='px-4 py-2 text-right'>Total PEN</th>
                      <th className='px-4 py-2 text-right'>Total USD</th>
                      <th className='px-4 py-2 text-right'>Total EUR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formatDataByShift &&
                      Object.entries(formatDataByShift).map(([key, item], index) => (
                        <tr key={key} className='border-t border-gray-200 hover:bg-gray-50'>
                          <td className='px-4 py-2'>{index + 1}</td>
                          <td className='px-4 py-2 capitalize w-[8rem]'>Ofrenda</td>
                          <td className='px-4 py-2 capitalize'>{key}</td>
                          <td className='px-4 py-2 text-right'>S/ {item?.totalPEN.toFixed(2)}</td>
                          <td className='px-4 py-2 text-right'>$ {item?.totalUSD.toFixed(2)}</td>
                          <td className='px-4 py-2 text-right'>€ {item?.totalEUR.toFixed(2)}</td>
                        </tr>
                      ))}

                    <tr className='border-t-2 border-gray-300 bg-gray-50 font-semibold'>
                      <td colSpan={3} className='px-4 py-2 text-right'>
                        Total
                      </td>
                      <td className='px-4 py-2 text-right text-green-700 dark:text-green-400'>
                        S/ {totalByRowShift.totalPEN.toFixed(2)}
                      </td>
                      <td className='px-4 py-2 text-right text-green-700 dark:text-green-400'>
                        $ {totalByRowShift.totalUSD.toFixed(2)}
                      </td>
                      <td className='px-4 py-2 text-right text-green-700 dark:text-green-400'>
                        € {totalByRowShift.totalEUR.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={isOpenSummaryByUser}
              onOpenChange={setIsOpenSummaryByUser}
              className='flex w-full flex-col mt-4'
            >
              <CollapsibleTrigger asChild>
                <Button className='text-sm md:text-base font-semibold tracking-wide mb-1 px-2 bg-slate-100 text-black dark:bg-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 w-full justify-between'>
                  📌 Resumen por Usuario
                  {isOpenSummaryByUser ? <ChevronUp /> : <ChevronDown />}
                  <span className='sr-only'>Toggle</span>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className='space-y-3 px-3'>
                <p className='text-sm text-slate-600 dark:text-slate-300 mb-4'>
                  Este informe muestra un resumen detallado de las ofrendas registradas, organizadas
                  por el usuario que realizo los registros.
                </p>
                <table className='min-w-full text-sm text-left border border-gray-200 rounded-lg'>
                  <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                    <tr>
                      <th className='px-4 py-2'>#</th>
                      <th className='px-4 py-2'>Tipo</th>
                      <th className='px-4 py-2 '>Usuario</th>
                      <th className='px-4 py-2 text-right'>Total PEN</th>
                      <th className='px-4 py-2 text-right'>Total USD</th>
                      <th className='px-4 py-2 text-right'>Total EUR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formatDataByUser &&
                      Object.entries(formatDataByUser).map(([key, item], index) => (
                        <tr key={key} className='border-t border-gray-200 hover:bg-gray-50'>
                          <td className='px-4 py-2'>{index + 1}</td>
                          <td className='px-4 py-2 capitalize w-[8rem]'>Ofrenda</td>
                          <td className='px-4 py-2 capitalize w-[8rem]'>
                            {getFirstNameAndLastNames({
                              firstNames: item.firstNames ?? '',
                              lastNames: item.lastNames ?? '',
                            })}
                          </td>
                          <td className='px-4 py-2 text-right'>S/ {item?.totalPEN.toFixed(2)}</td>
                          <td className='px-4 py-2 text-right'>$ {item?.totalUSD.toFixed(2)}</td>
                          <td className='px-4 py-2 text-right'>€ {item?.totalEUR.toFixed(2)}</td>
                        </tr>
                      ))}

                    <tr className='border-t-2 border-gray-300 bg-gray-50 font-semibold'>
                      <td colSpan={3} className='px-4 py-2 text-right'>
                        Total
                      </td>
                      <td className='px-4 py-2 text-right text-green-700 dark:text-green-400'>
                        S/ {totalByRowUser.totalPEN.toFixed(2)}
                      </td>
                      <td className='px-4 py-2 text-right text-green-700 dark:text-green-400'>
                        $ {totalByRowUser.totalUSD.toFixed(2)}
                      </td>
                      <td className='px-4 py-2 text-right text-green-700 dark:text-green-400'>
                        € {totalByRowUser.totalEUR.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CollapsibleContent>
            </Collapsible>

            {/* <div className='mt-3'>
              <p className='text-blue-500 text-[14px] md:text-[14px] font-bold mb-2'>
                Consideraciones
              </p>
              <p className='text-[13px] md:text-[13px] font-medium '>
                ✅ Se generara el reporte pdf con la iglesia actual de la búsqueda.
              </p>
            </div> */}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
