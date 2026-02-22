import { TbArrowsUpDown } from 'react-icons/tb';

import { type TooltipConfig } from '@/shared/interfaces/tooltip-config.interface';
import { type IncomeAndExpensesComparativePayload } from '@/modules/metrics/components/financial-balance-comparative/tooltips/interfaces/income-and-expenses-comparative-tooltip-payload.interface';

export const IncomeAndExpensesComparativeTooltipContent = (
  props: TooltipConfig<IncomeAndExpensesComparativePayload>
): JSX.Element => {
  const { payload, label } = props;

  return (
    <div className='min-w-[190px] max-w-[290px] rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden shadow-lg'>
      {/* Header */}
      <div className='px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10 border-b border-slate-200/60 dark:border-slate-700/40'>
        <div className='flex items-center gap-2'>
          <div className='p-1 rounded-md bg-blue-500/10 dark:bg-blue-500/20'>
            <TbArrowsUpDown className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
          </div>
          <div className='flex-1 min-w-0'>
            <span className='font-outfit font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate block'>
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='px-3 py-2.5 space-y-2'>
        {/* Previous balance */}
        <p className='font-inter text-[11px] font-medium text-slate-500 dark:text-slate-400'>
          {label === 'Enero' ? 'Saldo año anterior:' : 'Saldo mes anterior:'}{' '}
          <span className='font-bold text-slate-700 dark:text-slate-200'>
            {payload[0]?.payload?.netResultPrevious?.toFixed(2) ?? 0} {payload[0]?.payload?.currency}
          </span>
        </p>

        {/* Income and Expenses */}
        <div className='space-y-1.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <span className='inline-block h-2.5 w-2.5 rounded-[2px]' style={{ backgroundColor: '#4ecb17' }} />
              <span className='font-inter text-[10px] font-medium text-slate-500 dark:text-slate-400'>Ingresos</span>
            </div>
            <span className='font-inter text-[11px] font-bold text-slate-800 dark:text-slate-100'>
              {payload[0]?.payload?.totalIncome.toFixed(2)} {payload[0]?.payload?.currency}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <span className='inline-block h-2.5 w-2.5 rounded-[2px]' style={{ backgroundColor: '#ec564b' }} />
              <span className='font-inter text-[10px] font-medium text-slate-500 dark:text-slate-400'>Salidas</span>
            </div>
            <span className='font-inter text-[11px] font-bold text-slate-800 dark:text-slate-100'>
              {payload[0]?.payload?.totalExpenses.toFixed(2)} {payload[0]?.payload?.currency}
            </span>
          </div>
        </div>

        {/* Net result */}
        <div className='pt-1.5 border-t border-slate-200 dark:border-slate-700/50'>
          <div className='flex items-center justify-between'>
            <span className='font-inter text-[10px] font-semibold text-amber-600 dark:text-amber-400'>Diferencia</span>
            <span className='font-inter text-[11px] font-bold text-amber-700 dark:text-amber-300'>
              {payload[0]?.payload?.netResult.toFixed(2)} {payload[0]?.payload?.currency}
            </span>
          </div>
        </div>

        {/* Church metadata */}
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
