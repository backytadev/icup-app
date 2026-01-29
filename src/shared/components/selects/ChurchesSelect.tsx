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

import { MemberUseFormReturn } from '@/shared/interfaces/member-form-data';
import { ChurchResponse } from '@/modules/church/types';

export interface ChurchesSelectProps {
  form: MemberUseFormReturn;
  isInputTheirChurchOpen: boolean;
  isRelationSelectDisabled?: boolean;
  setIsInputTheirChurchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled?: boolean;
  queryChurches: UseQueryResult<ChurchResponse[], Error>;
  setChangedId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  className?: string;
}

export const ChurchesSelect = ({
  form,
  isInputDisabled,
  isRelationSelectDisabled,
  isInputTheirChurchOpen,
  setIsInputTheirChurchOpen,
  queryChurches,
  setChangedId,
  className,
}: ChurchesSelectProps) => {
  return (
    <FormField
      control={form.control}
      name='theirChurch'
      render={({ field }) => {
        return (
          <FormItem className={cn('mt-3', className)}>
            <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>Iglesia</FormLabel>
            <FormDescription className='text-[13.5px] md:text-[14px]'>
              Selecciona y asigna una Iglesia.
            </FormDescription>
            <Popover open={isInputTheirChurchOpen} onOpenChange={setIsInputTheirChurchOpen}>
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
                      ? queryChurches?.data?.find((church) => church.id === field.value)
                          ?.abbreviatedChurchName
                      : 'Busque y seleccione una iglesia'}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align='center' className='w-auto px-4 py-2'>
                <Command>
                  {queryChurches?.data?.length && queryChurches?.data?.length > 0 ? (
                    <>
                      <CommandInput placeholder='Busque una iglesia' className='h-9 text-[14px]' />
                      <CommandEmpty>Iglesia no encontrada.</CommandEmpty>
                      <CommandGroup className='max-h-[200px] h-auto'>
                        {queryChurches?.data?.map((church) => (
                          <CommandItem
                            className='text-[14px]'
                            value={church.abbreviatedChurchName}
                            key={church.id}
                            onSelect={() => {
                              form.setValue('theirChurch', church?.id);
                              setChangedId && setChangedId(church?.id);
                              setIsInputTheirChurchOpen(false);
                            }}
                          >
                            {church?.abbreviatedChurchName}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                church?.id === field.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  ) : (
                    queryChurches?.data?.length === 0 && (
                      <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                        ❌No hay iglesias disponibles.
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
