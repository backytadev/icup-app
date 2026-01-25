/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState, useEffect } from 'react';

import { Toaster } from 'sonner';

import { useChurchStore } from '@/modules/church/stores/church.store';

import { type ChurchResponse } from '@/modules/church/interfaces/church-response.interface';
import { churchInfoColumns as columns } from '@/modules/church/components/data-tables/columns/church-info-columns';
import { GeneralChurchSearchDataTable } from '@/modules/church/components/data-tables/boards/general-church-search-data-table';

import { ChurchModuleHeader } from '@/modules/church/components/shared';
import { ChurchFormCard } from '@/modules/church/components/shared';
import { GeneralSearchForm, SearchResultsInfo } from '@/modules/church/components/search';

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

  const isFiltersSearchGeneralDisabled = useChurchStore(
    (state) => state.isFiltersSearchGeneralDisabled
  );
  const setIsFiltersSearchGeneralDisabled = useChurchStore(
    (state) => state.setIsFiltersSearchGeneralDisabled
  );
  const dataSearchGeneralResponse = useChurchStore((state) => state.dataSearchGeneralResponse);

  useEffect(() => {
    setIsFiltersSearchGeneralDisabled(true);
  }, [setIsFiltersSearchGeneralDisabled]);

  useEffect(() => {
    document.title = 'Consultar Iglesias - IcupApp';
  }, []);

  const handleSearch = (params: GeneralSearchFormType): void => {
    setSearchParams(params);
    setIsFiltersSearchGeneralDisabled(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        {/* Header */}
        <ChurchModuleHeader
          title='Consultar Iglesias'
          description='Busca y consulta información de las iglesias y anexos registrados en el sistema.'
          titleColor='blue'
        />

        {/* Search Form */}
        {isFiltersSearchGeneralDisabled && (
          <ChurchFormCard
            title='Parámetros de Búsqueda'
            description='Configura los parámetros para realizar la búsqueda de iglesias.'
          >
            <GeneralSearchForm onSearch={handleSearch} />
          </ChurchFormCard>
        )}

        {/* Results Info */}
        {!isFiltersSearchGeneralDisabled && dataSearchGeneralResponse && (
          <SearchResultsInfo
            searchType='Iglesias y anexos (Todas)'
            totalRecords={dataSearchGeneralResponse?.length ?? 0}
          />
        )}

        {/* Data Table */}
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

        {/* Footer */}
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
