import { useState, useMemo } from 'react';

import { Eye } from 'lucide-react';

import { useCalendarEventStore, selectSearchData } from '@/modules/calendar-event/store';
import { CalendarEventTabsCard } from '@/modules/calendar-event/components/CalendarEventTabsCard';

import { Button } from '@/shared/components/ui/button';
import { ResponsiveModal } from '@/shared/components/modal';

interface EventInfoCardProps {
  idRow: string;
}

export const CalendarEventInfoCard = ({ idRow }: EventInfoCardProps): JSX.Element => {
  const searchData = useCalendarEventStore(selectSearchData);
  const [open, setOpen] = useState<boolean>(false);

  const currentEvent = useMemo(
    () => searchData?.find((data) => data.id === idRow),
    [searchData, idRow]
  );

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      triggerVariant='info'
      maxWidth='lg'
      trigger={
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20'
        >
          <Eye className='h-4 w-4' />
        </Button>
      }
    >
      <CalendarEventTabsCard data={currentEvent} id={idRow} />
    </ResponsiveModal>
  );
};
