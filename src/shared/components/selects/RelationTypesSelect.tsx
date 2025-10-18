import { MemberUseFormReturn } from '@/shared/interfaces/member-form-data';

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
import { ModuleName, RelationTypeModuleNames } from '@/shared/enums/relation-type.enum';

export interface RelationTypesSelectProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
  moduleName: ModuleName;
  showSubtitles?: boolean;
}

export const RelationTypesSelect = ({
  form,
  isInputDisabled,
  moduleName,
  showSubtitles = true,
}: RelationTypesSelectProps) => {
  return (
    <FormField
      control={form.control}
      name='relationType'
      render={({ field }) => {
        return (
          <FormItem className='mt-3'>
            <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
              Tipo de Relación
            </FormLabel>
            {showSubtitles && (
              <FormDescription className='text-[13.5px] md:text-[14px]'>
                Selecciona el tipo de relación que tendrá el discípulo.
              </FormDescription>
            )}
            <Select onValueChange={field.onChange} value={field.value} disabled={isInputDisabled}>
              <FormControl className='text-[14px] md:text-[14px]'>
                <SelectTrigger>
                  {field.value ? (
                    <SelectValue placeholder='Selecciona el tipo de relación' />
                  ) : (
                    'Selecciona el tipo de relación'
                  )}
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(RelationTypeModuleNames[moduleName as ModuleName]).map(
                  ([key, value]) => (
                    <SelectItem className={`text-[14px]`} key={key} value={key}>
                      {value}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <FormMessage className='text-[13px]' />
          </FormItem>
        );
      }}
    />
  );
};
