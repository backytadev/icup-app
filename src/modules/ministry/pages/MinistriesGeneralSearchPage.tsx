import { useState, useEffect } from 'react';

import { Toaster } from 'sonner';

import {
  useMinistryStore,
  selectGeneralFilterDisabled,
  selectSetGeneralFilterDisabled,
} from '@/modules/ministry/store/ministry.store';

import { type MinistryResponse } from '@/modules/ministry/types';
import { ministryInfoColumns as columns } from '@/modules/ministry/components/tables/columns';
import { GeneralMinistrySearchDataTable } from '@/modules/ministry/components/tables';

import {
  MinistryModuleHeader,
  MinistryFormCard,
  GeneralSearchForm,
} from '@/modules/ministry/components';

import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';

const dataFictional: MinistryResponse[] = [
  {
    id: '',
    ministryType: '',
    customMinistryName: '',
    ministryCode: '',
    serviceTimes: ['16:00'],
    foundingDate: new Date('2024-05-31'),
    email: 'culto.juvenil@gmail.com',
    phoneNumber: '',
    country: '',
    department: '',
    province: '',
    district: '',
    urbanSector: '',
    address: '',
    referenceAddress: '',
    recordStatus: 'active',
    theirPastor: null,
  },
];

export const MinistriesGeneralSearchPage = (): JSX.Element => {
  const [searchParams, setSearchParams] = useState<GeneralSearchFormType | undefined>();

  const isGeneralFilterDisabled = useMinistryStore(selectGeneralFilterDisabled);
  const setGeneralFilterDisabled = useMinistryStore(selectSetGeneralFilterDisabled);

  useEffect(() => {
    setGeneralFilterDisabled(true);
  }, [setGeneralFilterDisabled]);

  useEffect(() => {
    document.title = 'Consultar Ministerios - IcupApp';
  }, []);

  const handleSearch = (params: GeneralSearchFormType): void => {
    setSearchParams(params);
    setGeneralFilterDisabled(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <MinistryModuleHeader
          title='Consultar Ministerios'
          description='Busca y consulta información de los ministerios registrados en el sistema.'
          titleColor='blue'
        />

        {isGeneralFilterDisabled && (
          <MinistryFormCard
            title='Parámetros de Búsqueda'
            description='Configura los parámetros para realizar la búsqueda de ministerios.'
          >
            <GeneralSearchForm onSearch={handleSearch} />
          </MinistryFormCard>
        )}

        <div
          className='opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <MinistryFormCard>
            <GeneralMinistrySearchDataTable
              columns={columns}
              data={dataFictional}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </MinistryFormCard>
        </div>

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Ministerio - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MinistriesGeneralSearchPage;
