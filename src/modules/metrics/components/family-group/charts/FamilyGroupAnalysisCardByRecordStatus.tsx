import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { TbActivity } from 'react-icons/tb';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { getSimpleZones } from '@/modules/zone/services/zone.service';
import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';
import { getFamilyGroupsByRecordStatus } from '@/modules/metrics/services/family-group-metrics.service';
import { FamilyGroupsByRecordStatusTooltipContent } from '@/modules/metrics/components/family-group/tooltips/components/FamilyGroupsByRecordStatusTooltipContent';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';

import { cn } from '@/shared/lib/utils';

import { RecordOrder } from '@/shared/enums/record-order.enum';

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/shared/components/ui/form';
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
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

const chartConfig = {
  active: {
    label: 'Activos',
    color: '#22C55E',
  },
  inactive: {
    label: 'Inactivos',
    color: '#EF4444',
  },
} satisfies ChartConfig;

interface ResultDataOptions {
  zoneName: string;
  copastor: string;
  supervisor: string;
  active: number;
  inactive: number;
  church: {
    isAnexe: boolean;
    abbreviatedChurchName: string;
  };
}
interface SearchParamsOptions {
  zone?: string;
  all?: boolean;
}

export const FamilyGroupAnalysisCardByRecordStatus = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [mappedData, setMappedData] = useState<ResultDataOptions[]>();
  const [isInputSearchZoneOpen, setIsInputSearchZoneOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsOptions | undefined>(undefined);

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    resolver: zodResolver(metricsFormSchema),
    mode: 'onChange',
    defaultValues: {
      zone: searchParams ? searchParams.zone : '',
      all: false,
    },
  });

  //* Watchers
  const zone = form.watch('zone');
  const all = form.watch('all');

  //* Queries
  const zonesQuery = useQuery({
    queryKey: ['zones-for-family-groups-record-status', activeChurchId],
    queryFn: () => getSimpleZones({ churchId: activeChurchId ?? '', isSimpleQuery: true }),
    retry: false,
    enabled: !!activeChurchId,
  });

  const familyGroupsByRecordStatusQuery = useQuery({
    queryKey: ['family-groups-by-record-status', { ...searchParams, church: activeChurchId }],
    queryFn: () => {
      return getFamilyGroupsByRecordStatus({
        searchType: MetricSearchType.FamilyGroupsByRecordStatus,
        zone: searchParams?.zone ?? zone,
        allZones: searchParams?.all ?? all,
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      });
    },
    retry: false,
    enabled:
      !!searchParams?.zone && !!activeChurchId && !!zonesQuery?.data && !!zonesQuery.data.length,
  });

  //* Effects
  // Default value
  useEffect(() => {
    if (zonesQuery.data) {
      const zone = zonesQuery?.data?.map((zone) => zone?.id)[0];
      setSearchParams({ zone, all: false });
      form.setValue('zone', zone);
      form.setValue('all', false);
    }
  }, [zonesQuery?.data]);

  // Set data
  useEffect(() => {
    if (familyGroupsByRecordStatusQuery?.data) {
      const transformedData = Object.entries(familyGroupsByRecordStatusQuery?.data).map(
        ([zoneName, payload]) => {
          return {
            zoneName,
            active: payload?.active,
            inactive: payload?.inactive,
            copastor: payload?.copastor,
            supervisor: payload?.supervisor,
            church: {
              isAnexe: payload?.church?.isAnexe,
              abbreviatedChurchName: payload?.church?.abbreviatedChurchName,
            },
          };
        }
      );

      setMappedData(transformedData);
    }

    if (!familyGroupsByRecordStatusQuery?.data) {
      setMappedData([]);
    }
  }, [familyGroupsByRecordStatusQuery?.data, zone]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof metricsFormSchema>): void => {
    setSearchParams(formData);
  };

  const isFetchingData = !searchParams || (familyGroupsByRecordStatusQuery?.isFetching && !mappedData?.length);
  const isEmptyData = !isFetchingData && !mappedData?.length;

  return (
    <MetricCard
      className='col-start-2 col-end-3'
      title='Grupos Familiares'
      description='Por Estado de registro.'
      icon={<TbActivity className='w-5 h-5 text-rose-600 dark:text-rose-400' />}
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
                            disabled={all}
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'justify-between w-full text-center overflow-hidden px-2 text-[14px] md:text-[14px]',
                              !field.value && 'text-slate-500 dark:text-slate-200 font-normal px-2'
                            )}
                          >
                            {field.value
                              ? `${zonesQuery?.data?.find((zone) => zone.id === searchParams?.zone)?.zoneName}`
                              : searchParams?.zone
                                ? `${zonesQuery?.data?.find((zone) => zone.id === searchParams?.zone)?.zoneName}`
                                : 'Elige una zona'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0' />
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
                                    value={zone.zoneName}
                                    key={zone.id}
                                    onSelect={() => {
                                      form.setValue('zone', zone.id);
                                      form.handleSubmit(handleSubmit)();
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
              name='all'
              render={({ field }) => (
                <FormItem className='flex flex-row items-end space-x-2 space-y-0 rounded-md border p-3 h-[2.5rem]'>
                  <FormControl>
                    <Checkbox
                      checked={field?.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        form.handleSubmit(handleSubmit)();
                      }}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel className='text-[13px] md:text-[14px] cursor-pointer'>
                      Todos
                    </FormLabel>
                  </div>
                </FormItem>
              )}
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
            dataKey='zoneName'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 10)}
            className='text-xs fill-slate-500 dark:fill-slate-400'
          />
          <YAxis type='number' tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />
          <ChartTooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            content={FamilyGroupsByRecordStatusTooltipContent as any}
          />
          <ChartLegend
            content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />}
          />
          <Bar dataKey='active' fill='var(--color-active)' radius={4} />
          <Bar dataKey='inactive' fill='var(--color-inactive)' radius={4} />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
