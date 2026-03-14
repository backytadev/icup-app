import { useRef, useState, useCallback, useMemo } from 'react';

import { Pencil } from 'lucide-react';

import { useCalendarEventStore, selectSearchData } from '@/modules/calendar-event/store';
import { EventUpdateForm } from '@/modules/calendar-event/components/forms/EventUpdateForm';

import { Button } from '@/shared/components/ui/button';
import { FormModal } from '@/shared/components/modal';

interface EventUpdateCardProps {
  idRow: string;
}

export const CalendarEventUpdateCard = ({ idRow }: EventUpdateCardProps): JSX.Element => {
  const topRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchData = useCalendarEventStore(selectSearchData);

  const currentEvent = useMemo(
    () => searchData?.find((data) => data?.id === idRow),
    [searchData, idRow]
  );

  const handleContainerClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const handleContainerScroll = useCallback((): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <FormModal
      open={isOpen}
      onOpenChange={setIsOpen}
      maxWidth='xl'
      trigger={
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20'
        >
          <Pencil className='h-4 w-4' />
        </Button>
      }
    >
      <EventUpdateForm
        id={idRow}
        data={currentEvent}
        dialogClose={handleContainerClose}
        scrollToTop={handleContainerScroll}
      />
    </FormModal>
  );
};
