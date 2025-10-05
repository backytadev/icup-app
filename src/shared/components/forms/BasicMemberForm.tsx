import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from '@radix-ui/react-icons';

import { cn } from '@/shared/lib/utils';

import { DisabledDistrictsResult } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { DisabledUrbanSectorsResult } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import {
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

import { GenderNames } from '@/shared/enums/gender.enum';
import { CountryNames } from '@/shared/enums/country.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { ProvinceNames } from '@/shared/enums/province.enum';
import { DepartmentNames } from '@/shared/enums/department.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';
import { MaritalStatusNames } from '@/shared/enums/marital-status.enum';

import { MemberUseFormReturn } from '@/shared/interfaces/member-form-data';

export interface BasicMemberFormProps {
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

export const BasicMemberForm = ({
  form,
  isInputDisabled,
  isInputBirthDateOpen,
  setIsInputBirthDateOpen,
  isInputConvertionDateOpen,
  setIsInputConvertionDateOpen,
  residenceDistrict,
  districtsValidation,
  urbanSectorsValidation,
}: BasicMemberFormProps): JSX.Element => {
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

        <FormField
          control={form.control}
          name='gender'
          render={({ field }) => {
            return (
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>Género</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isInputDisabled}
                >
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <SelectTrigger>
                      {field.value ? (
                        <SelectValue placeholder='Selecciona el tipo de género' />
                      ) : (
                        'Selecciona el tipo de género'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(GenderNames).map(([key, value]) => (
                      <SelectItem className={`text-[14px]`} key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

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

        <FormField
          control={form.control}
          name='birthDate'
          render={({ field }) => (
            <FormItem className='mt-3'>
              <FormLabel className='text-[14px] font-medium'>Fecha de nacimiento</FormLabel>
              <Popover open={isInputBirthDateOpen} onOpenChange={setIsInputBirthDateOpen}>
                <PopoverTrigger asChild>
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <Button
                      disabled={isInputDisabled}
                      variant={'outline'}
                      className={cn(
                        'text-[14px] w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'LLL dd, y', { locale: es })
                      ) : (
                        <span className='text-[14px]'>Selecciona la fecha de nacimiento</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsInputBirthDateOpen(false);
                    }}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className='pl-2 text-blue-600 text-[12.5px] xl:text-[13px] font-bold italic'>
                * Su fecha de nacimiento se utilizara para calcular su edad.
              </FormDescription>
              <FormMessage className='text-[13px]' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='maritalStatus'
          render={({ field }) => {
            return (
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>Estado Civil</FormLabel>
                <Select
                  value={field.value}
                  disabled={isInputDisabled}
                  onValueChange={field.onChange}
                >
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <SelectTrigger>
                      {field.value ? (
                        <SelectValue placeholder='Selecciona el estado civil' />
                      ) : (
                        'Selecciona el estado civil'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(MaritalStatusNames).map(([key, value]) => (
                      <SelectItem className={`text-[14px]`} key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

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

        <FormField
          control={form.control}
          name='conversionDate'
          render={({ field }) => (
            <FormItem className='mt-3'>
              <FormLabel className='text-[14px] font-medium'>
                Fecha de conversión
                <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                  Opcional
                </span>
              </FormLabel>
              <Popover open={isInputConvertionDateOpen} onOpenChange={setIsInputConvertionDateOpen}>
                <PopoverTrigger asChild>
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <Button
                      disabled={isInputDisabled}
                      variant={'outline'}
                      className={cn(
                        'text-[14px] w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'LLL dd, y', { locale: es })
                      ) : (
                        <span className='text-[14px]'>Selecciona la fecha de conversión</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsInputConvertionDateOpen(false);
                    }}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className='pl-2 text-blue-600 text-[12.5px] xl:text-[13px] font-bold italic'>
                * Fecha en la que el creyente se convirtió.
              </FormDescription>
              <FormMessage className='text-[13px]' />
            </FormItem>
          )}
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

        <FormField
          control={form.control}
          name='residenceCountry'
          render={({ field }) => {
            return (
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>País</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isInputDisabled}
                >
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <SelectTrigger>
                      {field.value ? (
                        <SelectValue placeholder='Selecciona el país' />
                      ) : (
                        'Selecciona el país'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(CountryNames).map(([key, value]) => (
                      <SelectItem className={`text-[14px]`} key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name='residenceDepartment'
          render={({ field }) => {
            return (
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>Departamento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isInputDisabled}
                >
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <SelectTrigger>
                      {field.value ? (
                        <SelectValue placeholder='Selecciona el departamento' />
                      ) : (
                        'Selecciona el departamento'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(DepartmentNames).map(([key, value]) => (
                      <SelectItem className={`text-[14px]`} key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name='residenceProvince'
          render={({ field }) => {
            return (
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>Provincia</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isInputDisabled}
                >
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <SelectTrigger>
                      {field.value ? (
                        <SelectValue placeholder='Selecciona la provincia' />
                      ) : (
                        'Selecciona la provincia'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(ProvinceNames).map(([key, value]) => (
                      <SelectItem className={`text-[14px]`} key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name='residenceDistrict'
          render={({ field }) => {
            return (
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>Distrito</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isInputDisabled}
                >
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <SelectTrigger>
                      {field.value ? (
                        <SelectValue placeholder='Selecciona el distrito' />
                      ) : (
                        'Selecciona el distrito'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(DistrictNames).map(([key, value]) => (
                      <SelectItem
                        className={`text-[14px] ${districtsValidation?.districtsDataResult?.includes(value) ? 'hidden' : ''}`}
                        key={key}
                        value={key}
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name='residenceUrbanSector'
          render={({ field }) => {
            return (
              <FormItem className='mt-3'>
                <FormLabel className='text-[14px] font-medium'>Sector Urbano</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isInputDisabled}
                >
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <SelectTrigger>
                      {field.value ? (
                        <SelectValue placeholder='Selecciona el sector urbano' />
                      ) : (
                        'Selecciona el sector urbano'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(UrbanSectorNames).map(([key, value]) => (
                      <SelectItem
                        className={`text-[14px] ${(urbanSectorsValidation?.urbanSectorsDataResult?.includes(value) ?? !residenceDistrict) ? 'hidden' : ''}`}
                        key={key}
                        value={key}
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='text-[13px]' />
              </FormItem>
            );
          }}
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
