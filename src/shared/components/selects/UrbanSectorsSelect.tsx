import { Path } from 'react-hook-form';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';
import { MemberFormData, MemberUseFormReturn } from '@/shared/interfaces/member-form-data';
import { DisabledUrbanSectorsResult } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

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

interface UrbanSectorsSelectProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
  fieldName: Path<MemberFormData>;
  urbanSectorsValidation: DisabledUrbanSectorsResult | undefined;
  residenceDistrict: string;
}

export const UrbanSectorsSelect = ({
  form,
  isInputDisabled,
  fieldName,
  urbanSectorsValidation,
  residenceDistrict,
}: UrbanSectorsSelectProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName as any}
      render={({ field }) => {
        return (
          <FormItem className='mt-3'>
            <FormLabel className='text-[14px] font-medium'>Sector Urbano</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={isInputDisabled}>
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
  );
};
