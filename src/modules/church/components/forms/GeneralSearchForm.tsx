import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/shared/lib/utils';

import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { formSearchGeneralSchema } from '@/shared/validations/form-search-general-schema';
import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';

interface GeneralSearchFormProps {
  onSearch: (params: GeneralSearchFormType) => void;
}

export const GeneralSearchForm = ({ onSearch }: GeneralSearchFormProps): JSX.Element => {
  const form = useForm<z.infer<typeof formSearchGeneralSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formSearchGeneralSchema),
    defaultValues: {
      limit: '10',
      offset: '0',
      all: false,
      order: RecordOrder.Descending,
    },
  });

  //* Watchers
  const limit = form.watch('limit');
  const offset = form.watch('offset');
  const order = form.watch('order');

  //* Derived state - no useEffect needed
  const isDisabledSubmitButton = !limit || !offset || !order;

  const handleSubmit = (formData: z.infer<typeof formSearchGeneralSchema>): void => {
    onSearch(formData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='grid grid-cols-1 md:grid-cols-4 gap-4 items-end'
      >
        {/* Limit */}
        <FormField
          control={form.control}
          name='limit'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
            >
              <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                Límite
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                ¿Cuántos registros necesitas?
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  disabled={form.getValues('all')}
                  className={cn(
                    'h-11 text-sm',
                    'transition-all duration-200',
                    'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                  )}
                  value={form.getValues('all') ? '-' : field.value || ''}
                  placeholder='Ej: 10'
                />
              </FormControl>
              <FormMessage className='text-xs font-inter' />
            </FormItem>
          )}
        />

        {/* Offset */}
        <FormField
          control={form.control}
          name='offset'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                Desplazamiento
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                ¿Cuántos registros saltar?
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  disabled={form.getValues('all')}
                  className={cn(
                    'h-11 text-sm',
                    'transition-all duration-200',
                    'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                  )}
                  value={form.getValues('all') ? '-' : field?.value || ''}
                  placeholder='Ej: 0'
                />
              </FormControl>
              <FormMessage className='text-xs font-inter' />
            </FormItem>
          )}
        />

        {/* Order */}
        <FormField
          control={form.control}
          name='order'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
            >
              <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                Orden
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                Tipo de ordenamiento
              </FormDescription>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className='h-11 text-sm'>
                    {field.value ? (
                      <SelectValue placeholder='Selecciona un tipo de orden' />
                    ) : (
                      'Selecciona un tipo de orden'
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(RecordOrderNames).map(([key, value]) => (
                    <SelectItem className='text-sm' key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className='text-xs font-inter' />
            </FormItem>
          )}
        />

        {/* All Checkbox & Submit */}
        <div
          className='flex items-end gap-4 opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          <FormField
            control={form.control}
            name='all'
            render={({ field }) => (
              <FormItem className='flex items-center gap-2 p-3 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'>
                <FormControl>
                  <Checkbox
                    disabled={
                      !form.getValues('limit') ||
                      !form.getValues('offset') ||
                      !!form.formState.errors.limit
                    }
                    checked={field?.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    className='data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700'
                  />
                </FormControl>
                <FormLabel className='text-sm font-medium cursor-pointer text-slate-600 dark:text-slate-400 !mt-0'>
                  Todos
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            disabled={isDisabledSubmitButton}
            type='submit'
            className={cn(
              'h-11 px-8 font-semibold font-inter text-sm flex-1',
              'transition-all duration-300',
              'bg-gradient-to-r from-emerald-500 to-teal-600',
              'hover:from-emerald-600 hover:to-teal-700',
              'hover:shadow-lg hover:shadow-emerald-500/25',
              'hover:scale-[1.02]',
              'active:scale-[0.98]'
            )}
          >
            Buscar
          </Button>
        </div>
      </form>
    </Form>
  );
};
