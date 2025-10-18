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
import { MaritalStatusNames } from '@/shared/enums/marital-status.enum';

interface MaritalStatusSelectProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
}

export const MaritalStatusSelect = ({ form, isInputDisabled }: MaritalStatusSelectProps) => {
  return (
    <FormField
      control={form.control}
      name='maritalStatus'
      render={({ field }) => {
        return (
          <FormItem className='mt-3'>
            <FormLabel className='text-[14px] font-medium'>Estado Civil</FormLabel>
            <Select value={field.value} disabled={isInputDisabled} onValueChange={field.onChange}>
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
  );
};
