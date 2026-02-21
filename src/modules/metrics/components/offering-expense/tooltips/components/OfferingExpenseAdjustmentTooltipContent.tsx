import { TbArrowsUpDown } from 'react-icons/tb';

import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';
import { type OfferingExpenseAdjustmentPayload } from '@/modules/metrics/components/offering-expense/tooltips/interfaces/offering-expense-adjustment-tooltip-payload.interface';
import { type TooltipConfig } from '@/shared/interfaces/tooltip-config.interface';

export const OfferingExpenseAdjustmentTooltipContent = (
  props: TooltipConfig<OfferingExpenseAdjustmentPayload>
): JSX.Element => {
  const { payload, label } = props;

  const getCurrencyStyle = (currency: string): React.CSSProperties => ({
    backgroundColor:
      currency === CurrencyType.PEN
        ? 'var(--color-accumulatedOfferingPEN)'
        : currency === CurrencyType.USD
          ? 'var(--color-accumulatedOfferingUSD)'
          : 'var(--color-accumulatedOfferingEUR)',
  });

  return (
    <div className='min-w-[190px] max-w-[280px] rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden shadow-lg'>
      {/* Header */}
      <div className='px-3 py-2 bg-gradient-to-r from-teal-50 to-cyan-50/30 dark:from-teal-900/20 dark:to-cyan-900/10 border-b border-slate-200/60 dark:border-slate-700/40'>
        <div className='flex items-center gap-2'>
          <div className='p-1 rounded-md bg-teal-500/10 dark:bg-teal-500/20'>
            <TbArrowsUpDown className='w-3.5 h-3.5 text-teal-600 dark:text-teal-400' />
          </div>
          <span className='font-outfit font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate'>
            {label?.split('-')?.reverse()?.join('/')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='px-3 py-2.5 space-y-2'>
        {/* Offerings */}
        <div className='space-y-1'>
          {payload?.[0]?.payload?.allOfferings?.length > 1 && (
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
                  style={getCurrencyStyle(off.currency)}
                />
                <span className='font-inter text-[11px] font-medium text-slate-600 dark:text-slate-300'>
                  {payload?.[0]?.payload?.allOfferings?.length > 1 ? `${index + 1}° Ofrenda` : 'Monto'}
                </span>
              </div>
              <span className='font-inter text-[11px] font-semibold text-slate-800 dark:text-slate-100'>
                {off.offering.toFixed(2)} {off.currency}
              </span>
            </div>
          ))}
        </div>

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
      </div>
    </div>
  );
};
