import { TbCalendarEvent } from 'react-icons/tb';

import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';

import { type TooltipConfig } from '@/shared/interfaces/tooltip-config.interface';

import { type LatestSundaysOfferingsPayload } from '@/modules/dashboard/interfaces/last-sundays-offerings-tooltip-payload.interface';

import { type OfferingIncomeCreationCategory } from '@/modules/offering/income/enums/offering-income-creation-category.enum';
import { OfferingIncomeCreationCategoryNames } from '@/modules/offering/income/enums/offering-income-creation-category.enum';

export const LastSundaysOfferingsTooltipContent = (
  props: TooltipConfig<LatestSundaysOfferingsPayload>
): JSX.Element => {
  const { payload, label } = props;

  const totalAccumulatedPEN = payload
    .filter((item: any) => item.dataKey === 'dayPEN' || item.dataKey === 'afternoonPEN')
    .reduce((result: any, entry: any) => result + entry.value, 0)
    .toFixed(2);

  const totalAccumulatedUSD = payload
    .filter((item: any) => item.dataKey === 'dayUSD' || item.dataKey === 'afternoonUSD')
    .reduce((result: any, entry: any) => result + entry.value, 0)
    .toFixed(2);

  const totalAccumulatedEUR = payload
    .filter((item: any) => item.dataKey === 'dayEUR' || item.dataKey === 'afternoonEUR')
    .reduce((result: any, entry: any) => result + entry.value, 0)
    .toFixed(2);

  const hasMultipleCurrencies =
    (Number(totalAccumulatedPEN) > 0 && Number(totalAccumulatedUSD) > 0) ||
    (Number(totalAccumulatedPEN) > 0 && Number(totalAccumulatedEUR) > 0) ||
    (Number(totalAccumulatedUSD) > 0 && Number(totalAccumulatedEUR) > 0);

  return (
    <div className='min-w-[200px] max-w-[260px] rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden'>
      {/* Header */}
      <div className='px-3 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border-b border-slate-200/60 dark:border-slate-700/40'>
        <div className='flex items-center gap-2'>
          <div className='p-1.5 rounded-md bg-blue-500/10 dark:bg-blue-500/20'>
            <TbCalendarEvent className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
          </div>
          <span className='font-outfit font-semibold text-[13px] text-slate-800 dark:text-slate-100'>
            {label?.split('-')?.reverse()?.join('/')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='px-3 py-2.5 space-y-2.5'>
        {/* Offerings list */}
        <div className='space-y-1'>
          {payload.map((entry, index) =>
            entry.value ? (
              <div
                key={`item-${index}`}
                className='flex items-center justify-between gap-3 py-0.5'
              >
                <div className='flex items-center gap-2'>
                  <span
                    className='w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-900'
                    style={{
                      backgroundColor: entry.color,
                      boxShadow: `0 0 6px ${entry.color}40`,
                    }}
                  />
                  <span className='font-inter text-[11px] font-medium text-slate-600 dark:text-slate-300'>
                    {entry.name.charAt(0).toUpperCase() + entry.name.slice(1, -4)}
                  </span>
                </div>
                <span className='font-inter text-[11px] font-semibold text-slate-800 dark:text-slate-100'>
                  {entry.value}{' '}
                  <span className='text-slate-500 dark:text-slate-400 font-normal'>
                    {entry?.dataKey === 'dayPEN' || entry?.dataKey === 'afternoonPEN'
                      ? CurrencyType.PEN
                      : entry?.dataKey === 'dayUSD' || entry?.dataKey === 'afternoonUSD'
                        ? CurrencyType.USD
                        : CurrencyType.EUR}
                  </span>
                </span>
              </div>
            ) : null
          )}
        </div>

        {/* Metadata */}
        <div className='flex items-center gap-3 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700/50 flex-wrap'>
          <p className='flex items-center gap-1.5 font-inter text-[10px] text-slate-500 dark:text-slate-400'>
            <span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600' />
            {OfferingIncomeCreationCategoryNames[payload[0]?.payload?.category as OfferingIncomeCreationCategory]}
          </p>
          <p className='flex items-center gap-1.5 font-inter text-[10px] text-slate-500 dark:text-slate-400'>
            <span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600' />
            {payload[0]?.payload?.church?.abbreviatedChurchName}
            {payload[0]?.payload?.church?.isAnexe && (
              <span className='ml-1 px-1 py-0.5 text-[9px] rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'>
                Anexo
              </span>
            )}
          </p>
        </div>

        {/* Totals */}
        <div className='pt-2 border-t border-slate-200 dark:border-slate-700/50'>
          <p className='font-inter text-[9px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1.5'>
            {hasMultipleCurrencies ? 'Totales acumulados' : 'Total acumulado'}
          </p>
          <div className='flex flex-wrap gap-1.5'>
            {Number(totalAccumulatedPEN) > 0 && (
              <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-700/30'>
                <span className='font-inter text-[11px] font-bold text-amber-700 dark:text-amber-400'>
                  {totalAccumulatedPEN}
                </span>
                <span className='font-inter text-[9px] text-amber-600/70 dark:text-amber-500/70'>
                  PEN
                </span>
              </div>
            )}
            {Number(totalAccumulatedUSD) > 0 && (
              <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200/50 dark:border-emerald-700/30'>
                <span className='font-inter text-[11px] font-bold text-emerald-700 dark:text-emerald-400'>
                  {totalAccumulatedUSD}
                </span>
                <span className='font-inter text-[9px] text-emerald-600/70 dark:text-emerald-500/70'>
                  USD
                </span>
              </div>
            )}
            {Number(totalAccumulatedEUR) > 0 && (
              <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200/50 dark:border-violet-700/30'>
                <span className='font-inter text-[11px] font-bold text-violet-700 dark:text-violet-400'>
                  {totalAccumulatedEUR}
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
