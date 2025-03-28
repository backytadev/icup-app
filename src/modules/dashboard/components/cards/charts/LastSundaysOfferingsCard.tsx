/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FcDataBackup, FcDeleteDatabase } from 'react-icons/fc';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { toZonedTime, format as formatZonedTime } from 'date-fns-tz';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { LastSundaysOfferingsTooltipContent } from '@/modules/dashboard/components/cards/charts/LastSundaysOfferingsTooltipContent';

import { DashboardSearchType } from '@/modules/dashboard/enums/dashboard-search-type.enum';
import { getOfferingsForBarChartByTerm } from '@/modules/dashboard/services/dashboard.service';
import { dashBoardSearchFormSchema } from '@/modules/dashboard/validations/dashboard-search-form-schema';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import { cn } from '@/shared/lib/utils';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';

import {
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartLegendContent,
} from '@/shared/components/ui/chart';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/shared/components/ui/command';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';

const chartConfig = {
  dayPEN: {
    label: 'Día PEN',
    color: '#F09330',
  },
  afternoonPEN: {
    label: 'Tarde PEN',
    color: '#0284C7',
  },
  dayUSD: {
    label: 'Día USD',
    color: '#4CAF50',
  },
  afternoonUSD: {
    label: 'Tarde USD',
    color: '#E23670',
  },
  dayEUR: {
    label: 'Día EUR',
    color: '#8E44AD',
  },
  afternoonEUR: {
    label: 'Tarde EUR',
    color: '#edc505',
  },
} satisfies ChartConfig;

interface SearchParamsOptions {
  churchId?: string;
}

export const LastSundayOfferingsCard = (): JSX.Element => {
  //* States

  const [searchParams, setSearchParams] = useState<SearchParamsOptions | undefined>(undefined);
  const [isInputSearchChurchOpen, setIsInputSearchChurchOpen] = useState<boolean>(false);

  //* Form
  const form = useForm<z.infer<typeof dashBoardSearchFormSchema>>({
    resolver: zodResolver(dashBoardSearchFormSchema),
    mode: 'onChange',
    defaultValues: {
      churchId: '',
    },
  });

  //* Watchers
  const churchId = form.getValues('churchId');

  //* Queries
  const lastSundaysOfferings = useQuery({
    queryKey: ['last-sundays-offerings', searchParams],
    queryFn: () => {
      const timeZone = 'America/Lima';
      const now = new Date();
      const zonedDate = toZonedTime(now, timeZone);

      return getOfferingsForBarChartByTerm({
        searchType: DashboardSearchType.LastSundaysOfferings,
        churchId: searchParams?.churchId ?? churchId,
        date: formatZonedTime(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone }),
        limit: '14',
        order: RecordOrder.Descending,
      });
    },
    enabled: !!searchParams,
  });

  const churchesQuery = useQuery({
    queryKey: ['churches-for-sunday-offerings'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  //* Effects
  // Default value
  useEffect(() => {
    if (churchesQuery.data) {
      const churchId = churchesQuery?.data?.map((church) => church?.id)[0];
      setSearchParams({ churchId });
      form.setValue('churchId', churchId);
    }
  }, [churchesQuery?.data]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof dashBoardSearchFormSchema>): void => {
    setSearchParams(formData);
  };

  return (
    <Card className='flex flex-col row-start-1 row-end-2 col-start-1 col-end-3 md:row-start-1 md:row-end-2 md:col-start-1 md:col-end-3 lg:row-start-1 lg:row-end-2 xl:col-start-1 xl:col-end-4 xl:row-start-1 xl:row-end-2 h-[25rem] sm:h-[26rem] md:h-[28rem] lg:h-[28rem] 2xl:h-[30rem] m-0 border-slate-500'>
      <div className='flex flex-col md:grid md:grid-cols-4 md:justify-center md:items-center'>
        <CardHeader className='flex flex-col items-center justify-center px-4 py-2.5 col-span-3'>
          <CardTitle className='font-bold md:pl-[7rem] lg:pl-[16rem] xl:pl-[4rem] 2xl:pl-[8.5rem] 3-xl:pl-[16rem] text-[22px] sm:text-[25px] md:text-[28px] 2xl:text-[30px] inline-block'>
            Ofrendas - Dominicales
          </CardTitle>
          <CardDescription className='backdrop:text-[14px] md:text-[14.5px] md:pl-[7rem] lg:pl-[16rem] xl:pl-[4rem] 2xl:pl-[8.5rem] 3-xl:pl-[16rem] text-center'>
            {`Ultimas ofrendas dominicales (${new Date().getFullYear()})`}
          </CardDescription>
        </CardHeader>

        {/* Form */}

        <div className='col-span-1 flex justify-center -pl-[2rem] pb-2 xl:pr-5'>
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name='churchId'
                render={({ field }) => {
                  return (
                    <FormItem className='md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'>
                      <Popover
                        open={isInputSearchChurchOpen}
                        onOpenChange={setIsInputSearchChurchOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              role='combobox'
                              className={cn(
                                'justify-between w-full text-center px-2 text-[13.5px] md:text-[14px]',
                                !field.value &&
                                  'text-slate-500 dark:text-slate-200 font-normal px-2'
                              )}
                            >
                              {field.value
                                ? churchesQuery?.data
                                    ?.find((church) => church.id === field.value)
                                    ?.churchCode.split('-')
                                    .slice(0, 2)
                                    .join('-')
                                : searchParams?.churchId
                                  ? churchesQuery?.data
                                      ?.find((church) => church.id === searchParams.churchId)
                                      ?.churchCode.split('-')
                                      .slice(0, 2)
                                      .join('-')
                                  : 'ICUP-CENTRAL'}
                              <CaretSortIcon className='h-4 w-4 shrink-0' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align='center' className='w-auto px-4 py-2'>
                          <Command>
                            <CommandInput
                              placeholder='Busque una iglesia'
                              className='h-9 text-[14px] md:text-[14px]'
                            />
                            <CommandEmpty>Iglesia no encontrada.</CommandEmpty>
                            <CommandGroup className='max-h-[100px] h-auto'>
                              {churchesQuery?.data?.map((church) => (
                                <CommandItem
                                  className='text-[14px] md:text-[14px]'
                                  value={church.churchCode}
                                  key={church.id}
                                  onSelect={() => {
                                    form.setValue('churchId', church.id);
                                    church && form.handleSubmit(handleSubmit)();
                                    setIsInputSearchChurchOpen(false);
                                  }}
                                >
                                  {church?.abbreviatedChurchName}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      church.id === field.value ? 'opacity-100' : 'opacity-0'
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
            </form>
          </Form>
        </div>
      </div>

      {/* Chart */}

      {!lastSundaysOfferings?.data?.length && !searchParams ? (
        <CardContent className='h-full py-0 px-2'>
          <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
            <FcDataBackup className='text-[6rem] pb-2' />
            <p className='text-[14px] md:text-[14.5px] font-medium'>Consultando datos....</p>
          </div>
        </CardContent>
      ) : (
        <CardContent className='h-full py-0 px-2'>
          {lastSundaysOfferings?.isFetching && !lastSundaysOfferings?.data?.length && (
            <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
              <FcDataBackup className='text-[6rem] pb-2' />
              <p className='text-[14px] md:text-[14.5px] font-medium'>Consultando datos....</p>
            </div>
          )}
          {!!lastSundaysOfferings?.data?.length && searchParams && (
            <ChartContainer
              config={chartConfig}
              className={cn(
                'w-full h-[275px] sm:h-[280px] md:h-[355px] lg:h-[355px] xl:h-[355px] 2xl:h-[385px]'
              )}
            >
              <BarChart
                accessibilityLayer
                data={lastSundaysOfferings?.data}
                margin={{ top: 5, right: 5, left: -30, bottom: 10 }}
              >
                <CartesianGrid vertical={true} />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={true}
                  tickFormatter={(value) => formatDateToLimaDayMonthYear(value)}
                  className='text-[12.5px] sm:text-[14px]'
                />

                <YAxis className='text-[12.5px] sm:text-[14px]' />
                <ChartTooltip cursor={false} content={LastSundaysOfferingsTooltipContent as any} />

                <ChartLegend
                  content={
                    <ChartLegendContent className='ml-8 md:ml-10 text-[13px] md:text-[14px] flex flex-wrap gap-y-1.5 gap-x-3 md:gap-x-3' />
                  }
                />

                <Bar
                  dataKey='dayPEN'
                  name={chartConfig.dayPEN.label}
                  stackId='day'
                  fill='var(--color-dayPEN)'
                  radius={[2, 2, 2, 2]}
                />
                <Bar
                  dataKey='dayEUR'
                  name={chartConfig.dayEUR.label}
                  stackId='day'
                  fill='var(--color-dayEUR)'
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey='dayUSD'
                  name={chartConfig.dayUSD.label}
                  stackId='day'
                  fill='var(--color-dayUSD)'
                  radius={[2, 2, 0, 0]}
                />

                <Bar
                  dataKey='afternoonPEN'
                  name={chartConfig.afternoonPEN.label}
                  stackId='afternoon'
                  fill='var(--color-afternoonPEN)'
                  radius={[2, 2, 2, 2]}
                />
                <Bar
                  dataKey='afternoonEUR'
                  name={chartConfig.afternoonEUR.label}
                  stackId='afternoon'
                  fill='var(--color-afternoonEUR)'
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey='afternoonUSD'
                  name={chartConfig.afternoonUSD.label}
                  stackId='afternoon'
                  fill='var(--color-afternoonUSD)'
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
          {!lastSundaysOfferings?.isFetching && !lastSundaysOfferings?.data?.length && (
            <div className='text-red-500 flex flex-col justify-center items-center h-full -mt-6'>
              <FcDeleteDatabase className='text-[6rem] pb-2' />
              <p className='font-medium text-[15px] md:text-[16px]'>
                No hay datos disponibles para mostrar.
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
