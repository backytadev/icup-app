import { DisabledDistrictsResult } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { DisabledUrbanSectorsResult } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import {
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/shared/components/ui/form';

import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { MemberUseFormReturn } from '@/shared/interfaces/member-form-data';
import { RoleMemberCheckBox } from '@/shared/components/selects/RoleMemberCheckBox';

import { GenderSelect } from '@/shared/components/selects/GenderSelect';
import { BirthDateSelect } from '@/shared/components/selects/BirthDateSelect';
import { CountriesSelect } from '@/shared/components/selects/CountriesSelect';
import { ProvincesSelect } from '@/shared/components/selects/ProvincesSelect';
import { DistrictsSelect } from '@/shared/components/selects/DistrictsSelect';
import { DepartmentsSelect } from '@/shared/components/selects/DepartmentsSelect';
import { UrbanSectorsSelect } from '@/shared/components/selects/UrbanSectorsSelect';
import { RecordStatusSelect } from '@/shared/components/selects/RecordStatusSelect';
import { MaritalStatusSelect } from '@/shared/components/selects/MaritalStatusSelect';
import { ConversionDateSelect } from '@/shared/components/selects/ConversionDateSelect';

export interface BasicMemberUpdateFormProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
  isInputBirthDateOpen: boolean;
  isInputConvertionDateOpen: boolean;
  setIsInputBirthDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInputConvertionDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  residenceDistrict: string;
  districtsValidation: DisabledDistrictsResult | undefined;
  urbanSectorsValidation: DisabledUrbanSectorsResult | undefined;
  disabledRoles: MemberRole[] | undefined;
  moduleName: string;
}

export const BasicMemberUpdateForm = ({
  form,
  isInputDisabled,
  isInputBirthDateOpen,
  setIsInputBirthDateOpen,
  isInputConvertionDateOpen,
  setIsInputConvertionDateOpen,
  residenceDistrict,
  districtsValidation,
  urbanSectorsValidation,
  disabledRoles,
  moduleName,
}: BasicMemberUpdateFormProps): JSX.Element => {
  return (
    <>
      {/* Datos Generales */}
      <div className='col-start-1 col-end-2'>
        <legend className='font-bold text-[15px] sm:text-[16px]'>Datos generales</legend>
        <FormField
          control={form.control}
          name='firstNames'
          render={({ field }) => {
            return (
              <FormItem className='mt-2'>
                <FormLabel className='text-[14px]'>Nombres</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
                    className='text-[14px]'
                    placeholder='Ejem: Roberto Martin...'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name='lastNames'
          render={({ field }) => {
            return (
              <FormItem className='mt-2'>
                <FormLabel className='text-[14px]'>Apellidos</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
                    className='text-[14px]'
                    placeholder='Ejem: Mendoza Prado...'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <GenderSelect form={form} isInputDisabled={isInputDisabled} />

        <FormField
          control={form.control}
          name='originCountry'
          render={({ field }) => {
            return (
              <FormItem className='mt-2'>
                <FormLabel className='text-[14px]'>País de Origen</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
                    className='text-[14px]'
                    placeholder='Ejem: Perú, Colombia, Mexico...'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <BirthDateSelect
          form={form}
          isInputDisabled={isInputDisabled}
          isInputBirthDateOpen={isInputBirthDateOpen}
          setIsInputBirthDateOpen={setIsInputBirthDateOpen}
        />

        <MaritalStatusSelect form={form} isInputDisabled={isInputDisabled} />

        <FormField
          control={form.control}
          name='numberChildren'
          render={({ field }) => {
            return (
              <FormItem className='mt-2'>
                <FormLabel className='text-[14px]'>Nro. de hijos</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
                    className='text-[14px]'
                    placeholder='Ejem: 3'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <ConversionDateSelect
          form={form}
          isInputDisabled={isInputDisabled}
          isInputConvertionDateOpen={isInputConvertionDateOpen}
          setIsInputConvertionDateOpen={setIsInputConvertionDateOpen}
        />

        <RoleMemberCheckBox
          form={form as any}
          isInputDisabled={isInputDisabled}
          disabledRoles={disabledRoles}
          showSubtitles={false}
          className='mt-4 mb-2'
        />
      </div>

      {/* Contacto y Vivienda */}
      <div className='sm:col-start-2 sm:col-end-3'>
        <legend className='font-bold text-[15px] sm:text-[16px]'>Contacto / Vivienda</legend>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => {
            return (
              <FormItem className='mt-2'>
                <FormLabel className='text-[14px]'>
                  E-mail
                  <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                    Opcional
                  </span>
                </FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
                    className='text-[14px]'
                    placeholder='Ejem: martin@example.com'
                    type='email'
                    autoComplete='username'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => {
            return (
              <FormItem className='mt-2'>
                <FormLabel className='text-[14px]'>
                  Número de Teléfono
                  <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                    Opcional
                  </span>
                </FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
                    className='text-[14px]'
                    placeholder='Ejem: +51 999 999 999'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <CountriesSelect
          form={form}
          isInputDisabled={isInputDisabled}
          fieldName={'residenceCountry'}
        />

        <DepartmentsSelect
          form={form}
          isInputDisabled={isInputDisabled}
          fieldName={'residenceDepartment'}
        />

        <ProvincesSelect
          form={form}
          isInputDisabled={isInputDisabled}
          fieldName={'residenceProvince'}
        />

        <DistrictsSelect
          form={form}
          isInputDisabled={isInputDisabled}
          fieldName={'residenceDistrict'}
          districtsValidation={districtsValidation}
        />

        <UrbanSectorsSelect
          form={form}
          isInputDisabled={isInputDisabled}
          fieldName={'residenceUrbanSector'}
          urbanSectorsValidation={urbanSectorsValidation}
          residenceDistrict={residenceDistrict}
        />

        <FormField
          control={form.control}
          name='residenceAddress'
          render={({ field }) => {
            return (
              <FormItem className='mt-2'>
                <FormLabel className='text-[14px]'>Dirección</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
                    className='text-[14px]'
                    placeholder='Ejem: Av. Central 123'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name='referenceAddress'
          render={({ field }) => {
            return (
              <FormItem className='mt-2'>
                <FormLabel className='text-[14px] font-medium'>Referencia de dirección</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Textarea
                    disabled={isInputDisabled}
                    className='text-[14px]'
                    placeholder='Comentarios de referencia sobre la ubicación de la vivienda....'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <RecordStatusSelect form={form} isInputDisabled={isInputDisabled} moduleName={moduleName} />
      </div>
    </>
  );
};
