/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { cn } from '@/shared/lib/utils';

import {
  type OfferingIncomeCreationCategory,
  OfferingIncomeCreationCategoryNames,
} from '@/modules/offering/income/enums/offering-income-creation-category.enum';
import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';

import { type TopFamilyGroupOfferingsPayload } from '@/modules/dashboard/interfaces/top-family-groups-offerings-tooltip-payload.interface';

import { type TooltipConfig } from '@/shared/interfaces/tooltip-config.interface';
import { getFirstNameAndLastNames } from '@/shared/helpers/get-full-names.helper';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';

export const TopFamilyGroupsTooltipContent = (
  props: TooltipConfig<TopFamilyGroupOfferingsPayload>
): JSX.Element => {
  const { payload, label } = props;

  return (
    <div className='grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl'>
      <p>
        <span className='font-medium text-[14px] sm:text-[14px]'>{`${payload[0]?.payload?.familyGroup?.familyGroupName}`}</span>
        <span className='font-medium text-[13px] sm:text-[13px]'>{` ~ ${label}`}</span>
      </p>
      <ul className={'list flex flex-col justify-center gap-1.5'}>
        {payload.map(
          (entry, index: any) =>
            ((entry?.name === 'accumulatedOfferingEUR' &&
              entry?.payload?.allOfferings?.some(
                (item: any) => item.currency === CurrencyType.EUR
              )) ||
              (entry?.name === 'accumulatedOfferingPEN' &&
                entry?.payload?.allOfferings?.some(
                  (item: any) => item.currency === CurrencyType.PEN
                )) ||
              (entry?.name === 'accumulatedOfferingUSD' &&
                entry?.payload?.allOfferings?.some(
                  (item: any) => item.currency === CurrencyType.USD
                ))) && (
              <div key={`item-${index}`}>
                <li className={cn('flex items-center font-medium [14px] md:text-[14px]')}>
                  <span
                    className='inline-block h-2.5 w-2.5 rounded-[2px] mr-2'
                    style={{
                      backgroundColor: entry.color,
                      border: `1px solid ${entry.color}`,
                    }}
                  ></span>
                  <span className='font-semibold text-[13.5px] md:text-[14px]'>{`Ultima Ofrenda:`}</span>
                  <span className='pl-1 font-normal text-[13.5px] md:text-[14px] dark:text-white text-black'>
                    {`${
                      entry?.name === 'accumulatedOfferingPEN'
                        ? entry?.payload?.allOfferings?.find(
                            (item: any) => item.currency === CurrencyType.PEN
                          )?.offering
                        : entry?.name === 'accumulatedOfferingUSD'
                          ? entry?.payload?.allOfferings?.find(
                              (item: any) => item.currency === CurrencyType.USD
                            )?.offering
                          : entry?.payload?.allOfferings?.find(
                              (item: any) => item.currency === CurrencyType.EUR
                            )?.offering
                    } 
              ${
                entry?.name === 'accumulatedOfferingPEN'
                  ? CurrencyType.PEN
                  : entry?.name === 'accumulatedOfferingUSD'
                    ? CurrencyType.USD
                    : CurrencyType.EUR
              } - ${
                entry?.name === 'accumulatedOfferingPEN'
                  ? formatDateToLimaDayMonthYear(
                      entry?.payload?.allOfferings?.find(
                        (item: any) => item.currency === CurrencyType.PEN
                      )?.date!
                    )
                  : entry?.name === 'accumulatedOfferingUSD'
                    ? formatDateToLimaDayMonthYear(
                        entry.payload.allOfferings.find(
                          (item: any) => item.currency === CurrencyType.USD
                        )?.date!
                      )
                    : formatDateToLimaDayMonthYear(
                        entry?.payload?.allOfferings?.find(
                          (item: any) => item.currency === CurrencyType.EUR
                        )?.date!
                      )
              }`}
                  </span>
                </li>
              </div>
            )
        )}
      </ul>

      <ul className='list-disc pl-3 sm:pl-4 flex flex-col gap-1.5'>
        <li className={' font-medium italic text-[13.5px] sm:text-[13.5px]'}>
          <span className='sm:-ml-1'>{`Categoría: ${OfferingIncomeCreationCategoryNames[payload[0]?.payload?.category as OfferingIncomeCreationCategory]}`}</span>
        </li>
        <li className={' font-medium italic text-[13.5px] sm:text-[13.5px]'}>
          <span className='sm:-ml-1'>
            {`Predicador: ${getFirstNameAndLastNames({
              firstNames: `${payload?.[0]?.payload?.preacher?.firstNames || ''}`,
              lastNames: `${payload?.[0]?.payload?.preacher?.lastNames || ''}`,
            })}`}
          </span>
        </li>
        <li className=' font-medium italic text-[13.5px] sm:text-[13.5px]'>
          <span className='sm:-ml-1'>{`Miembros: ${payload[0]?.payload?.familyGroup?.disciples}`}</span>
        </li>
        <li className={' font-medium italic text-[13.5px] sm:text-[13.5px]'}>
          <span className='sm:-ml-1'>{`Iglesia: ${payload[0]?.payload?.church?.abbreviatedChurchName} ${payload[0]?.payload?.church?.isAnexe ? ' - (Anexo)' : ''}`}</span>
        </li>
      </ul>

      {(payload[0]?.payload?.accumulatedOfferingPEN > 0 &&
        payload[0]?.payload?.accumulatedOfferingUSD > 0) ||
      (payload[0]?.payload?.accumulatedOfferingPEN > 0 &&
        payload[0]?.payload?.accumulatedOfferingEUR > 0) ? (
        <p className='font-medium text-[13.5px] sm:text-[13.5px] dark:text-slate-400 text-slate-500'>
          Totales acumulados:
        </p>
      ) : (
        <p className='font-medium text-[13.5px] sm:text-[13.5px] dark:text-slate-400 text-slate-500'>
          Total acumulado:
        </p>
      )}

      <ul className='list-disc pl-3 sm:pl-4 flex flex-col gap-1.5'>
        {payload[0]?.payload?.accumulatedOfferingPEN > 0 && (
          <li className='font-medium text-[13.5px] sm:text-[13.5px] dark:text-slate-400 text-slate-500'>
            <span className='sm:-ml-1'>{`Soles: ${payload[0]?.payload?.accumulatedOfferingPEN.toFixed(2)} PEN`}</span>
          </li>
        )}

        {payload[0]?.payload?.accumulatedOfferingUSD > 0 && (
          <li className='font-medium text-[13.5px] sm:text-[13.5px] dark:text-slate-400 text-slate-500'>
            <span className='sm:-ml-1'>{`Dolares: ${payload[0]?.payload?.accumulatedOfferingUSD.toFixed(2)} USD`}</span>
          </li>
        )}

        {payload[0]?.payload?.accumulatedOfferingEUR > 0 && (
          <li className='font-medium text-[13.5px] sm:text-[13.5px] dark:text-slate-400 text-slate-500'>
            <span className='sm:-ml-1'>{`Euros: ${payload[0]?.payload?.accumulatedOfferingEUR.toFixed(2)} EUR`}</span>
          </li>
        )}
      </ul>
    </div>
  );
};
