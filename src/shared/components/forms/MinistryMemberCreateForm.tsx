import { Plus, Trash } from 'lucide-react';
import { UseQueryResult } from '@tanstack/react-query';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/shared/lib/utils';
import { ChurchResponse } from '@/modules/church/types';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';

import {
  MinistryMemberRole,
  MinistryMemberRoleNames,
  SearchTypesKidsMinistry,
  SearchTypesYouthMinistry,
  SearchTypesWorshipMinistry,
  SearchTypesEvangelismMinistry,
  SearchTypesTechnologyMinistry,
  SearchTypesBiblicalTeachingMinistry,
  SearchTypesIntercessionMinistry,
} from '@/modules/ministry/enums/ministry-member-role.enum';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/shared/components/ui/command';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

export interface MinistryMemberCreateFormProps {
  isInputDisabled: boolean;
  addMinistryBlock: () => void;
  ministryBlocks: MinistryMemberBlock[];
  updateMinistryBlock: <K extends keyof MinistryMemberBlock>(
    index: number,
    field: K,
    value: MinistryMemberBlock[K]
  ) => void;
  queryChurches: UseQueryResult<ChurchResponse[], Error>;
  handleSelectChurch: (index: number, churchId: string) => Promise<void>;
  toggleRoleInBlock: (index: number, role: string, isChecked: boolean) => void;
  removeMinistryBlock: (indexToRemove: number) => void;
}

export const MinistryMemberCreateForm = ({
  isInputDisabled,
  addMinistryBlock,
  ministryBlocks,
  updateMinistryBlock,
  queryChurches,
  handleSelectChurch,
  toggleRoleInBlock,
  removeMinistryBlock,
}: MinistryMemberCreateFormProps) => {
  return (
    <>
      <div className='w-full flex items-center justify-between border-b border-gray-300 pb-4'>
        <h3 className='text-[17px] md:text-[22px] font-semibold text-black dark:text-gray-100'>
          Agregar Ministerios
        </h3>

        <Button
          type='button'
          variant='ghost'
          disabled={isInputDisabled}
          onClick={addMinistryBlock}
          className={cn(
            'flex items-center gap-2 text-[14px] px-4 py-2 border border-blue-500 rounded-xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white hover:text-blue-100 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-colors shadow-sm hover:shadow-md'
          )}
        >
          <Plus className='w-4 h-4 md:w-5 md:h-5' />
          <span className='hidden md:block'>Agregar Ministerio</span>
        </Button>
      </div>

      {ministryBlocks.map((block, index) => (
        <div key={index} className='w-full flex flex-col space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* TIPO DE MINISTERIO */}
            <div className='flex flex-col'>
              <label className='text-[14.5px] md:text-[15px] font-bold mb-2'>
                Tipo de Ministerio
              </label>
              <Select
                value={block.ministryType ?? ''}
                onValueChange={(value) => {
                  updateMinistryBlock(index, 'ministryType', value);
                  updateMinistryBlock(index, 'ministryRoles', []);
                  updateMinistryBlock(index, 'churchId', '');
                }}
                disabled={isInputDisabled}
              >
                <SelectTrigger className='h-10 text-sm'>
                  {block.ministryType ? (
                    <SelectValue placeholder='Selecciona el tipo de ministerio' />
                  ) : (
                    'Selecciona el tipo de ministerio'
                  )}
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MinistryTypeNames).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* IGLESIA */}
            <div className='flex flex-col'>
              <label className='text-[14.5px] md:text-[15px] font-bold mb-2'>Iglesia</label>
              <Popover
                open={block.churchPopoverOpen}
                onOpenChange={(open) => updateMinistryBlock(index, 'churchPopoverOpen', open)}
              >
                <PopoverTrigger asChild>
                  <Button
                    disabled={!block.ministryType || isInputDisabled}
                    variant='outline'
                    role='combobox'
                    className='w-full h-10 justify-between text-sm'
                  >
                    {block.churchId
                      ? queryChurches?.data?.find((church) => church.id === block.churchId)
                          ?.abbreviatedChurchName
                      : 'Seleccione una iglesia'}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='center' className='w-[300px] p-4'>
                  <Command>
                    {queryChurches?.data && queryChurches?.data?.length > 0 ? (
                      <>
                        <CommandInput
                          placeholder='Busque una iglesia'
                          className='h-9 text-[14px]'
                        />
                        <CommandEmpty>Iglesia no encontrada.</CommandEmpty>
                        <CommandGroup className='max-h-[200px] h-auto'>
                          {queryChurches?.data?.map((church) => (
                            <CommandItem
                              key={church.id}
                              value={church.abbreviatedChurchName}
                              className='text-[14px]'
                              onSelect={() => {
                                updateMinistryBlock(index, 'churchId', church.id);
                                updateMinistryBlock(index, 'churchPopoverOpen', !open);
                                handleSelectChurch(index, church.id);
                              }}
                            >
                              {church?.abbreviatedChurchName}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  church.id === ministryBlocks[index].churchId
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    ) : (
                      queryChurches?.data?.length === 0 && (
                        <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                          ❌ No hay iglesias disponibles.
                        </p>
                      )
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* MINISTERIO */}
            <div className='flex flex-col'>
              <label className='text-[14.5px] md:text-[15px] font-bold mb-2'>Ministerio</label>
              <Popover
                open={block.ministryPopoverOpen}
                onOpenChange={(open) => updateMinistryBlock(index, 'ministryPopoverOpen', open)}
              >
                <PopoverTrigger asChild>
                  <Button
                    disabled={!block.churchId || !block.ministryType || isInputDisabled}
                    variant='outline'
                    role='combobox'
                    className='w-full h-10 justify-between text-sm'
                  >
                    {block.ministryId
                      ? block.ministries?.find((ministry) => ministry.id === block.ministryId)
                          ?.customMinistryName
                      : 'Seleccione un ministerio'}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='center' className='w-[300px] p-4'>
                  <Command>
                    {block.ministries && block.ministries?.length > 0 ? (
                      <>
                        <CommandInput
                          placeholder='Busque un ministerio'
                          className='h-9 text-[14px]'
                        />
                        <CommandEmpty>Ministerio no encontrado.</CommandEmpty>
                        <CommandGroup className='max-h-[200px] h-auto'>
                          {block.ministries?.map((ministry) => (
                            <CommandItem
                              key={ministry.id}
                              value={ministry?.customMinistryName}
                              className='text-[14px]'
                              onSelect={() => {
                                updateMinistryBlock(index, 'ministryId', ministry.id);
                                updateMinistryBlock(index, 'ministryPopoverOpen', !open);
                              }}
                            >
                              {ministry?.customMinistryName}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  ministry.id === ministryBlocks[index].ministryId
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    ) : (
                      block.ministries?.length === 0 && (
                        <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                          ❌ No hay ministerios disponibles.
                        </p>
                      )
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* ROLES DE MINISTERIO */}
          <div className='flex flex-col'>
            <label className='text-[15px] font-bold mb-2'>Roles de Ministerio</label>
            <div className='flex justify-between items-center gap-x-4'>
              <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1'>
                {Object.values(
                  block.ministryType === MinistryType.KidsMinistry
                    ? SearchTypesKidsMinistry
                    : block.ministryType === MinistryType.YouthMinistry
                      ? SearchTypesYouthMinistry
                      : block.ministryType === MinistryType.BiblicalTeachingMinistry
                        ? SearchTypesBiblicalTeachingMinistry
                        : block.ministryType === MinistryType.EvangelismMinistry
                          ? SearchTypesEvangelismMinistry
                          : block.ministryType === MinistryType.IntercessionMinistry
                            ? SearchTypesIntercessionMinistry
                            : block.ministryType === MinistryType.TechnologyMinistry
                              ? SearchTypesTechnologyMinistry
                              : SearchTypesWorshipMinistry
                ).map((role) => {
                  const isSelected = block.ministryRoles.includes(role);
                  const isAnySelected = block.ministryRoles.length > 0;
                  const isDisabled =
                    (!isSelected && isAnySelected) ||
                    isInputDisabled ||
                    !block.churchId ||
                    !block.ministryType ||
                    !block.ministryId;
                  const checkboxId = `role-${index}-${role}`;

                  return (
                    <div key={role} className='flex items-center space-x-2'>
                      <Checkbox
                        id={checkboxId}
                        disabled={isDisabled}
                        checked={isSelected}
                        onCheckedChange={(checked) => toggleRoleInBlock(index, role, !!checked)}
                        className={cn(isDisabled ? 'bg-slate-500' : '')}
                      />
                      <label htmlFor={checkboxId} className='text-sm cursor-pointer font-normal'>
                        {MinistryMemberRoleNames[role as MinistryMemberRole]}
                      </label>
                    </div>
                  );
                })}
              </div>

              <Button
                type='button'
                variant='ghost'
                disabled={isInputDisabled}
                onClick={() => removeMinistryBlock(index)}
                className={cn(
                  'flex items-center gap-2 text-[14px] px-4 py-2 border border-red-500 rounded-xl bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:text-red-100 hover:from-red-500 hover:via-red-600 hover:to-red-700 transition-colors shadow-sm hover:shadow-md'
                )}
              >
                <Trash className='w-4 h-4 md:w-5 md:h-5' />
                <span className='hidden md:block'>Eliminar</span>
              </Button>
            </div>
          </div>

          <div className='border-b border-gray-300 my-4' />
        </div>
      ))}
    </>
  );
};
