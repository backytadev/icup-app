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

// Función para obtener el color del gradiente según el tipo
const getGradientForTitle = (title: string): string => {
  switch (title) {
    case 'Pastores':
      return 'from-violet-600 via-violet-700 to-purple-700 dark:from-violet-800 dark:via-violet-900 dark:to-purple-900';
    case 'Co-Pastores':
      return 'from-indigo-600 via-indigo-700 to-blue-700 dark:from-indigo-800 dark:via-indigo-900 dark:to-blue-900';
    case 'Supervisores':
      return 'from-cyan-600 via-cyan-700 to-teal-700 dark:from-cyan-800 dark:via-cyan-900 dark:to-teal-900';
    case 'Predicadores':
      return 'from-emerald-600 via-emerald-700 to-green-700 dark:from-emerald-800 dark:via-emerald-900 dark:to-green-900';
    case 'Discípulos':
      return 'from-amber-600 via-amber-700 to-orange-700 dark:from-amber-800 dark:via-amber-900 dark:to-orange-900';
    case 'Zonas':
      return 'from-rose-600 via-rose-700 to-pink-700 dark:from-rose-800 dark:via-rose-900 dark:to-pink-900';
    case 'Grupos Familiares':
      return 'from-sky-600 via-sky-700 to-blue-700 dark:from-sky-800 dark:via-sky-900 dark:to-blue-900';
    case 'Ministerios':
      return 'from-fuchsia-600 via-fuchsia-700 to-pink-700 dark:from-fuchsia-800 dark:via-fuchsia-900 dark:to-pink-900';
    case 'Anexos':
      return 'from-slate-600 via-slate-700 to-gray-700 dark:from-slate-800 dark:via-slate-900 dark:to-gray-900';
    default:
      return 'from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900';
  }
};

// Función para obtener el color del badge según el tipo
const getBadgeColorForTitle = (title: string): string => {
  switch (title) {
    case 'Pastores':
      return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300';
    case 'Co-Pastores':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
    case 'Supervisores':
      return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300';
    case 'Predicadores':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
    case 'Discípulos':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    case 'Zonas':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
    case 'Grupos Familiares':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300';
    case 'Ministerios':
      return 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300';
    case 'Anexos':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300';
    default:
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  }
};

export const PopoverDataCard = ({
  data,
  title,
  moduleName,
  firstValue,
  secondValue,
}: PopoverDataProps): JSX.Element => {
  const sortedData = data?.sort((a: any, b: any) => {
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
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className='h-auto px-2 py-0.5 text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200/50 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800/30'
          variant='outline'
        >
          Ver más
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          'flex flex-col p-0 w-[22rem] md:w-[26rem] max-h-[85vh] rounded-xl overflow-hidden border-0 gap-0',
          title === 'Grupos Familiares' && 'md:w-[34rem]'
        )}
      >
        {/* Header con gradiente */}
        <div className={cn(
          'flex-shrink-0 relative px-5 py-4',
          'bg-gradient-to-r',
          getGradientForTitle(title)
        )}>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <span className='px-2 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                {moduleName}
              </span>
              <span className='px-2 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                {data?.length ?? 0} registros
              </span>
            </div>
            <div>
              <DialogTitle className='text-lg md:text-xl font-bold text-white font-outfit leading-tight'>
                {title}
              </DialogTitle>
              <DialogDescription className='text-white/80 text-[13px] font-inter mt-1'>
                {title} que pertenecen a este {moduleName.toLowerCase()}.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='bg-white dark:bg-slate-900 flex-1 min-h-0 overflow-y-auto'>
          <div className='p-4 md:p-5'>
            {/* Etiqueta de sección */}
            <div className='mb-3'>
              <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
                Listado completo
              </span>
            </div>

            {/* Lista de elementos */}
            {sortedData && sortedData.length > 0 ? (
              <div className={cn(
                'grid gap-2',
                title === 'Anexos' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
              )}>
                {sortedData.map((element: any, index: number) => {
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

                  return (
                    <div
                      key={key}
                      className='flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/30 transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
                    >
                      <span className={cn(
                        'flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-[11px] font-semibold font-inter',
                        getBadgeColorForTitle(title)
                      )}>
                        {index + 1}
                      </span>
                      <span className='text-[13px] md:text-[14px] font-medium text-slate-700 dark:text-slate-200 font-inter truncate'>
                        {displayValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <p className='text-[14px] font-medium text-slate-500 dark:text-slate-400 font-inter'>
                  No hay {title.toLowerCase()} registrados
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
