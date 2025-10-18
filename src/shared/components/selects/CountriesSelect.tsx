import { Path } from 'react-hook-form';
import { CountryNames } from '@/shared/enums/country.enum';
import { MemberFormData, MemberUseFormReturn } from '@/shared/interfaces/member-form-data';

import {
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';

interface CountriesSelectProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
  fieldName: Path<MemberFormData>;
}

export const CountriesSelect = ({ form, isInputDisabled, fieldName }: CountriesSelectProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName as any}
      render={({ field }) => {
        return (
          <FormItem className='mt-3'>
            <FormLabel className='text-[14px] font-medium'>País</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={isInputDisabled}>
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
  );
};
