import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/shared/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { TbBuildingCommunity } from 'react-icons/tb';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { District } from '@/shared/enums/district.enum';
import { RecordOrder } from '@/shared/enums/record-order.enum';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';
import { getMembersByDistrictAndGender } from '@/modules/metrics/services/member-metrics.service';
import { MembersByDistrictAndGenderTooltipContent } from '@/modules/metrics/components/member/tooltips/components/MembersByDistrictAndGenderTooltipContent';
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
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';

const chartConfig = {
  men: {
    label: 'Varones',
    color: '#62d723',
  },
  women: {
    label: 'Mujeres',
    color: '#d256c1',
  },
} satisfies ChartConfig;

interface ResultDataOptions {
  urbanSectorName: string;
  men: number;
  women: number;
  district: string;
  church: {
    isAnexe: boolean;
    abbreviatedChurchName: string;
  };
  totalPercentage: string;
}

interface SearchParamsOptions {
  district?: string;
}

export const MemberAnalysisCardByDistrictAndGender = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);
  const availableChurches = useChurchMinistryContextStore((s) => s.availableChurches);

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
  const membersByDistrictAndGenderQuery = useQuery({
    queryKey: ['members-by-district-and-gender', { ...searchParams, church: activeChurchId }],
    queryFn: () => {
      return getMembersByDistrictAndGender({
        searchType: MetricSearchType.MembersByDistrictAndGender,
        district: searchParams?.district ?? district,
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      });
    },
    retry: false,
    enabled: !!activeChurchId,
  });

  //* Effects
  useEffect(() => {
    const currentChurch = availableChurches.find((church) => church.id === activeChurchId);
    const districtValue = (currentChurch?.district as string) ?? District.Independencia;
    setSearchParams({ district: districtValue });
    form.setValue('district', districtValue);
  }, [activeChurchId, availableChurches]);

  useEffect(() => {
    if (membersByDistrictAndGenderQuery?.data) {
      const districts = Object.values(membersByDistrictAndGenderQuery?.data).map(
        (payload) => payload.district
      );

      setCurrentDistricts([...new Set(districts)]);
    }
  }, [membersByDistrictAndGenderQuery?.data, activeChurchId]);

  // Set data
  useEffect(() => {
    if (membersByDistrictAndGenderQuery?.data) {
      const transformedData = Object.entries(membersByDistrictAndGenderQuery?.data).map(
        ([urbanSectorName, payload]) => {
          const totalMembers: number = Object.values(membersByDistrictAndGenderQuery?.data).reduce(
            (total: number, item: { men: number; women: number }) =>
              total + item?.men + item?.women,
            0
          );

          return {
            urbanSectorName,
            men: payload?.men,
            women: payload?.women,
            district: payload?.district,
            church: {
              isAnexe: payload?.church?.isAnexe,
              abbreviatedChurchName: payload?.church?.abbreviatedChurchName,
            },
            totalPercentage: (((payload?.men + payload?.women) / totalMembers) * 100).toFixed(1),
          };
        }
      );

      setMappedData(transformedData);
    }
  }, [membersByDistrictAndGenderQuery?.data, district]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof metricsFormSchema>): void => {
    setSearchParams(formData);
  };

  const isFetchingData = membersByDistrictAndGenderQuery?.isFetching && !mappedData?.length;
  const isEmptyData = !isFetchingData && !mappedData?.length;

  return (
    <MetricCard
      className='col-start-1 col-end-2'
      title={
        <>
          Distrito - Sec. Urbano
          {membersByDistrictAndGenderQuery?.data &&
            Object.entries(membersByDistrictAndGenderQuery?.data)?.length > 0 && (
              <Badge
                variant='active'
                className='mt-1 text-[11px] text-white md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
              >
                Activos
              </Badge>
            )}
        </>
      }
      icon={<TbBuildingCommunity className='w-5 h-5 text-green-600 dark:text-green-400' />}
      isFetching={isFetchingData}
      isEmpty={isEmptyData}
      headerAction={
        <Form {...form}>
          <form className='flex'>
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
      }
    >
      <ChartContainer
        config={chartConfig}
        className='w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'
      >
        <BarChart
          accessibilityLayer
          data={mappedData}
          margin={{ top: 5, right: 5, left: -35, bottom: 10 }}
        >
          <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
          <XAxis
            dataKey='urbanSectorName'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 10)}
            className='text-xs fill-slate-500 dark:fill-slate-400'
          />
          <YAxis type='number' tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />
          <ChartTooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            content={MembersByDistrictAndGenderTooltipContent as any}
          />
          <ChartLegend
            content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />}
          />
          <Bar dataKey='men' fill='var(--color-men)' radius={4} />
          <Bar dataKey='women' fill='var(--color-women)' radius={4} />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
