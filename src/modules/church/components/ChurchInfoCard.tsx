import { useState, useMemo } from 'react';

import { useLocation } from 'react-router-dom';
import { BsFillPersonVcardFill } from 'react-icons/bs';

import { ChurchTabsCard } from '@/modules/church/components';

import {
  useChurchStore,
  selectGeneralSearchData,
  selectTermSearchData,
} from '@/modules/church/store';

import { ResponsiveModal } from '@/shared/components/modal';

interface ChurchInfoCardProps {
  idRow: string;
}

export const ChurchInfoCard = ({ idRow }: ChurchInfoCardProps): JSX.Element => {
  //* States
  const generalSearchData = useChurchStore(selectGeneralSearchData);
  const termSearchData = useChurchStore(selectTermSearchData);

  const [open, setOpen] = useState<boolean>(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Set data
  const currentChurch = useMemo(() => {
    return pathname === '/churches/general-search'
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
      <ChurchTabsCard data={currentChurch} id={idRow} />
    </ResponsiveModal>
  );
};
