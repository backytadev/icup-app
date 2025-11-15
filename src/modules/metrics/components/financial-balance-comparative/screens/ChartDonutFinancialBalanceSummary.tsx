import { Label, Pie, PieChart } from 'recharts';
import { useMediaQuery } from '@react-hook/media-query';

import { cn } from '@/shared/lib/utils';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';

interface ChartDonutFinancialBalanceSummaryProps {
  title: string;
  data: { name: string; value: number; fill: string; currency: string }[];
  valueLabel: string;
  strokeColor: string;
}

export const ChartDonutFinancialBalanceSummary = ({
  title,
  data,
  valueLabel,
  strokeColor,
}: ChartDonutFinancialBalanceSummaryProps) => {
  const total =
    valueLabel === 'Saldo'
      ? data.length > 0
        ? data[data.length - 1].value
        : 0
      : data.reduce((acc, curr) => acc + curr.value, 0);

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isXlDesktop = useMediaQuery('(min-width: 1280px)');

  return (
    <Card className='flex flex-col w-full bg-white dark:bg-slate-900/40'>
      <CardHeader className='items-center pb-0'>
        <CardTitle
          className={cn(
            'text-center font-bold',
            'text-2xl sm:text-3xl md:text-4xl',
            valueLabel === 'Ingresos' && 'text-green-500 dark:text-green-400',
            valueLabel === 'Egresos' && 'text-red-500 dark:text-red-400',
            valueLabel === 'Saldo' && 'text-amber-500 dark:text-amber-400'
          )}
        >
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={{}}
          className='mx-auto aspect-square w-full max-w-[260px] sm:max-w-[320px]md:max-w-[380px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className='text-[14px] sm:text-[16px]' hideLabel />}
            />

            <Pie
              data={data}
              dataKey='value'
              nameKey='name'
              innerRadius={isXlDesktop ? 80 : isDesktop ? 100 : 60}
              outerRadius='70%'
              stroke={strokeColor}
              strokeWidth={1}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          className='font-bold fill-foreground text-2xl sm:text-3xl md:text-4xl'
                          x={viewBox.cx}
                          y={viewBox.cy}
                        >
                          {Math.round(total).toLocaleString('es-PE')}
                        </tspan>
                        <tspan
                          className='text-muted-foreground font-medium text-[12px] sm:text-[14px] md:text-[16px]'
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 26}
                        >
                          {`${data[0].currency}`}
                        </tspan>
                        <tspan
                          className='text-muted-foreground font-medium text-[14px] sm:text-[16px] md:text-[18px]'
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 40}
                        >
                          {valueLabel}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
