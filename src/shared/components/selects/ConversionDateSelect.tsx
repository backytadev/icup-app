import React from 'react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { MemberUseFormReturn } from '@/shared/interfaces/member-form-data';

import {
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface ConversionDateSelectProps {
  form: MemberUseFormReturn;
  isInputDisabled: boolean;
  isInputConvertionDateOpen: boolean;
  setIsInputConvertionDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConversionDateSelect = ({
  form,
  isInputDisabled,
  isInputConvertionDateOpen,
  setIsInputConvertionDateOpen,
}: ConversionDateSelectProps) => {
  return (
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
  );
};
