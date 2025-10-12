import { useEffect } from 'react';

import { cn } from '@/shared/lib/utils';
import { FileText } from 'lucide-react';

import {
  type OfferingIncomeCreationShiftType,
  OfferingIncomeCreationShiftTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-shift-type.enum';
import { MemberType, MemberTypeNames } from '@/modules/offering/income/enums/member-type.enum';
import { OfferingIncomeCreationTypeNames } from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import {
  OfferingIncomeCreationSubType,
  OfferingIncomeCreationSubTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import {
  OfferingIncomeCreationCategory,
  OfferingIncomeCreationCategoryNames,
} from '@/modules/offering/income/enums/offering-income-creation-category.enum';

import {
  formatDateToLimaTime,
  formatDateToLimaDayMonthYear,
} from '@/shared/helpers/format-date-to-lima';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { GenderNames, type Gender } from '@/shared/enums/gender.enum';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';

import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface OfferingIncomeTabsCardProps {
  id: string;
  data: OfferingIncomeResponse | undefined;
}

export const OfferingIncomeTabsCard = ({ data, id }: OfferingIncomeTabsCardProps): JSX.Element => {
  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);

      if (url.pathname === '/offerings/income/general-search')
        url.pathname = `/offerings/income/general-search/${id}/view`;

      if (url.pathname === '/offerings/income/search-by-term')
        url.pathname = `/offerings/income/search-by-term/${id}/view`;

      if (url.pathname === '/offerings/income/update')
        url.pathname = `/offerings/income/update/${id}/view`;

      if (url.pathname === '/offerings/income/inactivate')
        url.pathname = `/offerings/income/inactivate/${id}/view`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  return (
    <Tabs defaultValue='general-info' className='md:-mt-8 w-[650px] md:w-[630px]'>
      <TabsList className='grid w-full px-auto grid-cols-1'>
        <TabsTrigger value='general-info' className='text-[14.5px] md:text-[15px]'>
          Información General
        </TabsTrigger>
      </TabsList>
      <TabsContent value='general-info'>
        <Card className='w-full'>
          <CardHeader className='text-center pb-4 pt-2'>
            <CardTitle className='text-blue-500 text-[23px] md:text-[28px] font-bold -mb-2'>
              Información General
            </CardTitle>
            <CardDescription className='text-[14px] md:text-[15px]'>
              Información general del registro de ingreso.
            </CardDescription>
          </CardHeader>

          <CardContent className='grid grid-cols-3 pl-[1.5rem] pr-[1.5rem] pb-5 sm:pl-[5.3rem] sm:pr-[5rem] gap-x-4 gap-y-1 md:gap-x-6 md:gap-y-4 md:pl-[5.8rem] md:pr-[2.5rem]'>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Tipo</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {Object.entries(OfferingIncomeCreationTypeNames).find(
                  ([key]) => key === data?.type
                )?.[1] ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Sub-tipo</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {Object.entries(OfferingIncomeCreationSubTypeNames).find(
                  ([key]) => key === data?.subType
                )?.[1] ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Categoría</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {Object.entries(OfferingIncomeCreationCategoryNames).find(
                  ([key]) => key === data?.category
                )?.[1] ?? '-'}
              </CardDescription>
            </div>

            {data?.shift && (
              <div className='space-y-1'>
                <Label className='text-[14px] md:text-[15px]'>Turno</Label>
                <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                  {data?.shift
                    ? OfferingIncomeCreationShiftTypeNames[
                        data?.shift as OfferingIncomeCreationShiftType
                      ]
                    : '-'}
                </CardDescription>
              </div>
            )}

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Monto</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.amount ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Divisa</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {Object.entries(CurrencyTypeNames).find(([key]) => key === data?.currency)?.[1] ??
                  '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Fecha</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.date ? formatDateToLimaDayMonthYear(data?.date) : '-'}
              </CardDescription>
            </div>

            <div className='space-y-1 col-start-1 col-end-3'>
              <Label className='text-[14px] md:text-[15px]'>Código de recibo</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.receiptCode ? data?.receiptCode : '-'}
              </CardDescription>
            </div>

            <div className='space-y-1 col-start-1 col-end-4'>
              <Label className='text-[14px] md:text-[15px]'>Archivos multimedia</Label>
              <div className='px-2 text-green-600 w-full overflow-x-auto'>
                <ul className='pl-2 flex gap-x-5 gap-y-2 list-disc w-fit flex-wrap overflow-hidden'>
                  {data?.imageUrls?.length !== undefined && data?.imageUrls?.length > 0 ? (
                    data?.imageUrls?.map((image, index) => (
                      <li key={image} className='w-auto overflow-hidden text-ellipsis'>
                        <a
                          className='block text-green-600 max-w-full md:max-w-[40vw] overflow-hidden text-ellipsis whitespace-nowrap'
                          href={image}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <p className='underline underline-offset-2 font-medium truncate max-w-full md:max-w-[40vw] flex items-center gap-x-2 w-full'>
                            <FileText className='w-4 h-4 text-green-600 shrink-0' />
                            <span>{data?.receiptCode ?? `Boleta ${index + 1}`}</span>
                          </p>
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className='text-red-500 text-[14px] md:text-[15px]'>
                      No hay imágenes adjuntadas.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className='space-y-1 col-start-1 col-end-4 row-start-5'>
              {data?.category === OfferingIncomeCreationCategory.ExternalDonation ? (
                <Label className='text-[14px] md:text-[15px]'>Observaciones / Descripción</Label>
              ) : (
                <Label className='text-[14px] md:text-[15px]'>Detalles / Observaciones</Label>
              )}
              <CardDescription className='px-2 text-[14px] md:text-[14.5px] overflow-hidden text-ellipsis'>
                {!data?.comments ? '-' : <p className='whitespace-pre-wrap'>{data?.comments}</p>}
              </CardDescription>
            </div>

            {(data?.category === OfferingIncomeCreationCategory.ExternalDonation ||
              data?.category === OfferingIncomeCreationCategory.InternalDonation ||
              data?.subType === OfferingIncomeCreationSubType.FamilyGroup ||
              data?.subType === OfferingIncomeCreationSubType.ZonalFasting ||
              data?.subType === OfferingIncomeCreationSubType.ZonalVigil ||
              data?.subType === OfferingIncomeCreationSubType.ZonalEvangelism ||
              data?.subType === OfferingIncomeCreationSubType.ZonalUnitedService) && (
              <>
                <Label className='md:-mb-2 mt-1 md:-mt-1 col-start-1 col-end-4 row-start-auto row-end-auto text-[15px] md:text-[16px] font-bold text-violet-500'>
                  Información del aportante
                </Label>
                {data?.externalDonor?.id && (
                  <div className='row-start-auto row-end-auto col-start-1 col-end-4 space-y-1'>
                    <Label className='text-[14px] md:text-[15px]'>Datos del donante</Label>

                    <CardDescription className='px-2 text-[14px] md:text-[14.5px] grid grid-cols-1 md:grid-cols-2 gap-1'>
                      <p>
                        <span className='font-semibold'>Nombres:</span>{' '}
                        {data?.externalDonor?.firstNames}
                      </p>
                      <p>
                        <span className='font-semibold'>Apellidos:</span>{' '}
                        {data?.externalDonor?.lastNames}
                      </p>
                      <p>
                        <span className='font-semibold'>Género:</span>{' '}
                        {GenderNames[data?.externalDonor?.gender as Gender] ?? 'Anónimo'}
                      </p>
                      <p>
                        <span className='font-semibold'>F. Nacimiento:</span>{' '}
                        {formatDateToLimaDayMonthYear(data?.externalDonor?.birthDate) ===
                        '01/01/1900'
                          ? 'Anónimo'
                          : formatDateToLimaDayMonthYear(data?.externalDonor?.birthDate)}
                      </p>
                      <p>
                        <span className='font-semibold'>País de origen:</span>{' '}
                        {data?.externalDonor?.originCountry ?? 'Anónimo'}
                      </p>
                      <p>
                        <span className='font-semibold'>E-mail:</span>{' '}
                        {data?.externalDonor?.email ?? 'Anónimo'}
                      </p>
                      <p>
                        <span className='font-semibold'>Teléfono:</span>{' '}
                        {data?.externalDonor?.phoneNumber ?? 'Anónimo'}
                      </p>
                      <p>
                        <span className='font-semibold'>País de residencia:</span>{' '}
                        {data?.externalDonor?.residenceCountry ?? 'Anónimo'}
                      </p>
                      <p>
                        <span className='font-semibold'>Ciudad de residencia:</span>{' '}
                        {data?.externalDonor?.residenceCountry ?? 'Anónimo'}
                      </p>
                      <p>
                        <span className='font-semibold'>Código Postal:</span>{' '}
                        {data?.externalDonor?.postalCode ?? 'Anónimo'}
                      </p>
                    </CardDescription>
                  </div>
                )}

                {data?.memberType && data?.memberType !== MemberType.ExternalDonor && (
                  <>
                    <div className='col-start-1 col-end-2 row-start-auto row-end-auto space-y-1'>
                      <Label className='text-[14px] md:text-[15px]'>Tipo de Miembro</Label>
                      <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                        {data?.memberType ? MemberTypeNames[data?.memberType as MemberType] : '-'}
                      </CardDescription>
                    </div>
                    <div className='space-y-1 row-start-auto row-end-auto col-start-2 col-end-4'>
                      <Label className='text-[14px] md:text-[15px]'>Miembro</Label>
                      <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                        {data?.disciple?.firstNames
                          ? `${data?.disciple?.firstNames} ${data?.disciple?.lastNames}`
                          : data?.preacher?.firstNames
                            ? `${data?.preacher?.firstNames} ${data?.preacher?.lastNames}`
                            : data?.supervisor?.firstNames
                              ? `${data?.supervisor?.firstNames} ${data?.supervisor?.lastNames}`
                              : data?.copastor?.firstNames
                                ? `${data?.copastor?.firstNames} ${data?.copastor?.lastNames}`
                                : data?.pastor?.firstNames
                                  ? `${data?.pastor?.firstNames} ${data?.pastor?.lastNames}`
                                  : '-'}
                      </CardDescription>
                    </div>
                  </>
                )}

                {data?.zone?.id && (
                  <div className='row-start-auto row-end-auto col-start-1 col-end-4 space-y-1'>
                    <Label className='text-[14px] md:text-[15px]'>Zona</Label>
                    <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                      {data?.zone?.id ? (
                        <>
                          <p className='mb-1'>
                            <span className='font-medium'>Nombre y distrito:</span>{' '}
                            {data?.zone?.zoneName} - {data?.zone?.district}
                          </p>
                          <p>
                            <span className='font-medium'>Supervisor:</span>{' '}
                            {data?.zone?.supervisorFirstNames} {data?.zone?.supervisorLastNames}
                          </p>
                        </>
                      ) : (
                        '-'
                      )}
                    </CardDescription>
                  </div>
                )}

                {data?.familyGroup?.id && (
                  <div className='row-start-auto row-end-auto col-start-1 col-end-4  space-y-1'>
                    <Label className='text-[14px] md:text-[15px]'>Grupo Familiar</Label>
                    <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                      {data?.familyGroup?.id ? (
                        <>
                          <p className='mb-1'>
                            <span className='font-medium'>Nombre y código:</span>{' '}
                            {data?.familyGroup?.familyGroupName}{' '}
                            {`(${data?.familyGroup?.familyGroupCode})`} ~{' '}
                            {data?.familyGroup?.urbanSector}
                          </p>
                          <p>
                            <span className='font-medium'>Predicador(a):</span>{' '}
                            {data?.familyGroup?.preacherFirstNames}{' '}
                            {data?.familyGroup?.preacherLastNames}
                          </p>
                        </>
                      ) : (
                        '-'
                      )}
                    </CardDescription>
                  </div>
                )}
              </>
            )}

            <Label className='md:-mb-3 mt-1 md:-mt-1 col-start-1 col-end-4 row-start-auto row-end-auto text-[15px] md:text-[16px] font-bold text-emerald-500'>
              Información de pertenecía
            </Label>
            {data?.church?.id && (
              <div className='row-start-auto row-end-auto col-start-1 col-end-4 space-y-1 mb-2 md:mb-0'>
                <Label className='text-[14px] md:text-[15px]'>Iglesia</Label>
                <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                  {data?.church?.id
                    ? `${data?.church?.abbreviatedChurchName} - ${data?.church?.district}`
                    : '-'}
                </CardDescription>
              </div>
            )}

            <Label
              className={cn(
                'md:-mb-3 pt-1 md:pt-0 row-start-10 row-end-11 md:row-auto col-start-1 col-end-4 text-[15px] md:text-[16px] font-bold text-amber-500',
                !data?.memberType && !data?.zone?.id && !data?.familyGroup?.id && '-mt-2',
                data?.subType !== OfferingIncomeCreationSubType.FamilyGroup &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalEvangelism &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalFasting &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalVigil &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalUnitedService &&
                  data?.subType !== OfferingIncomeCreationSubType.Special &&
                  data?.subType !== OfferingIncomeCreationSubType.ChurchGround &&
                  'row-start-9 row-end-10'
              )}
            >
              Información del registro
            </Label>

            <div
              className={cn(
                'space-y-1 flex justify-between items-center row-start-11 row-end-12 col-start-1 col-end-4 md:grid md:col-auto md:row-auto',
                data?.subType !== OfferingIncomeCreationSubType.FamilyGroup &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalEvangelism &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalFasting &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalVigil &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalUnitedService &&
                  data?.subType !== OfferingIncomeCreationSubType.Special &&
                  data?.subType !== OfferingIncomeCreationSubType.ChurchGround &&
                  'row-start-10 row-end-11'
              )}
            >
              <Label className='text-[14px] md:text-[15px]'>Creado por</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.createdBy
                  ? getInitialFullNames({
                      firstNames: data?.createdBy?.firstNames ?? '-',
                      lastNames: data?.createdBy?.lastNames ?? '-',
                    })
                  : '-'}
              </CardDescription>
            </div>

            <div
              className={cn(
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-12 row-end-13 md:grid md:col-auto md:row-auto',
                data?.subType !== OfferingIncomeCreationSubType.FamilyGroup &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalEvangelism &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalFasting &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalVigil &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalUnitedService &&
                  data?.subType !== OfferingIncomeCreationSubType.Special &&
                  data?.subType !== OfferingIncomeCreationSubType.ChurchGround &&
                  'row-start-11 row-end-12'
              )}
            >
              <Label className='text-[14px] md:text-[15px]'>Fecha de creación</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px] text-right md:text-left md:whitespace-nowrap'>
                {data?.createdAt
                  ? `${formatDateToLimaDayMonthYear(data?.createdAt)} - ${formatDateToLimaTime(data?.createdAt)}`
                  : '-'}
              </CardDescription>
            </div>

            <div
              className={cn(
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-13 row-end-14 md:grid md:row-auto  md:col-start-1 md:col-end-2',
                data?.subType !== OfferingIncomeCreationSubType.FamilyGroup &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalEvangelism &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalFasting &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalVigil &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalUnitedService &&
                  data?.subType !== OfferingIncomeCreationSubType.Special &&
                  data?.subType !== OfferingIncomeCreationSubType.ChurchGround &&
                  'row-start-12 row-end-13'
              )}
            >
              <Label className='text-[14px] md:text-[15px]'>Actualizado por</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.updatedBy
                  ? getInitialFullNames({
                      firstNames: data?.updatedBy?.firstNames ?? '-',
                      lastNames: data?.updatedBy?.lastNames ?? '-',
                    })
                  : '-'}
              </CardDescription>
            </div>

            <div
              className={cn(
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-14 row-end-15 md:grid md:row-auto md:col-start-2 md:col-end-4',
                data?.subType !== OfferingIncomeCreationSubType.FamilyGroup &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalEvangelism &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalFasting &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalVigil &&
                  data?.subType !== OfferingIncomeCreationSubType.ZonalUnitedService &&
                  data?.subType !== OfferingIncomeCreationSubType.Special &&
                  data?.subType !== OfferingIncomeCreationSubType.ChurchGround &&
                  'row-start-13 row-end-14'
              )}
            >
              <Label className='text-[14px] md:text-[15px]'>Ultima fecha de actualización</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px] text-right md:text-left'>
                {data?.updatedAt
                  ? `${formatDateToLimaDayMonthYear(data?.updatedAt)} - ${formatDateToLimaTime(data?.updatedAt)}`
                  : '-'}
              </CardDescription>
            </div>

            <div
              className={cn(
                'space-y-1 col-start-1 col-end-4 flex justify-between md:justify-center items-center row-span-2 row-start-15 row-end-16 md:grid md:row-start-9 md:row-end-10 md:col-start-3 md:col-end-4',
                (data?.subType === OfferingIncomeCreationSubType.FamilyGroup ||
                  data?.subType === OfferingIncomeCreationSubType.ZonalEvangelism ||
                  data?.subType === OfferingIncomeCreationSubType.ZonalFasting ||
                  data?.subType === OfferingIncomeCreationSubType.ZonalVigil ||
                  data?.subType === OfferingIncomeCreationSubType.ZonalUnitedService ||
                  data?.subType === OfferingIncomeCreationSubType.Special ||
                  data?.subType === OfferingIncomeCreationSubType.ChurchGround) &&
                  'md:row-start-11 md:row-end-12'
              )}
            >
              <Label className='text-[14px] md:text-[15px]'>Estado</Label>
              <CardDescription
                className={cn(
                  'px-2 text-[14px] md:text-[14.5px] text-green-600 font-bold',
                  data?.recordStatus !== RecordStatus.Active && 'text-red-600'
                )}
              >
                {data?.recordStatus === RecordStatus.Active ? 'Activo' : 'Inactivo'}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
