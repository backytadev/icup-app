import { type TooltipConfig } from '@/shared/interfaces/tooltip-config.interface';

import {
  OfferingIncomeCreationCategory,
  OfferingIncomeCreationCategoryNames,
} from '@/modules/offering/income/enums/offering-income-creation-category.enum';
import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';
import { type OfferingIncomePayloadByActivities } from '@/modules/metrics/components/offering-income/tooltips/interfaces/offering-income-by-activities-tooltip-payload.interface';

export const OfferingIncomeByActivitiesTooltipContent = (
  props: TooltipConfig<OfferingIncomePayloadByActivities>
): JSX.Element => {
  const { payload, label } = props;

  return (
    <div className='grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl'>
      <p>
        <span className='font-semibold text-[14px] sm:text-[14px]'>{`${label?.split('-')?.reverse()?.join('/')}`}</span>
      </p>
      {payload?.[0]?.payload?.allOfferings.length > 1 && (
        <span className='font-medium text-[13.5px] md:text-[13.5px]'>Lista de Ofrendas</span>
      )}
      {payload?.[0]?.payload?.allOfferings.map((off, index) => (
        <>
          <div key={`${String(off.date)}-${off.currency}`}>
            <span
              className='inline-block h-2.5 w-2.5 rounded-[2px] mr-2'
              style={{
                backgroundColor:
                  off.currency === CurrencyType.PEN
                    ? 'var(--color-accumulatedOfferingPEN)'
                    : off.currency === CurrencyType.USD
                      ? 'var(--color-accumulatedOfferingUSD)'
                      : 'var(--color-accumulatedOfferingEUR)',
                border:
                  off.currency === CurrencyType.PEN
                    ? '1px var(--color-accumulatedOfferingPEN)'
                    : off.currency === CurrencyType.USD
                      ? '1px var(--color-accumulatedOfferingUSD)'
                      : '1px var(--color-accumulatedOfferingEUR)',
              }}
            ></span>
            <span className='font-medium text-[13.5px] md:text-[13.5px]'>
              {payload?.[0]?.payload?.allOfferings.length > 1
                ? `${index + 1}° Ofrenda:`
                : `Ofrenda:`}
            </span>
            <span className='pl-1 dark:text-white text-black font-normal text-[13.5px] md:text-[13.5px]'>
              {`${off.offering.toFixed(2)} ${off.currency}`}
            </span>
          </div>
        </>
      ))}

      <ul className='list-disc pl-3 sm:pl-4 flex flex-col gap-1.5'>
        <li className={'font-medium italic text-[13.5px] sm:text-[13.5px]'}>
          <span className='sm:-ml-1'>{`Categoría: ${
            payload[0]?.payload?.category === OfferingIncomeCreationCategory.Events ||
            payload[0]?.payload?.category === OfferingIncomeCreationCategory.Meetings
              ? OfferingIncomeCreationCategoryNames[
                  payload[0]?.payload?.category as OfferingIncomeCreationCategory
                ]?.split(' ')[0]
              : OfferingIncomeCreationCategoryNames[
                  payload[0]?.payload?.category as OfferingIncomeCreationCategory
                ]
          }`}</span>
        </li>

        <li className={'font-medium italic text-[13.5px] sm:text-[13.5px]'}>
          <span className='sm:-ml-1'>{`Iglesia: ${payload[0]?.payload?.church?.abbreviatedChurchName} ${payload[0]?.payload?.church?.isAnexe ? ' - (Anexo)' : ''}`}</span>
        </li>
      </ul>
    </div>
  );
};
