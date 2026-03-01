import { useState, useMemo } from 'react';

import { useSupervisorStore, selectSearchData } from '@/modules/supervisor/store';
import { SupervisorTabsCard } from '@/modules/supervisor/components/SupervisorTabsCard';

import { Button } from '@/shared/components/ui/button';
import { ResponsiveModal } from '@/shared/components/modal';
import { Eye } from 'lucide-react';

interface SupervisorInfoCardProps {
  idRow: string;
}

export const SupervisorInfoCard = ({ idRow }: SupervisorInfoCardProps): JSX.Element => {
  //* States
  const searchData = useSupervisorStore(selectSearchData);
  const [open, setOpen] = useState<boolean>(false);

  //* Functions
  const currentSupervisor = useMemo(
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
      <SupervisorTabsCard data={currentSupervisor} id={idRow} />
    </ResponsiveModal>
  );
};
