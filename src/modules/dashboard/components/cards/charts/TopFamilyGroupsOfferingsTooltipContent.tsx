import { TbHome } from 'react-icons/tb';

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
  const data = payload[0]?.payload;

  const hasMultipleCurrencies =
    (data?.accumulatedOfferingPEN > 0 && data?.accumulatedOfferingUSD > 0) ||
    (data?.accumulatedOfferingPEN > 0 && data?.accumulatedOfferingEUR > 0) ||
    (data?.accumulatedOfferingUSD > 0 && data?.accumulatedOfferingEUR > 0);

  return (
    <div className='min-w-[210px] max-w-[270px] rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden'>
      {/* Header */}
      <div className='px-3 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/10 border-b border-slate-200/60 dark:border-slate-700/40'>
        <div className='flex items-center gap-2'>
          <div className='p-1.5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20'>
            <TbHome className='w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400' />
          </div>
          <div className='flex flex-col'>
            <span className='font-outfit font-semibold text-[13px] text-slate-800 dark:text-slate-100'>
              {data?.familyGroup?.familyGroupName}
            </span>
            <span className='font-inter text-[10px] text-slate-500 dark:text-slate-400'>
              {label} · {data?.familyGroup?.disciples} miembros
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='px-3 py-2.5 space-y-2.5'>
        {/* Last offerings */}
        <div className='space-y-1'>
          <p className='font-inter text-[9px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500'>
            Última ofrenda
          </p>
          {payload.map((entry, index: number) => {
            const currencyType =
              entry?.name === 'accumulatedOfferingPEN'
                ? CurrencyType.PEN
                : entry?.name === 'accumulatedOfferingUSD'
                  ? CurrencyType.USD
                  : CurrencyType.EUR;

            const offeringData = entry?.payload?.allOfferings?.find(
              (item: any) => item.currency === currencyType
            );

            if (!offeringData) return null;

            return (
              <div key={`item-${index}`} className='flex items-center justify-between gap-2 py-0.5'>
                <div className='flex items-center gap-2'>
                  <span
                    className='w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-900'
                    style={{
                      backgroundColor: entry.color,
                      boxShadow: `0 0 6px ${entry.color}40`,
                    }}
                  />
                  <span className='font-inter text-[11px] font-semibold text-slate-700 dark:text-slate-200'>
                    {offeringData.offering}{' '}
                    <span className='font-normal text-slate-400'>{currencyType}</span>
                  </span>
                </div>
                <span className='font-inter text-[10px] text-slate-400 dark:text-slate-500'>
                  {formatDateToLimaDayMonthYear(offeringData.date)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Metadata */}
        <div className='pt-2 border-t border-dashed border-slate-200 dark:border-slate-700/50'>
          <ul className='flex items-center gap-3 flex-wrap'>
            <li className='flex items-center gap-1.5 font-inter text-[10px] text-slate-500 dark:text-slate-400'>
              <span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600' />
              {OfferingIncomeCreationCategoryNames[data?.category as OfferingIncomeCreationCategory]}
            </li>
            <li className='flex items-center gap-1.5 font-inter text-[10px] text-slate-500 dark:text-slate-400 truncate'>
              <span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600' />
              {getFirstNameAndLastNames({
                firstNames: data?.preacher?.firstNames || '',
                lastNames: data?.preacher?.lastNames || '',
              })}
            </li>
            <li className='flex items-center gap-1.5 font-inter text-[10px] text-slate-500 dark:text-slate-400'>
              <span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600' />
              {data?.church?.abbreviatedChurchName}
              {data?.church?.isAnexe && (
                <span className='ml-1 px-1 py-0.5 text-[9px] rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'>
                  Anexo
                </span>
              )}
            </li>
          </ul>
        </div>

        {/* Totals */}
        <div className='pt-2 border-t border-slate-200 dark:border-slate-700/50'>
          <p className='font-inter text-[9px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1.5'>
            {hasMultipleCurrencies ? 'Totales acumulados' : 'Total acumulado'}
          </p>
          <div className='flex flex-wrap gap-1.5'>
            {data?.accumulatedOfferingPEN > 0 && (
              <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-700/30'>
                <span className='font-inter text-[11px] font-bold text-amber-700 dark:text-amber-400'>
                  {data.accumulatedOfferingPEN.toFixed(2)}
                </span>
                <span className='font-inter text-[9px] text-amber-600/70 dark:text-amber-500/70'>
                  PEN
                </span>
              </div>
            )}
            {data?.accumulatedOfferingUSD > 0 && (
              <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200/50 dark:border-emerald-700/30'>
                <span className='font-inter text-[11px] font-bold text-emerald-700 dark:text-emerald-400'>
                  {data.accumulatedOfferingUSD.toFixed(2)}
                </span>
                <span className='font-inter text-[9px] text-emerald-600/70 dark:text-emerald-500/70'>
                  USD
                </span>
              </div>
            )}
            {data?.accumulatedOfferingEUR > 0 && (
              <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200/50 dark:border-violet-700/30'>
                <span className='font-inter text-[11px] font-bold text-violet-700 dark:text-violet-400'>
                  {data.accumulatedOfferingEUR.toFixed(2)}
                </span>
                <span className='font-inter text-[9px] text-violet-600/70 dark:text-violet-500/70'>
                  EUR
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
