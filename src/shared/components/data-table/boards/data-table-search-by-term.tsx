/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { type z } from 'zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { zodResolver } from '@hookform/resolvers/zod';

import { es } from 'date-fns/locale';
import { format } from 'date-fns';

import { cn } from '@/shared/lib/utils';

import {
  type ColumnDef,
  flexRender,
  type SortingState,
  getPaginationRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { UserRoles, UserRoleNames } from '@/app/user/enums';

import { formSearchByTermSchema } from '@/shared/validations';
import { type FormSearchByTerm } from '@/shared/interfaces';
import { Calendar } from '@/shared/components/ui/calendar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from '@/shared/components/ui/select';

import {
  validateTypesAllowedByModule,
  validateSubTypesAllowedByModule,
  validateTermSelectByTypeAndSubtype,
} from '@/shared/helpers';
import {
  TypesSearch,
  TypesSearchNames,
  SubTypesSearchNames,
  SearchSelectionOptionsNames,
  SubTypesSearch,
  RecordOrder,
  RecordOrderNames,
} from '@/shared/enums';

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: TData[];
}
// NOTE : del componente padre que llama a este, hacer el fetch y mandar el ID, y el onDelete
// NOTE : para que actualize la lista, (pero tmb ver la manera de transformar el id a serial)

export function DataTableSearchByTerm<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>): JSX.Element {
  //* States
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const [dataForm, setDataForm] = useState<FormSearchByTerm>();

  const [rowSelection, setRowSelection] = useState({});

  const [isFiltersDisabled, setIsFiltersDisabled] = useState<boolean>(true);

  //* Library hooks
  const { pathname } = useLocation();

  //* Forms
  const form = useForm<z.infer<typeof formSearchByTermSchema>>({
    resolver: zodResolver(formSearchByTermSchema),
    mode: 'onChange',
    defaultValues: {
      limit: '10',
      termInput: '',
      termNames: '',
      termLastNames: '',
      termSelect: '',
      termDate: undefined,
      subType: '',
      all: false,
      order: RecordOrder.Ascending,
    },
  });

  //* Form handler
  function onSubmit(values: z.infer<typeof formSearchByTermSchema>): void {
    setIsFiltersDisabled(false);
    setDataForm(values);
    form.reset();
    console.log({ values });
  }

  //* Watchers
  const type = form.watch('type');
  const subType = form.watch('subType');
  const limit = form.watch('limit');
  const order = form.watch('order');

  //* Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  //* Effects
  useEffect(() => {
    if (form.getValues('all')) {
      form.setValue('limit', '10');
    }
  }, [form.getValues('all')]);

  useEffect(() => {
    if (limit !== '' && order !== '') {
      setIsDisabledSubmitButton(false);
    }

    if (limit === '' || order === '') {
      setIsDisabledSubmitButton(true);
    }
  }, [limit, order]);

  //* Functions
  const formatDate = (dateString: Date): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  //* Helpers
  const disabledTypes = validateTypesAllowedByModule(pathname);
  const disabledSubTypes = validateSubTypesAllowedByModule(pathname, type);
  const disabledTermSelect = validateTermSelectByTypeAndSubtype(type, subType);

  return (
    <div className='md:w-full m-auto lg:w-full pt-3'>
      {isFiltersDisabled && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid grid-cols-1 gap-4 gap-y-4 items-end mb-16 md:mb-12 md:grid-cols-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 w-auto'
          >
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] font-bold'>Tipo</FormLabel>
                    <FormDescription className='text-[14px]'>
                      ¿Qué tipo de búsqueda desea hacer?
                    </FormDescription>
                    <Select
                      onOpenChange={() => {
                        form.resetField('subType', {
                          keepError: true,
                        });
                        form.resetField('termNames', {
                          keepError: true,
                        });
                        form.resetField('termLastNames', {
                          keepError: true,
                        });
                        form.resetField('termDate', {
                          keepError: true,
                        });
                        form.resetField('termSelect', {
                          keepError: true,
                        });
                        form.resetField('termInput', {
                          keepError: true,
                        });
                      }}
                      onValueChange={field.onChange}
                    >
                      <FormControl className='text-[13px] md:text-[14px]'>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecciona un tipo' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(TypesSearchNames).map(([key, value]) => (
                          <SelectItem
                            className={`text-[13px] md:text-[14px] ${disabledTypes?.disabledTypes?.includes(value) ? 'hidden' : ''}`}
                            key={key}
                            value={key}
                          >
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {(type === TypesSearch.FirstName ||
              type === TypesSearch.LastName ||
              type === TypesSearch.FullName ||
              type === TypesSearch.Tithe ||
              type === TypesSearch.SundayWorship ||
              type === TypesSearch.FamilyHouse ||
              type === TypesSearch.ZonalFasting ||
              type === TypesSearch.GeneralFasting ||
              type === TypesSearch.ZonalVigil ||
              type === TypesSearch.GeneralVigil ||
              type === TypesSearch.SundaySchool ||
              type === TypesSearch.YouthWorship ||
              type === TypesSearch.Activities ||
              type === TypesSearch.ChurchGround ||
              type === TypesSearch.Special ||
              type === TypesSearch.OperationalExpenses ||
              type === TypesSearch.MaintenanceAndRepairExpenses ||
              type === TypesSearch.DecorationExpenses ||
              type === TypesSearch.EquipmentAndTechnologyExpenses ||
              type === TypesSearch.SuppliesExpenses ||
              type === TypesSearch.ActivitiesAndEventsExpenses) && (
              <FormField
                control={form.control}
                name='subType'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>
                        Sub-tipo{' '}
                        {(pathname === '/offerings/expenses/search-by-term-offerings-expenses' ||
                          pathname === '/offerings/expenses/update-offering-expenses' ||
                          pathname === '/offerings/expenses/delete-offering-expenses') && (
                          <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[8.3px] font-semibold uppercase px-2 py-[2px] rounded-full mr-1'>
                            Opcional
                          </span>
                        )}
                      </FormLabel>
                      <FormDescription className='text-[14px]'>
                        ¿Qué sub tipo de búsqueda deseas hacer?
                      </FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        onOpenChange={() => {
                          form.resetField('termNames', {
                            defaultValue: '',
                          });
                          form.resetField('termLastNames', {
                            defaultValue: '',
                          });
                          form.resetField('termDate', {
                            keepError: true,
                          });
                          form.resetField('termSelect', {
                            keepError: true,
                          });
                          form.resetField('termInput', {
                            keepError: true,
                          });
                        }}
                      >
                        <FormControl className='text-[13px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona un sub-tipo' />
                            ) : (
                              'Elige un sub-tipo'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(SubTypesSearchNames).map(([key, value]) => (
                            <SelectItem
                              className={cn(
                                `text-[13px] md:text-[14px]`,
                                disabledSubTypes?.disabledSubTypes?.includes(key) && 'hidden'
                              )}
                              key={key}
                              value={key}
                            >
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            {((type !== TypesSearch.FirstName &&
              type !== TypesSearch.LastName &&
              type !== TypesSearch.FullName &&
              type !== TypesSearch.MonthBirth &&
              type !== TypesSearch.DateBirth &&
              type !== TypesSearch.Gender &&
              type !== TypesSearch.MaritalStatus &&
              type !== TypesSearch.Status &&
              type !== TypesSearch.Tithe &&
              type !== TypesSearch.SundayWorship &&
              type !== TypesSearch.FamilyHouse &&
              type !== TypesSearch.GeneralFasting &&
              type !== TypesSearch.ZonalFasting &&
              type !== TypesSearch.ZonalVigil &&
              type !== TypesSearch.GeneralVigil &&
              type !== TypesSearch.SundaySchool &&
              type !== TypesSearch.YouthWorship &&
              type !== TypesSearch.Activities &&
              type !== TypesSearch.ChurchGround &&
              type !== TypesSearch.Special &&
              type !== TypesSearch.Roles &&
              type !== TypesSearch.OperationalExpenses &&
              type !== TypesSearch.MaintenanceAndRepairExpenses &&
              type !== TypesSearch.DecorationExpenses &&
              type !== TypesSearch.EquipmentAndTechnologyExpenses &&
              type !== TypesSearch.SuppliesExpenses &&
              type !== TypesSearch.ActivitiesAndEventsExpenses &&
              type !== undefined) ||
              subType === SubTypesSearch.OfferingByZone ||
              subType === SubTypesSearch.OfferingByDateZone ||
              subType === SubTypesSearch.OfferingByCodeHouse ||
              subType === SubTypesSearch.OfferingByDateCodeHouse) && (
              <FormField
                control={form.control}
                name='termInput'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[14px] font-bold'>Termino</FormLabel>
                    <FormDescription className='text-[14px]'>
                      Escribe aquí lo que deseas buscar.
                    </FormDescription>
                    <FormControl>
                      <Input
                        className='text-[13px] md:text-[14px]'
                        placeholder='Eje: C-2, Av.Central 123, Lima ....'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(type === TypesSearch.DateBirth ||
              type === TypesSearch.OperationalExpenses ||
              type === TypesSearch.MaintenanceAndRepairExpenses ||
              type === TypesSearch.DecorationExpenses ||
              type === TypesSearch.EquipmentAndTechnologyExpenses ||
              type === TypesSearch.SuppliesExpenses ||
              type === TypesSearch.ActivitiesAndEventsExpenses ||
              subType === SubTypesSearch.TitheByDate ||
              subType === SubTypesSearch.TitheByDateNames ||
              subType === SubTypesSearch.TitheByDateLastNames ||
              subType === SubTypesSearch.TitheByDateFullName ||
              subType === SubTypesSearch.OfferingByDate ||
              subType === SubTypesSearch.OfferingByDateShift ||
              subType === SubTypesSearch.OfferingByDateZone ||
              subType === SubTypesSearch.OfferingByDateCodeHouse) && (
              <FormField
                control={form.control}
                name='termDate'
                render={({ field }) => (
                  <FormItem className=''>
                    <FormLabel className='text-[14px] font-bold'>Termino (fecha)</FormLabel>
                    <FormDescription className='text-[14px]'>
                      Buscar por fecha o rango de fechas
                    </FormDescription>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full text-left font-normal justify-center p-4 text-[13px] md:text-[14px]',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className='mr-[0.1rem] h-4 w-4' />
                            {field?.value?.from ? (
                              field?.value.to ? (
                                <>
                                  {format(field?.value.from, 'LLL dd, y', {
                                    locale: es,
                                  })}{' '}
                                  -{' '}
                                  {format(field?.value.to, 'LLL dd, y', {
                                    locale: es,
                                  })}
                                </>
                              ) : (
                                format(field?.value.from, 'LLL dd, y')
                              )
                            ) : (
                              <span className='text-[13px] md:text-[14px]'>Elige una fecha</span>
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

            {(type === TypesSearch.Gender ||
              type === TypesSearch.MaritalStatus ||
              type === TypesSearch.Status ||
              type === TypesSearch.MonthBirth ||
              subType === SubTypesSearch.OfferingByShift ||
              subType === SubTypesSearch.OfferingByDateShift) && (
              <FormField
                control={form.control}
                name='termSelect'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>Termino</FormLabel>
                      <FormDescription className='text-[14px]'>
                        Selecciona una opción de búsqueda.
                      </FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl className='text-[13px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue
                                className='text-[13px] md:text-[14px]'
                                placeholder='Elige una opción'
                              />
                            ) : (
                              'Elige una opción'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(SearchSelectionOptionsNames).map(([key, value]) => (
                            <SelectItem
                              className={`text-[13px] md:text-[14px] ${disabledTermSelect?.disabledTermSelect?.includes(value) ? 'hidden' : ''}`}
                              key={key}
                              value={key}
                            >
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            {type === TypesSearch.Roles && (
              <FormField
                control={form.control}
                name='termMultiSelect'
                render={() => (
                  <FormItem>
                    <FormLabel className='text-[14px] font-bold'>Roles</FormLabel>
                    <FormDescription className='text-[14px]'>
                      Seleccione los roles que desea buscar
                    </FormDescription>
                    <div className='flex flex-wrap gap-y-1 justify-start sm:justify-around items-center'>
                      {Object.values(UserRoles).map((role) => (
                        <FormField
                          key={role}
                          control={form.control}
                          name='termMultiSelect'
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={role}
                                className='flex flex-row items-start space-x-3 space-y-0'
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(role)}
                                    onCheckedChange={(checked) => {
                                      let updatedRoles: UserRoles[] = [];
                                      checked
                                        ? (updatedRoles = field.value
                                            ? [...field.value, role]
                                            : [role])
                                        : (updatedRoles =
                                            field.value?.filter((value) => value !== role) ?? []);

                                      field.onChange(updatedRoles);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className='text-[13px] md:text-[14px] font-normal'>
                                  {UserRoleNames[role]}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {((subType && (type === TypesSearch.FirstName || type === TypesSearch.FullName)) ||
              subType === SubTypesSearch.TitheByNames ||
              subType === SubTypesSearch.TitheByFullName ||
              subType === SubTypesSearch.TitheByDateNames ||
              subType === SubTypesSearch.TitheByDateFullName ||
              subType === SubTypesSearch.OfferingByPreacherNames ||
              subType === SubTypesSearch.OfferingByPreacherFullName ||
              subType === SubTypesSearch.OfferingBySupervisorNames ||
              subType === SubTypesSearch.OfferingBySupervisorFullName ||
              subType === SubTypesSearch.OfferingByNames ||
              subType === SubTypesSearch.OfferingByFullName ||
              subType === SubTypesSearch.UserByNames ||
              subType === SubTypesSearch.UserByFullName) && (
              <FormField
                control={form.control}
                name='termNames'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[14px] font-bold'>Termino (nombres)</FormLabel>
                    <FormDescription className='text-[14px]'>
                      Escribe los nombres que deseas buscar.
                    </FormDescription>
                    <FormControl>
                      <Input
                        className='text-[13px] md:text-[14px]'
                        placeholder='Eje: Rolando Martin...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {((subType && (type === TypesSearch.LastName || type === TypesSearch.FullName)) ||
              subType === SubTypesSearch.TitheByLastNames ||
              subType === SubTypesSearch.TitheByFullName ||
              subType === SubTypesSearch.TitheByDateLastNames ||
              subType === SubTypesSearch.TitheByDateFullName ||
              subType === SubTypesSearch.OfferingByPreacherLastNames ||
              subType === SubTypesSearch.OfferingByPreacherFullName ||
              subType === SubTypesSearch.OfferingBySupervisorLastNames ||
              subType === SubTypesSearch.OfferingBySupervisorFullName ||
              subType === SubTypesSearch.OfferingByLastNames ||
              subType === SubTypesSearch.OfferingByFullName) && (
              <FormField
                control={form.control}
                name='termLastNames'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[14px] font-bold'>Termino (apellidos)</FormLabel>
                    <FormDescription className='text-[14px]'>
                      Escribe los apellidos que deseas buscar.
                    </FormDescription>
                    <FormControl>
                      <Input
                        className='text-[13px] md:text-[14px]'
                        placeholder='Eje: Sanchez Torres...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className='grid grid-cols-2 items-end justify-evenly'>
              <div className='flex flex-col gap-2 col-start-1 col-end-3 pb-2'>
                <FormField
                  control={form.control}
                  name='limit'
                  render={() => (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>Limite</FormLabel>
                      <FormDescription className='text-[14px]'>
                        ¿Cuantos registros necesitas?
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex col-start-1 col-end-3 gap-2 md:gap-6 lg:gap-4 md:justify-start'>
                <FormField
                  control={form.control}
                  name='limit'
                  render={({ field }) => (
                    <FormItem className='2xl:w-[20rem]'>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={form.getValues('all')}
                          className='text-[13px] md:text-[14px]'
                          value={form.getValues('all') ? '-' : field.value || ''}
                          placeholder='Limite de registros'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='all'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-end space-x-3 space-y-0 rounded-md border p-3 h-[2.5rem] w-[8rem] justify-center'>
                      <FormControl>
                        <Checkbox
                          disabled={!form.getValues('limit') || !!form.formState.errors.limit} // transform to boolean
                          checked={field?.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          className={
                            form.getValues('limit') && !form.formState.errors.limit
                              ? ''
                              : 'bg-slate-500'
                          }
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel className='text-[13px] md:text-[14px]'>Todos</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div
                className={cn(
                  'flex flex-col gap-2 col-start-1 col-end-3',
                  form.formState.errors.limit && 'mt-2'
                )}
              >
                <FormField
                  control={form.control}
                  name='limit'
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name='order'
              render={({ field }) => (
                <FormItem className='w-full col-start-auto col-end-auto lg:col-start-auto lg:col-end-auto'>
                  <FormLabel className='text-[14px] font-bold'>Orden</FormLabel>
                  <FormDescription className='text-[14px]'>
                    Elige el tipo de orden de los registros
                  </FormDescription>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl className='text-[14px]'>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue
                            className='text-[13px] md:text-[14px]'
                            placeholder='Selecciona un tipo de orden'
                          />
                        ) : (
                          'Selecciona un tipo de orden'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(RecordOrderNames).map(([key, value]) => (
                        <SelectItem className={`text-[13px] md:text-[14px]`} key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isDisabledSubmitButton}
              type='submit'
              variant='ghost'
              className='mx-auto mt-14 lg:mt-4 xl:mt-0 md:mt-0 md:col-start-2 md:col-end-3 lg:col-start-2 lg:col-end-3 lg:row-start-auto lg:row-end-auto xl:row-start-auto xl:row-end-auto xl:col-start-auto xl:col-end-auto w-[8rem] text-[13px] lg:text-[14px] h-[2.5rem] md:w-[15rem] lg:w-full xl:w-full xl:-ml-0 2xl:w-full 2xl:mx-auto px-4 py-2 border-1 text-green-950 border-green-500 bg-green-500  hover:bg-green-400 dark:bg-green-500 dark:hover:bg-green-400 hover:text-white'
            >
              Buscar
            </Button>
          </form>
        </Form>
      )}

      {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}

      {/* Input Filters and search results */}

      {/* Members */}

      {!isFiltersDisabled &&
        (pathname === '/disciples/search-by-term-disciples' ||
          pathname === '/disciples/update-disciple' ||
          pathname === '/disciples/delete-disciple' ||
          pathname === '/pastors/search-by-term-pastors' ||
          pathname === '/pastors/update-pastor' ||
          pathname === '/pastors/delete-pastor' ||
          pathname === '/copastors/search-by-term-copastors' ||
          pathname === '/copastors/update-copastor' ||
          pathname === '/copastors/delete-copastor' ||
          pathname === '/leaders/search-by-term-leaders' ||
          pathname === '/leaders/update-leader' ||
          pathname === '/leaders/delete-leader') && (
          <div>
            {/* Search Types */}
            <div>
              <span className='dark:text-offering-color text-search-color font-bold text-[14px] md:text-[15.5px]'>
                Tipo de búsqueda:
              </span>{' '}
              <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                {`${
                  Object.entries(TypesSearchNames).find(
                    ([key, value]) => key === dataForm?.type && value
                  )?.[1]
                }`}
              </span>
              {(dataForm?.type === TypesSearch.FirstName ||
                dataForm?.type === TypesSearch.LastName ||
                dataForm?.type === TypesSearch.FullName) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {' '}
                  -{' '}
                  {`${
                    Object.entries(SubTypesSearchNames).find(
                      ([key, value]) => key === dataForm?.subType && value
                    )?.[1]
                  }`}
                </span>
              )}
            </div>

            {/* Search Terms */}
            {(dataForm?.type === TypesSearch.FirstName ||
              dataForm?.type === TypesSearch.LastName ||
              dataForm?.type === TypesSearch.FullName ||
              dataForm?.type === TypesSearch.DateBirth ||
              dataForm?.type === TypesSearch.Zone ||
              dataForm?.type === TypesSearch.OriginCountry ||
              dataForm?.type === TypesSearch.CodeHouse ||
              dataForm?.type === TypesSearch.NameHouse ||
              dataForm?.type === TypesSearch.Address ||
              dataForm?.type === TypesSearch.Department ||
              dataForm?.type === TypesSearch.Province ||
              dataForm?.type === TypesSearch.District ||
              dataForm?.type === TypesSearch.MonthBirth ||
              dataForm?.type === TypesSearch.Gender ||
              dataForm?.type === TypesSearch.MaritalStatus ||
              dataForm?.type === TypesSearch.Status) && (
              <div>
                <span className='text-indigo-500 font-bold text-[14px] md:text-[15.5px]'>
                  Termino de búsqueda:
                </span>{' '}
                {(dataForm?.type === TypesSearch.Zone ||
                  dataForm?.type === TypesSearch.OriginCountry ||
                  dataForm?.type === TypesSearch.CodeHouse ||
                  dataForm?.type === TypesSearch.NameHouse ||
                  dataForm?.type === TypesSearch.Address ||
                  dataForm?.type === TypesSearch.Department ||
                  dataForm?.type === TypesSearch.Province ||
                  dataForm?.type === TypesSearch.District) && (
                  <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                    {`${dataForm?.termInput}`}
                  </span>
                )}
                {dataForm?.type === TypesSearch.FirstName && (
                  <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                    {`${dataForm?.termNames}`}
                  </span>
                )}
                {dataForm?.type === TypesSearch.LastName && (
                  <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                    {`${dataForm?.termLastNames}`}
                  </span>
                )}
                {dataForm?.type === TypesSearch.FullName && (
                  <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                    {`${dataForm?.termNames} - ${dataForm?.termLastNames} `}
                  </span>
                )}
                {dataForm?.type === TypesSearch.DateBirth && (
                  <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                    {`${dataForm?.termDate?.from ? formatDate(dataForm?.termDate?.from) : ''} ${dataForm?.termDate?.to ? ` - ${formatDate(dataForm?.termDate?.to)}` : ''}`}
                  </span>
                )}
                {(dataForm?.type === TypesSearch.MonthBirth ||
                  dataForm?.type === TypesSearch.Gender ||
                  dataForm?.type === TypesSearch.MaritalStatus ||
                  dataForm?.type === TypesSearch.Status) && (
                  <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                    {`${
                      Object.entries(SearchSelectionOptionsNames).find(
                        ([key, value]) => key === dataForm?.termSelect && value
                      )?.[1]
                    }`}
                  </span>
                )}
              </div>
            )}

            {/* Input Filters */}
            <div className='pb-8 lg:pb-8 grid grid-cols-2 gap-3 lg:flex lg:items-center py-4 lg:gap-6'>
              <Input
                placeholder='Filtro por nombres...'
                value={(table.getColumn('first_name')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('first_name')?.setFilterValue(event.target.value)
                }
                className='text-[13px] lg:text-[14px] w-full col-start-1 col-end-2 row-start-1 row-end-2'
                disabled={isFiltersDisabled}
              />
              <Input
                placeholder='Filtro por apellidos...'
                value={(table.getColumn('last_name')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('last_name')?.setFilterValue(event.target.value)
                }
                className='col-start-2 col-end-3 row-start-1 row-end-2 text-[13px] lg:text-[14px] w-full'
                disabled={isFiltersDisabled}
              />
              <Button
                variant='ghost'
                className='col-start-2 col-end-3 row-start-2 row-end-3 w-full m-auto text-[13px] lg:text-[14px] h-full md:w-[15rem] lg:w-[8rem] px-4 py-2 border-1 text-red-950 border-red-500 bg-red-500 hover:bg-red-500 hover:text-white'
                onClick={() => {
                  table.getColumn('first_name')?.setFilterValue('');
                  table.getColumn('last_name')?.setFilterValue('');
                }}
              >
                Borrar
              </Button>
              <Button
                variant='ghost'
                className='col-start-1 col-end-2 row-start-2 row-end-3 w-full m-auto text-[13px] lg:text-[14px] h-full md:w-[15rem] lg:w-auto px-4 py-2 border-1 text-green-950 border-green-500 bg-green-500 hover:bg-green-500 hover:text-white'
                onClick={() => {
                  setIsFiltersDisabled(true);
                  table.getColumn('first_name')?.setFilterValue('');
                  table.getColumn('last_name')?.setFilterValue('');
                }}
              >
                Nueva Búsqueda
              </Button>
            </div>
          </div>
        )}

      {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}

      {/* Family House */}

      {!isFiltersDisabled &&
        (pathname === '/family-houses/search-by-term-family-houses' ||
          pathname === '/family-houses/update-family-house' ||
          pathname === '/family-houses/delete-family-house') && (
          <div>
            {/* Search Types */}
            <div>
              <span className='dark:text-offering-color text-search-color font-bold text-[14px] md:text-[15.5px]'>
                Tipo de búsqueda:
              </span>{' '}
              <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                {`${
                  Object.entries(TypesSearchNames).find(
                    ([key, value]) => key === dataForm?.type && value
                  )?.[1]
                }`}
              </span>
              {(dataForm?.type === TypesSearch.FirstName ||
                dataForm?.type === TypesSearch.LastName ||
                dataForm?.type === TypesSearch.FullName) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {' '}
                  -{' '}
                  {`${
                    Object.entries(SubTypesSearchNames).find(
                      ([key, value]) => key === dataForm?.subType && value
                    )?.[1]
                  }`}
                </span>
              )}
            </div>

            {/* Search Terms */}
            <div>
              <span className='text-indigo-500 font-bold text-[14px] md:text-[15.5px]'>
                Termino de búsqueda:
              </span>{' '}
              {(dataForm?.type === TypesSearch.Zone ||
                dataForm?.type === TypesSearch.CodeHouse ||
                dataForm?.type === TypesSearch.NameHouse ||
                dataForm?.type === TypesSearch.Address ||
                dataForm?.type === TypesSearch.Department ||
                dataForm?.type === TypesSearch.Province ||
                dataForm?.type === TypesSearch.District) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {`${dataForm?.termInput}`}
                </span>
              )}
              {dataForm?.type === TypesSearch.FirstName && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {`${dataForm?.termNames}`}
                </span>
              )}
              {dataForm?.type === TypesSearch.LastName && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {`${dataForm?.termLastNames}`}
                </span>
              )}
              {dataForm?.type === TypesSearch.FullName && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {`${dataForm?.termNames} - ${dataForm?.termLastNames} `}
                </span>
              )}
              {dataForm?.type === TypesSearch.Status && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {`${
                    Object.entries(SearchSelectionOptionsNames).find(
                      ([key, value]) => key === dataForm?.termSelect && value
                    )?.[1]
                  }`}
                </span>
              )}
            </div>

            {/* Inputs Filters */}
            <div className='pb-8 lg:pb-8 grid grid-cols-2 gap-3 lg:flex lg:items-center lg:py-4 lg:gap-6'>
              <Input
                placeholder='Filtro por nombre de casa...'
                value={(table.getColumn('name_house')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('name_house')?.setFilterValue(event.target.value)
                }
                className='text-[13px] lg:text-[14px] w-full col-start-1 col-end-2 row-start-1 row-end-2'
                disabled={isFiltersDisabled}
              />
              <Input
                placeholder='Filtro por código de casa...'
                value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn('code')?.setFilterValue(event.target.value)}
                className='col-start-2 col-end-3 row-start-1 row-end-2 text-[13px] lg:text-[14px] w-full'
                disabled={isFiltersDisabled}
              />
              <Button
                variant='ghost'
                className='col-start-2 col-end-3 row-start-2 row-end-3 w-full m-auto text-[13px] lg:text-[14px] h-full md:w-[15rem] lg:w-[8rem] px-4 py-2 border-1 bg-red-500 text-red-950 border-red-500 hover:bg-red-500 hover:text-white'
                onClick={() => {
                  table.getColumn('name_house')?.setFilterValue('');
                  table.getColumn('code')?.setFilterValue('');
                }}
              >
                Borrar
              </Button>
              <Button
                variant='ghost'
                className='col-start-1 col-end-2 row-start-2 row-end-3 w-full m-auto text-[13px] lg:text-[14px] h-full md:w-[15rem] lg:w-auto px-4 py-2 border-1 text-green-950 border-green-500 bg-green-500 hover:bg-green-500 hover:text-white'
                onClick={() => {
                  setIsFiltersDisabled(true);
                  table.getColumn('name_house')?.setFilterValue('');
                  table.getColumn('code')?.setFilterValue('');
                }}
              >
                Nueva Búsqueda
              </Button>
            </div>
          </div>
        )}
      {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}

      {/* Offerings Income */}

      {!isFiltersDisabled &&
        (pathname === '/offerings/income/search-by-term-offerings-income' ||
          pathname === '/offerings/income/update-offering-income' ||
          pathname === '/offerings/income/delete-offering-income') && (
          <div>
            {/* Search Types */}
            <div>
              <span className='dark:text-offering-color text-search-color font-bold text-[14px] md:text-[15.5px]'>
                Tipo de búsqueda:
              </span>{' '}
              <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                {`${
                  Object.entries(TypesSearchNames).find(
                    ([key, value]) => key === dataForm?.type && value
                  )?.[1]
                }`}
              </span>
              {(dataForm?.type === TypesSearch.Tithe ||
                dataForm?.type === TypesSearch.SundayWorship ||
                dataForm?.type === TypesSearch.FamilyHouse ||
                dataForm?.type === TypesSearch.GeneralFasting ||
                dataForm?.type === TypesSearch.GeneralVigil ||
                dataForm?.type === TypesSearch.ZonalFasting ||
                dataForm?.type === TypesSearch.ZonalVigil ||
                dataForm?.type === TypesSearch.SundaySchool ||
                dataForm?.type === TypesSearch.YouthWorship ||
                dataForm?.type === TypesSearch.Activities ||
                dataForm?.type === TypesSearch.ChurchGround ||
                dataForm?.type === TypesSearch.Special) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {' '}
                  -{' '}
                  {`${
                    Object.entries(SubTypesSearchNames).find(
                      ([key, value]) => key === dataForm?.subType && value
                    )?.[1]
                  }`}
                </span>
              )}
            </div>

            {/* Search Terms */}
            <div>
              <span className='text-indigo-500 font-bold text-[14px] md:text-[15.5px]'>
                Termino de búsqueda:
              </span>{' '}
              {(dataForm?.subType === SubTypesSearch.OfferingByZone ||
                dataForm?.subType === SubTypesSearch.OfferingByDateZone ||
                dataForm?.subType === SubTypesSearch.OfferingByDateCodeHouse ||
                dataForm?.subType === SubTypesSearch.OfferingByCodeHouse) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {`${dataForm?.termInput}`} -{' '}
                </span>
              )}
              {(dataForm?.subType === SubTypesSearch.OfferingByPreacherNames ||
                dataForm?.subType === SubTypesSearch.OfferingBySupervisorNames ||
                dataForm?.subType === SubTypesSearch.OfferingByNames) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {`${dataForm?.termNames}`}
                </span>
              )}
              {(dataForm?.subType === SubTypesSearch.OfferingByPreacherLastNames ||
                dataForm?.subType === SubTypesSearch.OfferingBySupervisorLastNames ||
                dataForm?.subType === SubTypesSearch.OfferingByLastNames) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {`${dataForm?.termLastNames}`}
                </span>
              )}
              {(dataForm?.subType === SubTypesSearch.OfferingByPreacherFullName ||
                dataForm?.subType === SubTypesSearch.OfferingBySupervisorFullName ||
                dataForm?.subType === SubTypesSearch.OfferingByFullName) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {`${dataForm?.termNames} - ${dataForm?.termLastNames} `}
                </span>
              )}
              {(dataForm?.subType === SubTypesSearch.OfferingByDate ||
                dataForm?.subType === SubTypesSearch.OfferingByDateShift ||
                dataForm?.subType === SubTypesSearch.OfferingByDateZone ||
                dataForm?.subType === SubTypesSearch.OfferingByDateCodeHouse) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {`${dataForm?.termDate?.from ? formatDate(dataForm?.termDate?.from) : ''} ${dataForm?.termDate?.to ? ` - ${formatDate(dataForm?.termDate?.to)}` : ''}`}
                </span>
              )}
              {dataForm?.type === TypesSearch.Status && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {`${
                    Object.entries(SearchSelectionOptionsNames).find(
                      ([key, value]) => key === dataForm?.termSelect && value
                    )?.[1]
                  }`}
                </span>
              )}
              {(dataForm?.subType === SubTypesSearch.OfferingByShift ||
                dataForm?.subType === SubTypesSearch.OfferingByDateShift) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {' '}
                  -{' '}
                  {`${
                    Object.entries(SearchSelectionOptionsNames).find(
                      ([key, value]) => key === dataForm?.termSelect && value
                    )?.[1]
                  }`}
                </span>
              )}
            </div>

            {/* Inputs Filters */}

            <div className='pb-8 lg:pb-8 grid grid-cols-2 gap-3 lg:flex lg:items-center lg:py-4 lg:gap-6'>
              <Input
                placeholder='Filtro por tipo...'
                value={(table.getColumn('type')?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn('type')?.setFilterValue(event.target.value)}
                className='text-[13px] lg:text-[14px] w-full col-start-1 col-end-2 row-start-1 row-end-2'
                disabled={isFiltersDisabled}
              />
              <Input
                placeholder='Filtro por sub-tipo...'
                value={(table.getColumn('sub_type')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('sub_type')?.setFilterValue(event.target.value)
                }
                className='col-start-2 col-end-3 row-start-1 row-end-2 text-[13px] lg:text-[14px] w-full'
                disabled={isFiltersDisabled}
              />
              <Button
                variant='ghost'
                className='col-start-2 col-end-3 row-start-2 row-end-3 w-full m-auto text-[13px] lg:text-[14px] h-full md:w-[15rem] lg:w-[8rem] px-4 py-2 border-1 bg-red-500 text-red-950 border-red-500 hover:bg-red-500 hover:text-white'
                onClick={() => {
                  table.getColumn('type')?.setFilterValue('');
                  table.getColumn('sub_type')?.setFilterValue('');
                }}
              >
                Borrar
              </Button>
              <Button
                variant='ghost'
                className='col-start-1 col-end-2 row-start-2 row-end-3 w-full m-auto text-[13px] lg:text-[14px] h-full md:w-[15rem] lg:w-auto px-4 py-2 border-1 text-green-950 border-green-500 bg-green-500 hover:bg-green-500 hover:text-white'
                onClick={() => {
                  setIsFiltersDisabled(true);
                  table.getColumn('type')?.setFilterValue('');
                  table.getColumn('sub_type')?.setFilterValue('');
                }}
              >
                Nueva Búsqueda
              </Button>
            </div>
          </div>
        )}
      {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}

      {/* Offerings Expenses */}

      {!isFiltersDisabled &&
        (pathname === '/offerings/expenses/search-by-term-offerings-expenses' ||
          pathname === '/offerings/expenses/update-offering-expenses' ||
          pathname === '/offerings/expenses/delete-offering-expenses') && (
          <div>
            {/* Search Types */}
            <div>
              <span className='dark:text-offering-color text-search-color font-bold text-[14px] md:text-[15.5px]'>
                Tipo de búsqueda:
              </span>{' '}
              <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                {`${
                  Object.entries(TypesSearchNames).find(
                    ([key, value]) => key === dataForm?.type && value
                  )?.[1]
                }`}
              </span>
              {(dataForm?.type === TypesSearch.OperationalExpenses ||
                dataForm?.type === TypesSearch.MaintenanceAndRepairExpenses ||
                dataForm?.type === TypesSearch.DecorationExpenses ||
                dataForm?.type === TypesSearch.EquipmentAndTechnologyExpenses ||
                dataForm?.type === TypesSearch.SuppliesExpenses ||
                dataForm?.type === TypesSearch.ActivitiesAndEventsExpenses) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {' '}
                  -{' '}
                  {`${
                    dataForm?.subType
                      ? Object.entries(SubTypesSearchNames).find(
                          ([key, value]) => key === dataForm?.subType && value
                        )?.[1]
                      : `Todos los sub-tipos`
                  }`}
                </span>
              )}
            </div>

            {/* Search Terms */}
            <div>
              <span className='text-indigo-500 font-bold text-[14px] md:text-[15.5px]'>
                Termino de búsqueda:
              </span>{' '}
              <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                {`${dataForm?.termDate?.from ? formatDate(dataForm?.termDate?.from) : ''} ${dataForm?.termDate?.to ? ` - ${formatDate(dataForm?.termDate?.to)}` : ''}`}
              </span>
            </div>

            {/* Inputs Filters */}

            <div className='pb-8 lg:pb-8 grid grid-cols-2 gap-3 lg:flex lg:items-center lg:py-4 lg:gap-6'>
              <Input
                placeholder='Filtro por tipo...'
                value={(table.getColumn('type')?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn('type')?.setFilterValue(event.target.value)}
                className='text-[13px] lg:text-[14px] w-full col-start-1 col-end-2 row-start-1 row-end-2'
                disabled={isFiltersDisabled}
              />
              <Input
                placeholder='Filtro por sub-tipo...'
                value={(table.getColumn('sub_type')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('sub_type')?.setFilterValue(event.target.value)
                }
                className='col-start-2 col-end-3 row-start-1 row-end-2 text-[13px] lg:text-[14px] w-full'
                disabled={isFiltersDisabled}
              />
              <Button
                variant='ghost'
                className='col-start-2 col-end-3 row-start-2 row-end-3 w-full m-auto text-[13px] lg:text-[14px] h-full md:w-[15rem] lg:w-[8rem] px-4 py-2 border-1 bg-red-500 text-red-950 border-red-500 hover:bg-red-500 hover:text-white'
                onClick={() => {
                  table.getColumn('type')?.setFilterValue('');
                  table.getColumn('sub_type')?.setFilterValue('');
                }}
              >
                Borrar
              </Button>
              <Button
                variant='ghost'
                className='col-start-1 col-end-2 row-start-2 row-end-3 w-full m-auto text-[13px] lg:text-[14px] h-full md:w-[15rem] lg:w-auto px-4 py-2 border-1 text-green-950 border-green-500 bg-green-500 hover:bg-green-500 hover:text-white'
                onClick={() => {
                  setIsFiltersDisabled(true);
                  table.getColumn('type')?.setFilterValue('');
                  table.getColumn('sub_type')?.setFilterValue('');
                }}
              >
                Nueva Búsqueda
              </Button>
            </div>
          </div>
        )}
      {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}

      {/* Users */}

      {!isFiltersDisabled &&
        (pathname === '/users/search-by-term-users' ||
          pathname === '/users/update-user' ||
          pathname === '/users/delete-user') && (
          <div>
            {/* Search Types */}
            <div>
              <span className='dark:text-offering-color text-search-color font-bold text-[14px] md:text-[15.5px]'>
                Tipo de búsqueda:
              </span>{' '}
              <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                {`${
                  Object.entries(TypesSearchNames).find(
                    ([key, value]) => key === dataForm?.type && value
                  )?.[1]
                }`}
              </span>
              {(dataForm?.type === TypesSearch.FirstName ||
                dataForm?.type === TypesSearch.LastName ||
                dataForm?.type === TypesSearch.FullName) && (
                <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                  {' '}
                  -{' '}
                  {`${
                    Object.entries(SubTypesSearchNames).find(
                      ([key, value]) => key === dataForm?.subType && value
                    )?.[1]
                  }`}
                </span>
              )}
            </div>

            {/* Search Terms */}
            {(dataForm?.type === TypesSearch.FirstName ||
              dataForm?.type === TypesSearch.LastName ||
              dataForm?.type === TypesSearch.FullName ||
              dataForm?.type === TypesSearch.Roles ||
              dataForm?.type === TypesSearch.Status) && (
              <div>
                <span className='text-indigo-500 font-bold text-[14px] md:text-[15.5px]'>
                  Termino de búsqueda:
                </span>{' '}
                {dataForm?.type === TypesSearch.FirstName && (
                  <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                    {`${dataForm?.termNames}`}
                  </span>
                )}
                {dataForm?.type === TypesSearch.LastName && (
                  <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                    {`${dataForm?.termLastNames}`}
                  </span>
                )}
                {dataForm?.type === TypesSearch.FullName && (
                  <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                    {`${dataForm?.termNames} - ${dataForm?.termLastNames} `}
                  </span>
                )}
                {dataForm?.type === TypesSearch.Roles && (
                  <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                    {`${Object.entries(UserRoleNames)
                      .map(([key, value]) => {
                        return dataForm?.termMultiSelect?.includes(key as UserRoles) ? value : null;
                      })
                      .filter((value) => value !== null)
                      .join(', ')}`}
                  </span>
                )}
                {dataForm?.type === TypesSearch.Status && (
                  <span className='font-medium text-[13px] md:text-[14.5px] italic'>
                    {`${
                      Object.entries(SearchSelectionOptionsNames).find(
                        ([key, value]) => key === dataForm?.termSelect && value
                      )?.[1]
                    }`}
                  </span>
                )}
              </div>
            )}
            <div className='pb-8 lg:pb-8 grid grid-cols-2 gap-3 lg:flex lg:items-center lg:py-4 lg:gap-6'>
              <Input
                placeholder='Filtro por correo electrónico...'
                value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
                className='text-[13px] lg:text-[14px] w-full col-start-1 col-end-2 row-start-1 row-end-2'
                disabled={isFiltersDisabled}
              />
              <Input
                placeholder='Filtro por roles de usuario...'
                value={(table.getColumn('roles')?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn('roles')?.setFilterValue(event.target.value)}
                className='col-start-2 col-end-3 row-start-1 row-end-2 text-[13px] lg:text-[14px] w-full'
                disabled={isFiltersDisabled}
              />
              <Button
                variant='ghost'
                className='col-start-2 col-end-3 row-start-2 row-end-3 w-full m-auto text-[13px] lg:text-[14px] h-full md:w-[15rem] lg:w-[8rem] px-4 py-2 border-1 bg-red-500 text-red-950 border-red-500 hover:bg-red-500 hover:text-white'
                onClick={() => {
                  table.getColumn('email')?.setFilterValue('');
                  table.getColumn('roles')?.setFilterValue('');
                }}
              >
                Borrar
              </Button>
              <Button
                variant='ghost'
                className='col-start-1 col-end-2 row-start-2 row-end-3 w-full m-auto text-[13px] lg:text-[14px] h-full md:w-[15rem] lg:w-auto px-4 py-2 border-1 text-green-950 border-green-500 bg-green-500 hover:bg-green-500 hover:text-white'
                onClick={() => {
                  setIsFiltersDisabled(true);
                  table.getColumn('email')?.setFilterValue('');
                  table.getColumn('roles')?.setFilterValue('');
                }}
              >
                Nueva Búsqueda
              </Button>
            </div>
          </div>
        )}

      {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}

      {/* render date table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className='text-center text-slate-700 dark:text-slate-200 font-bold text-[13px] lg:text-sm'
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {!isFiltersDisabled && (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className='text-center font-normal text-[13px] lg:text-[14px]'
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className='px-2 lg:px-4 py-2.5' key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    Sin resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          className='text-[13px] lg:text-sm'
          variant='outline'
          size='sm'
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          className='text-[13px] lg:text-sm'
          variant='outline'
          size='sm'
          onClick={() => {
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
