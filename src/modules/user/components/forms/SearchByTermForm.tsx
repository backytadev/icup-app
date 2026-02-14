import { useState, useEffect } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  UserSearchType,
  UserSearchTypeNames,
} from '@/modules/user/enums/user-search-type.enum';
import {
  UserSearchNamesByGender,
  UserSearchNamesByRecordStatus,
} from '@/modules/user/enums/user-search-select-option.enum';
import { UserRole, UserRoleNames } from '@/modules/user/enums/user-role.enum';

import { userSearchByTermFormSchema } from '@/modules/user/schemas/user-search-by-term-form-schema';
import { type UserSearchFormByTerm } from '@/modules/user/types/user-form-search-by-term.interface';

import { cn } from '@/shared/lib/utils';
import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { lastNamesFormatter, firstNamesFormatter } from '@/shared/helpers/names-formatter.helper';

import {
  Form,
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
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';

interface Props {
  onSearch: (params: UserSearchFormByTerm, formData: UserSearchFormByTerm) => void;
}

export const SearchByTermForm = ({ onSearch }: Props): JSX.Element => {
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const form = useForm<z.infer<typeof userSearchByTermFormSchema>>({
    resolver: zodResolver(userSearchByTermFormSchema),
    mode: 'onChange',
    defaultValues: {
      limit: '10',
      firstNamesTerm: '',
      lastNamesTerm: '',
      selectTerm: '',
      multiSelectTerm: [],
      all: false,
      order: RecordOrder.Descending,
    },
  });

  const { searchType, limit, order, all } = form.watch();

  useEffect(() => {
    if (all) form.setValue('limit', '10');
  }, [all]);

  useEffect(() => {
    setIsDisabledSubmitButton(!limit || !order);
  }, [limit, order]);

  function onSubmit(formData: z.infer<typeof userSearchByTermFormSchema>): void {
    const newNamesTerm = firstNamesFormatter(formData.firstNamesTerm);
    const newLastNamesTerm = lastNamesFormatter(formData.lastNamesTerm);

    const searchParams: UserSearchFormByTerm = {
      searchType: formData.searchType,
      order: formData.order,
      limit: formData.limit,
      all: formData.all,
      firstNamesTerm: newNamesTerm,
      lastNamesTerm: newLastNamesTerm,
      selectTerm: formData.selectTerm,
      multiSelectTerm: formData.multiSelectTerm?.join('+'),
    };

    onSearch(searchParams, formData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end mb-4'
      >
        <FormField
          control={form.control}
          name='searchType'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-[14px] font-bold'>Tipo de Búsqueda</FormLabel>
              <FormDescription className='text-[12px] pb-1'>¿Qué deseas buscar?</FormDescription>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.resetField('selectTerm');
                  form.resetField('firstNamesTerm');
                  form.resetField('lastNamesTerm');
                  form.resetField('multiSelectTerm');
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className='text-[14px]'>
                    <SelectValue placeholder='Selecciona un tipo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(UserSearchTypeNames).map(([key, value]) => (
                    <SelectItem key={key} value={key} className='text-[14px]'>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dynamic Fields Based on Search Type */}
        {(searchType === UserSearchType.RecordStatus ||
          searchType === UserSearchType.Gender) && (
            <FormField
              control={form.control}
              name='selectTerm'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] font-bold'>Opción</FormLabel>
                  <FormDescription className='text-[12px] pb-1'>
                    Selecciona una opción
                  </FormDescription>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-[14px]'>
                        <SelectValue placeholder='Elegir...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(
                        searchType === UserSearchType.Gender
                          ? UserSearchNamesByGender
                          : UserSearchNamesByRecordStatus
                      ).map(([key, value]) => (
                        <SelectItem key={key} value={key} className='text-[14px]'>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

        {searchType === UserSearchType.Roles && (
          <FormField
            control={form.control}
            name='multiSelectTerm'
            render={() => (
              <FormItem className='md:col-span-2 lg:col-span-3'>
                <FormLabel className='text-[14px] font-bold'>Roles</FormLabel>
                <FormDescription className='text-[12px] pb-1'>
                  Selecciona los roles a buscar
                </FormDescription>
                <div className='flex flex-col md:flex-row md:flex-wrap gap-4'>
                  {Object.entries(UserRoleNames).map(([key, value]) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name='multiSelectTerm'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center space-x-2 -space-y-1'>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(key as UserRole)}
                              onCheckedChange={(checked) => {
                                let updated: UserRole[] = [];
                                checked
                                  ? (updated = field.value ? [...field.value, key as UserRole] : [key as UserRole])
                                  : (updated = field.value?.filter((value) => value !== key) ?? []);

                                field.onChange(updated);
                              }}
                            />
                          </FormControl>
                          <FormLabel className='text-[14px] cursor-pointer'>{value}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(searchType === UserSearchType.FirstNames ||
          searchType === UserSearchType.FullNames) && (
            <FormField
              control={form.control}
              name='firstNamesTerm'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] font-bold'>Nombres</FormLabel>
                  <FormDescription className='text-[12px] pb-1'>Nombres a buscar</FormDescription>
                  <FormControl>
                    <Input {...field} className='text-[14px]' placeholder='Ejem: Juan...' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

        {(searchType === UserSearchType.LastNames ||
          searchType === UserSearchType.FullNames) && (
            <FormField
              control={form.control}
              name='lastNamesTerm'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] font-bold'>Apellidos</FormLabel>
                  <FormDescription className='text-[12px] pb-1'>
                    Apellidos a buscar
                  </FormDescription>
                  <FormControl>
                    <Input {...field} className='text-[14px]' placeholder='Ejem: Perez...' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

        {/* Global params */}
        <div className='flex gap-3 items-end md:col-span-1 lg:col-span-1 xl:col-span-1'>
          <FormField
            control={form.control}
            name='limit'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel className='text-[14px] font-bold'>Límite</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={form.getValues('all')}
                    className='text-[14px]'
                    value={form.getValues('all') ? '-' : field.value || ''}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='all'
            render={({ field }) => (
              <FormItem className='flex items-center space-x-2 space-y-0 rounded-md border p-3 h-[2.5rem] mt-auto'>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className='text-[14px] cursor-pointer'>Todos</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='order'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-[14px] font-bold'>Orden</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className='text-[14px]'>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(RecordOrderNames).map(([key, value]) => (
                    <SelectItem key={key} value={key} className='text-[14px]'>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className='lg:col-span-1 flex justify-start mt-2'>
          <Button
            disabled={isDisabledSubmitButton}
            type='submit'
            className={cn(
              'w-full md:w-[200px] text-[14px] h-[2.5rem] font-semibold transition-all duration-200',
              'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20'
            )}
          >
            Buscar
          </Button>
        </div>
      </form>
    </Form>
  );
};
