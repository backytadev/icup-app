import { useState, useMemo } from 'react';

import { useFamilyGroupStore, selectSearchData } from '@/modules/family-group/store';
import { FamilyGroupTabsCard } from '@/modules/family-group/components/FamilyGroupTabsCard';

import { Button } from '@/shared/components/ui/button';
import { ResponsiveModal } from '@/shared/components/modal';
import { Eye } from 'lucide-react';

interface FamilyGroupInfoCardProps {
  idRow: string;
}

export const FamilyGroupInfoCard = ({ idRow }: FamilyGroupInfoCardProps): JSX.Element => {
  //* States
  const searchData = useFamilyGroupStore(selectSearchData);
  const [open, setOpen] = useState<boolean>(false);

  //* Functions
  const currentFamilyGroup = useMemo(
    () => searchData?.find((data) => data.id === idRow),
    [searchData, idRow]
  );

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
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
      <FamilyGroupTabsCard data={currentFamilyGroup} id={idRow} />
    </ResponsiveModal>
  );
};
