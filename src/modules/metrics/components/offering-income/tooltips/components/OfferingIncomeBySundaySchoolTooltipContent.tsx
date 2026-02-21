/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { TbBook } from 'react-icons/tb';

import {
  OfferingIncomeCreationCategory,
  OfferingIncomeCreationCategoryNames,
} from '@/modules/offering/income/enums/offering-income-creation-category.enum';
import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';
import { type MemberType, MemberTypeNames } from '@/modules/offering/income/enums/member-type.enum';

import { type TooltipConfig } from '@/shared/interfaces/tooltip-config.interface';
import { type OfferingIncomePayloadBySundaySchool } from '@/modules/metrics/components/offering-income/tooltips/interfaces/offering-income-by-sunday-school-tooltip-payload.interface';

export const OfferingIncomeBySundaySchoolTooltipContent = (
  props: TooltipConfig<OfferingIncomePayloadBySundaySchool>
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

  const hasPEN = +totalAccumulatedPEN > 0;
  const hasUSD = +totalAccumulatedUSD > 0;
  const hasEUR = +totalAccumulatedEUR > 0;

  return (
    <div className='min-w-[190px] max-w-[290px] rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden shadow-lg'>
      {/* Header */}
      <div className='px-3 py-2 bg-gradient-to-r from-orange-50 to-amber-50/30 dark:from-orange-900/20 dark:to-amber-900/10 border-b border-slate-200/60 dark:border-slate-700/40'>
        <div className='flex items-center gap-2'>
          <div className='p-1 rounded-md bg-orange-500/10 dark:bg-orange-500/20'>
            <TbBook className='w-3.5 h-3.5 text-orange-600 dark:text-orange-400' />
          </div>
          <span className='font-outfit font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate'>
            {label?.split('-')?.reverse()?.join('/')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='px-3 py-2.5 space-y-2'>
        {/* Entries */}
        <div className='space-y-1'>
          {payload[0]?.payload?.allOfferings?.length > 1 && (
            <span className='font-inter text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500'>
              Lista de Ofrendas
            </span>
          )}
          {(() => {
            let count = 0;
            return payload.map((entry, _) => {
              if (entry.value) {
                count += 1;
                return (
                  <div
                    key={`${entry.dataKey}-${entry.payload.category}`}
                    className='flex items-center justify-between gap-3'
                  >
                    <div className='flex items-center gap-2'>
                      <span
                        className='inline-block h-2.5 w-2.5 rounded-[2px] flex-shrink-0'
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className='font-inter text-[11px] font-medium text-slate-600 dark:text-slate-300'>
                        {entry?.dataKey !== 'accumulatedOfferingPEN' &&
                        entry?.dataKey !== 'accumulatedOfferingUSD' &&
                        entry?.dataKey !== 'accumulatedOfferingEUR'
                          ? entry.name.charAt(0).toUpperCase() + entry.name.slice(1, -4)
                          : payload[0]?.payload?.allOfferings?.length > 1
                            ? `${count}° Ofrenda`
                            : 'Ofrenda'}
                      </span>
                    </div>
                    <span className='font-inter text-[11px] font-semibold text-slate-800 dark:text-slate-100'>
                      {`${entry.value.toFixed(2)} ${
                        entry?.dataKey === 'dayPEN' ||
                        entry?.dataKey === 'afternoonPEN' ||
                        entry?.dataKey === 'accumulatedOfferingPEN'
                          ? CurrencyType.PEN
                          : entry?.dataKey === 'dayUSD' ||
                              entry?.dataKey === 'afternoonUSD' ||
                              entry?.dataKey === 'accumulatedOfferingUSD'
                            ? CurrencyType.USD
                            : CurrencyType.EUR
                      }`}
                    </span>
                  </div>
                );
              }
              return null;
            });
          })()}
        </div>

        {/* Metadata */}
        <div className='pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-700/50'>
          <ul className='space-y-0.5'>
            <li className='flex items-center gap-1.5 font-inter text-[10px] text-slate-500 dark:text-slate-400'>
              <span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0' />
              {`Categoría: ${OfferingIncomeCreationCategoryNames[payload[0]?.payload?.category as OfferingIncomeCreationCategory]}`}
            </li>

            {payload?.[0]?.payload?.internalDonor?.memberFullName &&
              payload?.[0]?.payload?.internalDonor?.memberType && (
                <>
                  <li className='flex items-center gap-1.5 font-inter text-[10px] text-slate-500 dark:text-slate-400'>
                    <span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0' />
                    {`Miembro: ${payload?.[0]?.payload?.internalDonor?.memberFullName}`}
                  </li>
                  <li className='flex items-center gap-1.5 font-inter text-[10px] text-slate-500 dark:text-slate-400'>
                    <span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0' />
                    {`Cargo: ${MemberTypeNames[payload?.[0]?.payload?.internalDonor?.memberType as MemberType]}`}
                  </li>
                </>
              )}

            {payload?.[0]?.payload?.externalDonor?.donorFullName && (
              <>
                <li className='flex items-center gap-1.5 font-inter text-[10px] text-slate-500 dark:text-slate-400'>
                  <span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0' />
                  {`País: ${payload?.[0]?.payload?.externalDonor?.sendingCountry}`}
                </li>
                <li className='flex items-center gap-1.5 font-inter text-[10px] text-slate-500 dark:text-slate-400'>
                  <span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0' />
                  {`Donante: ${payload?.[0]?.payload?.externalDonor?.donorFullName}`}
                </li>
              </>
            )}

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
        {payload?.[0]?.payload?.category === OfferingIncomeCreationCategory.OfferingBox &&
          (hasPEN || hasUSD || hasEUR) && (
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
                    {totalAccumulatedPEN} PEN
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
                    {totalAccumulatedUSD} USD
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
                    {totalAccumulatedEUR} EUR
                  </span>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};
