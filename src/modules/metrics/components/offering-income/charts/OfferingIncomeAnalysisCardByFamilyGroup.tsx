import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';
import { TbHome } from 'react-icons/tb';

import { cn } from '@/shared/lib/utils';

import { getSimpleZones } from '@/modules/zone/services/zone.service';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { generateYearOptions } from '@/shared/helpers/generate-year-options.helper';

import { months } from '@/modules/metrics/data/months-data';
import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';
import { getOfferingIncomeByFamilyGroup } from '@/modules/metrics/services/offering-income-metrics.service';
import { OfferingIncomeByFamilyGroupTooltipContent } from '@/modules/metrics/components/offering-income/tooltips/components/OfferingIncomeByFamilyGroupTooltipContent';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';

import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/shared/components/ui/command';
import {
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartLegendContent,
} from '@/shared/components/ui/chart';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';

const chartConfig = {
  accumulatedOfferingPEN: {
    label: 'Ofrenda PEN',
    color: '#029012',
  },
  accumulatedOfferingUSD: {
    label: 'Ofrenda USD',
    color: '#813cb4',
  },
  accumulatedOfferingEUR: {
    label: 'Ofrenda EUR',
    color: '#279fb3',
  },
} satisfies ChartConfig;

interface SearchParamsOptions {
  zone?: string;
  month?: string;
  year?: string;
}

export const OfferingIncomeAnalysisCardByFamilyGroup = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [isInputSearchMonthOpen, setIsInputSearchMonthOpen] = useState<boolean>(false);
  const [isInputSearchZoneOpen, setIsInputSearchZoneOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsOptions | undefined>(undefined);

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    resolver: zodResolver(metricsFormSchema),
    mode: 'onChange',
    defaultValues: {
      zone: searchParams?.zone ? searchParams?.zone : '',
      month: format(new Date(), 'MMMM').toLowerCase(),
      year: new Date().getFullYear().toString(),
    },
  });

  //* Helpers
  const years = generateYearOptions(2025);

  //* Watchers
  const zone = form.watch('zone');
  const year = form.watch('year');
  const month = form.watch('month');

  //* Queries
  const zonesQuery = useQuery({
    queryKey: ['zones-for-offering-income-by-family-group', activeChurchId],
    queryFn: () => getSimpleZones({ churchId: activeChurchId ?? '', isSimpleQuery: true }),
    retry: false,
    enabled: !!activeChurchId,
  });

  const offeringIncomeByFamilyGroup = useQuery({
    queryKey: ['offering-income-by-family-group', { ...searchParams, church: activeChurchId }],
    queryFn: () => {
      return getOfferingIncomeByFamilyGroup({
        searchType: MetricSearchType.OfferingIncomeByFamilyGroup,
        zone: searchParams?.zone ?? zone,
        month: searchParams?.month ?? month,
        isSingleMonth: true,
        year: searchParams?.year ?? year,
        church: activeChurchId ?? '',
        order: RecordOrder.Ascending,
      });
    },
    retry: false,
    enabled: !!searchParams?.zone && !!searchParams?.year && !!searchParams?.month && !!activeChurchId,
  });

  //* Effects
  useEffect(() => {
    if (zonesQuery.data) {
      const zone = zonesQuery?.data?.map((zone) => zone?.id)[0];
      setSearchParams({ zone, year, month });
      form.setValue('zone', zone);
    }

    if (searchParams?.zone) {
      setSearchParams({ zone, year, month });
      form.setValue('zone', zone);
    }
  }, [zonesQuery?.data, year]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof metricsFormSchema>): void => {
    setSearchParams(formData);
  };

  const isFetchingData =
    !searchParams || (offeringIncomeByFamilyGroup?.isFetching && !offeringIncomeByFamilyGroup?.data?.length);
  const isEmptyData = !isFetchingData && !offeringIncomeByFamilyGroup?.data?.length;

  return (
    <MetricCard
      className='col-start-2 col-end-3'
      title={
        <>
          Grupos Familiares
          {!!offeringIncomeByFamilyGroup?.data?.length && (
            <Badge variant='active' className='mt-1 text-white text-[11px] py-0.3 tracking-wide'>
              Activos
            </Badge>
          )}
        </>
      }
      description='Ofrendas por grupo familiar del mes.'
      icon={<TbHome className='w-5 h-5 text-green-600 dark:text-green-400' />}
      isFetching={isFetchingData}
      isEmpty={isEmptyData}
      headerAction={
        <Form {...form}>
          <form className='flex'>
            <FormField
              control={form.control}
              name='zone'
              render={({ field }) => {
                return (
                  <FormItem className='md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'>
                    <Popover open={isInputSearchZoneOpen} onOpenChange={setIsInputSearchZoneOpen}>
                      <PopoverTrigger asChild>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'justify-between w-full text-[14px] md:text-[14px] text-center px-2',
                              !field.value && 'text-slate-500 dark:text-slate-200 font-normal px-2'
                            )}
                          >
                            {field.value
                              ? zonesQuery?.data?.find((zone) => zone.id === field.value)?.zoneName
                              : 'Zona'}
                            <CaretSortIcon className='h-4 w-4 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command className='w-[10rem]'>
                          {zonesQuery?.data?.length && zonesQuery?.data?.length > 0 ? (
                            <>
                              <CommandInput
                                placeholder='Busque una zona'
                                className='h-9 text-[14px] md:text-[14px]'
                              />
                              <CommandEmpty>Zona no encontrada.</CommandEmpty>
                              <CommandGroup className='max-h-[200px] h-auto'>
                                {zonesQuery?.data?.map((zone) => (
                                  <CommandItem
                                    className='text-[14px] md:text-[14px]'
                                    value={zone.id}
                                    key={zone.zoneName}
                                    onSelect={() => {
                                      form.setValue('zone', zone.id);
                                      zone && month && year && form.handleSubmit(handleSubmit)();
                                      setIsInputSearchZoneOpen(false);
                                    }}
                                  >
                                    {zone.zoneName}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        zone.id === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          ) : (
                            zonesQuery?.data?.length === 0 && (
                              <p className='text-[12px] md:text-[14px] font-medium text-red-500 text-center'>
                                ❌No hay zonas disponibles.
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
            <FormField
              control={form.control}
              name='month'
              render={({ field }) => {
                return (
                  <FormItem className='md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'>
                    <Popover
                      open={isInputSearchMonthOpen}
                      onOpenChange={(e) => {
                        setIsInputSearchMonthOpen(e);
                        form.resetField('year', {
                          defaultValue: '',
                        });
                      }}
                    >
                      <PopoverTrigger asChild>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'justify-between w-full text-[14px] md:text-[14px] text-center px-2',
                              !field.value && 'text-slate-500 dark:text-slate-200 font-normal px-2'
                            )}
                          >
                            {field.value
                              ? months.find((month) => month.value === field.value)?.label
                              : 'Mes'}
                            <CaretSortIcon className='h-4 w-4 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command className='w-[10rem]'>
                          <CommandInput
                            placeholder='Busque un mes'
                            className='h-9 text-[14px] md:text-[14px]'
                          />
                          <CommandEmpty>Mes no encontrado.</CommandEmpty>
                          <CommandGroup className='max-h-[100px] h-auto'>
                            {months.map((month) => (
                              <CommandItem
                                className='text-[14px] md:text-[14px]'
                                value={month.label}
                                key={month.value}
                                onSelect={() => {
                                  form.setValue('month', month.value);
                                  setIsInputSearchMonthOpen(false);
                                }}
                              >
                                {month.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    month.value === field.value ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name='year'
              render={({ field }) => {
                return (
                  <FormItem className='flex justify-start gap-5 items-center'>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.handleSubmit(handleSubmit)();
                      }}
                      value={field.value}
                    >
                      <FormControl className='text-[14px] md:text-[14px] w-[4.8rem] font-medium'>
                        <SelectTrigger>
                          {field.value ? <SelectValue placeholder='Año' /> : 'Año'}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={cn(years.length >= 3 ? 'h-[8rem]' : 'h-auto')}>
                        {Object.values(years).map(({ label, value }) => (
                          <SelectItem className='text-[14px]' key={value} value={label}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      }
    >
      <ChartContainer
        config={chartConfig}
        className='w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'
      >
        <BarChart
          accessibilityLayer
          data={offeringIncomeByFamilyGroup?.data}
          margin={{ top: 5, right: 5, left: -25, bottom: 10 }}
        >
          <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
          <XAxis
            dataKey='familyGroup.familyGroupCode'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
            className='text-xs fill-slate-500 dark:fill-slate-400'
          />
          <YAxis tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />
          <ChartTooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            content={OfferingIncomeByFamilyGroupTooltipContent as any}
          />
          <ChartLegend
            content={
              <ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />
            }
          />
          <Bar
            dataKey='accumulatedOfferingPEN'
            stackId='familyGroup'
            fill='var(--color-accumulatedOfferingPEN)'
            radius={[2, 2, 2, 2]}
          />
          <Bar
            dataKey='accumulatedOfferingEUR'
            stackId='familyGroup'
            fill='var(--color-accumulatedOfferingEUR)'
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey='accumulatedOfferingUSD'
            stackId='familyGroup'
            fill='var(--color-accumulatedOfferingUSD)'
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
