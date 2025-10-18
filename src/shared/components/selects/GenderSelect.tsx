import { GenderNames } from '@/shared/enums/gender.enum';
import { MemberUseFormReturn } from '@/shared/interfaces/member-form-data';

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

interface GenderSelectProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
}

export const GenderSelect = ({ form, isInputDisabled }: GenderSelectProps) => {
  return (
    <FormField
      control={form.control}
      name='gender'
      render={({ field }) => {
        return (
          <FormItem className='mt-3'>
            <FormLabel className='text-[14px] font-medium'>Género</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={isInputDisabled}>
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
  );
};
