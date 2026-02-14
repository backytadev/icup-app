import { Path } from 'react-hook-form';
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
import { type PastorResponse } from '@/modules/pastor/types';
import { MemberFormData, MemberUseFormReturn } from '@/shared/interfaces/member-form-data';

export interface PastorsSelectProps {
  form: MemberUseFormReturn;
  isInputTheirPastorOpen: boolean;
  setIsInputTheirPastorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled?: boolean;
  isRelationSelectDisabled?: boolean;
  queryPastors: UseQueryResult<PastorResponse[], Error>;
  fieldName: Path<MemberFormData>;
  className?: string;
  setChangedId?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const PastorsSelect = ({
  form,
  isInputDisabled,
  isInputTheirPastorOpen,
  setIsInputTheirPastorOpen,
  queryPastors,
  fieldName,
  isRelationSelectDisabled,
  className,
  setChangedId,
}: PastorsSelectProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem className={cn('mt-3', className)}>
            <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>Pastor</FormLabel>
            <FormDescription className='text-[13.5px] md:text-[14px]'>
              Selecciona y asigna un Pastor.
            </FormDescription>
            <Popover open={isInputTheirPastorOpen} onOpenChange={setIsInputTheirPastorOpen}>
              <PopoverTrigger asChild>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Button
                    disabled={isInputDisabled || isRelationSelectDisabled}
                    variant='outline'
                    role='combobox'
                    className={cn(
                      'w-full justify-between overflow-hidden',
                      !field.value && 'text-slate-500 font-normal text-[14px]'
                    )}
                  >
                    {field.value
                      ? `${queryPastors?.data?.find((pastor) => pastor.id === field.value)?.member?.firstNames} 
                          ${queryPastors?.data?.find((pastor) => pastor.id === field.value)?.member?.lastNames}`
                      : 'Busque y seleccione un pastor'}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align='center' className='w-auto px-4 py-2'>
                <Command>
                  {queryPastors?.data?.length && queryPastors?.data?.length > 0 ? (
                    <>
                      <CommandInput placeholder='Busque un pastor' className='h-9 text-[14px]' />
                      <CommandEmpty>Pastor no encontrado.</CommandEmpty>
                      <CommandGroup className='max-h-[200px] h-auto'>
                        {queryPastors?.data?.map((pastor) => (
                          <CommandItem
                            className='text-[14px]'
                            value={getFullNames({
                              firstNames: pastor.member?.firstNames ?? '',
                              lastNames: pastor.member?.lastNames ?? '',
                            })}
                            key={pastor.id}
                            onSelect={() => {
                              form.setValue(fieldName, pastor?.id);
                              setChangedId && setChangedId(pastor?.id);
                              setIsInputTheirPastorOpen(false);
                            }}
                          >
                            {`${pastor?.member?.firstNames} ${pastor?.member?.lastNames}`}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                pastor?.id === field.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  ) : (
                    queryPastors?.data?.length === 0 && (
                      <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                        ❌No hay pastores disponibles.
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
