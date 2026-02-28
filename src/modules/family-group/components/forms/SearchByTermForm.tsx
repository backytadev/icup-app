import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/shared/lib/utils';

import {
  FamilyGroupSearchType,
  FamilyGroupSearchTypeNames,
  SubTypeNamesFamilyGroupSearchByFirstNames,
  SubTypeNamesFamilyGroupSearchByLastNames,
  SubTypeNamesFamilyGroupSearchByFullNames,
  FamilyGroupSearchNamesByRecordStatus,
} from '@/modules/family-group/enums';

import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { familyGroupSearchByTermFormSchema } from '@/modules/family-group/schemas';
import { type FamilyGroupSearchFormByTerm } from '@/modules/family-group/types';

import { firstNamesFormatter, lastNamesFormatter } from '@/shared/helpers/names-formatter.helper';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';

interface SearchByTermFormProps {
  onSearch: (params: FamilyGroupSearchFormByTerm, formData: FamilyGroupSearchFormByTerm) => void;
}

export const SearchByTermForm = ({ onSearch }: SearchByTermFormProps): JSX.Element => {
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const form = useForm<z.infer<typeof familyGroupSearchByTermFormSchema>>({
    resolver: zodResolver(familyGroupSearchByTermFormSchema),
    mode: 'onChange',
    defaultValues: {
      searchSubType: '' as any,
      limit: '10',
      inputTerm: '',
      firstNamesTerm: '',
      lastNamesTerm: '',
      selectTerm: '',
      all: false,
      order: RecordOrder.Descending,
    },
  });

  const searchType = form.watch('searchType');
  const limit = form.watch('limit');
  const order = form.watch('order');
  const all = form.watch('all');

  //* Effects
  useEffect(() => {
    if (all) form.setValue('limit', '10');
  }, [all, form]);

  useEffect(() => {
    setIsDisabledSubmitButton(!limit || !order);
  }, [limit, order]);

  useEffect(() => {
    form.setValue('searchSubType', undefined);
  }, [searchType, form]);

  const handleSubmit = (formData: z.infer<typeof familyGroupSearchByTermFormSchema>): void => {
    const newNamesTerm = firstNamesFormatter(formData?.firstNamesTerm);
    const newLastNamesTerm = lastNamesFormatter(formData?.lastNamesTerm);

    const searchParams = {
      ...formData,
      firstNamesTerm: newNamesTerm,
      lastNamesTerm: newLastNamesTerm,
    };

    onSearch(searchParams as FamilyGroupSearchFormByTerm, formData as FamilyGroupSearchFormByTerm);
    setIsDisabledSubmitButton(true);
    form.reset();
    setIsDisabledSubmitButton(false);
  };

  const getInputLabel = (): string => {
    switch (searchType) {
      case FamilyGroupSearchType.FamilyGroupName:
        return 'Nombre de Grupo Familiar';
      case FamilyGroupSearchType.FamilyGroupCode:
        return 'Código de Grupo Familiar';
      case FamilyGroupSearchType.ZoneName:
        return 'Nombre de Zona';
      case FamilyGroupSearchType.Country:
        return 'País';
      case FamilyGroupSearchType.Department:
        return 'Departamento';
      case FamilyGroupSearchType.Province:
        return 'Provincia';
      case FamilyGroupSearchType.District:
        return 'Distrito';
      case FamilyGroupSearchType.UrbanSector:
        return 'Sector Urbano';
      case FamilyGroupSearchType.Address:
        return 'Dirección';
      default:
        return 'Término';
    }
  };

  const getInputPlaceholder = (): string => {
    switch (searchType) {
      case FamilyGroupSearchType.FamilyGroupName:
        return 'Ej: Los Guerreros de Dios...';
      case FamilyGroupSearchType.FamilyGroupCode:
        return 'Ej: GF-001, GF-002...';
      case FamilyGroupSearchType.ZoneName:
        return 'Ej: Jerusalem Alta, Luz del Mundo...';
      case FamilyGroupSearchType.Country:
        return 'Ej: Perú, Colombia...';
      case FamilyGroupSearchType.Department:
        return 'Ej: Lima, Ayacucho, Puno...';
      case FamilyGroupSearchType.Province:
        return 'Ej: Huaraz, Lima, Huamanga...';
      case FamilyGroupSearchType.District:
        return 'Ej: Independencia, Los Olivos, SJL...';
      case FamilyGroupSearchType.UrbanSector:
        return 'Ej: Tahuantinsuyo, La Unificada...';
      case FamilyGroupSearchType.Address:
        return 'Ej: Av. Central 123...';
      default:
        return 'Escribe lo que deseas buscar...';
    }
  };

  const showInputField =
    searchType === FamilyGroupSearchType.FamilyGroupName ||
    searchType === FamilyGroupSearchType.FamilyGroupCode ||
    searchType === FamilyGroupSearchType.ZoneName ||
    searchType === FamilyGroupSearchType.Country ||
    searchType === FamilyGroupSearchType.Department ||
    searchType === FamilyGroupSearchType.Province ||
    searchType === FamilyGroupSearchType.District ||
    searchType === FamilyGroupSearchType.UrbanSector ||
    searchType === FamilyGroupSearchType.Address;

  const showSubTypeField =
    searchType === FamilyGroupSearchType.FirstNames ||
    searchType === FamilyGroupSearchType.LastNames ||
    searchType === FamilyGroupSearchType.FullNames;

  const showFirstNamesField =
    searchType === FamilyGroupSearchType.FirstNames ||
    searchType === FamilyGroupSearchType.FullNames;

  const showLastNamesField =
    searchType === FamilyGroupSearchType.LastNames ||
    searchType === FamilyGroupSearchType.FullNames;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end'
      >
        {/* Search Type */}
        <FormField
          control={form.control}
          name='searchType'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
            >
              <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                Tipo de Búsqueda
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                ¿Qué tipo de búsqueda deseas?
              </FormDescription>
              <Select
                onOpenChange={() => {
                  form.resetField('selectTerm', { keepError: true });
                  form.resetField('inputTerm', { keepError: true });
                  form.resetField('searchSubType', { keepError: true });
                  form.resetField('firstNamesTerm', { keepError: true });
                  form.resetField('lastNamesTerm', { keepError: true });
                }}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className='h-11 text-sm'>
                    <SelectValue placeholder='Selecciona un tipo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(FamilyGroupSearchTypeNames).map(([key, value]) => (
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

        {/* Sub Type (conditional) */}
        {showSubTypeField && (
          <FormField
            control={form.control}
            name='searchSubType'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Sub-tipo
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  ¿Qué sub-tipo de búsqueda deseas?
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  onOpenChange={() => {
                    form.resetField('firstNamesTerm', { defaultValue: '' });
                    form.resetField('lastNamesTerm', { defaultValue: '' });
                    form.resetField('selectTerm', { keepError: true });
                    form.resetField('inputTerm', { keepError: true });
                  }}
                >
                  <FormControl>
                    <SelectTrigger className='h-11 text-sm'>
                      {field.value ? (
                        <SelectValue placeholder='Selecciona un sub-tipo' />
                      ) : (
                        'Elige un sub-tipo'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(
                      searchType === FamilyGroupSearchType.FirstNames
                        ? SubTypeNamesFamilyGroupSearchByFirstNames
                        : searchType === FamilyGroupSearchType.LastNames
                          ? SubTypeNamesFamilyGroupSearchByLastNames
                          : SubTypeNamesFamilyGroupSearchByFullNames
                    ).map(([key, value]) => (
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
        )}

        {/* Input Term (conditional) */}
        {showInputField && (
          <FormField
            control={form.control}
            name='inputTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  {getInputLabel()}
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Escribe lo que deseas buscar
                </FormDescription>
                <FormControl>
                  <Input
                    className={cn(
                      'h-11 text-sm',
                      'transition-all duration-200',
                      'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                    )}
                    placeholder={getInputPlaceholder()}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        )}

        {/* First Names (conditional) */}
        {showFirstNamesField && (
          <FormField
            control={form.control}
            name='firstNamesTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Nombres
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Escribe los nombres que deseas buscar
                </FormDescription>
                <FormControl>
                  <Input
                    className={cn(
                      'h-11 text-sm',
                      'transition-all duration-200',
                      'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                    )}
                    placeholder='Ej: Rolando Martin...'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        )}

        {/* Last Names (conditional) */}
        {showLastNamesField && (
          <FormField
            control={form.control}
            name='lastNamesTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Apellidos
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Escribe los apellidos que deseas buscar
                </FormDescription>
                <FormControl>
                  <Input
                    className={cn(
                      'h-11 text-sm',
                      'transition-all duration-200',
                      'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                    )}
                    placeholder='Ej: Sanchez Torres...'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        )}

        {/* Select Term - Record Status (conditional) */}
        {searchType === FamilyGroupSearchType.RecordStatus && (
          <FormField
            control={form.control}
            name='selectTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Estado de Registro
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Selecciona una opción
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='h-11 text-sm'>
                      {field.value ? (
                        <SelectValue placeholder='Elige una opción' />
                      ) : (
                        'Elige una opción'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(FamilyGroupSearchNamesByRecordStatus).map(([key, value]) => (
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
        )}

        {/* Limit & All */}
        <div
          className='space-y-2 opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          <FormField
            control={form.control}
            name='limit'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Límite
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  ¿Cuántos registros necesitas?
                </FormDescription>
                <div className='flex gap-3'>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.getValues('all')}
                      className={cn(
                        'h-11 text-sm flex-1',
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                      )}
                      value={form.getValues('all') ? '-' : field.value || ''}
                      placeholder='Ej: 10'
                    />
                  </FormControl>
                  <FormField
                    control={form.control}
                    name='all'
                    render={({ field: allField }) => (
                      <FormItem className='flex items-center gap-2 p-3 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'>
                        <FormControl>
                          <Checkbox
                            disabled={!form.getValues('limit') || !!form.formState.errors.limit}
                            checked={allField?.value}
                            onCheckedChange={(checked) => allField.onChange(checked)}
                            className='data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700'
                          />
                        </FormControl>
                        <FormLabel className='text-sm font-medium cursor-pointer text-slate-600 dark:text-slate-400 !mt-0'>
                          Todos
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        </div>

        {/* Order */}
        <FormField
          control={form.control}
          name='order'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
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

        {/* Submit Button */}
        <div
          className={cn(
            'flex items-end opacity-0 animate-slide-in-up',
            !searchType && 'md:col-span-2 lg:col-span-1'
          )}
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          <Button
            disabled={isDisabledSubmitButton}
            type='submit'
            className={cn(
              'h-11 px-8 w-full font-semibold font-inter text-sm',
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
