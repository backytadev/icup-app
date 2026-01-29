import { useState, useEffect } from 'react';

import { Toaster } from 'sonner';

import {
  useChurchStore,
  selectGeneralFilterDisabled,
  selectSetGeneralFilterDisabled,
} from '@/modules/church/store';

import { type ChurchResponse } from '@/modules/church/types';
import { churchInfoColumns as columns } from '@/modules/church/components/tables/columns';
import { GeneralChurchSearchDataTable } from '@/modules/church/components/tables';

import {
  ChurchModuleHeader,
  ChurchFormCard,
  GeneralSearchForm,
} from '@/modules/church/components';

import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';

const dataFictional: ChurchResponse[] = [
  {
    id: '',
    churchName: '',
    abbreviatedChurchName: '',
    churchCode: '',
    isAnexe: false,
    serviceTimes: ['16:00'],
    foundingDate: new Date('2024-05-31'),
    email: 'iglesia.central@gmail.com',
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

export const ChurchesGeneralSearchPage = (): JSX.Element => {
  const [searchParams, setSearchParams] = useState<GeneralSearchFormType | undefined>();

  const isGeneralFilterDisabled = useChurchStore(selectGeneralFilterDisabled);
  const setGeneralFilterDisabled = useChurchStore(selectSetGeneralFilterDisabled);

  useEffect(() => {
    setGeneralFilterDisabled(true);
  }, [setGeneralFilterDisabled]);

  useEffect(() => {
    document.title = 'Consultar Iglesias - IcupApp';
  }, []);

  const handleSearch = (params: GeneralSearchFormType): void => {
    setSearchParams(params);
    setGeneralFilterDisabled(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <ChurchModuleHeader
          title='Consultar Iglesias'
          description='Busca y consulta información de las iglesias y anexos registrados en el sistema.'
          titleColor='blue'
        />

        {isGeneralFilterDisabled && (
          <ChurchFormCard
            title='Parámetros de Búsqueda'
            description='Configura los parámetros para realizar la búsqueda de iglesias.'
          >
            <GeneralSearchForm onSearch={handleSearch} />
          </ChurchFormCard>
        )}

        <div
          className='opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <ChurchFormCard>
            <GeneralChurchSearchDataTable
              columns={columns}
              data={dataFictional}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
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

export default ChurchesGeneralSearchPage;
