import { TbChartPie } from 'react-icons/tb';

import { getPercent } from '@/modules/metrics/helpers/get-percent.helper';
import { type TooltipConfig } from '@/shared/interfaces/tooltip-config.interface';
import { type MembersByCategoryAndGenderPayload } from '@/modules/metrics/components/member/tooltips/interfaces/members-by-category-and-gender-tooltip-payload.interface';

const ageRangeMap: Record<string, string> = {
  Niño: '(0-12)',
  Adolescente: '(13-17)',
  Joven: '(18-29)',
  Adulto: '(30-59)',
  'Adulto Mayor': '(60-74)',
  Anciano: '(+75)',
};

export const MembersByCategoryAndGenderTooltipContent = (
  props: TooltipConfig<MembersByCategoryAndGenderPayload>
): JSX.Element => {
  const { payload, label } = props;
  const total = payload.reduce((result, entry) => result + entry.value, 0);

  return (
    <div className='min-w-[190px] max-w-[250px] rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden shadow-lg'>
      {/* Header */}
      <div className='px-3 py-2 bg-gradient-to-r from-orange-50 to-amber-50/30 dark:from-orange-900/20 dark:to-amber-900/10 border-b border-slate-200/60 dark:border-slate-700/40'>
        <div className='flex items-center gap-2'>
          <div className='p-1 rounded-md bg-orange-500/10 dark:bg-orange-500/20'>
            <TbChartPie className='w-3.5 h-3.5 text-orange-600 dark:text-orange-400' />
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='font-outfit font-semibold text-[13px] text-slate-800 dark:text-slate-100'>
              {label}
            </span>
            <span className='font-inter text-[10px] text-slate-400 dark:text-slate-500'>
              {ageRangeMap[label] ?? ''}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='px-3 py-2.5 space-y-2'>
        {/* Entries */}
        <div className='space-y-1'>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-2'>
                <span
                  className='w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-900'
                  style={{ backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}40` }}
                />
                <span className='font-inter text-[11px] font-medium text-slate-600 dark:text-slate-300'>
                  {entry.name === 'men' ? 'Varones' : 'Mujeres'}
                </span>
              </div>
              <span className='font-inter text-[11px] font-semibold text-slate-800 dark:text-slate-100'>
                {entry.value}{' '}
                <span className='text-[9px] font-normal text-slate-400'>
                  ({getPercent(entry.value, total)})
                </span>
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

        {/* Totals */}
        <div className='pt-1.5 border-t border-slate-200 dark:border-slate-700/50 space-y-1'>
          <div className='flex items-center justify-between'>
            <span className='font-inter text-[9px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500'>
              Total categoría
            </span>
            <span className='font-inter text-[12px] font-bold text-slate-800 dark:text-slate-100'>
              {total}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='font-inter text-[9px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500'>
              % del total
            </span>
            <span className='font-inter text-[11px] font-semibold text-amber-600 dark:text-amber-400'>
              {isNaN(+payload[0]?.payload?.totalPercentage) ? '0' : payload[0]?.payload?.totalPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
