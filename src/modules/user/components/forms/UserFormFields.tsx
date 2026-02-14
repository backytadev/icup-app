import { memo } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { CaretSortIcon } from '@radix-ui/react-icons';

import type * as z from 'zod';

import { type userFormSchema } from '@/modules/user/schemas/user-form-schema';
import { type UserResponse } from '@/modules/user/types/user-response.interface';
import { UserRole, UserRoleNames } from '@/modules/user/enums/user-role.enum';

import { type ChurchResponse } from '@/modules/church/types';
import { type MinistryResponse } from '@/modules/ministry/types';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';

import { cn } from '@/shared/lib/utils';
import { GenderNames } from '@/shared/enums/gender.enum';

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/shared/components/ui/command';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

type UserFormData = z.infer<typeof userFormSchema>;
type FormMode = 'create' | 'update';

//* Hoisted static JSX - prevents recreation on every render
const FormDivider = memo(() => (
  <div className='border-t border-slate-200 dark:border-slate-700/50 my-5' />
));
FormDivider.displayName = 'FormDivider';

interface UserFormFieldsProps {
  mode: FormMode;
  form: UseFormReturn<UserFormData>;
  data?: UserResponse;
  isInputDisabled: boolean;
  isSubmitButtonDisabled: boolean;
  isMessageErrorDisabled: boolean;
  isMessageErrorPasswordDisabled: boolean;
  isMessageErrorRolesDisabled: boolean;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirChurchesOpen: boolean;
  setIsInputTheirChurchesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirMinistriesOpen: boolean;
  setIsInputTheirMinistriesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword?: boolean;
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
  showPasswordConfirm?: boolean;
  setShowPasswordConfirm?: React.Dispatch<React.SetStateAction<boolean>>;
  churchesQuery: UseQueryResult<ChurchResponse[], Error>;
  ministriesQuery: UseQueryResult<MinistryResponse[], Error>;
  isPending: boolean;
  handleSubmit: (formData: UserFormData) => void;
}

const formConfig = {
  create: {
    submitButtonText: 'Registrar Usuario',
    submitButtonPendingText: 'Procesando...',
    successMessage: 'Campos completados. Puedes registrar el usuario.',
    errorMessage: 'Datos incompletos. Completa todos los campos requeridos.',
    errorPasswordMessage: 'Las contraseñas deben coincidir.',
    errorRolesMessage: 'Debes elegir al menos un rol.',
    buttonGradient: 'from-emerald-500 to-teal-500',
    buttonHoverGradient: 'hover:from-emerald-600 hover:to-teal-600',
    buttonShadow: 'hover:shadow-emerald-500/20',
    pendingGradient: 'from-emerald-600 to-teal-600',
  },
  update: {
    submitButtonText: 'Guardar cambios',
    submitButtonPendingText: 'Procesando...',
    successMessage: '¡Campos completados correctamente!',
    errorMessage: '❌ Datos incompletos, revisa todos los campos.',
    buttonColor: 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700',
    buttonShadow: 'hover:shadow-orange-500/20',
  },
};

export const UserFormFields = ({
  mode,
  form,
  data: _data,
  isInputDisabled,
  isSubmitButtonDisabled,
  isMessageErrorDisabled,
  isMessageErrorPasswordDisabled,
  isMessageErrorRolesDisabled,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
  isInputTheirChurchesOpen,
  setIsInputTheirChurchesOpen,
  isInputTheirMinistriesOpen,
  setIsInputTheirMinistriesOpen,
  showPassword,
  setShowPassword,
  showPasswordConfirm,
  setShowPasswordConfirm,
  churchesQuery,
  ministriesQuery,
  isPending,
  handleSubmit,
}: UserFormFieldsProps): JSX.Element => {
  const config = formConfig[mode];
  const roles = form.watch('roles');

  //* Password handlers (only for create mode)
  const toggleShowPassword = (): void => {
    if (setShowPassword) setShowPassword(!showPassword);
  };

  const toggleShowPasswordConfirm = (): void => {
    if (setShowPasswordConfirm) setShowPasswordConfirm(!showPasswordConfirm);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          'w-full',
          mode === 'create' && 'flex flex-col gap-y-6 md:grid md:grid-cols-2 md:gap-y-8 md:gap-x-10 p-5 md:p-6',
          mode === 'update' && 'grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-8 md:gap-x-10 p-5 md:p-6'
        )}
      >
        {/* Basic Information */}
        <FormField
          control={form.control}
          name='firstNames'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Nombres</FormLabel>
              <FormControl>
                <Input disabled={isInputDisabled} placeholder='Nombres del usuario' {...field} />
              </FormControl>
              <FormMessage className='text-[13px]' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='lastNames'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Apellidos</FormLabel>
              <FormControl>
                <Input disabled={isInputDisabled} placeholder='Apellidos del usuario' {...field} />
              </FormControl>
              <FormMessage className='text-[13px]' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='gender'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Género</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isInputDisabled}>
                <FormControl>
                  <SelectTrigger>
                    {field.value ? (
                      <SelectValue placeholder='Selecciona el tipo de género' />
                    ) : (
                      'Selecciona el tipo de género'
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(GenderNames).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className='text-[13px]' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                Correo Electrónico
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isInputDisabled}
                  placeholder='Dirección de correo electrónico'
                  type='email'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-[13px]' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='userName'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Usuario</FormLabel>
              <FormControl>
                <Input disabled={isInputDisabled} placeholder='Nombre de usuario' {...field} />
              </FormControl>
              <FormMessage className='text-[13px]' />
            </FormItem>
          )}
        />

        {/* Password fields - Only in create mode */}
        {mode === 'create' && (
          <>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        disabled={isInputDisabled}
                        placeholder='Contraseña'
                        autoComplete='new-password'
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                      />
                      <button
                        className='absolute right-2 top-3'
                        type='button'
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='passwordConfirm'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                    Confirmar Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        disabled={isInputDisabled}
                        placeholder='Confirmar contraseña'
                        autoComplete='new-password'
                        type={showPasswordConfirm ? 'text' : 'password'}
                        {...field}
                      />
                      <button
                        className='absolute right-2 top-3'
                        type='button'
                        onClick={toggleShowPasswordConfirm}
                      >
                        {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className='text-[13px]' />

                  {(form.formState.errors.password || form.formState.errors.passwordConfirm) && (
                    <div className='text-red-500 font-medium text-[13.5px] md:text-[13.5px]'>
                      <ul className='pl-2'>
                        <li className='pl-2'>✅ Al menos un dígito.</li>
                        <li className='pl-2'>✅ No espacios en blanco.</li>
                        <li className='pl-2'>✅ Al menos 1 carácter especial.</li>
                        <li className='pl-2'>✅ Mínimo 8 caracteres y máximo 15 caracteres.</li>
                        <li className='pl-2'>
                          ✅ Al menos una letra mayúscula y al menos una letra minúscula.
                        </li>
                      </ul>
                    </div>
                  )}
                </FormItem>
              )}
            />
          </>
        )}

        {/* Roles */}
        <FormField
          control={form.control}
          name='roles'
          render={() => (
            <FormItem className={cn(mode === 'create' && 'md:col-span-2')}>
              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Roles</FormLabel>
              <FormDescription className='text-[13px] md:text-[14px]'>
                Seleccione los roles
              </FormDescription>

              <div className='flex flex-col md:flex-row md:flex-wrap gap-4'>
                {Object.values(UserRole).map((role) => (
                  <FormField
                    key={role}
                    control={form.control}
                    name='roles'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center space-x-2 -space-y-1'>
                        <FormControl>
                          <Checkbox
                            disabled={isInputDisabled}
                            checked={field.value?.includes(role)}
                            onCheckedChange={(checked) => {
                              let updated: UserRole[] = [];
                              checked
                                ? (updated = field.value ? [...field.value, role] : [role])
                                : (updated = field.value?.filter((value) => value !== role) ?? []);

                              field.onChange(updated);
                            }}
                          />
                        </FormControl>
                        <FormLabel className='text-[14px] cursor-pointer'>
                          {UserRoleNames[role]}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage className='text-[13px]' />
            </FormItem>
          )}
        />

        {/* Churches Selection (for non-MinistryUser roles) */}
        {roles.length > 0 && !roles.includes(UserRole.MinistryUser) && (
          <FormField
            control={form.control}
            name='churches'
            render={({ field }) => {
              const selected = field.value || [];

              const toggle = (id: string) => {
                if (selected.includes(id)) {
                  form.setValue(
                    'churches',
                    selected.filter((v) => v !== id)
                  );
                } else {
                  form.setValue('churches', [...selected, id]);
                }
              };

              return (
                <FormItem className={cn(mode === 'create' && 'md:col-span-2')}>
                  <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
                    Iglesias
                  </FormLabel>
                  <Popover
                    open={isInputTheirChurchesOpen}
                    onOpenChange={setIsInputTheirChurchesOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          disabled={isInputDisabled}
                          className='w-full justify-between overflow-hidden'
                        >
                          <div className='flex flex-wrap gap-1'>
                            {selected.length === 0 && (
                              <span className='text-slate-500'>Busque y seleccione iglesias</span>
                            )}

                            {selected?.map((id) => {
                              const ch = churchesQuery?.data?.find((x) => x.id === id);
                              if (!ch) return null;

                              return (
                                <span
                                  key={id}
                                  className='text-xs bg-muted px-2 py-0.5 rounded-full border flex items-center gap-1 max-w-[10rem] truncate'
                                >
                                  {ch.abbreviatedChurchName}
                                </span>
                              );
                            })}
                          </div>

                          <CaretSortIcon className='ml-2 h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent align='center' className='w-auto px-4 py-2'>
                      <Command>
                        {churchesQuery?.data?.length ? (
                          <>
                            <CommandInput placeholder='Buscar iglesia' className='h-9' />
                            <CommandEmpty>Iglesia no encontrada.</CommandEmpty>

                            <CommandGroup className='max-h-[200px] overflow-auto'>
                              {churchesQuery?.data?.map((church) => {
                                const checked = selected.includes(church.id);

                                return (
                                  <CommandItem
                                    key={church.id}
                                    onSelect={() => toggle(church.id)}
                                    className='cursor-pointer'
                                  >
                                    <div className='flex items-center gap-2 w-full'>
                                      <input type='checkbox' readOnly checked={checked} />
                                      <span className='flex-1'>{church.abbreviatedChurchName}</span>
                                      {checked && <CheckIcon className='h-4 w-4' />}
                                    </div>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </>
                        ) : (
                          <p className='text-red-500 text-center'>
                            ❌ No hay iglesias disponibles.
                          </p>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              );
            }}
          />
        )}

        {/* Ministries Selection (for MinistryUser role) */}
        {roles.length > 0 && roles.includes(UserRole.MinistryUser) && (
          <FormField
            control={form.control}
            name='ministries'
            render={({ field }) => {
              const selected = field.value || [];

              const toggle = (id: string) => {
                if (selected.includes(id)) {
                  form.setValue(
                    'ministries',
                    selected.filter((v) => v !== id)
                  );
                } else {
                  form.setValue('ministries', [...selected, id]);
                }
              };

              return (
                <FormItem className={cn(mode === 'create' && 'md:col-span-2')}>
                  <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
                    Ministerios
                  </FormLabel>
                  <Popover
                    open={isInputTheirMinistriesOpen}
                    onOpenChange={setIsInputTheirMinistriesOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          disabled={isInputDisabled}
                          className='w-full justify-between overflow-hidden'
                        >
                          <div className='flex flex-wrap gap-1'>
                            {selected.length === 0 && (
                              <span className='text-slate-500'>
                                Busque y seleccione ministerios
                              </span>
                            )}

                            {selected?.map((id) => {
                              const ministry = ministriesQuery?.data?.find((x) => x.id === id);
                              if (!ministry) return null;

                              return (
                                <span
                                  key={id}
                                  className='text-xs bg-muted px-2 py-0.5 rounded-full border flex items-center gap-1 max-w-[10rem] truncate'
                                >
                                  {MinistryTypeNames[ministry.ministryType as MinistryType]}
                                </span>
                              );
                            })}
                          </div>

                          <CaretSortIcon className='ml-2 h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent align='center' className='w-auto px-4 py-2'>
                      <Command>
                        {ministriesQuery?.data?.length ? (
                          <>
                            <CommandInput placeholder='Buscar Ministerio' className='h-9' />
                            <CommandEmpty>Ministerio no encontrado.</CommandEmpty>

                            <CommandGroup className='max-h-[200px] overflow-auto'>
                              {ministriesQuery?.data?.map((ministry) => {
                                const checked = selected.includes(ministry.id);

                                return (
                                  <CommandItem
                                    key={ministry.id}
                                    onSelect={() => toggle(ministry.id)}
                                    className='cursor-pointer'
                                  >
                                    <div className='flex items-center gap-2 w-full'>
                                      <input type='checkbox' readOnly checked={checked} />
                                      <span className='flex-1'>
                                        {MinistryTypeNames[ministry.ministryType as MinistryType]}
                                      </span>
                                      {checked && <CheckIcon className='h-4 w-4' />}
                                    </div>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </>
                        ) : (
                          <p className='text-red-500 text-center'>
                            ❌ No hay ministerios disponibles.
                          </p>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription className='text-[12.5px] text-blue-500 dark:text-blue-400'>
                    Las iglesias se asignarán automáticamente según los ministerios seleccionados.
                  </FormDescription>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              );
            }}
          />
        )}

        {/* Record Status (update mode only) */}
        {mode === 'update' && (
          <FormField
            control={form.control}
            name='recordStatus'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className='text-[14px]'>Estado</FormLabel>
                  <Select disabled={isInputDisabled} onValueChange={field.onChange}>
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <SelectTrigger>
                        {field.value === 'active' ? (
                          <SelectValue placeholder='Activo' />
                        ) : (
                          <SelectValue placeholder='Inactivo' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className='text-[13px] md:text-[14px]' value='active'>
                        Activo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {form.getValues('recordStatus') === 'active' && (
                    <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                      *El registro esta <span className='text-green-500'>Activo</span>, para
                      colocar nuevamente como <span className='text-red-500'>inactivo</span>{' '}
                      inactivar el registro desde el modulo{' '}
                      <span className='font-bold text-red-500'>Inactivar Usuario.</span>
                    </FormDescription>
                  )}
                  {form.getValues('recordStatus') === 'inactive' && (
                    <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                      * El registro esta <span className='text-red-500'>inactivo</span>, puede
                      modificar el estado eligiendo otra opción.
                    </FormDescription>
                  )}
                  <FormMessage className='text-[13px]' />
                </FormItem>
              );
            }}
          />
        )}

        {/* Validation message and Submit button */}
        <div
          className={cn(
            'flex flex-col items-center gap-4',
            mode === 'create' && 'md:col-span-2 -mb-4',
            mode === 'update' && 'col-span-2 mt-4 pt-6 border-t border-slate-100 dark:border-slate-800'
          )}
        >
          {mode === 'create' ? (
            <>
              {isMessageErrorDisabled ? (
                <p className='text-center text-[12px] md:text-[13px] font-medium text-red-500 font-inter px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
                  {config.errorMessage}
                </p>
              ) : isMessageErrorPasswordDisabled ? (
                <p className='text-center text-[12px] md:text-[13px] font-medium text-red-500 font-inter px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
                  {formConfig.create.errorPasswordMessage}
                </p>
              ) : isMessageErrorRolesDisabled ? (
                <p className='text-center text-[12px] md:text-[13px] font-medium text-red-500 font-inter px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
                  {formConfig.create.errorRolesMessage}
                </p>
              ) : (
                <p className='text-center text-[12px] md:text-[13px] font-medium text-emerald-600 dark:text-emerald-400 font-inter px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'>
                  {config.successMessage}
                </p>
              )}
            </>
          ) : (
            <>
              {isMessageErrorDisabled ? (
                <p className='text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                  {config.errorMessage}
                </p>
              ) : (
                <p className='text-center text-emerald-500 text-[12.5px] md:text-[13px] font-bold animate-pulse'>
                  {config.successMessage}
                </p>
              )}
            </>
          )}

          <Button
            disabled={isSubmitButtonDisabled}
            type='submit'
            className={cn(
              'text-[13px] md:text-[14px] font-semibold font-inter transition-all duration-200',
              mode === 'create' &&
              `w-full md:w-[280px] bg-gradient-to-r ${formConfig.create.buttonGradient} text-white ${formConfig.create.buttonHoverGradient} shadow-sm hover:shadow-md ${formConfig.create.buttonShadow}`,
              mode === 'update' &&
              `w-full md:w-[22rem] h-11 text-[15px] shadow-md ${formConfig.update.buttonColor} text-white ${formConfig.update.buttonShadow}`,
              isPending && 'opacity-70 cursor-not-allowed'
            )}
            onClick={() => {
              setTimeout(() => {
                if (Object.keys(form.formState.errors).length === 0) {
                  setIsSubmitButtonDisabled(true);
                  setIsInputDisabled(true);
                }
              }, 100);
            }}
          >
            {isPending ? (
              mode === 'create' ? (
                <span className='flex items-center gap-2'>
                  <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  {config.submitButtonPendingText}
                </span>
              ) : (
                config.submitButtonPendingText
              )
            ) : (
              config.submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
