import { UseQueryResult } from '@tanstack/react-query';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/shared/lib/utils';

import {
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/shared/components/ui/command';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

import { getFullNames } from '@/shared/helpers/get-full-names.helper';
import { MemberUseFormReturn } from '@/shared/interfaces/member-form-data';
import { CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';

export interface CopastorSelectProps {
  form: MemberUseFormReturn;
  isInputTheirCopastorOpen: boolean;
  setIsInputTheirCopastorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
  queryCopastors: UseQueryResult<CopastorResponse[], Error>;
}

export const CopastorSelect = ({
  form,
  isInputDisabled,
  isInputTheirCopastorOpen,
  setIsInputTheirCopastorOpen,
  queryCopastors,
}: CopastorSelectProps) => {
  return (
    <FormField
      control={form.control}
      name='theirCopastor'
      render={({ field }) => {
        return (
          <FormItem className='mt-3'>
            <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>Co-Pastor</FormLabel>
            <FormDescription className='text-[13.5px] md:text-[14px]'>
              Selecciona y asigna un Co-Pastor .
            </FormDescription>
            <Popover open={isInputTheirCopastorOpen} onOpenChange={setIsInputTheirCopastorOpen}>
              <PopoverTrigger asChild>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Button
                    disabled={isInputDisabled}
                    variant='outline'
                    role='combobox'
                    className={cn(
                      'text-[14px] w-full justify-between overflow-hidden',
                      !field.value && 'text-slate-500 font-normal text-[14px]'
                    )}
                  >
                    {field.value
                      ? `${queryCopastors.data?.find((copastor) => copastor.id === field.value)?.member?.firstNames} 
                      ${queryCopastors.data?.find((copastor) => copastor.id === field.value)?.member?.lastNames}`
                      : 'Busque y seleccione un co-pastor'}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align='center' className='w-auto px-4 py-2'>
                <Command>
                  {queryCopastors?.data?.length && queryCopastors?.data?.length > 0 ? (
                    <>
                      <CommandInput
                        placeholder='Busque un co-pastor...'
                        className='h-9 text-[14px]'
                      />
                      <CommandEmpty>Co-Pastor no encontrado.</CommandEmpty>
                      <CommandGroup className='max-h-[200px] h-auto'>
                        {queryCopastors.data?.map((copastor) => (
                          <CommandItem
                            className='text-[14px]'
                            value={getFullNames({
                              firstNames: copastor.member?.firstNames ?? '',
                              lastNames: copastor.member?.lastNames ?? '',
                            })}
                            key={copastor.id}
                            onSelect={() => {
                              form.setValue('theirCopastor', copastor.id);
                              setIsInputTheirCopastorOpen(false);
                            }}
                          >
                            {`${copastor?.member?.firstNames} ${copastor?.member?.lastNames}`}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                copastor?.id === field.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  ) : (
                    queryCopastors?.data?.length === 0 && (
                      <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                        ❌No hay co-pastores disponibles.
                      </p>
                    )
                  )}
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage className='text-[13px]' />
          </FormItem>
        );
      }}
    />
  );
};
