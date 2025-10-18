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

import { MemberUseFormReturn } from '@/shared/interfaces/member-form-data';
import { BirthDateSelect } from '@/shared/components/selects/BirthDateSelect';
import { MaritalStatusSelect } from '@/shared/components/selects/MaritalStatusSelect';
import { ConversionDateSelect } from '@/shared/components/selects/ConversionDateSelect';

import { GenderSelect } from '@/shared/components/selects/GenderSelect';
import { CountriesSelect } from '@/shared/components/selects/CountriesSelect';
import { ProvincesSelect } from '@/shared/components/selects/ProvincesSelect';
import { DistrictsSelect } from '@/shared/components/selects/DistrictsSelect';
import { DepartmentsSelect } from '@/shared/components/selects/DepartmentsSelect';
import { UrbanSectorsSelect } from '@/shared/components/selects/UrbanSectorsSelect';

export interface BasicMemberCreateFormProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
  isInputBirthDateOpen: boolean;
  isInputConvertionDateOpen: boolean;
  setIsInputBirthDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInputConvertionDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  residenceDistrict: string;
  districtsValidation: DisabledDistrictsResult | undefined;
  urbanSectorsValidation: DisabledUrbanSectorsResult | undefined;
}

export const BasicMemberCreateForm = ({
  form,
  isInputDisabled,
  isInputBirthDateOpen,
  setIsInputBirthDateOpen,
  isInputConvertionDateOpen,
  setIsInputConvertionDateOpen,
  residenceDistrict,
  districtsValidation,
  urbanSectorsValidation,
}: BasicMemberCreateFormProps): JSX.Element => {
  return (
    <>
      {/* First Block */}
      <div className='sm:col-start-1 sm:col-end-2'>
        <legend className='font-bold text-[16px] sm:text-[18px]'>Datos generales</legend>
        <FormField
          control={form.control}
          name='firstNames'
          render={({ field }) => {
            return (
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>Nombres</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    className='text-[14px]'
                    disabled={isInputDisabled}
                    placeholder='Ejem: Ramiro Ignacio'
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
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>Apellidos</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
                    placeholder='Ejem: Saavedra Ramirez'
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
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>País de origen</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
                    placeholder='Ejem:  Colombia, Panama, Ecuador'
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
              <FormItem className=' mt-3'>
                <FormLabel className='text-[14px] font-medium'>Nro. de hijos</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input disabled={isInputDisabled} placeholder='Ejem: 2' {...field} />
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
      </div>

      {/* Second Block */}
      <div className='sm:col-start-2 sm:col-end-3'>
        <legend className='font-bold text-[16px] sm:text-[18px]'>Contacto / Vivienda</legend>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => {
            return (
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>
                  E-mail
                  <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                    Opcional
                  </span>
                </FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
                    placeholder='Ejem: pedro123@gmail.com'
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
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>
                  Número de teléfono
                  <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                    Opcional
                  </span>
                </FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
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
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>Dirección</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Input
                    disabled={isInputDisabled}
                    placeholder='Ejem: Jr. Rosales 111 - Mz.A Lt.14'
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
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>Referencia de dirección</FormLabel>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Textarea
                    disabled={isInputDisabled}
                    placeholder='Comentarios de referencia sobre la ubicación de la vivienda....'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />
      </div>
    </>
  );
};
