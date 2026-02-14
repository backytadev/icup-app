import { useState, useMemo } from 'react';

import { Eye } from 'lucide-react';

import {
  useOfferingIncomeStore,
  selectSearchData,
} from '@/modules/offering/income/stores/offering-income.store';

import { OfferingIncomeTabsCard } from '@/modules/offering/income/components';

import { ResponsiveModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';

interface OfferingIncomeInfoCardProps {
  idRow: string;
}

export const OfferingIncomeInfoCard = ({ idRow }: OfferingIncomeInfoCardProps): JSX.Element => {
  //* States
  const searchData = useOfferingIncomeStore(selectSearchData);
  const [open, setOpen] = useState<boolean>(false);

  //* Set data
  const currentOfferingIncome = useMemo(() => {
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
      <OfferingIncomeTabsCard data={currentOfferingIncome} id={idRow} />
    </ResponsiveModal>
  );
};
