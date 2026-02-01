import { useState, useMemo } from 'react';

import { useLocation } from 'react-router-dom';
import { BsFillPersonVcardFill } from 'react-icons/bs';

import { MinistryTabsCard } from '@/modules/ministry/components';

import {
  useMinistryStore,
  selectGeneralSearchData,
  selectTermSearchData,
} from '@/modules/ministry/store/ministry.store';

import { ResponsiveModal } from '@/shared/components/modal';

interface MinistryInfoCardProps {
  idRow: string;
}

export const MinistryInfoCard = ({ idRow }: MinistryInfoCardProps): JSX.Element => {
  //* States
  const generalSearchData = useMinistryStore(selectGeneralSearchData);
  const termSearchData = useMinistryStore(selectTermSearchData);

  const [open, setOpen] = useState<boolean>(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Set data
  const currentMinistry = useMemo(() => {
    return pathname === '/ministries/general-search'
      ? generalSearchData?.find((data) => data.id === idRow)
      : termSearchData?.find((data) => data.id === idRow);
  }, [pathname, generalSearchData, termSearchData, idRow]);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      triggerVariant='info'
      triggerIcon={<BsFillPersonVcardFill className='w-8 h-[1.65rem]' />}
      maxWidth='lg'
    >
      <MinistryTabsCard data={currentMinistry} id={idRow} />
    </ResponsiveModal>
  );
};
