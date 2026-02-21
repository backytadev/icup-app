import { TbReceipt } from 'react-icons/tb';

import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';
import { type TooltipConfig } from '@/shared/interfaces/tooltip-config.interface';
import { type OfferingExpenseChartPayload } from '@/modules/metrics/components/offering-expense/tooltips/interfaces/offering-expense-chart-tooltip-payload.interface';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';

export const OfferingExpenseChartTooltipContent = (
  props: TooltipConfig<OfferingExpenseChartPayload>
): JSX.Element => {
  const { payload, label } = props;

  const hasPEN = (payload[0]?.payload?.accumulatedOfferingPEN ?? 0) > 0;
  const hasUSD = (payload[0]?.payload?.accumulatedOfferingUSD ?? 0) > 0;
  const hasEUR = (payload[0]?.payload?.accumulatedOfferingEUR ?? 0) > 0;

  return (
    <div className='min-w-[190px] max-w-[290px] rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden shadow-lg'>
      {/* Header */}
      <div className='px-3 py-2 bg-gradient-to-r from-rose-50 to-red-50/30 dark:from-rose-900/20 dark:to-red-900/10 border-b border-slate-200/60 dark:border-slate-700/40'>
        <div className='flex items-center gap-2'>
          <div className='p-1 rounded-md bg-rose-500/10 dark:bg-rose-500/20'>
            <TbReceipt className='w-3.5 h-3.5 text-rose-600 dark:text-rose-400' />
          </div>
          <div className='flex-1 min-w-0'>
            <span className='font-outfit font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate block'>
              {label}
            </span>
            {payload[0]?.payload?.totalPercentage && (
              <span className='font-inter text-[10px] text-slate-500 dark:text-slate-400'>
                {payload[0]?.payload?.totalPercentage}% del total
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='px-3 py-2.5 space-y-2'>
        {/* Offerings list */}
        {(payload?.[0]?.payload?.allOfferings?.length ?? 0) > 0 && (
          <div className='space-y-1'>
            {(payload?.[0]?.payload?.allOfferings?.length ?? 0) > 1 && (
              <span className='font-inter text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500'>
                Lista de Ofrendas
              </span>
            )}
            {payload?.[0]?.payload?.allOfferings?.map((off, index) => (
              <div
                key={`item-${index}`}
                className='flex items-center justify-between gap-3'
              >
                <div className='flex items-center gap-2'>
                  <span
                    className='inline-block h-2.5 w-2.5 rounded-[2px] flex-shrink-0'
                    style={{
                      backgroundColor:
                        off.currency === CurrencyType.PEN
                          ? 'var(--color-accumulatedOfferingPEN)'
                          : off.currency === CurrencyType.USD
                            ? 'var(--color-accumulatedOfferingUSD)'
                            : 'var(--color-accumulatedOfferingEUR)',
                    }}
                  />
                  <span className='font-inter text-[11px] font-medium text-slate-600 dark:text-slate-300'>
                    {(payload?.[0]?.payload?.allOfferings?.length ?? 0) > 1
                      ? `${index + 1}° Ofrenda`
                      : 'Monto'}
                  </span>
                </div>
                <span className='font-inter text-[11px] font-semibold text-slate-800 dark:text-slate-100'>
                  {off.offering.toFixed(2)} {off.currency}
                  {off.date ? ` - ${formatDateToLimaDayMonthYear(off.date)}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className='pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-700/50'>
          <ul className='space-y-0.5'>
            <li className='flex items-center gap-1.5 font-inter text-[10px] text-slate-500 dark:text-slate-400'>
              <span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0' />
              {payload[0]?.payload?.church?.abbreviatedChurchName}
              {payload[0]?.payload?.church?.isAnexe && (
                <span className='ml-1 px-1 py-0.5 text-[9px] rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'>
                  Anexo
                </span>
              )}
            </li>
          </ul>
        </div>

        {/* Totals */}
        {(hasPEN || hasUSD || hasEUR) && (
          <div className='pt-1.5 border-t border-slate-200 dark:border-slate-700/50 space-y-1'>
            <span className='font-inter text-[9px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500'>
              {(hasPEN && hasUSD) || (hasPEN && hasEUR) ? 'Totales acumulados' : 'Total acumulado'}
            </span>
            {hasPEN && (
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <span className='inline-block h-2.5 w-2.5 rounded-[2px]' style={{ backgroundColor: 'var(--color-accumulatedOfferingPEN)' }} />
                  <span className='font-inter text-[10px] font-medium text-slate-500 dark:text-slate-400'>Soles</span>
                </div>
                <span className='font-inter text-[11px] font-bold text-slate-800 dark:text-slate-100'>
                  {payload[0]?.payload?.accumulatedOfferingPEN.toFixed(2)} PEN
                </span>
              </div>
            )}
            {hasUSD && (
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <span className='inline-block h-2.5 w-2.5 rounded-[2px]' style={{ backgroundColor: 'var(--color-accumulatedOfferingUSD)' }} />
                  <span className='font-inter text-[10px] font-medium text-slate-500 dark:text-slate-400'>Dólares</span>
                </div>
                <span className='font-inter text-[11px] font-bold text-slate-800 dark:text-slate-100'>
                  {payload[0]?.payload?.accumulatedOfferingUSD.toFixed(2)} USD
                </span>
              </div>
            )}
            {hasEUR && (
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <span className='inline-block h-2.5 w-2.5 rounded-[2px]' style={{ backgroundColor: 'var(--color-accumulatedOfferingEUR)' }} />
                  <span className='font-inter text-[10px] font-medium text-slate-500 dark:text-slate-400'>Euros</span>
                </div>
                <span className='font-inter text-[11px] font-bold text-slate-800 dark:text-slate-100'>
                  {payload[0]?.payload?.accumulatedOfferingEUR.toFixed(2)} EUR
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
