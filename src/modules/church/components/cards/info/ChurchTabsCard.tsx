import { useEffect } from 'react';

import { type ChurchResponse } from '@/modules/church/interfaces/church-response.interface';

import { cn } from '@/shared/lib/utils';

import {
  formatDateToLimaTime,
  formatDateToLimaDayMonthYear,
} from '@/shared/helpers/format-date-to-lima';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { PopoverDataCard } from '@/shared/components/cards/PopoverDataCard';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import {
  type ChurchServiceTime,
  ChurchServiceTimeNames,
} from '@/modules/church/enums/church-service-time.enum';
import {
  type ChurchInactivationReason,
  ChurchInactivationReasonNames,
} from '@/modules/church/enums/church-inactivation-reason.enum';
import {
  type ChurchInactivationCategory,
  ChurchInactivationCategoryNames,
} from '@/modules/church/enums/church-inactivation-category.enum';

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface ChurchTabsCardProps {
  id: string;
  data: ChurchResponse | undefined;
}

export const ChurchTabsCard = ({ data, id }: ChurchTabsCardProps): JSX.Element => {
  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);

      if (url.pathname === '/churches/general-search')
        url.pathname = `/churches/general-search/${id}/view`;

      if (url.pathname === '/churches/search-by-term')
        url.pathname = `/churches/search-by-term/${id}/view`;

      if (url.pathname === '/churches/update') url.pathname = `/churches/update/${id}/view`;

      if (url.pathname === '/churches/inactivate') url.pathname = `/churches/inactivate/${id}/view`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  return (
    <Tabs defaultValue='general-info' className='md:-mt-8 w-[650px] md:w-[630px]'>
      <TabsList className='grid w-full grid-cols-2 px-auto'>
        <TabsTrigger value='general-info' className='text-[14.5px] md:text-[15px]'>
          General
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
              Información general de la iglesia.
            </CardDescription>
          </CardHeader>

          <CardContent className='grid grid-cols-3 pl-[1.5rem] pr-[1rem] sm:pl-[4rem] sm:pr-[5rem] gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-4 md:pl-[4.8rem] md:pr-[2rem]'>
            <div className='space-y-1 col-start-1 col-end-4'>
              <Label className='text-[14px] md:text-[15px]'>Nombre Completo</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.churchName ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Abreviatura</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px] break-words'>
                {data?.abbreviatedChurchName ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Código</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px] break-words'>
                {data?.churchCode ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Fecha de Fundación</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.foundingDate ? formatDateToLimaDayMonthYear(data?.foundingDate) : '-'}
              </CardDescription>
            </div>

            <div className='space-y-1 col-start-1 col-end-2'>
              <Label className='text-[14px] md:text-[15px]'>Horarios de Culto</Label>
              <div className='px-2 text-[14px] md:text-[14.5px]'>
                <ul className='pl-5 flex flex-col flex-wrap gap-x-10 gap-y-2 list-disc'>
                  {data?.serviceTimes !== undefined && data?.serviceTimes.length > 0 ? (
                    data?.serviceTimes.map((serviceTime) =>
                      Object.keys(ChurchServiceTimeNames).map(
                        (serviceTimeName) =>
                          serviceTime === serviceTimeName && (
                            <li key={serviceTime}>
                              {ChurchServiceTimeNames[serviceTime as ChurchServiceTime]}
                            </li>
                          )
                      )
                    )
                  ) : (
                    <li className='text-red-500'>No hay horarios de culto disponibles.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className='space-y-1 col-start-2 col-end-3'>
              <Label className='text-[14px] md:text-[15px]'>Iglesia Principal</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirMainChurch && data?.isAnexe
                  ? `${data?.theirMainChurch?.abbreviatedChurchName ?? 'No tiene'} - ${data?.theirMainChurch?.district ?? 'una iglesia principal asignada.'}`
                  : !data?.isAnexe
                    ? `Esta es la iglesia central.`
                    : `Esta iglesia anexo no tiene una iglesia principal asignada.`}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Anexo</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.isAnexe ? 'Si' : 'No'}
              </CardDescription>
            </div>

            {/* Relaciones */}
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Anexos</Label>
              <div>
                <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                  {data?.anexes?.length ?? '-'}
                </CardDescription>
                <PopoverDataCard
                  data={data?.anexes}
                  title={'Anexos'}
                  moduleName={'Iglesia'}
                  firstValue={'abbreviatedChurchName'}
                  secondValue={'urbanSector'}
                />
              </div>
            </div>

            <div className='space-y-1 '>
              <Label className='text-[14px] md:text-[15px]'>Ministerios</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.ministries?.length ?? '-'}
              </CardDescription>
              <PopoverDataCard
                data={data?.ministries}
                title={'Ministerios'}
                moduleName={'Iglesia'}
                firstValue={'ministryType'}
                secondValue={'customMinistryName'}
              />
            </div>

            <div className='space-y-1 '>
              <Label className='text-[14px] md:text-[15px]'>Pastores</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.pastors?.length ?? '-'}
              </CardDescription>
              <PopoverDataCard
                data={data?.pastors}
                title={'Pastores'}
                moduleName={'Iglesia'}
                firstValue={'firstNames'}
                secondValue={'lastNames'}
              />
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Co-Pastores</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.copastors?.length ?? '-'}
              </CardDescription>
              <PopoverDataCard
                data={data?.copastors}
                title={'Co-Pastores'}
                moduleName={'Iglesia'}
                firstValue={'firstNames'}
                secondValue={'lastNames'}
              />
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Supervisores</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.supervisors?.length ?? '-'}
              </CardDescription>
              <PopoverDataCard
                data={data?.supervisors}
                title={'Supervisores'}
                moduleName={'Iglesia'}
                firstValue={'firstNames'}
                secondValue={'lastNames'}
              />
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Zonas</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.zones?.length ?? '-'}
              </CardDescription>
              <PopoverDataCard
                data={data?.zones}
                title={'Zonas'}
                moduleName={'Iglesia'}
                firstValue={'zoneName'}
                secondValue={'district'}
              />
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Predicadores</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.preachers?.length ?? '-'}
              </CardDescription>
              <PopoverDataCard
                data={data?.preachers}
                title={'Predicadores'}
                moduleName={'Iglesia'}
                firstValue={'firstNames'}
                secondValue={'lastNames'}
              />
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Grupos Familiares</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.familyGroups?.length ?? '-'}
              </CardDescription>
              <PopoverDataCard
                data={data?.familyGroups}
                title={'Grupos Familiares'}
                moduleName={'Iglesia'}
                firstValue={'familyGroupCode'}
                secondValue={'familyGroupName'}
              />
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Discípulos</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.disciples?.length ?? '-'}
              </CardDescription>
              <PopoverDataCard
                data={data?.disciples}
                title={'Discípulos'}
                moduleName={'Iglesia'}
                firstValue={'firstNames'}
                secondValue={'lastNames'}
              />
            </div>

            <span
              className={cn(
                'pt-1 md:pt-0 col-start-1 col-end-4 row-start-7 row-end-8 md:row-start-auto md:row-end-auto text-[15px] md:text-[16px] font-bold text-yellow-500',
                data?.inactivationCategory && 'col-start-1 col-end-4 row-start-7 row-end-8'
              )}
            >
              Información de registro
            </span>

            <div
              className={cn(
                'space-y-1 flex justify-between items-center row-start-8 row-end-9 col-start-1 col-end-4 md:grid md:col-auto md:row-auto',
                data?.inactivationCategory && 'row-start-8 row-end-9 col-start-1 col-end-4'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-9 row-end-10 md:grid  md:row-start-8 md:row-end-9 md:col-start-2 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-9 row-end-10 col-start-1 col-end-4 md:col-start-2 md:col-end-3 md:row-start-8 md:row-end-9'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-10 row-end-11 md:grid md:row-auto  md:col-start-1 md:col-end-2',
                data?.inactivationCategory && 'row-start-10 row-end-11 col-start-1 col-end-4'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-11 row-end-12 md:grid md:row-auto md:col-start-2 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-11 row-end-12 col-start-1 col-end-4 md:row-start-9 md:row-end-10 md:col-start-2 md:col-end-4'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between md:justify-center items-center row-start-12 row-end-13 md:grid md:row-start-8 md:row-end-9 md:col-start-3 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-12 row-end-13 col-start-1 col-end-4 md:col-start-3 md:col-end-4 md:row-start-8 md:row-end-9'
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
                <div className='pt-1 md:pt-0 col-start-1 col-end-4 row-start-13 row-end-14 md:row-start-auto md:row-end-auto text-[15px] md:text-[16px] font-bold text-red-500'>
                  Información de Inactivación
                </div>
                <div className='flex justify-between md:grid items-center space-y-1 col-start-1 col-end-4 row-start-14 row-end-15 md:col-start-auto md:col-end-auto md:row-start-auto md:row-end-auto'>
                  <Label className='text-[14px] md:text-[15px]'>Categoría</Label>
                  <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                    {ChurchInactivationCategoryNames[
                      data?.inactivationCategory as ChurchInactivationCategory
                    ] ?? '-'}
                  </CardDescription>
                </div>

                <div className='flex justify-between md:grid items-center col-start-1 col-end-4 row-start-15 row-end-16 md:col-start-2 md:col-end-4 md:row-start-11 md:row-end-12 space-y-1'>
                  <Label className='text-[14px] md:text-[15px]'>Motivo o Descripción</Label>
                  <CardDescription className='px-2 text-[14px] md:text-[14.5px] text-right md:text-left'>
                    {ChurchInactivationReasonNames[
                      data?.inactivationReason as ChurchInactivationReason
                    ] ?? '-'}
                  </CardDescription>
                </div>
              </>
            )}
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

          <CardContent className='grid grid-cols-2 pl-[2.5rem] sm:pl-[7rem] gap-x-8 gap-y-5 md:gap-x-16 md:gap-y-6 md:pl-[7rem] md:pr-[1rem]'>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>E-mail</Label>
              <CardDescription className='break-words px-2 text-[14px] md:text-[14.5px]'>
                {data?.email ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Número Teléfono</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.phoneNumber ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>País</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.country ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Departamento</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.department ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Provincia</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.province ?? '-'}
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
              <Label className='text-[14px] md:text-[15px]'>Referencia de ubicación</Label>
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
