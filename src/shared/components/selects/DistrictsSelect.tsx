import { Path } from 'react-hook-form';
import { DistrictNames } from '@/shared/enums/district.enum';
import { MemberFormData, MemberUseFormReturn } from '@/shared/interfaces/member-form-data';
import { DisabledDistrictsResult } from '@/shared/helpers/validate-districts-allowed-by-module.helper';

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

interface DistrictsSelectProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
  fieldName: Path<MemberFormData>;
  districtsValidation: DisabledDistrictsResult | undefined;
}

export const DistrictsSelect = ({
  form,
  isInputDisabled,
  fieldName,
  districtsValidation,
}: DistrictsSelectProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName as any}
      render={({ field }) => {
        return (
          <FormItem className='mt-3'>
            <FormLabel className='text-[14px] font-medium'>Distrito</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={isInputDisabled}>
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
  );
};
