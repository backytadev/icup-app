import { FamilyGroupTabsCard } from '@/modules/family-group/components/cards/info/FamilyGroupTabsCard';
import { type FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';

import { InfoItemCard, InfoItemModal } from '@/modules/dashboard/components/shared';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

interface Props {
  data: FamilyGroupResponse;
}

export function FamilyGroupInfoItem({ data }: Props): JSX.Element {
  const leaderName = data.theirPreacher
    ? `${data.theirPreacher.firstNames} ${data.theirPreacher.lastNames}`
    : 'Sin líder asignado';

  return (
    <InfoItemCard>
      <div className='flex items-center gap-3.5 flex-1 min-w-0'>
        {/* Avatar with gradient ring */}
        <div className='relative'>
          <div className='absolute -inset-0.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300' />
          <Avatar className='relative h-11 w-11 ring-2 ring-white dark:ring-slate-700 shadow-sm'>
            <AvatarImage
              className='rounded-full object-cover'
              src='/images/family-group.webp'
              alt={data.familyGroupName}
            />
            <AvatarFallback className='bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm font-semibold'>
              {data.familyGroupName?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className='flex flex-col min-w-0 gap-0.5'>
          <p className='text-sm font-semibold text-slate-800 dark:text-slate-100 truncate font-inter tracking-tight'>
            {data.familyGroupName}
          </p>
          <div className='flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-inter'>
            <span className='bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded text-[11px] font-medium'>
              {data.familyGroupCode}
            </span>
            <span className='flex items-center gap-1'>
              <span className='inline-block w-1.5 h-1.5 rounded-full bg-amber-400' />
              {data.disciples?.length ?? 0} disc.
            </span>
          </div>
          <p className='text-xs text-slate-500 dark:text-slate-400 truncate font-inter'>
            <span className='text-slate-400 dark:text-slate-500'>Líder:</span> {leaderName}
          </p>
        </div>
      </div>

      {/* Modal */}
      <InfoItemModal
        title='Información del Grupo Familiar'
        description={`Detalles completos del grupo familiar ${data.familyGroupName}`}
      >
        <FamilyGroupTabsCard data={data} id={data.id} />
      </InfoItemModal>
    </InfoItemCard>
  );
}
