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
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { metricsFormSchema } from '@/modules/metrics/validations/metrics-form-schema';
import { getFamilyGroupsByDistrict } from '@/modules/metrics/services/family-group-metrics.service';
import { FamilyGroupsByDistrictTooltipContent } from '@/modules/metrics/components/family-group/tooltips/components/FamilyGroupsByDistrictTooltipContent';

import { cn } from '@/shared/lib/utils';

import { District } from '@/shared/enums/district.enum';
import { RecordOrder } from '@/shared/enums/record-order.enum';

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
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { getSimpleChurches } from '@/modules/church/services/church.service';

const chartConfig = {
  familyGroupsCount: {
    label: 'Sector Urbano',
    color: '#62d723',
  },
} satisfies ChartConfig;

interface ResultDataOptions {
  urbanSectorName: string;
  district: string;
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
  const [currentDistricts, setCurrentDistricts] = useState<string[]>([]);

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
  const churchesQuery = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

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
    retry: false,
    enabled: !!churchId,
  });

  //* Effects
  // Default value
  useEffect(() => {
    const currentChurch = churchesQuery.data?.find((church) => church.id === churchId);
    setSearchParams({ district: currentChurch?.district });
    form.setValue('district', currentChurch?.district);
  }, [churchId]);

  useEffect(() => {
    if (familyGroupsByDistrictQuery?.data) {
      const districts = Object.values(familyGroupsByDistrictQuery?.data).map(
        (payload) => payload.district
      );

      setCurrentDistricts([...new Set(districts)]);
    }
  }, [familyGroupsByDistrictQuery?.data, churchId]);

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
            district: payload?.district,
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
    <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col col-start-2 col-end-3 h-[24rem] md:h-[27rem] lg:h-[27rem] 2xl:h-[27rem] m-0 border-slate-200 dark:border-slate-800'>
      <CardHeader className='z-10 flex flex-col sm:flex-row items-center justify-between px-4 pt-1.5 pb-2'>
        <div className='flex flex-col'>
          <CardTitle className='flex justify-center items-center gap-2 font-bold text-[22px] sm:text-[25px] md:text-[28px] 2xl:text-[30px]'>
            Grupos Familiares
            {familyGroupsByDistrictQuery?.data &&
              Object.entries(familyGroupsByDistrictQuery?.data)?.length > 0 && (
                <Badge
                  variant='active'
                  className='mt-1 text-[11px] text-white md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
                >
                  Activos
                </Badge>
              )}
          </CardTitle>
          <CardDescription className='-ml-6 sm:ml-1 text-center sm:text-left text-[14px] md:text-[14.5px] italic'>
            Por Distrito.
          </CardDescription>
        </div>
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
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Button
                            disabled={all}
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'justify-between w-full text-center px-2 text-[14px] md:text-[14px]',
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
                        <Command className='w-[10rem]'>
                          <CommandInput
                            placeholder='Busque un distrito'
                            className='h-9 text-[14px] md:text-[14px]'
                          />
                          <CommandEmpty>Distrito no encontrado.</CommandEmpty>
                          <CommandGroup className='max-h-[200px] h-auto'>
                            {Object.values(District).map(
                              (district) =>
                                currentDistricts.includes(district) && (
                                  <CommandItem
                                    className='text-[14px] md:text-[14px]'
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
                                )
                            )}
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
      </CardHeader>

      {!mappedData?.length && !searchParams ? (
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
            <FcDataBackup className='text-[6rem] pb-2' />
            <p className='font-medium text-[15px] md:text-[16px]'>Consultando datos....</p>
          </div>
        </CardContent>
      ) : (
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          {familyGroupsByDistrictQuery?.isFetching && !mappedData?.length && (
            <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
              <FcDataBackup className='text-[6rem] pb-2' />
              <p className='font-medium text-[15px] md:text-[16px]'>Consultando datos....</p>
            </div>
          )}
          {!!mappedData?.length && searchParams && (
            <ChartContainer
              config={chartConfig}
              className={cn(
                'w-full h-[270px] sm:h-[310px] md:h-[350px] lg:h-[350px] xl:h-[350px] 2xl:h-[345px]'
              )}
            >
              <BarChart
                accessibilityLayer
                data={mappedData}
                margin={{ top: 5, right: 5, left: -40, bottom: 10 }}
              >
                <CartesianGrid vertical={true} />
                <XAxis
                  dataKey='urbanSectorName'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={true}
                  tickFormatter={(value) => value.slice(0, 10)}
                  className='text-[12.5px] md:text-[14px]'
                />
                <YAxis type='number' className='text-[12.5px] md:text-[14px]' />
                <ChartTooltip
                  cursor={false}
                  content={FamilyGroupsByDistrictTooltipContent as any}
                />
                <ChartLegend
                  content={<ChartLegendContent className='ml-8 text-[13px] md:text-[14px]' />}
                />
                <Bar dataKey='familyGroupsCount' fill='var(--color-familyGroupsCount)' radius={4} />
              </BarChart>
            </ChartContainer>
          )}
          {!familyGroupsByDistrictQuery?.isFetching && !mappedData?.length && (
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
