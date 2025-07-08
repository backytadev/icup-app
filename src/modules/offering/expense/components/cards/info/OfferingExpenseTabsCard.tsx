/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { cn } from '@/shared/lib/utils';

import { OfferingExpenseSearchTypeNames } from '@/modules/offering/expense/enums/offering-expense-search-type.enum';
import { OfferingExpenseSearchSubTypeNames } from '@/modules/offering/expense/enums/offering-expense-search-sub-type.enum';

import {
  formatDateToLimaTime,
  formatDateToLimaDayMonthYear,
} from '@/shared/helpers/format-date-to-lima';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { type OfferingExpenseResponse } from '@/modules/offering/expense/interfaces/offering-expense-response.interface';

import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface OfferingExpenseTabsCardProps {
  id: string;
  data: OfferingExpenseResponse | undefined;
}

export const OfferingExpenseTabsCard = ({
  data,
  id,
}: OfferingExpenseTabsCardProps): JSX.Element => {
  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);

      if (url.pathname === '/offerings/expenses/general-search')
        url.pathname = `/offerings/expenses/general-search/${id}/view`;

      if (url.pathname === '/offerings/expenses/search-by-term')
        url.pathname = `/offerings/expenses/search-by-term/${id}/view`;

      if (url.pathname === '/offerings/expenses/update')
        url.pathname = `/offerings/expenses/update/${id}/view`;

      if (url.pathname === '/offerings/expenses/inactivate')
        url.pathname = `/offerings/expenses/inactivate/${id}/view`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  return (
    <Tabs defaultValue='general-info' className='md:-mt-8 w-[650px] md:w-[630px]'>
      <TabsList className='grid w-full px-auto grid-cols-1'>
        <TabsTrigger value='general-info' className='text-[14.5px] md:text-[15px]'>
          Información General
        </TabsTrigger>
      </TabsList>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          <CardHeader className='text-center pb-4 pt-2'>
            <CardTitle className='text-blue-500 text-[23px] md:text-[28px] font-bold -mb-2'>
              Información General
            </CardTitle>
            <CardDescription className='text-[14px] md:text-[15px]'>
              Información general del registro de ingreso de la ofrenda.
            </CardDescription>
          </CardHeader>

          <CardContent className='grid grid-cols-3 pl-[1.5rem] pr-[1.5rem] pb-5 sm:pl-[5.3rem] sm:pr-[5rem] gap-x-4 gap-y-1 md:gap-x-6 md:gap-y-4 md:pl-[5.8rem] md:pr-[2.5rem]'>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Tipo</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {Object.entries(OfferingExpenseSearchTypeNames).find(
                  ([key]) => key === data?.type
                )?.[1] ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Sub-tipo</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {Object.entries(OfferingExpenseSearchSubTypeNames).find(
                  ([key]) => key === data?.subType
                )?.[1] ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Monto</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.amount ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Divisa</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {Object.entries(CurrencyTypeNames).find(([key]) => key === data?.currency)?.[1] ??
                  '-'}
              </CardDescription>
            </div>

            <div className='space-y-1 col-start-2 col-end-4'>
              <Label className='text-[14px] md:text-[15px]'>Fecha del gasto</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.createdAt ? formatDateToLimaDayMonthYear(data?.date) : '-'}
              </CardDescription>
            </div>

            <div className='space-y-1 col-start-1 col-end-4'>
              <Label className='text-[14px] md:text-[15px]'>Detalles / Observaciones</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px] overflow-hidden text-ellipsis'>
                {!data?.comments
                  ? '-'
                  : data?.comments.split('\n').map((line, index) => (
                      <p key={index} className='whitespace-pre-wrap'>
                        {line}
                      </p>
                    ))}
              </CardDescription>
            </div>

            <div className='space-y-1 col-start-1 col-end-4'>
              <Label className='text-[14px] md:text-[15px]'>Imágenes adjuntas</Label>
              <div className='px-2 text-green-600 w-full overflow-x-auto'>
                <ul className='pl-4 flex justify-between gap-x-10 gap-y-2 list-disc w-fit'>
                  {data?.imageUrls?.length !== undefined && data?.imageUrls?.length > 0 ? (
                    data?.imageUrls?.map((image, index) => (
                      <li key={image} className='w-full'>
                        <a
                          className='block text-green-600 max-w-[40vw] overflow-hidden text-ellipsis whitespace-nowrap'
                          href={image}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Imagen N°{index + 1}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className='text-red-500 text-[14px] md:text-[15px]'>
                      No hay imágenes adjuntadas.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className='md:-mb-3 pt-1 md:pt-0 col-start-1 col-end-4 row-start-5 row-end-6 md:row-start-auto md:row-end-auto flex flex-col gap-2'>
              <Label className='col-start-1 col-end-4 text-[15px] md:text-[16px] font-bold text-emerald-500'>
                Información de pertenecía
              </Label>

              <div className='space-y-1 col-start-1 col-end-4'>
                <Label className='text-[14px] md:text-[15px]'>Iglesia</Label>
                <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                  {data?.church?.id
                    ? `${data?.church?.abbreviatedChurchName} - ${data?.church?.district}`
                    : '-'}
                </CardDescription>
              </div>
            </div>

            <Label className='md:-mb-3 pt-1 md:pt-0 row-start-6 row-end-7 md:row-auto col-start-1 col-end-4 text-[15px] md:text-[16px] font-bold text-amber-500'>
              Información del registro
            </Label>

            <div className='space-y-1 flex justify-between items-center row-start-7 row-end-8 col-start-1 col-end-4 md:grid md:col-auto md:row-auto'>
              <Label className='text-[14px] md:text-[15px]'>Creado por</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.createdBy
                  ? getInitialFullNames({
                      firstNames: data?.createdBy?.firstNames ?? '-',
                      lastNames: data?.createdBy?.lastNames ?? '-',
                    })
                  : '-'}
              </CardDescription>
            </div>

            <div className='space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-8 row-end-9 md:grid md:col-auto md:row-auto'>
              <Label className='text-[14px] md:text-[15px]'>Fecha de creación</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px] text-right md:text-left md:whitespace-nowrap'>
                {data?.createdAt
                  ? `${formatDateToLimaDayMonthYear(data?.createdAt)} - ${formatDateToLimaTime(data?.createdAt)}`
                  : '-'}
              </CardDescription>
            </div>

            <div className='space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-9 row-end-10 md:grid md:row-auto  md:col-start-1 md:col-end-2'>
              <Label className='text-[14px] md:text-[15px]'>Actualizado por</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.updatedBy
                  ? getInitialFullNames({
                      firstNames: data?.updatedBy?.firstNames ?? '-',
                      lastNames: data?.updatedBy?.lastNames ?? '-',
                    })
                  : '-'}
              </CardDescription>
            </div>

            <div className='space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-10 row-end-11 md:grid md:row-auto md:col-start-2 md:col-end-4'>
              <Label className='text-[14px] md:text-[15px]'>Ultima fecha de actualización</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px] text-right md:text-left'>
                {data?.updatedAt
                  ? `${formatDateToLimaDayMonthYear(data?.updatedAt)} - ${formatDateToLimaTime(data?.updatedAt)}`
                  : '-'}
              </CardDescription>
            </div>

            <div className='space-y-1 col-start-1 col-end-4 flex justify-between md:justify-center items-center row-start-11 row-end-12 md:grid md:row-start-7 md:row-end-8 md:col-start-3 md:col-end-4'>
              <Label className='text-[14px] md:text-[15px]'>Estado</Label>
              <CardDescription
                className={cn(
                  'px-2 text-[14px] md:text-[14.5px] text-green-600 font-bold',
                  data?.recordStatus !== RecordStatus.Active && 'text-red-600'
                )}
              >
                {data?.recordStatus === RecordStatus.Active ? 'Activo' : 'Inactivo'}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
