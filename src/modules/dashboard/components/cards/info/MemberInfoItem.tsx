import { DiscipleTabsCard } from '@/modules/disciple/components/cards/info/DiscipleTabsCard';
import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';

import { InfoItemCard, InfoItemModal } from '@/modules/dashboard/components/shared';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

interface Props {
  data: DiscipleResponse;
}

export function MemberInfoItem({ data }: Props): JSX.Element {
  const fullName = `${data?.member?.firstNames} ${data?.member?.lastNames}`;
  const location = `${data?.member?.residenceDistrict} - ${data?.member?.residenceUrbanSector}`;
  const avatarSrc = data?.member?.gender === 'male' ? '/images/boy.webp' : '/images/girl.webp';
  const initials = `${data?.member?.firstNames?.charAt(0) ?? ''}${data?.member?.lastNames?.charAt(0) ?? ''}`;

  return (
    <InfoItemCard>
      <div className='flex items-center gap-3.5 flex-1 min-w-0'>
        {/* Avatar with gradient ring */}
        <div className='relative'>
          <div className='absolute -inset-0.5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300' />
          <Avatar className='relative h-11 w-11 ring-2 ring-white dark:ring-slate-700 shadow-sm'>
            <AvatarImage className='rounded-full object-cover' src={avatarSrc} alt={fullName} />
            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold'>
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className='flex flex-col min-w-0 gap-0.5'>
          <p className='text-sm font-semibold text-slate-800 dark:text-slate-100 truncate font-inter tracking-tight'>
            {fullName}
          </p>
          <p className='text-xs text-slate-500 dark:text-slate-400 truncate font-inter flex items-center gap-1.5'>
            <span className='inline-block w-1.5 h-1.5 rounded-full bg-emerald-400' />
            {location}
          </p>
        </div>
      </div>

      {/* Modal */}
      <InfoItemModal
        title='Información del Discípulo'
        description={`Detalles completos del discípulo ${fullName}`}
      >
        <DiscipleTabsCard data={data} id={data.id} />
      </InfoItemModal>
    </InfoItemCard>
  );
}
