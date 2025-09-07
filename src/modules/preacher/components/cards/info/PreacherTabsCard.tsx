/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { cn } from '@/shared/lib/utils';

import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';

import {
  type MemberInactivationReason,
  MemberInactivationReasonNames,
} from '@/shared/enums/member-inactivation-reason.enum';
import {
  type MemberInactivationCategory,
  MemberInactivationCategoryNames,
} from '@/shared/enums/member-inactivation-category.enum';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { type Gender, GenderNames } from '@/shared/enums/gender.enum';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';
import { type MemberRole, MemberRoleNames } from '@/shared/enums/member-role.enum';

import {
  formatDateToLimaTime,
  formatDateToLimaDayMonthYear,
} from '@/shared/helpers/format-date-to-lima';
import { PopoverDataCard } from '@/shared/components/card/PopoverDataCard';
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
import { MinistryMemberRole } from '@/modules/ministry/enums/ministry-member-role.enum';
import { RelationType, RelationTypeModuleNames } from '@/shared/enums/relation-type.enum';

interface PreacherTabsCardProps {
  id: string;
  data: PreacherResponse | undefined;
}

export const PreacherTabsCard = ({ data, id }: PreacherTabsCardProps): JSX.Element => {
  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);

      if (url.pathname === '/preachers/general-search')
        url.pathname = `/preachers/general-search/${id}/view`;

      if (url.pathname === '/preachers/search-by-term')
        url.pathname = `/preachers/search-by-term/${id}/view`;

      if (url.pathname === '/preachers/update') url.pathname = `/preachers/update/${id}/view`;

      if (url.pathname === '/preachers/inactivate')
        url.pathname = `/preachers/inactivate/${id}/view`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  const allMinistryRoles = data?.member.ministries.flatMap((item) => item.ministryRoles);
  const allMinistryTypes = data?.member.ministries.flatMap(
    (item) =>
      `${MinistryTypeNames[item.ministryType as MinistryType]} ~ (${item.churchMinistryName})`
  );

  console.log(data);

  return (
    <Tabs defaultValue='general-info' className='md:-mt-8 w-[650px] md:w-[630px]'>
      <TabsList className='grid w-full grid-cols-3 px-auto'>
        <TabsTrigger value='general-info' className='text-[14.5px] md:text-[15px]'>
          General
        </TabsTrigger>
        <TabsTrigger value='ecclesiastical-info' className='text-[14.5px] md:text-[15px]'>
          Eclesiástica
        </TabsTrigger>
        <TabsTrigger value='contact-info' className='text-[14.5px] md:text-[15px]'>
          Contacto
        </TabsTrigger>
      </TabsList>

      <TabsContent value='general-info'>
        <Card className='w-full '>
          <CardHeader className='text-center pb-4 pt-2'>
            <CardTitle className='text-blue-500 text-[23px] md:text-[28px] font-bold -mb-2'>
              Información General
            </CardTitle>
            <CardDescription className='text-[14px] md:text-[15px]'>
              Información general y personal.
            </CardDescription>
          </CardHeader>

          <CardContent className='grid grid-cols-3 gap-x-4 gap-y-2 px-4 md:gap-x-6 md:gap-y-4 md:pl-[4.3rem] md:pr-[2.5rem]'>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Nombres</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.firstNames ?? '-'}
              </CardDescription>
            </div>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Apellidos</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.lastNames ?? '-'}
              </CardDescription>
            </div>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>País de Origen</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.originCountry ?? '-'}
              </CardDescription>
            </div>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Fecha de Nacimiento</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.birthDate
                  ? formatDateToLimaDayMonthYear(data?.member?.birthDate)
                  : '-'}
              </CardDescription>
            </div>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Edad</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.age ?? '-'}
              </CardDescription>
            </div>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Género</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.gender ? GenderNames[data?.member?.gender as Gender] : '-'}
              </CardDescription>
            </div>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Fecha de Conversion</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.conversionDate
                  ? formatDateToLimaDayMonthYear(data?.member?.conversionDate)
                  : '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Estado Civil</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.maritalStatus === 'married'
                  ? 'Casado(a)'
                  : data?.member?.maritalStatus === 'single'
                    ? 'Soltero(a)'
                    : data?.member?.maritalStatus === 'widowed'
                      ? 'Viudo(a)'
                      : data?.member?.maritalStatus === 'divorced'
                        ? 'Divorciado(a)'
                        : 'Estado Civil Desconocido'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Nro. de hijos</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.numberChildren ?? '-'}
              </CardDescription>
            </div>

            {/* Relaciones */}
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Discípulos</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.disciples?.length}
              </CardDescription>
              <PopoverDataCard
                data={data?.disciples}
                title={'Discípulos'}
                moduleName={'Predicador'}
                firstValue={'firstNames'}
                secondValue={'lastNames'}
              />
            </div>

            <span
              className={cn(
                'pt-1 md:pt-0 col-start-1 col-end-4 row-start-6 row-end-7 md:row-start-auto md:row-end-auto text-[15px] md:text-[16px] font-bold text-yellow-500',
                data?.inactivationCategory && 'col-start-1 col-end-4 row-start-5 row-end-6'
              )}
            >
              Información de registro
            </span>

            <div
              className={cn(
                'space-y-1 flex justify-between items-center row-start-7 row-end-8 col-start-1 col-end-4 md:grid md:col-auto md:row-auto',
                data?.inactivationCategory && 'row-start-6 row-end-7 col-start-1 col-end-4'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-8 row-end-9 md:grid  md:row-start-6 md:row-end-7 md:col-start-2 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-7 row-end-8 col-start-1 col-end-4 md:col-start-2 md:col-end-3 md:row-start-6 md:row-end-7'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-9 row-end-10 md:grid md:row-auto  md:col-start-1 md:col-end-2',
                data?.inactivationCategory && 'row-start-8 row-end-9 col-start-1 col-end-4'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-10 row-end-11 md:grid md:row-start-7 md:row-end-8 md:col-start-2 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-9 row-end-10 col-start-1 col-end-4 md:row-start-7 md:row-end-8 md:col-start-2 md:col-end-4'
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
                'space-y-1 col-start-1 col-end-4 flex justify-between md:justify-center items-center row-start-11 row-end-12 md:grid md:row-start-6 md:row-end-7 md:col-start-3 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-10 row-end-11 col-start-1 col-end-4 md:col-start-3 md:col-end-4 md:row-start-6 md:row-end-7'
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
                <div className='pt-1 md:pt-0 col-start-1 col-end-4 row-start-11 row-end-12 md:row-start-auto md:row-end-auto text-[15px] md:text-[16px] font-bold text-red-500'>
                  Información de Inactivación
                </div>
                <div className='flex justify-between md:grid items-center space-y-1 col-start-1 col-end-4 row-start-12 row-end-13 md:col-start-auto md:col-end-auto md:row-start-auto md:row-end-auto'>
                  <Label className='text-[14px] md:text-[15px]'>Categoría</Label>
                  <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                    {MemberInactivationCategoryNames[
                      data?.inactivationCategory as MemberInactivationCategory
                    ] ?? '-'}
                  </CardDescription>
                </div>

                <div className='flex justify-between md:grid items-center col-start-1 col-end-4 row-start-13 row-end-14 md:col-start-2 md:col-end-4 md:row-start-9 md:row-end-10 space-y-1'>
                  <Label className='text-[14px] md:text-[15px]'>Motivo o Descripción</Label>
                  <CardDescription className='px-2 text-[14px] md:text-[14.5px] text-right md:text-left'>
                    {MemberInactivationReasonNames[
                      data?.inactivationReason as MemberInactivationReason
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

          <CardContent className='grid grid-cols-2 pl-[1.5rem] pr-[1rem] gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-7 md:pl-[5.5rem] md:pr-[2.5rem]'>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Tipo de Relación</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                <li>
                  {data?.relationType
                    ? `${RelationTypeModuleNames['preacher'][data?.relationType as RelationType]}`
                    : 'Este discípulo no tiene una iglesia asignada.'}
                </li>
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Ministerios</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                <ul
                  className={cn(
                    'list-disc pl-5 text-slate-500 dark:text-slate-400',
                    data?.member.ministries.length === 0 && 'pl-0'
                  )}
                >
                  {data?.member.ministries && data?.member.ministries.length > 0
                    ? allMinistryTypes?.map((item) => <li key={item}>{item}</li>)
                    : 'Este discípulo no esta relacionado a ningún ministerio.'}
                </ul>
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Roles Ministeriales</Label>
              <div className='px-2 text-[14px] md:text-[14.5px]'>
                <ul className='list-disc pl-5 text-slate-500 dark:text-slate-400'>
                  {allMinistryRoles &&
                  allMinistryRoles.length > 0 &&
                  allMinistryRoles.filter((rol) => MemberRoleNames[rol as MinistryMemberRole])
                    .length > 0
                    ? allMinistryRoles
                        .filter((rol) => MemberRoleNames[rol as MinistryMemberRole])
                        .map((rol) => (
                          <li key={rol}>{MemberRoleNames[rol as MinistryMemberRole]}</li>
                        ))
                    : '-'}
                </ul>
              </div>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Roles de Membresía</Label>
              <div className='px-2 text-[14px] md:text-[14.5px]'>
                <ul className='list-disc pl-5 text-slate-500 dark:text-slate-400'>
                  {data?.member?.roles &&
                  data?.member?.roles.filter(
                    (rol) => !MemberRoleNames[rol as MemberRole]?.includes('Min.')
                  ).length > 0
                    ? data?.member?.roles
                        .filter((rol) => !MemberRoleNames[rol as MemberRole]?.includes('Min.'))
                        .map((rol) => <li key={rol}>{MemberRoleNames[rol as MemberRole]}</li>)
                    : '-'}
                </ul>
              </div>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Iglesia</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirChurch?.id
                  ? `${data?.theirChurch?.abbreviatedChurchName}`
                  : 'Este predicador no tiene una iglesia asignada.'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Pastor</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirPastor?.id
                  ? `${data?.theirPastor?.firstNames} ${data?.theirPastor?.lastNames}`
                  : 'Este predicador no tiene un pastor asignado.'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Copastor</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirCopastor?.id
                  ? `${data?.theirCopastor?.firstNames} ${data?.theirCopastor?.lastNames}`
                  : 'Este predicador no tiene un co-pastor asignado.'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Supervisor</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirSupervisor?.id
                  ? `${data?.theirSupervisor?.firstNames} ${data?.theirSupervisor?.lastNames}`
                  : 'Este predicador no tiene un supervisor asignado.'}{' '}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Zona</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirZone?.id
                  ? `${data?.theirZone?.zoneName} (${data?.theirZone?.department} - ${data?.theirZone?.district})`
                  : 'Este predicador no tiene una zona asignada.'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Grupo Familiar</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.theirFamilyGroup?.id
                  ? `${data?.theirFamilyGroup?.familyGroupName} (${data?.theirFamilyGroup?.familyGroupCode} - ${data?.theirFamilyGroup?.urbanSector})`
                  : 'Este predicador no tiene un grupo familiar asignado.'}
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
              Información de Contacto
            </CardTitle>
            <CardDescription className='text-[14px] md:text-[15px]'>
              Información de contacto y ubicación.
            </CardDescription>
          </CardHeader>

          <CardContent className='grid grid-cols-2 pl-[2rem] pr-[0.5rem] sm:pl-[6rem] gap-x-8 gap-y-4  md:gap-x-16 md:gap-y-6 md:pl-[5.5rem] md:pr-[3rem]'>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Correo Electrónico</Label>
              <CardDescription className='break-words px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.email ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Teléfono / Celular</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.phoneNumber ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>País</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.residenceCountry ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Departamento</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.residenceDepartment ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Provincia</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.residenceProvince ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Distrito</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.residenceDistrict ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Sector Urbano</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.residenceUrbanSector ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Dirección</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.residenceAddress ?? '-'}
              </CardDescription>
            </div>

            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Referencia de ubicación</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.member?.referenceAddress ?? '-'}
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
