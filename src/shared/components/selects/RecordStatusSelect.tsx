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
import { MemberUseFormReturn } from '@/shared/interfaces/member-form-data';

export interface RecordStatusSelectProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
  moduleName: string;
}

export const RecordStatusSelect = ({
  form,
  isInputDisabled,
  moduleName,
}: RecordStatusSelectProps) => {
  return (
    <FormField
      control={form.control}
      name='recordStatus'
      render={({ field }) => {
        return (
          <FormItem className='mt-2'>
            <FormLabel className='text-[14px]'>Estado</FormLabel>
            <Select disabled={isInputDisabled} value={field.value} onValueChange={field.onChange}>
              <FormControl className='text-[14px]'>
                <SelectTrigger>
                  {field.value === 'active' ? (
                    <SelectValue placeholder='Activo' />
                  ) : (
                    <SelectValue placeholder='Inactivo' />
                  )}
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem className='text-[14px]' value='active'>
                  Activo
                </SelectItem>
                <SelectItem className='text-[14px]' value='inactive'>
                  Inactivo
                </SelectItem>
              </SelectContent>
            </Select>
            {form.getValues('recordStatus') === 'active' && (
              <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                *El registro esta <span className='text-green-500'>Activo</span>, para colocarla
                como <span className='text-red-500'>Inactivo</span> debe inactivar el registro desde
                el modulo <span className='font-bold text-red-500'>Inactivar {moduleName}.</span>
              </FormDescription>
            )}
            {form.getValues('recordStatus') === 'inactive' && (
              <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                * El registro esta <span className='text-red-500 '>Inactivo</span>, puede modificar
                el estado eligiendo otra opción.
              </FormDescription>
            )}
            <FormMessage className='text-[13px]' />
          </FormItem>
        );
      }}
    />
  );
};
