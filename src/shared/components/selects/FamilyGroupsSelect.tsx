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
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { getCodeAndNameFamilyGroup } from '@/shared/helpers/get-code-and-name-family-group.helper';
import { FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';

export interface FamilyGroupsSelectProps {
  form: MemberUseFormReturn;
  isInputTheirFamilyGroupOpen: boolean;
  setIsInputTheirFamilyGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
  queryFamilyGroups: UseQueryResult<FamilyGroupResponse[], Error>;
  setChangedId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  className?: string;
}

export const FamilyGroupsSelect = ({
  form,
  isInputDisabled,
  isInputTheirFamilyGroupOpen,
  setIsInputTheirFamilyGroupOpen,
  queryFamilyGroups,
  setChangedId,
  className,
}: FamilyGroupsSelectProps) => {
  return (
    <FormField
      control={form.control}
      name='theirFamilyGroup'
      render={({ field }) => {
        return (
          <FormItem className={cn('mt-3', className)}>
            <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>Grupo Familiar</FormLabel>
            <FormDescription className='text-[13.5px] md:text-[14px]'>
              Selecciona y asigna el Grupo Familiar.
            </FormDescription>
            <Popover
              open={isInputTheirFamilyGroupOpen}
              onOpenChange={setIsInputTheirFamilyGroupOpen}
            >
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
                      ? `${queryFamilyGroups?.data?.find((familyGroup) => familyGroup.id === field.value)?.familyGroupName} 
                          (${queryFamilyGroups?.data?.find((familyGroup) => familyGroup.id === field.value)?.familyGroupCode}) ~ 
                          ${getInitialFullNames({
                            firstNames:
                              queryFamilyGroups?.data?.find(
                                (familyGroup) => familyGroup.id === field.value
                              )?.theirPreacher?.firstNames ?? '',
                            lastNames:
                              queryFamilyGroups?.data?.find(
                                (familyGroup) => familyGroup.id === field.value
                              )?.theirPreacher?.lastNames ?? '',
                          })}`
                      : 'Busque y seleccione un grupo familiar'}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align='center' className='w-auto px-4 py-2'>
                <Command>
                  {queryFamilyGroups?.data?.length && queryFamilyGroups?.data?.length > 0 ? (
                    <>
                      <CommandInput
                        placeholder='Busque un grupo familiar...'
                        className='h-9 text-[14px]'
                      />
                      <CommandEmpty>Grupo familiar no encontrado.</CommandEmpty>
                      <CommandGroup className='max-h-[200px] h-auto'>
                        {queryFamilyGroups?.data?.map((familyGroup) => (
                          <CommandItem
                            className='text-[14px]'
                            value={getCodeAndNameFamilyGroup({
                              code: familyGroup.familyGroupCode,
                              name: familyGroup.familyGroupName,
                              preacher: `${getInitialFullNames({ firstNames: familyGroup.theirPreacher?.firstNames ?? '', lastNames: familyGroup.theirPreacher?.lastNames ?? '' })}`,
                            })}
                            key={familyGroup.id}
                            onSelect={() => {
                              form.setValue('theirFamilyGroup', familyGroup?.id);
                              setChangedId && setChangedId(familyGroup.id);
                              setIsInputTheirFamilyGroupOpen(false);
                            }}
                          >
                            {`${familyGroup?.familyGroupName} (${familyGroup?.familyGroupCode}) ~ ${getInitialFullNames(
                              {
                                firstNames: familyGroup?.theirPreacher?.firstNames ?? '',
                                lastNames: familyGroup?.theirPreacher?.lastNames ?? '',
                              }
                            )}`}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                familyGroup?.id === field.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  ) : (
                    queryFamilyGroups?.data?.length === 0 && (
                      <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                        ❌No hay grupos familiares disponibles.
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
