import { useState, useEffect } from 'react';

import { Toaster } from 'sonner';

import {
  useChurchStore,
  selectTermFilterDisabled,
  selectSetTermFilterDisabled,
} from '@/modules/church/store';

import { type ChurchResponse, type ChurchSearchFormByTerm } from '@/modules/church/types';
import { churchInactivateColumns as columns } from '@/modules/church/components/tables/columns';
import { SearchByTermChurchDataTable } from '@/modules/church/components/tables';

import { ChurchSearchType } from '@/modules/church/enums';

import {
  ChurchModuleHeader,
  ChurchFormCard,
  SearchByTermForm,
} from '@/modules/church/components';

const dataFictional: ChurchResponse[] = [
  {
    id: '',
    churchName: '',
    abbreviatedChurchName: '',
    churchCode: '',
    isAnexe: false,
    serviceTimes: ['16:00'],
    foundingDate: new Date('2024-05-31'),
    email: '',
    phoneNumber: '',
    country: '',
    department: '',
    province: '',
    district: '',
    urbanSector: '',
    address: '',
    referenceAddress: '',
    recordStatus: 'active',
    theirMainChurch: null,
  },
];

export const ChurchInactivatePage = (): JSX.Element => {
  const [dataForm, setDataForm] = useState<ChurchSearchFormByTerm>();
  const [searchParams, setSearchParams] = useState<ChurchSearchFormByTerm | undefined>();

  const isTermFilterDisabled = useChurchStore(selectTermFilterDisabled);
  const setTermFilterDisabled = useChurchStore(selectSetTermFilterDisabled);

  useEffect(() => {
    setTermFilterDisabled(true);
  }, [setTermFilterDisabled]);

  useEffect(() => {
    document.title = 'Inactivar Iglesia - IcupApp';
  }, []);

  const handleSearch = (params: ChurchSearchFormByTerm, formData: ChurchSearchFormByTerm): void => {
    if (formData.searchType === ChurchSearchType.RecordStatus) {
      return;
    }
    setSearchParams(params);
    setDataForm(formData);
    setTermFilterDisabled(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <ChurchModuleHeader
          title='Inactivar Iglesia'
          description='Busca y selecciona una iglesia o anexo para inactivar su registro del sistema.'
          titleColor='red'
        />

        {isTermFilterDisabled && (
          <ChurchFormCard
            title='Buscar Iglesia'
            description='Utiliza los filtros para encontrar la iglesia que deseas inactivar.'
          >
            <SearchByTermForm onSearch={handleSearch} />
          </ChurchFormCard>
        )}

        <div
          className='opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <ChurchFormCard>
            <SearchByTermChurchDataTable
              columns={columns}
              data={dataFictional}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              dataForm={dataForm}
            />
          </ChurchFormCard>
        </div>

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Iglesia - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ChurchInactivatePage;
