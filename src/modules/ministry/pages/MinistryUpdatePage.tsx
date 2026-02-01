import { useState, useEffect } from 'react';

import { Toaster } from 'sonner';

import {
  useMinistryStore,
  selectTermFilterDisabled,
  selectSetTermFilterDisabled,
} from '@/modules/ministry/store/ministry.store';

import { type MinistryResponse, type MinistrySearchFormByTerm } from '@/modules/ministry/types';
import { ministryUpdateColumns as columns } from '@/modules/ministry/components/tables/columns';
import { SearchByTermMinistryDataTable } from '@/modules/ministry/components/tables';

import {
  MinistryModuleHeader,
  MinistryFormCard,
  SearchByTermForm,
} from '@/modules/ministry/components';

const dataFictional: MinistryResponse[] = [
  {
    id: '',
    ministryType: '',
    customMinistryName: '',
    ministryCode: '',
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
    theirPastor: null,
  },
];

export const MinistryUpdatePage = (): JSX.Element => {
  const [dataForm, setDataForm] = useState<MinistrySearchFormByTerm>();
  const [searchParams, setSearchParams] = useState<MinistrySearchFormByTerm | undefined>();

  const isTermFilterDisabled = useMinistryStore(selectTermFilterDisabled);
  const setTermFilterDisabled = useMinistryStore(selectSetTermFilterDisabled);

  useEffect(() => {
    setTermFilterDisabled(true);
  }, [setTermFilterDisabled]);

  useEffect(() => {
    document.title = 'Actualizar Ministerios - IcupApp';
  }, []);

  const handleSearch = (params: MinistrySearchFormByTerm, formData: MinistrySearchFormByTerm): void => {
    setSearchParams(params);
    setDataForm(formData);
    setTermFilterDisabled(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <MinistryModuleHeader
          title='Actualizar Ministerios'
          description='Busca y selecciona un ministerio para actualizar su información.'
          titleColor='orange'
        />

        {isTermFilterDisabled && (
          <MinistryFormCard
            title='Filtros de Búsqueda'
            description='Selecciona el tipo de búsqueda y configura los parámetros deseados.'
          >
            <SearchByTermForm onSearch={handleSearch} />
          </MinistryFormCard>
        )}

        <div
          className='opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <MinistryFormCard>
            <SearchByTermMinistryDataTable
              columns={columns}
              data={dataFictional}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              dataForm={dataForm}
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

export default MinistryUpdatePage;
