import { memo } from 'react';
import { Link } from 'react-router-dom';
import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/shared/lib/utils';
import { getFullNames } from '@/shared/helpers/get-full-names.helper';

import { CountryNames } from '@/shared/enums/country.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { ProvinceNames } from '@/shared/enums/province.enum';
import { DepartmentNames } from '@/shared/enums/department.enum';

import { type ZoneFormData, type ZoneResponse } from '@/modules/zone/types';
import { AlertUpdateRelationZone } from '@/modules/zone/components/alerts/AlertUpdateRelationZone';

import { type SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';

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
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/shared/components/ui/command';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

type FormMode = 'create' | 'update';

//* Hoisted static JSX - prevents recreation on every render
const FormDivider = memo(() => (
  <div className='border-t border-slate-200 dark:border-slate-700/50 my-5' />
));
FormDivider.displayName = 'FormDivider';

const SectionHeader = memo(({ title }: { title: string }) => (
  <div className='mb-4'>
    <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
      {title}
    </span>
  </div>
));
SectionHeader.displayName = 'SectionHeader';

//* Pre-computed arrays to avoid Object.entries on every render
const countryEntries = Object.entries(CountryNames);
const departmentEntries = Object.entries(DepartmentNames);
const provinceEntries = Object.entries(ProvinceNames);
const districtEntries = Object.entries(DistrictNames);

interface ZoneFormFieldsProps {
  mode: FormMode;
  form: UseFormReturn<ZoneFormData>;
  data?: ZoneResponse;
  isInputDisabled: boolean;
  isSubmitButtonDisabled: boolean;
  isFormValid: boolean;
  isPending: boolean;
  isInputTheirSupervisorOpen: boolean;
  setIsInputTheirSupervisorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  availableSupervisorsQuery: UseQueryResult<SupervisorResponse[], Error>;
  notAvailableSupervisorsData: SupervisorResponse[] | undefined;
  districtsValidation: { districtsDataResult: string[] | undefined } | undefined;
  handleSubmit: (formData: ZoneFormData) => void;
  //* Alert dialog props (optional - only for update mode)
  changedSupervisorId?: string | undefined;
  setChangedSupervisorId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  isAlertDialogOpen?: boolean;
  setIsAlertDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const formConfig = {
  create: {
    submitButtonText: 'Registrar Zona',
    submitButtonPendingText: 'Procesando...',
    successMessage: 'Campos completados. Puedes registrar la zona.',
    buttonGradient: 'from-emerald-500 to-teal-500',
    buttonHoverGradient: 'hover:from-emerald-600 hover:to-teal-600',
    buttonShadow: 'hover:shadow-emerald-500/20',
    pendingGradient: 'from-emerald-600 to-teal-600',
  },
  update: {
    submitButtonText: 'Guardar Cambios',
    submitButtonPendingText: 'Procesando...',
    successMessage: 'Campos completados. Puedes guardar los cambios.',
    buttonGradient: 'from-amber-500 to-orange-500',
    buttonHoverGradient: 'hover:from-amber-600 hover:to-orange-600',
    buttonShadow: 'hover:shadow-amber-500/20',
    pendingGradient: 'from-emerald-500 to-teal-500',
  },
};

export const ZoneFormFields = ({
  mode,
  form,
  data,
  isInputDisabled,
  isSubmitButtonDisabled,
  isFormValid,
  isPending,
  isInputTheirSupervisorOpen,
  setIsInputTheirSupervisorOpen,
  availableSupervisorsQuery,
  notAvailableSupervisorsData,
  districtsValidation,
  handleSubmit,
  changedSupervisorId,
  setChangedSupervisorId,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
}: ZoneFormFieldsProps): JSX.Element => {
  const config = formConfig[mode];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='p-5 md:p-6'>
        {/* Sección: Información General */}
        <div className='mb-6'>
          <SectionHeader title='Información General' />

          <div className='grid grid-cols-1 gap-x-6 gap-y-4'>
            <FormField
              control={form.control}
              name='zoneName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Nombre
                  </FormLabel>
                  <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                    Asigna un nombre a la zona.
                  </FormDescription>
                  <FormControl>
                    <Input
                      className='text-[13px] md:text-[14px] font-inter'
                      disabled={isInputDisabled}
                      placeholder='Ej: Jerusalem Alta'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-[12px]' />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormDivider />

        {/* Sección: Ubicación */}
        <div className='mb-6'>
          <SectionHeader title='Ubicación' />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    País
                  </FormLabel>
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona el país' />
                        ) : (
                          'Selecciona el país'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryEntries.map(([key, value]) => (
                        <SelectItem className='text-[13px]' key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[12px]' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='department'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Departamento
                  </FormLabel>
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona el departamento' />
                        ) : (
                          'Selecciona el departamento'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departmentEntries.map(([key, value]) => (
                        <SelectItem className='text-[13px]' key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[12px]' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='province'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Provincia
                  </FormLabel>
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona la provincia' />
                        ) : (
                          'Selecciona la provincia'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinceEntries.map(([key, value]) => (
                        <SelectItem className='text-[13px]' key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[12px]' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='district'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Distrito
                  </FormLabel>
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona el distrito' />
                        ) : (
                          'Selecciona el distrito'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districtEntries.map(([key, value]) => (
                        <SelectItem
                          className={`${districtsValidation?.districtsDataResult?.includes(value) ? 'hidden' : ''}`}
                          key={key}
                          value={key}
                        >
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[12px]' />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormDivider />

        {/* Sección: Relaciones */}
        <div className='mb-6'>
          <SectionHeader title='Relaciones' />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <FormField
              control={form.control}
              name='theirSupervisor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Supervisor
                  </FormLabel>
                  <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                    Asigna el Supervisor responsable de esta Zona.
                  </FormDescription>
                  <Popover
                    open={isInputTheirSupervisorOpen}
                    onOpenChange={setIsInputTheirSupervisorOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isInputDisabled}
                          variant='outline'
                          role='combobox'
                          className={cn('w-full justify-between text-[13px] md:text-[14px] font-inter')}
                        >
                          {field.value
                            ? (() => {
                              const found = notAvailableSupervisorsData?.find(
                                (s) => s.id === field.value
                              );
                              if (found) {
                                return `${found.member?.firstNames} ${found.member?.lastNames}`;
                              }
                              if (mode === 'update' && data?.theirSupervisor?.id === field.value) {
                                return `${data.theirSupervisor.firstNames} ${data.theirSupervisor.lastNames}`;
                              }
                              return 'Busque y seleccione un supervisor';
                            })()
                            : 'Busque y seleccione un supervisor'}
                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align='center' className='w-auto px-4 py-2'>
                      <Command>
                        {availableSupervisorsQuery.data?.length &&
                          availableSupervisorsQuery.data.length > 0 ? (
                          <>
                            <CommandInput
                              placeholder='Buscar supervisor...'
                              className='h-9 text-[13px]'
                            />
                            <CommandEmpty>Supervisor no encontrado.</CommandEmpty>
                            <CommandGroup className='max-h-[200px] h-auto w-[350px]'>
                              {availableSupervisorsQuery.data.map((supervisor) => (
                                <CommandItem
                                  className='text-[13px]'
                                  value={getFullNames({
                                    firstNames: supervisor?.member?.firstNames ?? '',
                                    lastNames: supervisor?.member?.lastNames ?? '',
                                  })}
                                  key={supervisor.id}
                                  onSelect={() => {
                                    form.setValue('theirSupervisor', supervisor.id, {
                                      shouldValidate: true,
                                    });
                                    if (mode === 'update' && setChangedSupervisorId) {
                                      setChangedSupervisorId(supervisor.id);
                                    }
                                    setIsInputTheirSupervisorOpen(false);
                                  }}
                                >
                                  {`${supervisor?.member?.firstNames} ${supervisor?.member?.lastNames}`}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      supervisor.id === field.value ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        ) : (
                          <p className='text-[13px] font-medium text-red-500 text-center py-2 w-[20rem]'>
                            ❌ No se encontraron supervisores disponibles.{' '}
                            {mode === 'create' && (
                              <Link className='text-green-500 underline' to='/supervisors/create'>
                                Crear Supervisor.
                              </Link>
                            )}
                          </p>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage className='text-[12px]' />
                </FormItem>
              )}
            />

            {/* Alert Dialog for Supervisor Change (update mode only) */}
            {mode === 'update' &&
              isAlertDialogOpen !== undefined &&
              setIsAlertDialogOpen &&
              setChangedSupervisorId && (
                <AlertUpdateRelationZone
                  data={data}
                  isAlertDialogOpen={isAlertDialogOpen}
                  setIsAlertDialogOpen={setIsAlertDialogOpen}
                  availableSupervisorsQuery={availableSupervisorsQuery}
                  zoneUpdateForm={form}
                  setChangedId={setChangedSupervisorId}
                  changedId={changedSupervisorId}
                />
              )}

            {/* Record Status (update mode only) */}
            {mode === 'update' && (
              <FormField
                control={form.control}
                name='recordStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                      Estado del Registro
                    </FormLabel>
                    <Select
                      disabled={isInputDisabled}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
                          {field.value === 'active' ? (
                            <SelectValue placeholder='Activo' />
                          ) : (
                            <SelectValue placeholder='Inactivo' />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className='text-[13px]' value='active'>
                          Activo
                        </SelectItem>
                        <SelectItem className='text-[13px]' value='inactive'>
                          Inactivo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.getValues('recordStatus') === 'active' ? (
                      <FormDescription className='text-[11px] md:text-[12px] text-slate-500 dark:text-slate-400 font-inter mt-2'>
                        El registro está{' '}
                        <span className='text-emerald-600 dark:text-emerald-400 font-semibold'>
                          Activo
                        </span>
                        . Para inactivarlo, use el módulo de{' '}
                        <span className='text-red-500 font-semibold'>Inactivar Zona</span>.
                      </FormDescription>
                    ) : null}
                    {form.getValues('recordStatus') === 'inactive' ? (
                      <FormDescription className='text-[11px] md:text-[12px] text-slate-500 dark:text-slate-400 font-inter mt-2'>
                        El registro está{' '}
                        <span className='text-red-500 font-semibold'>Inactivo</span>. Puede cambiar
                        el estado seleccionando otra opción.
                      </FormDescription>
                    ) : null}
                    <FormMessage className='text-[12px]' />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <FormDivider />

        {/* Footer: Messages and Submit Button */}
        <div className='flex flex-col items-center gap-4'>
          {!isFormValid ? (
            <p className='text-center text-[12px] md:text-[13px] font-medium text-red-500 font-inter px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
              Datos incompletos. Completa todos los campos requeridos.
            </p>
          ) : (
            <p className='text-center text-[12px] md:text-[13px] font-medium text-emerald-600 dark:text-emerald-400 font-inter px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'>
              {config.successMessage}
            </p>
          )}

          <Button
            disabled={isSubmitButtonDisabled}
            type='submit'
            className={cn(
              'w-full md:w-[280px] text-[13px] md:text-[14px] font-semibold font-inter',
              `bg-gradient-to-r ${config.buttonGradient} text-white`,
              config.buttonHoverGradient,
              `shadow-sm hover:shadow-md ${config.buttonShadow}`,
              'transition-all duration-200',
              isPending && `bg-gradient-to-r ${config.pendingGradient} hover:${config.pendingGradient}`
            )}
          >
            {isPending ? (
              <span className='flex items-center gap-2'>
                <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                {config.submitButtonPendingText}
              </span>
            ) : (
              config.submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
