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
  OfferingIncomeSearchSubType,
  SubTypeNamesOfferingIncomeSearchByActivities,
  SubTypeNamesOfferingIncomeSearchByFamilyGroup,
  SubTypeNamesOfferingIncomeSearchByYoungService,
  SubTypeNamesOfferingIncomeSearchBySundaySchool,
  SubTypeNamesOfferingIncomeSearchBySundayService,
  SubTypeNamesOfferingIncomeSearchByUnitedService,
  SubTypeNamesOfferingIncomeSearchByIncomeAdjustment,
  SubTypeNamesOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelism,
  SubTypeNamesOfferingIncomeSearchByFastingAndVigilGeneralAndGeneralEvangelism,
  SubTypeNamesOfferingIncomeSearchByChurchGroundAndSpecial,
} from '@/modules/offering/income/enums/offering-income-search-sub-type.enum';
import {
  OfferingIncomeSearchType,
  OfferingIncomeSearchTypeNames,
} from '@/modules/offering/income/enums/offering-income-search-type.enum';
import {
  OfferingIncomeSearchNamesByShift,
  OfferingIncomeSearchNamesByMemberType,
  OfferingIncomeSearchNamesByRecordStatus,
} from '@/modules/offering/income/enums/offering-income-search-select-option.enum';

import { type OfferingIncomeSearchFormByTerm } from '@/modules/offering/income/interfaces/offering-income-search-form-by-term.interface';
import { offeringIncomeSearchByTermFormSchema } from '@/modules/offering/income/schemas/offering-income-search-by-term-form-schema';

import { cn } from '@/shared/lib/utils';
import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { firstNamesFormatter, lastNamesFormatter } from '@/shared/helpers/names-formatter.helper';
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
  onSearch: (params: OfferingIncomeSearchFormByTerm, formData: OfferingIncomeSearchFormByTerm) => void;
}

export const SearchByTermForm = ({ onSearch }: Props): JSX.Element => {
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<z.infer<typeof offeringIncomeSearchByTermFormSchema>>({
    resolver: zodResolver(offeringIncomeSearchByTermFormSchema),
    mode: 'onChange',
    defaultValues: {
      searchSubType: '' as any,
      limit: '10',
      inputTerm: '',
      firstNamesTerm: '',
      lastNamesTerm: '',
      selectTerm: '',
      dateTerm: undefined,
      all: false,
      order: RecordOrder.Descending,
    },
  });

  const { searchType, searchSubType, limit, order, all } = form.watch();

  const churchesQuery = useQuery({
    queryKey: ['churches-offering-income-search-term'],
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

  function onSubmit(formData: z.infer<typeof offeringIncomeSearchByTermFormSchema>): void {
    let newDateTermTo;
    if (!formData.dateTerm?.to) {
      newDateTermTo = formData.dateTerm?.from;
    }

    const newDateTerm = dateFormatterTermToTimestamp({
      from: formData.dateTerm?.from,
      to: formData.dateTerm?.to ? formData.dateTerm?.to : newDateTermTo,
    });

    const newNamesTerm = firstNamesFormatter(formData?.firstNamesTerm);
    const newLastNamesTerm = lastNamesFormatter(formData?.lastNamesTerm);

    const searchParams = {
      ...formData,
      firstNamesTerm: newNamesTerm,
      lastNamesTerm: newLastNamesTerm,
      dateTerm: newDateTerm as any,
    };

    onSearch(searchParams, formData);
  }

  //* Determine sub-type options based on search type
  const getSubTypeOptions = (): Record<string, string> => {
    switch (searchType) {
      case OfferingIncomeSearchType.SundayService:
        return SubTypeNamesOfferingIncomeSearchBySundayService;
      case OfferingIncomeSearchType.SundaySchool:
        return SubTypeNamesOfferingIncomeSearchBySundaySchool;
      case OfferingIncomeSearchType.FamilyGroup:
        return SubTypeNamesOfferingIncomeSearchByFamilyGroup;
      case OfferingIncomeSearchType.ZonalVigil:
      case OfferingIncomeSearchType.ZonalFasting:
      case OfferingIncomeSearchType.ZonalUnitedService:
      case OfferingIncomeSearchType.ZonalEvangelism:
        return SubTypeNamesOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelism;
      case OfferingIncomeSearchType.GeneralFasting:
      case OfferingIncomeSearchType.GeneralVigil:
      case OfferingIncomeSearchType.GeneralEvangelism:
        return SubTypeNamesOfferingIncomeSearchByFastingAndVigilGeneralAndGeneralEvangelism;
      case OfferingIncomeSearchType.YouthService:
        return SubTypeNamesOfferingIncomeSearchByYoungService;
      case OfferingIncomeSearchType.UnitedService:
        return SubTypeNamesOfferingIncomeSearchByUnitedService;
      case OfferingIncomeSearchType.Activities:
        return SubTypeNamesOfferingIncomeSearchByActivities;
      case OfferingIncomeSearchType.Special:
      case OfferingIncomeSearchType.ChurchGround:
        return SubTypeNamesOfferingIncomeSearchByChurchGroundAndSpecial;
      case OfferingIncomeSearchType.IncomeAdjustment:
        return SubTypeNamesOfferingIncomeSearchByIncomeAdjustment;
      default:
        return {};
    }
  };

  //* Conditions for showing fields
  const showSubType =
    searchType === OfferingIncomeSearchType.Activities ||
    searchType === OfferingIncomeSearchType.ChurchGround ||
    searchType === OfferingIncomeSearchType.FamilyGroup ||
    searchType === OfferingIncomeSearchType.GeneralFasting ||
    searchType === OfferingIncomeSearchType.GeneralVigil ||
    searchType === OfferingIncomeSearchType.GeneralEvangelism ||
    searchType === OfferingIncomeSearchType.IncomeAdjustment ||
    searchType === OfferingIncomeSearchType.Special ||
    searchType === OfferingIncomeSearchType.SundaySchool ||
    searchType === OfferingIncomeSearchType.SundayService ||
    searchType === OfferingIncomeSearchType.UnitedService ||
    searchType === OfferingIncomeSearchType.ZonalUnitedService ||
    searchType === OfferingIncomeSearchType.YouthService ||
    searchType === OfferingIncomeSearchType.ZonalFasting ||
    searchType === OfferingIncomeSearchType.ZonalVigil ||
    searchType === OfferingIncomeSearchType.ZonalEvangelism;

  const showInputTerm =
    (searchType === OfferingIncomeSearchType.FamilyGroup ||
      searchType === OfferingIncomeSearchType.ZonalFasting ||
      searchType === OfferingIncomeSearchType.ZonalVigil ||
      searchType === OfferingIncomeSearchType.ZonalUnitedService ||
      searchType === OfferingIncomeSearchType.ZonalEvangelism) &&
    (searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCode ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByZone ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate);

  const showDateTerm =
    showSubType &&
    (searchSubType === OfferingIncomeSearchSubType.OfferingByDate ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate);

  const showSelectTerm =
    searchType === OfferingIncomeSearchType.RecordStatus ||
    ((searchType === OfferingIncomeSearchType.SundayService ||
      searchType === OfferingIncomeSearchType.GeneralFasting ||
      searchType === OfferingIncomeSearchType.GeneralVigil ||
      searchType === OfferingIncomeSearchType.GeneralEvangelism ||
      searchType === OfferingIncomeSearchType.Activities ||
      searchType === OfferingIncomeSearchType.UnitedService ||
      searchType === OfferingIncomeSearchType.SundaySchool ||
      searchType === OfferingIncomeSearchType.YouthService ||
      searchType === OfferingIncomeSearchType.IncomeAdjustment ||
      searchType === OfferingIncomeSearchType.Special ||
      searchType === OfferingIncomeSearchType.ChurchGround) &&
      (searchSubType === OfferingIncomeSearchSubType.OfferingByShift ||
        searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate ||
        searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFirstNames ||
        searchSubType === OfferingIncomeSearchSubType.OfferingByContributorLastNames ||
        searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFullNames));

  const showFirstNames =
    (searchType === OfferingIncomeSearchType.ChurchGround ||
      searchType === OfferingIncomeSearchType.FamilyGroup ||
      searchType === OfferingIncomeSearchType.Special ||
      searchType === OfferingIncomeSearchType.ZonalFasting ||
      searchType === OfferingIncomeSearchType.ZonalVigil ||
      searchType === OfferingIncomeSearchType.ZonalUnitedService ||
      searchType === OfferingIncomeSearchType.ZonalEvangelism ||
      searchType === OfferingIncomeSearchType.YouthService ||
      searchType === OfferingIncomeSearchType.SundaySchool) &&
    (searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFirstNames ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFullNames ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherFirstNames ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherFullNames ||
      searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorFirstNames ||
      searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorFullNames);

  const showLastNames =
    (searchType === OfferingIncomeSearchType.ChurchGround ||
      searchType === OfferingIncomeSearchType.FamilyGroup ||
      searchType === OfferingIncomeSearchType.Special ||
      searchType === OfferingIncomeSearchType.ZonalFasting ||
      searchType === OfferingIncomeSearchType.ZonalVigil ||
      searchType === OfferingIncomeSearchType.ZonalUnitedService ||
      searchType === OfferingIncomeSearchType.ZonalEvangelism ||
      searchType === OfferingIncomeSearchType.YouthService ||
      searchType === OfferingIncomeSearchType.SundaySchool) &&
    (searchSubType === OfferingIncomeSearchSubType.OfferingByContributorLastNames ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFullNames ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherLastNames ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherFullNames ||
      searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorLastNames ||
      searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorFullNames);

  //* Select term label
  const getSelectTermLabel = (): string => {
    if (
      searchSubType === OfferingIncomeSearchSubType.OfferingByShift ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate
    ) {
      return 'Turno';
    }
    if (searchType === OfferingIncomeSearchType.RecordStatus) {
      return 'Estado de registro';
    }
    return 'Tipo de miembro';
  };

  //* Select term options
  const getSelectTermOptions = (): Record<string, string> => {
    if (searchType === OfferingIncomeSearchType.RecordStatus) {
      return OfferingIncomeSearchNamesByRecordStatus;
    }
    if (
      searchSubType === OfferingIncomeSearchSubType.OfferingByShift ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate
    ) {
      return OfferingIncomeSearchNamesByShift;
    }
    return OfferingIncomeSearchNamesByMemberType;
  };

  //* Input term label
  const getInputTermLabel = (): string => {
    if (
      searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCode ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate
    ) {
      return 'Codigo de grupo familiar';
    }
    if (
      searchSubType === OfferingIncomeSearchSubType.OfferingByZone ||
      searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate
    ) {
      return 'Zona';
    }
    return '';
  };

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
                  form.resetField('inputTerm', { keepError: true });
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
                  {Object.entries(OfferingIncomeSearchTypeNames).map(([key, value]) => (
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
                    form.resetField('firstNamesTerm', { defaultValue: '' });
                    form.resetField('lastNamesTerm', { defaultValue: '' });
                    form.resetField('dateTerm', { keepError: true });
                    form.resetField('selectTerm', { keepError: true });
                    form.resetField('inputTerm', { keepError: true });
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

        {/* Input Term */}
        {showInputTerm && (
          <FormField
            control={form.control}
            name='inputTerm'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[14px] font-bold'>{getInputTermLabel()}</FormLabel>
                <FormDescription className='text-[12px] pb-1'>
                  Escribe aqui lo que deseas buscar.
                </FormDescription>
                <FormControl className='text-[14px]'>
                  <Input
                    className='text-[14px]'
                    placeholder='Ejem: C-2, Av.Central 123, Lima ....'
                    {...field}
                  />
                </FormControl>
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

        {/* Select Term */}
        {showSelectTerm && (
          <FormField
            control={form.control}
            name='selectTerm'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[14px] font-bold'>{getSelectTermLabel()}</FormLabel>
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
                    {Object.entries(getSelectTermOptions()).map(([key, value]) => (
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

        {/* First Names */}
        {showFirstNames && (
          <FormField
            control={form.control}
            name='firstNamesTerm'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[14px] font-bold'>Nombres</FormLabel>
                <FormDescription className='text-[12px] pb-1'>
                  Escribe los nombres que deseas buscar.
                </FormDescription>
                <FormControl className='text-[14px]'>
                  <Input
                    className='text-[14px]'
                    placeholder='Ejem: Rolando Martin...'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[13px]' />
              </FormItem>
            )}
          />
        )}

        {/* Last Names */}
        {showLastNames && (
          <FormField
            control={form.control}
            name='lastNamesTerm'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[14px] font-bold'>Apellidos</FormLabel>
                <FormDescription className='text-[12px] pb-1'>
                  Escribe los apellidos que deseas buscar.
                </FormDescription>
                <FormControl className='text-[14px]'>
                  <Input
                    className='text-[14px]'
                    placeholder='Ejem: Sanchez Torres...'
                    {...field}
                  />
                </FormControl>
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
