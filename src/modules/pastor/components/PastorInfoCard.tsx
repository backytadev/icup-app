import { useState, useMemo } from 'react';

import { PastorTabsCard } from '@/modules/pastor/components/PastorTabsCard';
import { usePastorStore, selectSearchData } from '@/modules/pastor/store';

import { ResponsiveModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';
import { Eye } from 'lucide-react';

interface PastorInfoCardProps {
  idRow: string;
}

export const PastorInfoCard = ({ idRow }: PastorInfoCardProps): JSX.Element => {
  //* States
  const searchData = usePastorStore(selectSearchData);
  const [open, setOpen] = useState<boolean>(false);

  //* Set data
  const currentPastor = useMemo(() => {
    return searchData?.find((data) => data.id === idRow);
  }, [searchData, idRow]);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      triggerVariant='info'
      trigger={
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20'
        >
          <Eye className='h-4 w-4' />
        </Button>
      }
      maxWidth='lg'
    >
      <PastorTabsCard data={currentPastor} id={idRow} />
    </ResponsiveModal>
  );
};
