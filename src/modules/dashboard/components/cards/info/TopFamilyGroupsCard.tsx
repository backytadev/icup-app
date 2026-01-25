import { useState } from 'react';
import { HiHome } from 'react-icons/hi2';
import { ArrowUpDown } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { RecordOrder } from '@/shared/enums/record-order.enum';

import { useChurchSelector, useDashboardQuery } from '@/modules/dashboard/hooks';
import { ChurchSelector, DashboardCard } from '@/modules/dashboard/components/shared';
import { DashboardSearchType } from '@/modules/dashboard/enums/dashboard-search-type.enum';
import { getProportionFamilyGroups } from '@/modules/dashboard/services/dashboard.service';
import { FamilyGroupInfoItem } from '@/modules/dashboard/components/cards/info/FamilyGroupInfoItem';

import { Button } from '@/shared/components/ui/button';

export function HousesInfoCard(): JSX.Element {
  const [showMostPopulated, setShowMostPopulated] = useState(true);

  const {
    searchParams,
    isPopoverOpen,
    setIsPopoverOpen,
    churchesQuery,
    selectedChurchCode,
    handleChurchSelect,
    form,
  } = useChurchSelector({ queryKey: 'family-groups' });

  const churchId = form.getValues('churchId') ?? searchParams?.churchId;

  const { data, isLoading, isFetching, isEmpty } = useDashboardQuery({
    queryKey: [
      'proportion-family-groups',
      showMostPopulated ? 'most-populated' : 'less-populated',
      searchParams,
    ],
    queryFn: () =>
      getProportionFamilyGroups({
        searchType: showMostPopulated
          ? DashboardSearchType.MostPopulatedFamilyGroups
          : DashboardSearchType.LessPopulatedFamilyGroups,
        populationLevel: showMostPopulated ? 'most-populated' : 'less-populated',
        churchId: searchParams?.churchId ?? churchId ?? '',
        order: RecordOrder.Ascending,
      }),
    churchId: searchParams?.churchId ?? churchId,
    enabled: !!searchParams && !!searchParams.churchId,
  });

  const togglePopulationFilter = () => {
    setShowMostPopulated((prev) => !prev);
  };

  return (
    <DashboardCard
      title='Grupos Familiares'
      description={`Grupos con ${showMostPopulated ? 'más' : 'menos'} discípulos.`}
      icon={<HiHome className='w-5 h-5 text-amber-600 dark:text-amber-400' />}
      headerAction={
        <div className='flex items-center gap-2'>
          <Button
            onClick={togglePopulationFilter}
            variant='outline'
            size='sm'
            className={cn(
              'h-9 w-9 p-0',
              'border-slate-200 dark:border-slate-700',
              'hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
            title={showMostPopulated ? 'Ver menos poblados' : 'Ver más poblados'}
          >
            <ArrowUpDown className='h-4 w-4' />
          </Button>
          <ChurchSelector
            churches={churchesQuery.data}
            selectedChurchId={churchId}
            selectedChurchCode={selectedChurchCode}
            isOpen={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
            onSelect={handleChurchSelect}
            isLoading={churchesQuery.isLoading}
          />
        </div>
      }
      isLoading={isLoading || (!data && isFetching)}
      isEmpty={isEmpty}
      emptyVariant='default'
      emptyMessage='No hay grupos familiares para mostrar.'
      className='col-span-1 xl:col-span-3'
      contentClassName='max-h-[420px] overflow-y-auto'
    >
      <div className='space-y-1'>
        {data?.map((familyGroup, index) => (
          <div
            key={familyGroup.id}
            className='opacity-0 animate-slide-in-up'
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
          >
            <FamilyGroupInfoItem data={familyGroup} />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
