import { useState, useEffect } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import {
  PastorSearchType,
  PastorSearchTypeNames,
} from '@/modules/pastor/enums/pastor-search-type.enum';
import {
  PastorSearchNamesByGender,
  PastorSearchNamesByBirthMonth,
  PastorSearchNamesByRecordStatus,
  PastorSearchNamesByMaritalStatus,
} from '@/modules/pastor/enums/pastor-search-select-option.enum';

import { pastorSearchByTermFormSchema } from '@/modules/pastor/schemas/pastor-search-by-term-form-schema';
import { type PastorSearchFormByTerm } from '@/modules/pastor/types/pastor-search-form-by-term.interface';

import { cn } from '@/shared/lib/utils';
import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { lastNamesFormatter, firstNamesFormatter } from '@/shared/helpers/names-formatter.helper';
import { dateFormatterTermToTimestamp } from '@/shared/helpers/date-formatter-to-timestamp.helper';

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
import { Calendar } from '@/shared/components/ui/calendar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface Props {
  onSearch: (params: PastorSearchFormByTerm, formData: PastorSearchFormByTerm) => void;
}

export const SearchByTermForm = ({ onSearch }: Props): JSX.Element => {
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const form = useForm<z.infer<typeof pastorSearchByTermFormSchema>>({
    resolver: zodResolver(pastorSearchByTermFormSchema),
    mode: 'onChange',
    defaultValues: {
      limit: '10',
      inputTerm: '',
      firstNamesTerm: '',
      lastNamesTerm: '',
      selectTerm: '',
      dateTerm: undefined,
      all: false,
      order: RecordOrder.Descending,
      churchId: '',
    },
  });

  const { searchType, limit, order, all } = form.watch();

  const churchesQuery = useQuery({
    queryKey: ['churches-pastor-search-term'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  useEffect(() => {
    if (all) form.setValue('limit', '10');
  }, [all]);

  useEffect(() => {
    setIsDisabledSubmitButton(!limit || !order);
  }, [limit, order]);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data]);

  function onSubmit(formData: z.infer<typeof pastorSearchByTermFormSchema>): void {
    const newDateTermTo = formData.dateTerm?.to ?? formData.dateTerm?.from;

    const newDateTerm = dateFormatterTermToTimestamp({
      from: formData.dateTerm?.from,
      to: newDateTermTo,
    });

    const newNamesTerm = firstNamesFormatter(formData.firstNamesTerm);
    const newLastNamesTerm = lastNamesFormatter(formData.lastNamesTerm);

    const searchParams = {
      ...formData,
      firstNamesTerm: newNamesTerm,
      lastNamesTerm: newLastNamesTerm,
      dateTerm: newDateTerm as any,
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
                  form.resetField('dateTerm');
                  form.resetField('selectTerm');
                  form.resetField('inputTerm');
                  form.resetField('firstNamesTerm');
                  form.resetField('lastNamesTerm');
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className='text-[14px]'>
                    <SelectValue placeholder='Selecciona un tipo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(PastorSearchTypeNames)
                    .filter(
                      ([key]) =>
                        ![
                          PastorSearchType.OriginCountry,
                          PastorSearchType.ResidenceCountry,
                          PastorSearchType.ResidenceDepartment,
                          PastorSearchType.ResidenceProvince,
                          PastorSearchType.ResidenceDistrict,
                          PastorSearchType.ResidenceAddress,
                        ].includes(key as PastorSearchType)
                    )
                    .map(([key, value]) => (
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
        {(searchType === PastorSearchType.ResidenceUrbanSector) && (
          <FormField
            control={form.control}
            name='inputTerm'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[14px] font-bold'>Sector Urbano</FormLabel>
                <FormDescription className='text-[12px] pb-1'>Escribe el término</FormDescription>
                <FormControl>
                  <Input {...field} className='text-[14px]' placeholder='Ejem: Payet...' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {searchType === PastorSearchType.BirthDate && (
          <FormField
            control={form.control}
            name='dateTerm'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[14px] font-bold'>Fecha / Rango</FormLabel>
                <FormDescription className='text-[12px] pb-1'>Día o rango de fechas</FormDescription>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full text-left font-normal text-[14px]',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, 'dd/MM/yyyy')} -{' '}
                              {format(field.value.to, 'dd/MM/yyyy')}
                            </>
                          ) : (
                            format(field.value.from, 'dd/MM/yyyy')
                          )
                        ) : (
                          <span>Elige una fecha</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      initialFocus
                      mode='range'
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(searchType === PastorSearchType.RecordStatus ||
          searchType === PastorSearchType.BirthMonth ||
          searchType === PastorSearchType.Gender ||
          searchType === PastorSearchType.MaritalStatus) && (
            <FormField
              control={form.control}
              name='selectTerm'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] font-bold'>Opción</FormLabel>
                  <FormDescription className='text-[12px] pb-1'>Selecciona una opción</FormDescription>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-[14px]'>
                        <SelectValue placeholder='Elegir...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(
                        searchType === PastorSearchType.Gender
                          ? PastorSearchNamesByGender
                          : searchType === PastorSearchType.BirthMonth
                            ? PastorSearchNamesByBirthMonth
                            : searchType === PastorSearchType.MaritalStatus
                              ? PastorSearchNamesByMaritalStatus
                              : PastorSearchNamesByRecordStatus
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

        {(searchType === PastorSearchType.FirstNames ||
          searchType === PastorSearchType.FullNames) && (
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

        {(searchType === PastorSearchType.LastNames ||
          searchType === PastorSearchType.FullNames) && (
            <FormField
              control={form.control}
              name='lastNamesTerm'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] font-bold'>Apellidos</FormLabel>
                  <FormDescription className='text-[12px] pb-1'>Apellidos a buscar</FormDescription>
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

        <FormField
          control={form.control}
          name='churchId'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-[14px] font-bold'>Iglesia (Opcional)</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className='text-[14px]'>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {churchesQuery?.data?.map((church) => (
                    <SelectItem key={church.id} value={church.id} className='text-[14px]'>
                      {church.abbreviatedChurchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className='lg:col-span-1 flex justify-end mt-2'>
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
