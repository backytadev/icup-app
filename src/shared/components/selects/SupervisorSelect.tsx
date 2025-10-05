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
import { SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';

export interface SupervisorSelectProps {
  form: MemberUseFormReturn;
  isInputTheirSupervisorOpen: boolean;
  setIsInputTheirSupervisorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
  querySupervisors: UseQueryResult<SupervisorResponse[], Error>;
}

export const SupervisorSelect = ({
  form,
  isInputDisabled,
  isInputTheirSupervisorOpen,
  setIsInputTheirSupervisorOpen,
  querySupervisors,
}: SupervisorSelectProps) => {
  return (
    <FormField
      control={form.control}
      name='theirSupervisor'
      render={({ field }) => {
        return (
          <FormItem className='mt-3'>
            <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>Supervisor</FormLabel>
            <FormDescription className='text-[13.5px] md:text-[14px]'>
              Selecciona y asigna un Supervisor.
            </FormDescription>
            <Popover open={isInputTheirSupervisorOpen} onOpenChange={setIsInputTheirSupervisorOpen}>
              <PopoverTrigger asChild>
                <FormControl className='text-[14px] md:text-[14px]'>
                  <Button
                    disabled={isInputDisabled}
                    variant='outline'
                    role='combobox'
                    className={cn(
                      'w-full justify-between overflow-hidden',
                      !field.value && 'text-slate-500 font-normal text-[14px]'
                    )}
                  >
                    {field.value
                      ? `${querySupervisors?.data?.find((supervisor) => supervisor.id === field.value)?.member?.firstNames}
                       ${querySupervisors?.data?.find((supervisor) => supervisor.id === field.value)?.member?.lastNames}`
                      : 'Busque y seleccione un supervisor'}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align='center' className='w-auto px-4 py-2'>
                <Command>
                  {querySupervisors?.data?.length && querySupervisors?.data?.length > 0 ? (
                    <>
                      <CommandInput
                        placeholder='Busque un supervisor...'
                        className='h-9 text-[14px]'
                      />
                      <CommandEmpty>Supervisor no encontrado.</CommandEmpty>
                      <CommandGroup className='max-h-[200px] h-auto'>
                        {querySupervisors?.data?.map((supervisor) => (
                          <CommandItem
                            className='text-[14px]'
                            value={getFullNames({
                              firstNames: supervisor.member?.firstNames ?? '',
                              lastNames: supervisor.member?.lastNames ?? '',
                            })}
                            key={supervisor.id}
                            onSelect={() => {
                              form.setValue('theirSupervisor', supervisor.id);
                              setIsInputTheirSupervisorOpen(false);
                            }}
                          >
                            {`${supervisor?.member?.firstNames} ${supervisor?.member?.lastNames}`}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                supervisor?.id === field.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  ) : (
                    querySupervisors?.data?.length === 0 && (
                      <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                        ❌No hay supervisores disponibles.
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
