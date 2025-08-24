/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { cn } from '@/shared/lib/utils';

import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';

import { Button } from '@/shared/components/ui/button';

import {
  type Zone,
  type Anexe,
  type Pastor,
  type Copastor,
  type Disciple,
  type Ministry,
  type Preacher,
  type Supervisor,
  type FamilyGroup,
  type MinistryMember,
} from '@/shared/interfaces/relations-response.interface';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';

export type AllowedTypes =
  | Anexe[]
  | Pastor[]
  | Copastor[]
  | Supervisor[]
  | Zone[]
  | Preacher[]
  | FamilyGroup[]
  | Disciple[]
  | Ministry[]
  | MinistryMember[];

interface PopoverDataProps {
  data: AllowedTypes | undefined;
  title: string;
  moduleName: string;
  firstValue: string;
  secondValue: string;
}

export const PopoverDataCard = ({
  data,
  title,
  moduleName,
  firstValue,
  secondValue,
}: PopoverDataProps): JSX.Element => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='px-2 py-0 text-[13.5px] md:text-[13.5px]' variant='outline'>
          Ver más
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          'flex flex-col w-[20rem] md:w-[23rem] h-auto rounded-lg pl-7 pr-0 overflow-scroll',
          data && data?.length >= 36 && 'h-[40rem]',
          title === 'Grupos Familiares' && 'md:w-[32rem]'
        )}
      >
        <div className='space-y-2'>
          <DialogTitle className='text-teal-500 font-bold text-[16px] md:text-[18px] leading-none'>
            {title}
          </DialogTitle>
          <DialogDescription className='text-[14px] md:text-[15.5px] text-muted-foreground'>
            {title} que pertenecen a este {moduleName}.
          </DialogDescription>
        </div>

        <ul
          className={cn(
            'grid grid-cols-2 text-[14px] md:text-[15px] px-3 md:px-4 gap-2 gap-x-8 list-disc',
            title === 'Anexos' && 'grid-cols-1'
          )}
        >
          {data
            ?.sort((a: any, b: any) => {
              const valueA =
                title === 'Anexos' || title === 'Zonas' || title === 'Grupos Familiares'
                  ? `${a?.[firstValue]} - ${a?.[secondValue]}`
                  : title === 'Ministerios'
                    ? `${MinistryTypeNames[a?.[firstValue] as MinistryType]} - ${a?.[secondValue]}`
                    : getInitialFullNames({
                        firstNames: a?.[firstValue] ?? '',
                        lastNames: a?.[secondValue] ?? '',
                      });

              const valueB =
                title === 'Anexos' || title === 'Zonas' || title === 'Grupos Familiares'
                  ? `${b?.[firstValue]} - ${b?.[secondValue]}`
                  : title === 'Ministerios'
                    ? `${MinistryTypeNames[b?.[firstValue] as MinistryType]} - ${b?.[secondValue]}`
                    : getInitialFullNames({
                        firstNames: b?.[firstValue] ?? '',
                        lastNames: b?.[secondValue] ?? '',
                      });

              return valueA.localeCompare(valueB);
            })
            .map((element: any) => {
              const key = element?.id;
              const displayValue =
                title === 'Anexos' || title === 'Zonas' || title === 'Grupos Familiares'
                  ? `${element?.[firstValue]} - ${element?.[secondValue]}`
                  : title === 'Ministerios'
                    ? `${MinistryTypeNames[element?.[firstValue] as MinistryType]} ~ "${element?.[secondValue]}"`
                    : getInitialFullNames({
                        firstNames: element?.[firstValue] ?? '',
                        lastNames: element?.[secondValue] ?? '',
                      });

              return <li key={key}>{displayValue}</li>;
            })}
        </ul>
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
};
