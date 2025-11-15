import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { cn } from '@/shared/lib/utils';

import {
  ChartConfig,
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from '@/shared/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface ChartBarFinancialBalanceSummaryProps {
  type: string;
  data: Array<{
    label: string;
    pen: number;
    usd: number;
    eur: number;
  }>;
}

export function ChartBarFinancialBalanceSummary({
  data,
  type,
}: ChartBarFinancialBalanceSummaryProps) {
  const chartConfig: ChartConfig = {
    pen: {
      label: 'PEN',
      color: type === 'income' ? '#029012' : '#F43F5E',
    },
    usd: {
      label: 'USD',
      color: '#279fb3',
    },
    eur: {
      label: 'EUR',
      color: '#813CB4',
    },
  };

  return (
    <Card className='w-full bg-white dark:bg-slate-900/40'>
      <CardHeader>
        <CardTitle
          className={cn(
            'text-xl md:text-2xl font-bold text-green-600 dark:text-green-400',
            type === 'expense' && 'text-red-600 dark:text-red-400'
          )}
        >
          Resumen Gráfico
        </CardTitle>
      </CardHeader>

      <CardContent className='px-2 sm:px-4 py-0 '>
        {!!data?.length ? (
          <ChartContainer
            config={chartConfig}
            className={cn('w-full h-full sm:h-[345px] md:h-[345px] lg:h-[415px] xl:h-[415px]')}
          >
            <BarChart
              data={data}
              accessibilityLayer
              margin={{ top: 5, right: 5, left: -15, bottom: 10 }}
            >
              <CartesianGrid vertical={true} />

              <XAxis
                dataKey='label'
                tickLine={false}
                tickMargin={10}
                axisLine={true}
                className='text-[12.5px] sm:text-[14px]'
                tickFormatter={(value) => {
                  const [a, b] = String(value).split(' ');
                  return b ? `${a} ${b.charAt(0)}.` : a;
                }}
              />

              <YAxis className='text-[12.5px] sm:text-[14px]' />

              <ChartTooltip
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                content={<ChartTooltipContent />}
              />

              <ChartLegend
                content={
                  <ChartLegendContent className='ml-4 sm:ml-8 text-[13px] md:text-[14px] flex gap-2 sm:gap-5' />
                }
              />

              <Bar dataKey='pen' stackId='subType' fill='var(--color-pen)' radius={[2, 2, 2, 2]} />
              <Bar dataKey='usd' stackId='subType' fill='var(--color-usd)' radius={[2, 2, 2, 2]} />
              <Bar dataKey='eur' stackId='subType' fill='var(--color-eur)' radius={[2, 2, 2, 2]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className='text-red-500 flex flex-col justify-center items-center h-full py-10'>
            <p className='font-medium text-[15px] md:text-[16px]'>
              No hay datos disponibles para mostrar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
