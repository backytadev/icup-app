import { useState, useMemo } from 'react';

import { usePreacherStore, selectSearchData } from '@/modules/preacher/store';
import { PreacherTabsCard } from '@/modules/preacher/components/PreacherTabsCard';

import { Button } from '@/shared/components/ui/button';
import { ResponsiveModal } from '@/shared/components/modal';
import { Eye } from 'lucide-react';

interface PreacherInfoCardProps {
  idRow: string;
}

export const PreacherInfoCard = ({ idRow }: PreacherInfoCardProps): JSX.Element => {
  //* States
  const searchData = usePreacherStore(selectSearchData);
  const [open, setOpen] = useState<boolean>(false);

  //* Functions
  const currentPreacher = useMemo(
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
      <PreacherTabsCard data={currentPreacher} id={idRow} />
    </ResponsiveModal>
  );
};
