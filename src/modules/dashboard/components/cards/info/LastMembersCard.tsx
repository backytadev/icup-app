import { HiUsers } from 'react-icons/hi2';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';
import { getDisciples } from '@/modules/disciple/services/disciple.service';

import { useDashboardQuery } from '@/modules/dashboard/hooks';
import { DashboardCard } from '@/modules/dashboard/components/shared';
import { MemberInfoItem } from '@/modules/dashboard/components/cards/info/MemberInfoItem';

export function MembersInfoCard(): JSX.Element {
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  const { data, isLoading, isFetching, isEmpty } = useDashboardQuery({
    queryKey: ['last-disciples', activeChurchId],
    queryFn: () =>
      getDisciples({
        limit: '10',
        all: false,
        offset: '0',
        churchId: activeChurchId ?? '',
        order: RecordOrder.Descending,
      }),
    churchId: activeChurchId ?? undefined,
  });

  return (
    <DashboardCard
      title='Discípulos Nuevos'
      description='Últimos discípulos registrados.'
      icon={<HiUsers className='w-5 h-5 text-green-600 dark:text-green-400' />}

      isLoading={isLoading || (!data && isFetching)}
      isEmpty={isEmpty}
      emptyVariant='member'
      emptyMessage='No hay discípulos registrados para mostrar.'
      className='col-span-1 xl:col-span-3'
      contentClassName='max-h-[420px] overflow-y-auto'
    >
      <div className='space-y-1'>
        {data?.map((disciple, index) => (
          <div
            key={disciple.id}
            className='opacity-0 animate-slide-in-up'
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
          >
            <MemberInfoItem data={disciple} />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
