import { Path } from 'react-hook-form';
import { DepartmentNames } from '@/shared/enums/department.enum';
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

interface DepartmentsSelectProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
  fieldName: Path<MemberFormData>;
}

export const DepartmentsSelect = ({ form, isInputDisabled, fieldName }: DepartmentsSelectProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName as any}
      render={({ field }) => {
        return (
          <FormItem className='mt-3'>
            <FormLabel className='text-[14px] font-medium'>Departamento</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={isInputDisabled}>
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
  );
};
