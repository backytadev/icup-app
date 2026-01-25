/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState, useEffect } from 'react';

import { Toaster } from 'sonner';

import { useChurchStore } from '@/modules/church/stores/church.store';

import { type ChurchResponse } from '@/modules/church/interfaces/church-response.interface';
import { type ChurchSearchFormByTerm } from '@/modules/church/interfaces/church-search-form-by-term.interface';
import { churchInfoColumns as columns } from '@/modules/church/components/data-tables/columns/church-info-columns';
import { SearchByTermChurchDataTable } from '@/modules/church/components/data-tables/boards/search-by-term-church-data-table';

import { ChurchSearchTypeNames } from '@/modules/church/enums/church-search-type.enum';

import { ChurchModuleHeader } from '@/modules/church/components/shared';
import { ChurchFormCard } from '@/modules/church/components/shared';
import { SearchByTermForm, SearchResultsInfo } from '@/modules/church/components/search';

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

export const ChurchesSearchPageByTerm = (): JSX.Element => {
  const [dataForm, setDataForm] = useState<ChurchSearchFormByTerm>();
  const [searchParams, setSearchParams] = useState<ChurchSearchFormByTerm | undefined>();

  const isFiltersSearchByTermDisabled = useChurchStore(
    (state) => state.isFiltersSearchByTermDisabled
  );
  const setIsFiltersSearchByTermDisabled = useChurchStore(
    (state) => state.setIsFiltersSearchByTermDisabled
  );
  const dataSearchByTermResponse = useChurchStore((state) => state.dataSearchByTermResponse);

  useEffect(() => {
    setIsFiltersSearchByTermDisabled(true);
  }, [setIsFiltersSearchByTermDisabled]);

  useEffect(() => {
    document.title = 'Buscar Iglesias por Filtros - IcupApp';
  }, []);

  const handleSearch = (params: ChurchSearchFormByTerm, formData: ChurchSearchFormByTerm): void => {
    setSearchParams(params);
    setDataForm(formData);
    setIsFiltersSearchByTermDisabled(false);
  };

  const getSearchTypeLabel = (): string => {
    if (!dataForm?.searchType) return 'Búsqueda por filtros';

    const typeName =
      ChurchSearchTypeNames[dataForm.searchType as keyof typeof ChurchSearchTypeNames];

    if (dataForm.inputTerm) {
      return `${typeName}: "${dataForm.inputTerm}"`;
    }

    if (dataForm.selectTerm) {
      return `${typeName}: ${dataForm.selectTerm}`;
    }

    if (dataForm.dateTerm) {
      return `${typeName}: Rango de fechas`;
    }

    return typeName;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        {/* Header */}
        <ChurchModuleHeader
          title='Buscar por Filtros'
          description='Consulta iglesias y anexos utilizando filtros avanzados como nombre, ubicación, fecha de fundación y más.'
          titleColor='sky'
        />

        {/* Search Form */}
        {isFiltersSearchByTermDisabled && (
          <ChurchFormCard
            title='Filtros de Búsqueda'
            description='Selecciona el tipo de búsqueda y configura los parámetros deseados.'
          >
            <SearchByTermForm onSearch={handleSearch} />
          </ChurchFormCard>
        )}

        {/* Results Info */}
        {!isFiltersSearchByTermDisabled && dataSearchByTermResponse && (
          <SearchResultsInfo
            searchType={getSearchTypeLabel()}
            totalRecords={dataSearchByTermResponse?.length ?? 0}
          />
        )}

        {/* Data Table */}
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

export default ChurchesSearchPageByTerm;
