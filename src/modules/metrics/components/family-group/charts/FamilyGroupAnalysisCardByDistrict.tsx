/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/shared/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { FcDataBackup, FcDeleteDatabase } from 'react-icons/fc';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';

import { MetricSearchType } from '@/modules/metrics/enums';
import { metricsFormSchema } from '@/modules/metrics/validations';
import { getFamilyGroupsByDistrict } from '@/modules/metrics/services';
import { FamilyGroupsByDistrictTooltipContent } from '@/modules/metrics/components/family-group/tooltips/components';

import { District, RecordOrder } from '@/shared/enums';

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
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';

const chartConfig = {
  familyGroupsCount: {
    label: 'Sector Urbano',
    color: '#62d723',
  },
} satisfies ChartConfig;

interface ResultDataOptions {
  urbanSectorName: string;
  familyGroupsCount: number;
  church: {
    isAnexe: boolean;
    abbreviatedChurchName: string;
  };
  totalPercentage: string;
}

interface SearchParamsOptions {
  district?: string;
}

interface Props {
  churchId: string | undefined;
}

export const FamilyGroupAnalysisCardByDistrict = ({ churchId }: Props): JSX.Element => {
  //* States
  const [mappedData, setMappedData] = useState<ResultDataOptions[]>();
  const [isInputSearchDistrictOpen, setIsInputSearchDistrictOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsOptions | undefined>(undefined);

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    resolver: zodResolver(metricsFormSchema),
    mode: 'onChange',
    defaultValues: {
      district: District.Independencia,
    },
  });

  //* Watchers
  const district = form.watch('district');
  const all = form.watch('all');

  //* Queries
  const familyGroupsByDistrictQuery = useQuery({
    queryKey: ['family-groups-by-district', { ...searchParams, church: churchId }],
    queryFn: () => {
      return getFamilyGroupsByDistrict({
        searchType: MetricSearchType.FamilyGroupsByDistrict,
        district: searchParams?.district ?? district,
        order: RecordOrder.Ascending,
        church: churchId ?? '',
      });
    },
    retry: 1,
    enabled: !!searchParams?.district && !!churchId,
  });

  //* Effects
  // Default value
  useEffect(() => {
    setSearchParams({ district });
    form.setValue('district', district);
  }, [familyGroupsByDistrictQuery?.data]);

  // Set data
  useEffect(() => {
    if (familyGroupsByDistrictQuery?.data) {
      const transformedData = Object.entries(familyGroupsByDistrictQuery?.data).map(
        ([urbanSectorName, payload]) => {
          const totalMembers: number = Object.values(familyGroupsByDistrictQuery?.data).reduce(
            (total: number, item: { familyGroupsCount: number }) => total + item?.familyGroupsCount,
            0
          );

          return {
            urbanSectorName,
            familyGroupsCount: payload?.familyGroupsCount,
            church: {
              isAnexe: payload?.church?.isAnexe,
              abbreviatedChurchName: payload?.church?.abbreviatedChurchName,
            },
            totalPercentage: ((payload?.familyGroupsCount / totalMembers) * 100).toFixed(1),
          };
        }
      );
      setMappedData(transformedData);
    }
  }, [familyGroupsByDistrictQuery?.data, district]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof metricsFormSchema>): void => {
    setSearchParams(formData);
  };
  return (
    <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col col-start-2 col-end-3 h-[22rem] md:h-[25rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
      <CardHeader className='z-10 flex flex-col sm:flex-row items-center justify-between px-4 py-2.5'>
        <CardTitle className='flex justify-center items-center gap-2 font-bold text-[22px] sm:text-[25px] md:text-[28px] 2xl:text-[30px]'>
          <span>Grupos F. (distrito)</span>
          {familyGroupsByDistrictQuery?.data &&
            Object.entries(familyGroupsByDistrictQuery?.data)?.length > 0 && (
              <Badge
                variant='active'
                className='mt-1 text-[10px] md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
              >
                Activos
              </Badge>
            )}
        </CardTitle>
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name='district'
              render={({ field }) => {
                return (
                  <FormItem className='md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'>
                    <Popover
                      open={isInputSearchDistrictOpen}
                      onOpenChange={setIsInputSearchDistrictOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={all}
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'justify-between w-full text-center px-2 text-[12px] md:text-[14px]',
                              !field.value && 'text-slate-500 dark:text-slate-200 font-normal px-4'
                            )}
                          >
                            {field.value
                              ? Object.values(District).find((district) => district === field.value)
                              : 'Elige un distrito'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command>
                          <CommandInput
                            placeholder='Busque un distrito...'
                            className='h-9 text-[12px] md:text-[14px]'
                          />
                          <CommandEmpty>Distrito no encontrado.</CommandEmpty>
                          <CommandGroup className='max-h-[200px] h-auto'>
                            {Object.values(District).map((district) => (
                              <CommandItem
                                className='text-[12px] md:text-[14px]'
                                value={district}
                                key={district}
                                onSelect={() => {
                                  form.setValue('district', district);
                                  form.handleSubmit(handleSubmit)();
                                  setIsInputSearchDistrictOpen(false);
                                }}
                              >
                                {district}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    district === field.value ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </CardHeader>

      {!mappedData?.length && !searchParams ? (
        <CardContent className='h-full pl-3 pr-6 py-0'>
          <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
            <FcDataBackup className='text-[6rem] pb-2' />
            <p>Consultando datos....</p>
          </div>
        </CardContent>
      ) : (
        <CardContent className='h-full pl-3 pr-6 py-0'>
          {familyGroupsByDistrictQuery?.isFetching && !mappedData?.length && (
            <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
              <FcDataBackup className='text-[6rem] pb-2' />
              <p>Consultando datos....</p>
            </div>
          )}
          {!!mappedData?.length && searchParams && (
            <ChartContainer
              config={chartConfig}
              className={cn(
                'w-full h-[252px] sm:h-[285px] md:h-[330px] lg:h-[330px] xl:h-[330px] 2xl:h-[345px]'
              )}
            >
              <BarChart
                accessibilityLayer
                data={mappedData}
                margin={{ top: 5, right: 5, left: -28, bottom: 10 }}
              >
                <CartesianGrid vertical={true} />
                <XAxis
                  dataKey='urbanSectorName'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={true}
                  tickFormatter={(value) => value.slice(0, 10)}
                  className='text-[12px] md:text-[14px]'
                />
                <YAxis type='number' className='text-[12px] md:text-[14px]' />
                <ChartTooltip
                  cursor={false}
                  content={FamilyGroupsByDistrictTooltipContent as any}
                />
                <ChartLegend
                  content={<ChartLegendContent className='ml-10 text-[12px] md:text-[14px]' />}
                />
                <Bar dataKey='familyGroupsCount' fill='var(--color-familyGroupsCount)' radius={4} />
              </BarChart>
            </ChartContainer>
          )}
          {!familyGroupsByDistrictQuery?.isFetching && !mappedData?.length && (
            <div className='text-red-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
              <FcDeleteDatabase className='text-[6rem] pb-2' />
              <p>No hay datos disponibles para mostrar.</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
