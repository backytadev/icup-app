/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import {
  type FamilyGroupInactivationCategory,
  FamilyGroupInactivationCategoryNames,
} from '@/modules/family-group/enums/family-group-inactivation-category.enum';
import {
  type FamilyGroupInactivationReason,
  FamilyGroupInactivationReasonNames,
} from '@/modules/family-group/enums/family-group-inactivation-reason.enum';

import { type FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';

import { FamilyGroupServiceTime } from '@/modules/family-group/enums/family-group-service-time.enum';
import { FamilyGroupServiceTimeNames } from '@/modules/family-group/enums/family-group-service-time.enum';

import { cn } from '@/shared/lib/utils';

import { PopoverDataCard } from '@/shared/components/cards/PopoverDataCard';

import {
  formatDateToLimaTime,
  formatDateToLimaDayMonthYear,
} from '@/shared/helpers/format-date-to-lima';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface FamilyGroupTabsCardProps {
  id: string;
  data: FamilyGroupResponse | undefined;
}

export const FamilyGroupTabsCard = ({ data, id }: FamilyGroupTabsCardProps): JSX.Element => {
  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);

      if (url.pathname === '/family-groups/general-search')
        url.pathname = `/family-groups/general-search/${id}/view`;

      if (url.pathname === '/family-groups/search-by-term')
        url.pathname = `/family-groups/search-by-term/${id}/view`;

      if (url.pathname === '/family-groups/update')
        url.pathname = `/family-groups/update/${id}/view`;

      if (url.pathname === '/family-groups/inactivate')
        url.pathname = `/family-groups/inactivate/${id}/view`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  return (
    <Tabs defaultValue='general-info' className='md:-mt-8 w-[650px] md:w-[630px]'>
      <TabsList className='grid w-full grid-cols-3 px-auto'>
        <TabsTrigger value='general-info' className='text-[14.5px] md:text-[15px]'>
          General
        </TabsTrigger>
        <TabsTrigger value='ecclesiastical-info' className='text-[14px] md:text-[15px]'>
          Eclesiástica
        </TabsTrigger>
        <TabsTrigger value='contact-info' className='text-[14.5px] md:text-[15px]'>
          Contacto
        </TabsTrigger>
      </TabsList>
      <TabsContent value='general-info'>
        <Card className='w-full'>
          <CardHeader className='text-center pb-4 pt-2'>
            <CardTitle className='text-blue-500 text-[23px] md:text-[28px] font-bold -mb-2'>
              Información General
            </CardTitle>
            <CardDescription className='text-[14px] md:text-[15px]'>
              Información general y discípulos.
            </CardDescription>
          </CardHeader>

          <CardContent className='grid grid-cols-3 pl-[1.5rem] sm:pl-[4rem] sm:pr-[5rem] gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-4 md:pl-[6rem] md:pr-[2rem]'>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Nombre</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.familyGroupName ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Zona</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirZone?.zoneName ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Código</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.familyGroupCode ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Número</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.familyGroupNumber ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Nro. discípulos</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.disciples?.length ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Hr. Culto</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {FamilyGroupServiceTimeNames[data?.serviceTime as FamilyGroupServiceTime] ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1 col-start-1 col-end-4'>
              <Label className='text-[14px] md:text-[15px]'>Discípulos</Label>
              <div className='px-2 pt-2 text-[14px] md:text-[14.5px]'>
                <ul className='flex flex-wrap gap-x-10 gap-y-2 list-disc'>
                  <PopoverDataCard
                    data={data?.disciples}
                    title={'Discípulos'}
                    moduleName={'Grupo Familiar'}
                    firstValue={'firstNames'}
                    secondValue={'lastNames'}
                  />
                </ul>
              </div>
            </div>

            <span
              className={cn(
                'pt-1 md:pt-0 col-start-1 col-end-4 row-start-4 row-end-5 md:row-start-auto md:row-end-auto text-[15px] md:text-[16px] font-bold text-yellow-500',
                data?.inactivationCategory && 'col-start-1 col-end-4 row-start-4 row-end-5'
              )}
            >
              Información de registro
            </span>

            <div
              className={cn(
                'space-y-1 flex justify-between items-center row-start-5 row-end-6 col-start-1 col-end-4 md:grid md:col-auto md:row-auto',
                data?.inactivationCategory && 'row-start-5 row-end-6 col-start-1 col-end-4'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-6 row-end-7 md:grid  md:row-start-5 md:row-end-6 md:col-start-2 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-6 row-end-7 col-start-1 col-end-4 md:col-start-2 md:col-end-3 md:row-start-5 md:row-end-6'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-7 row-end-8 md:grid md:row-auto  md:col-start-1 md:col-end-2',
                data?.inactivationCategory && 'row-start-7 row-end-8 col-start-1 col-end-4'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-8 row-end-9 md:grid md:row-start-6 md:row-end-7 md:col-start-2 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-8 row-end-9 col-start-1 col-end-4 md:row-start-6 md:row-end-7 md:col-start-2 md:col-end-4'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between md:justify-center items-center row-start-9 row-end-10 md:grid md:row-start-5 md:row-end-6 md:col-start-3 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-9 row-end-10 col-start-1 col-end-4 md:col-start-3 md:col-end-4 md:row-start-5 md:row-end-6'
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

            {data?.inactivationCategory && (
              <>
                <div className='pt-1 md:pt-0 col-start-1 col-end-4 row-start-10 row-end-11 md:row-start-auto md:row-end-auto text-[15px] md:text-[16px] font-bold text-red-500'>
                  Información de Inactivación
                </div>
                <div className='flex justify-between md:grid items-center space-y-1 col-start-1 col-end-4 row-start-11 row-end-12 md:col-start-auto md:col-end-auto md:row-start-auto md:row-end-auto'>
                  <Label className='text-[14px] md:text-[15px]'>Categoría</Label>
                  <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                    {FamilyGroupInactivationCategoryNames[
                      data?.inactivationCategory as FamilyGroupInactivationCategory
                    ] ?? '-'}
                  </CardDescription>
                </div>

                <div className='flex justify-between md:grid items-center col-start-1 col-end-4 row-start-12 row-end-13 md:col-start-2 md:col-end-4 md:row-start-8 md:row-end-9 space-y-1'>
                  <Label className='text-[14px] md:text-[15px]'>Motivo o Descripción</Label>
                  <CardDescription className='px-2 text-[14px] md:text-[14.5px] text-right md:text-left'>
                    {FamilyGroupInactivationReasonNames[
                      data?.inactivationReason as FamilyGroupInactivationReason
                    ] ?? '-'}
                  </CardDescription>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value='ecclesiastical-info'>
        <Card>
          <CardHeader className='text-center pb-6 pt-2'>
            <CardTitle className='text-yellow-500 text-[23px] md:text-[28px] font-bold -mb-2'>
              Información Eclesiástica
            </CardTitle>
            <CardDescription className='text-[14px] md:text-[15px]'>
              Información eclesiástica y relaciones ministeriales.
            </CardDescription>
          </CardHeader>

          <CardContent className='grid grid-cols-2 pl-[2rem] pr-[1rem] sm:pl-[6rem] gap-x-6 gap-y-4 md:gap-x-4 md:gap-y-8 md:pl-[6.5rem] md:pr-[3.5rem]'>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Iglesia</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirChurch?.id
                  ? `${data?.theirChurch?.abbreviatedChurchName}`
                  : 'Este grupo familiar no tiene una iglesia asignada.'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Pastor</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirPastor?.id
                  ? `${data?.theirPastor?.firstNames} ${data?.theirPastor?.lastNames}`
                  : 'Este grupo familiar no tiene un pastor asignado.'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Co-Pastor</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirCopastor?.id
                  ? `${data?.theirCopastor?.firstNames} ${data?.theirCopastor?.lastNames}`
                  : 'Este grupo familiar no tiene un co-pastor asignado.'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Supervisor</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirSupervisor?.id
                  ? `${data?.theirSupervisor?.firstNames} ${data?.theirSupervisor?.lastNames}`
                  : 'Este grupo familiar no tiene un supervisor asignado.'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Zona</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirZone?.id
                  ? `${data?.theirZone?.zoneName} - ${data?.theirZone?.district}`
                  : 'Este grupo familiar no tiene una zona asignado.'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Predicador</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirPreacher?.id
                  ? `${data?.theirPreacher?.firstNames} ${data?.theirPreacher?.lastNames}`
                  : 'Este grupo familiar no tiene un predicador asignado.'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
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

      <TabsContent value='contact-info'>
        <Card>
          <CardHeader className='text-center pb-6 pt-2'>
            <CardTitle className='text-orange-500 text-[23px] md:text-[28px] font-bold -mb-2'>
              Contacto
            </CardTitle>
            <CardDescription className='text-[14px] md:text-[15px]'>
              Información de contacto y ubicación.
            </CardDescription>
          </CardHeader>

          <CardContent className='grid grid-cols-2 pl-[2.5rem] sm:pl-[7rem] gap-x-8 gap-y-5 md:gap-x-16 md:gap-y-6 md:pl-[7.5rem] md:pr-[1rem]'>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>País</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.country ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Departamento</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.province ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Provincia</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.department ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Distrito</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.district ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Sector Urbano</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.urbanSector ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Dirección</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.address ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Referencia</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.referenceAddress ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
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
