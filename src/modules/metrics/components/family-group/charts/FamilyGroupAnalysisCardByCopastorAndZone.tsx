import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { TbUsersGroup } from 'react-icons/tb';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getSimpleCopastors } from '@/modules/copastor/services/copastor.service';
import { getFamilyGroupsByCopastorAndZone } from '@/modules/metrics/services/family-group-metrics.service';
import { FamilyGroupsByCopastorAndZoneTooltipContent } from '@/modules/metrics/components/family-group/tooltips/components/FamilyGroupsByCopastorAndZoneTooltipContent';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';

import { cn } from '@/shared/lib/utils';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { getFullNames, getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

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
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

const chartConfig = {
  familyGroupsCount: {
    label: 'Zona',
    color: '#2662D9',
  },
} satisfies ChartConfig;

interface ResultDataOptions {
  zoneName: string;
  supervisor: string;
  familyGroupsCount: number;
  church: {
    isAnexe: boolean;
    abbreviatedChurchName: string;
  };
  totalPercentage: string;
}

interface SearchParamsOptions {
  copastor?: string;
  all?: boolean;
}

export const FamilyGroupAnalysisCardByCopastorAndZone = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [mappedData, setMappedData] = useState<ResultDataOptions[]>();
  const [isInputSearchCopastorOpen, setIsInputSearchCopastorOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsOptions | undefined>(undefined);

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    resolver: zodResolver(metricsFormSchema),
    mode: 'onChange',
    defaultValues: {
      copastor: searchParams ? searchParams.copastor : '',
      all: false,
    },
  });

  //* Watchers
  const copastor = form.watch('copastor');
  const all = form.watch('all');

  //* Queries
  const copastorsQuery = useQuery({
    queryKey: ['copastors-for-zone', activeChurchId],
    queryFn: () => getSimpleCopastors({ churchId: activeChurchId ?? '', isSimpleQuery: true }),
    retry: false,
    enabled: !!activeChurchId,
  });

  const familyGroupsByZoneQuery = useQuery({
    queryKey: ['family-groups-by-zone', { ...searchParams, church: activeChurchId }],
    queryFn: () => {
      return getFamilyGroupsByCopastorAndZone({
        searchType: MetricSearchType.FamilyGroupsByCopastorAndZone,
        copastor: searchParams?.copastor ?? copastor,
        allZones: searchParams?.all ?? all,
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      });
    },
    retry: false,
    enabled:
      !!searchParams?.copastor &&
      !!activeChurchId &&
      !!copastorsQuery?.data &&
      !!copastorsQuery.data.length,
  });

  //* Effects
  // Default value
  useEffect(() => {
    if (copastorsQuery.data) {
      const copastor = copastorsQuery?.data?.map((copastor) => copastor?.id)[0];
      setSearchParams({ copastor, all: false });
      form.setValue('copastor', copastor);
      form.setValue('all', false);
    }
  }, [copastorsQuery?.data]);

  // Set data
  useEffect(() => {
    if (familyGroupsByZoneQuery?.data) {
      const transformedData = Object.entries(familyGroupsByZoneQuery?.data).map(
        ([zoneName, payload]) => {
          const totalFamilyGroups: number = Object.values(familyGroupsByZoneQuery?.data).reduce(
            (total: number, item: { familyGroupsCount: number }) => total + item.familyGroupsCount,
            0
          );

          return {
            zoneName,
            familyGroupsCount: payload?.familyGroupsCount,
            copastor: payload?.copastor,
            supervisor: payload?.supervisor,
            church: {
              isAnexe: payload?.church?.isAnexe,
              abbreviatedChurchName: payload?.church?.abbreviatedChurchName,
            },
            totalPercentage: ((payload.familyGroupsCount / totalFamilyGroups) * 100).toFixed(1),
          };
        }
      );
      setMappedData(transformedData);
    }

    if (!familyGroupsByZoneQuery?.data) {
      setMappedData([]);
    }
  }, [familyGroupsByZoneQuery?.data, copastor]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof metricsFormSchema>): void => {
    setSearchParams(formData);
  };

  const isFetchingData = !searchParams || (familyGroupsByZoneQuery?.isFetching && !mappedData?.length);
  const isEmptyData = !isFetchingData && !mappedData?.length;

  return (
    <MetricCard
      className='col-start-1 col-end-2'
      title={
        <>
          Grupos Familiares
          {!!copastorsQuery?.data?.length && (
            <Badge
              variant='active'
              className='mt-1 text-white text-[11px] py-0.3 tracking-wide'
            >
              Activos
            </Badge>
          )}
        </>
      }
      description='Por Co-Pastor y Zona.'
      icon={<TbUsersGroup className='w-5 h-5 text-blue-600 dark:text-blue-400' />}
      isFetching={isFetchingData}
      isEmpty={isEmptyData}
      headerAction={
        <Form {...form}>
          <form className='flex'>
            <FormField
              control={form.control}
              name='copastor'
              render={({ field }) => {
                return (
                  <FormItem className='md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'>
                    <Popover
                      open={isInputSearchCopastorOpen}
                      onOpenChange={setIsInputSearchCopastorOpen}
                    >
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
                              ? `${getInitialFullNames({ firstNames: copastorsQuery?.data?.find((copastor) => copastor.id === searchParams?.copastor)?.member?.firstNames ?? '', lastNames: '' })} ${copastorsQuery?.data?.find((copastor) => copastor.id === searchParams?.copastor)?.member?.lastNames ?? ''}`
                              : searchParams?.copastor
                                ? `${getInitialFullNames({ firstNames: copastorsQuery?.data?.find((copastor) => copastor.id === searchParams?.copastor)?.member?.firstNames ?? '', lastNames: '' })} ${copastorsQuery?.data?.find((copastor) => copastor.id === searchParams?.copastor)?.member?.lastNames ?? ''}`
                                : 'Elige un co-pastor'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command>
                          {copastorsQuery?.data?.length && copastorsQuery?.data?.length > 0 ? (
                            <>
                              <CommandInput
                                placeholder='Busque un co-pastor'
                                className='h-9 text-[14px] md:text-[14px]'
                              />
                              <CommandEmpty>Co-pastor no encontrado.</CommandEmpty>
                              <CommandGroup className='max-h-[200px] h-auto'>
                                {copastorsQuery?.data?.map((copastor) => (
                                  <CommandItem
                                    className='text-[14px] md:text-[14px]'
                                    value={getFullNames({
                                      firstNames: copastor?.member?.firstNames ?? '',
                                      lastNames: copastor?.member?.lastNames ?? '',
                                    })}
                                    key={copastor.id}
                                    onSelect={() => {
                                      form.setValue('copastor', copastor.id);
                                      form.handleSubmit(handleSubmit)();
                                      setIsInputSearchCopastorOpen(false);
                                    }}
                                  >
                                    {`${getInitialFullNames({ firstNames: copastor?.member?.firstNames ?? '', lastNames: '' })} ${copastor?.member?.lastNames ?? ''}`}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        copastor.id === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          ) : (
                            copastorsQuery?.data?.length === 0 && (
                              <p className='text-[12.5px] md:text-[14px] font-medium text-red-500 text-center'>
                                ❌No hay co-pastores disponibles.
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
          <YAxis tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />
          <ChartTooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            content={FamilyGroupsByCopastorAndZoneTooltipContent as any}
          />
          <ChartLegend
            content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />}
          />
          <Bar dataKey='familyGroupsCount' fill='var(--color-familyGroupsCount)' radius={4} />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
