import { useState, useMemo } from 'react';

import { Eye } from 'lucide-react';

import { UserTabsCard } from '@/modules/user/components';

import {
  useUserStore,
  selectSearchData,
} from '@/modules/user/store';

import { ResponsiveModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';

interface UserInfoCardProps {
  idRow: string;
}

export const UserInfoCard = ({ idRow }: UserInfoCardProps): JSX.Element => {
  //* States
  const searchData = useUserStore(selectSearchData);

  const [open, setOpen] = useState<boolean>(false);

  //* Set data
  const currentUser = useMemo(() => {
    return searchData?.find((data) => data.id === idRow);
  }, [searchData, idRow]);

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
      <UserTabsCard data={currentUser} id={idRow} />
    </ResponsiveModal>
  );
};
