import { useState, useEffect } from 'react';

import { type z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMediaQuery } from '@react-hook/media-query';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import {
  SubTypeNamesOfferingExpenseSearchByOperativeExpenses,
  SubTypeNamesOfferingExpenseSearchByMaintenanceAndRepairExpenses,
  SubTypeNamesOfferingExpenseSearchByDecorationExpenses,
  SubTypeNamesOfferingExpenseSearchByEquipmentAndTechnologyExpenses,
  SubTypeNamesOfferingExpenseSearchBySuppliesExpenses,
  SubTypeNamesOfferingExpenseSearchByPlaningEventsExpenses,
  SubTypeNamesOfferingExpenseSearchByOtherExpenses,
} from '@/modules/offering/expense/enums/offering-expense-search-sub-type.enum';
import {
  OfferingExpenseSearchType,
  OfferingExpenseSearchTypeNames,
} from '@/modules/offering/expense/enums/offering-expense-search-type.enum';
import {
  SubTypeSearchOfferingExpenseByRecordStatusNames,
} from '@/modules/offering/expense/enums/offering-expense-search-select-option.enum';

import { type OfferingExpenseSearchFormByTerm } from '@/modules/offering/expense/interfaces/offering-expense-search-form-by-term.interface';
import { offeringExpenseSearchByTermFormSchema } from '@/modules/offering/expense/schemas/offering-expense-search-by-term-form-schema';

import { cn } from '@/shared/lib/utils';
import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { dateFormatterTermToTimestamp } from '@/shared/helpers/date-formatter-to-timestamp.helper';

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface Props {
  onSearch: (params: OfferingExpenseSearchFormByTerm, formData: OfferingExpenseSearchFormByTerm) => void;
}

export const SearchByTermForm = ({ onSearch }: Props): JSX.Element => {
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<z.infer<typeof offeringExpenseSearchByTermFormSchema>>({
    resolver: zodResolver(offeringExpenseSearchByTermFormSchema),
    mode: 'onChange',
    defaultValues: {
      searchSubType: '' as any,
      limit: '10',
      selectTerm: '',
      dateTerm: undefined,
      all: false,
      order: RecordOrder.Descending,
    },
  });

  const { searchType, limit, order, all } = form.watch();

  const churchesQuery = useQuery({
    queryKey: ['churches-offering-expense-search-term'],
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
    form.setValue('searchSubType', undefined);
  }, [searchType]);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data]);

  function onSubmit(formData: z.infer<typeof offeringExpenseSearchByTermFormSchema>): void {
    let newDateTermTo;
    if (!formData.dateTerm?.to) {
      newDateTermTo = formData.dateTerm?.from;
    }

    const newDateTerm = dateFormatterTermToTimestamp({
      from: formData.dateTerm?.from,
      to: formData.dateTerm?.to ? formData.dateTerm?.to : newDateTermTo,
    });

    const searchParams = {
      ...formData,
      dateTerm: newDateTerm as any,
    };

    onSearch(searchParams, formData);
  }

  //* Determine sub-type options based on search type
  const getSubTypeOptions = (): Record<string, string> => {
    switch (searchType) {
      case OfferingExpenseSearchType.OperationalExpenses:
        return SubTypeNamesOfferingExpenseSearchByOperativeExpenses;
      case OfferingExpenseSearchType.MaintenanceAndRepairExpenses:
        return SubTypeNamesOfferingExpenseSearchByMaintenanceAndRepairExpenses;
      case OfferingExpenseSearchType.DecorationExpenses:
        return SubTypeNamesOfferingExpenseSearchByDecorationExpenses;
      case OfferingExpenseSearchType.EquipmentAndTechnologyExpenses:
        return SubTypeNamesOfferingExpenseSearchByEquipmentAndTechnologyExpenses;
      case OfferingExpenseSearchType.SuppliesExpenses:
        return SubTypeNamesOfferingExpenseSearchBySuppliesExpenses;
      case OfferingExpenseSearchType.PlaningEventsExpenses:
        return SubTypeNamesOfferingExpenseSearchByPlaningEventsExpenses;
      case OfferingExpenseSearchType.OtherExpenses:
        return SubTypeNamesOfferingExpenseSearchByOtherExpenses;
      default:
        return {};
    }
  };

  //* Conditions for showing fields
  const showSubType =
    searchType === OfferingExpenseSearchType.OperationalExpenses ||
    searchType === OfferingExpenseSearchType.MaintenanceAndRepairExpenses ||
    searchType === OfferingExpenseSearchType.DecorationExpenses ||
    searchType === OfferingExpenseSearchType.EquipmentAndTechnologyExpenses ||
    searchType === OfferingExpenseSearchType.SuppliesExpenses ||
    searchType === OfferingExpenseSearchType.PlaningEventsExpenses ||
    searchType === OfferingExpenseSearchType.OtherExpenses;

  const showDateTerm =
    searchType === OfferingExpenseSearchType.OperationalExpenses ||
    searchType === OfferingExpenseSearchType.MaintenanceAndRepairExpenses ||
    searchType === OfferingExpenseSearchType.DecorationExpenses ||
    searchType === OfferingExpenseSearchType.EquipmentAndTechnologyExpenses ||
    searchType === OfferingExpenseSearchType.SuppliesExpenses ||
    searchType === OfferingExpenseSearchType.PlaningEventsExpenses ||
    searchType === OfferingExpenseSearchType.ExpensesAdjustment;

  const showSelectTerm = searchType === OfferingExpenseSearchType.RecordStatus;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end mb-4'
      >
        {/* Search Type */}
        <FormField
          control={form.control}
          name='searchType'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-[14px] font-bold'>Tipo</FormLabel>
              <FormDescription className='text-[12px] pb-1'>
                ¿Que tipo de busqueda deseas hacer?
              </FormDescription>
              <Select
                onOpenChange={() => {
                  form.resetField('dateTerm', { keepError: true });
                  form.resetField('selectTerm', { keepError: true });
                  form.resetField('searchSubType', { keepError: true });
                }}
                onValueChange={field.onChange}
              >
                <FormControl className='text-[14px]'>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecciona un tipo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(OfferingExpenseSearchTypeNames).map(([key, value]) => (
                    <SelectItem className='text-[14px]' key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className='text-[13px]' />
            </FormItem>
          )}
        />

        {/* Search Sub Type */}
        {showSubType && (
          <FormField
            control={form.control}
            name='searchSubType'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[14px] font-bold'>Sub-tipo</FormLabel>
                <FormDescription className='text-[12px] pb-1'>
                  ¿Que sub tipo de busqueda deseas hacer?
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  onOpenChange={() => {
                    form.resetField('dateTerm', { keepError: true });
                  }}
                >
                  <FormControl className='text-[14px]'>
                    <SelectTrigger>
                      {field.value ? (
                        <SelectValue placeholder='Selecciona un sub-tipo' />
                      ) : (
                        'Elige un sub-tipo'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(getSubTypeOptions()).map(([key, value]) => (
                      <SelectItem className='text-[14px]' key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='text-[13px]' />
              </FormItem>
            )}
          />
        )}

        {/* Date Term */}
        {showDateTerm && (
          <FormField
            control={form.control}
            name='dateTerm'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[14px] font-bold'>Fecha</FormLabel>
                <FormDescription className='text-[12px] pb-1'>
                  Buscar por fecha o rango de fechas.
                </FormDescription>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl className='text-[14px]'>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full text-left font-normal justify-center p-4 text-[14px]',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-[0.1rem] h-4 w-4' />
                        {field?.value?.from ? (
                          field?.value.to ? (
                            <>
                              {format(field?.value.from, 'LLL dd, y', { locale: es })}
                              {' - '}
                              {format(field?.value.to, 'LLL dd, y', { locale: es })}
                            </>
                          ) : (
                            format(field?.value.from, 'LLL dd, y', { locale: es })
                          )
                        ) : (
                          <span className='text-[14px]'>Elige una fecha</span>
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
                      numberOfMonths={isDesktop ? 2 : 1}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className='text-[13px]' />
              </FormItem>
            )}
          />
        )}

        {/* Select Term (Record Status) */}
        {showSelectTerm && (
          <FormField
            control={form.control}
            name='selectTerm'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[14px] font-bold'>Estado de registro</FormLabel>
                <FormDescription className='text-[12px] pb-1'>
                  Selecciona una opcion de busqueda.
                </FormDescription>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl className='text-[14px]'>
                    <SelectTrigger>
                      {field.value ? (
                        <SelectValue className='text-[14px]' placeholder='Elige una opcion' />
                      ) : (
                        'Elige una opcion'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(SubTypeSearchOfferingExpenseByRecordStatusNames).map(([key, value]) => (
                      <SelectItem className='text-[14px]' key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='text-[13px]' />
              </FormItem>
            )}
          />
        )}

        {/* Limit & All */}
        <div className='flex gap-3 items-end md:col-span-1 lg:col-span-1 xl:col-span-1'>
          <FormField
            control={form.control}
            name='limit'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel className='text-[14px] font-bold'>Limite</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={form.getValues('all')}
                    className='text-[14px]'
                    value={form.getValues('all') ? '-' : (field.value ?? '')}
                  />
                </FormControl>
                <FormMessage className='text-[13px]' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='all'
            render={({ field }) => (
              <FormItem className='flex items-center space-x-2 space-y-0 rounded-md border p-3 h-[2.5rem] mt-auto'>
                <FormControl>
                  <Checkbox
                    disabled={!form.getValues('limit') || !!form.formState.errors.limit}
                    checked={field?.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className='text-[14px] cursor-pointer'>Todos</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* Order */}
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

        {/* Church */}
        <FormField
          control={form.control}
          name='churchId'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-[14px] font-bold'>
                Iglesia
                <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                  Opcional
                </span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || churchesQuery?.data?.[0]?.id}
                value={field.value}
              >
                <FormControl className='text-[14px]'>
                  <SelectTrigger>
                    {field.value ? (
                      <SelectValue className='text-[14px]' placeholder='Elige una opcion' />
                    ) : (
                      'Elige una opcion'
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {churchesQuery?.data?.map((church) => (
                    <SelectItem className='text-[14px]' key={church.id} value={church.id}>
                      {church.abbreviatedChurchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className='text-[13px]' />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className='flex justify-start mt-2'>
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
