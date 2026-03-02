import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/shared/lib/utils';
import { CountryNames } from '@/shared/enums/country.enum';
import { ProvinceNames } from '@/shared/enums/province.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { DepartmentNames } from '@/shared/enums/department.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';

import { getFullNames } from '@/shared/helpers/get-full-names.helper';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { type ZoneResponse } from '@/modules/zone/types';
import { type PreacherResponse } from '@/modules/preacher/types/preacher-response.interface';
import { type FamilyGroupResponse, type FamilyGroupFormData } from '@/modules/family-group/types';
import { FamilyGroupServiceTimeNames } from '@/modules/family-group/enums';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/shared/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

type FormMode = 'create' | 'update';

interface FamilyGroupFormFieldsProps {
  mode: FormMode;
  form: UseFormReturn<FamilyGroupFormData>;
  data?: FamilyGroupResponse;
  isInputDisabled: boolean;
  isSubmitButtonDisabled: boolean;
  isFormValid: boolean;
  isPending: boolean;
  isInputTheirZoneOpen: boolean;
  setIsInputTheirZoneOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirPreacherOpen: boolean;
  setIsInputTheirPreacherOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirZoneDisabled: boolean;
  isInputTheirPreacherDisabled: boolean;
  zonesQuery: UseQueryResult<ZoneResponse[], Error>;
  preachersQuery: UseQueryResult<PreacherResponse[], Error>;
  preachersByZoneQuery: UseQueryResult<PreacherResponse[], Error>;
  urbanSectorsValidation: ReturnType<typeof validateUrbanSectorsAllowedByDistrict>;
  districtsValidation: ReturnType<typeof validateDistrictsAllowedByModule>;
  handleSubmit: (formData: FamilyGroupFormData) => void;
}

export const FamilyGroupFormFields = ({
  mode,
  form,
  data,
  isInputDisabled,
  isSubmitButtonDisabled,
  isFormValid,
  isPending,
  isInputTheirZoneOpen,
  setIsInputTheirZoneOpen,
  isInputTheirPreacherOpen,
  setIsInputTheirPreacherOpen,
  isInputTheirPreacherDisabled,
  zonesQuery,
  preachersQuery,
  preachersByZoneQuery,
  urbanSectorsValidation,
  districtsValidation,
  handleSubmit,
}: FamilyGroupFormFieldsProps): JSX.Element => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='px-6 py-5'>
        {/* Title */}
        {mode === 'create' && (
          <div className='dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] mb-4'>
            Datos del Nuevo Grupo Familiar
          </div>
        )}
        {mode === 'update' && (
          <div className='dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] mb-4'>
            Grupo Familiar: {`${data?.familyGroupName} (${data?.familyGroupCode ?? 'SC'})`}
          </div>
        )}

        <div className='w-full flex flex-col md:grid md:grid-cols-2 gap-x-10 gap-y-5'>
          {/* Column 1 */}
          <div className='col-start-1 col-end-2'>
            {/* familyGroupName */}
            <FormField
              control={form.control}
              name='familyGroupName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Nombre</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    {mode === 'create'
                      ? 'Asigna una nombre al nuevo grupo familiar.'
                      : 'Asigna una nombre al grupo familiar.'}
                  </FormDescription>
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <Input
                      disabled={isInputDisabled}
                      placeholder='Ejem: Los Guerreros de Dios...'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* serviceTime */}
            <FormField
              control={form.control}
              name='serviceTime'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                    Horario de culto
                  </FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    {mode === 'create'
                      ? 'Asigna un horario de culto al nuevo grupo familiar.'
                      : 'Asigna un horario de culto al grupo familiar.'}
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isInputDisabled}
                  >
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona un horario' />
                        ) : (
                          'Selecciona un horario'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='h-[12rem] md:h-[15rem]'>
                      {Object.entries(FamilyGroupServiceTimeNames).map(([key, value]) => (
                        <SelectItem className='text-[14px]' key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* country */}
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>País</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Asigna el país al que pertenece el grupo familiar.
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isInputDisabled}
                  >
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona el país' />
                        ) : (
                          'Selecciona el país'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CountryNames).map(([key, value]) => (
                        <SelectItem className='text-[14px]' key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* department */}
            <FormField
              control={form.control}
              name='department'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                    Departamento
                  </FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Asigna el departamento al que pertenece el grupo familiar.
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isInputDisabled}
                  >
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona el departamento' />
                        ) : (
                          'Selecciona el departamento'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DepartmentNames).map(([key, value]) => (
                        <SelectItem className='text-[14px]' key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* province */}
            <FormField
              control={form.control}
              name='province'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Provincia</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Asigna la provincia a la que pertenece el grupo familiar.
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isInputDisabled}
                  >
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona la provincia' />
                        ) : (
                          'Selecciona la provincia'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ProvinceNames).map(([key, value]) => (
                        <SelectItem className='text-[14px]' key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* district */}
            <FormField
              control={form.control}
              name='district'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Distrito</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Asigna el distrito al que pertenece el grupo familiar.
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isInputDisabled}
                  >
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona el distrito' />
                        ) : (
                          'Selecciona el distrito'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DistrictNames).map(([key, value]) => (
                        <SelectItem
                          className={`text-[14px] ${districtsValidation?.districtsDataResult?.includes(value) ? 'hidden' : ''}`}
                          key={key}
                          value={key}
                        >
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />
          </div>

          {/* Column 2 */}
          <div className='col-start-2 col-end-3'>
            {/* urbanSector */}
            <FormField
              control={form.control}
              name='urbanSector'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                    Sector Urbano
                  </FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Asigna el sector urbano al que pertenece el grupo familiar.
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isInputDisabled}
                  >
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona el sector urbano' />
                        ) : (
                          'Selecciona el sector urbano'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(UrbanSectorNames).map(([key, value]) => (
                        <SelectItem
                          className={`text-[14px] ${(urbanSectorsValidation?.urbanSectorsDataResult?.includes(value) ?? !form.getValues('district')) ? 'hidden' : ''}`}
                          key={key}
                          value={key}
                        >
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* address */}
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Dirección</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Asigna la dirección al que pertenece el grupo familiar.
                  </FormDescription>
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <Input
                      disabled={isInputDisabled}
                      placeholder='Ej: Av. Central 123 - Mz.A Lt.3'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* referenceAddress */}
            <FormField
              control={form.control}
              name='referenceAddress'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                    Referencia de dirección
                  </FormLabel>
                  <FormControl className='text-[14px] md:text-[14px]'>
                    <Textarea
                      disabled={isInputDisabled}
                      placeholder='Comentarios sobre la referencia de ubicación del grupo familiar...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* theirZone — oculto en update, zona se mantiene sin cambio */}
            {mode === 'create' && (
              <FormField
                control={form.control}
                name='theirZone'
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex justify-between items-center'>
                      <p>Zona</p>
                    </FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Asigna la Zona a la que pertenecerá este Grupo Familiar.
                    </FormDescription>
                    <Popover open={isInputTheirZoneOpen} onOpenChange={setIsInputTheirZoneOpen}>
                      <PopoverTrigger asChild>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Button
                            disabled={isInputDisabled}
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'font-normal',
                              isInputDisabled && 'dark:bg-gray-100 dark:text-black bg-gray-200'
                            )}
                          >
                            {field.value
                              ? zonesQuery?.data?.find((zone) => zone.id === field.value)?.zoneName
                              : 'Busque y seleccione una zona'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command>
                          {zonesQuery?.data?.length && zonesQuery?.data?.length > 0 ? (
                            <>
                              <CommandInput
                                placeholder='Busque una zona'
                                className='h-9 text-[14px]'
                              />
                              <CommandEmpty>Zona no encontrada.</CommandEmpty>
                              <CommandGroup className='max-h-[200px] h-auto'>
                                {zonesQuery?.data?.map((zone) => (
                                  <CommandItem
                                    className='text-[14px]'
                                    value={zone.zoneName}
                                    key={zone.id}
                                    onSelect={() => {
                                      form.setValue('theirZone', zone?.id);
                                      setIsInputTheirZoneOpen(false);
                                    }}
                                  >
                                    {zone.zoneName}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        zone?.id === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          ) : (
                            zonesQuery?.data?.length === 0 && (
                              <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                ❌No hay zonas disponibles.
                              </p>
                            )
                          )}
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription className='text-[12.5px] md:text-[13px] text-blue-500 italic font-medium'>
                      * Si no hay zonas disponibles o necesitas una nueva zona, debes crearla en{' '}
                      <Link className='text-green-500 underline' to={'/zones/create'}>
                        Crear Zona.
                      </Link>
                    </FormDescription>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                )}
              />
            )}

            {/* theirPreacher */}
            <FormField
              control={form.control}
              name='theirPreacher'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Predicador</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Asigna el Predicador responsable para este Grupo Familiar.
                  </FormDescription>

                  {/* Loading state for update mode */}
                  {preachersByZoneQuery?.isFetching && mode === 'update' ? (
                    <div className='pt-2 font-black text-[16px] text-center dark:text-gray-300 text-gray-500'>
                      <span>Cargando predicadores...</span>
                    </div>
                  ) : (
                    <Popover
                      open={isInputTheirPreacherOpen}
                      onOpenChange={setIsInputTheirPreacherOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Button
                            disabled={isInputTheirPreacherDisabled}
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'font-normal',
                              isInputTheirPreacherDisabled &&
                              'dark:bg-gray-100 dark:text-black bg-gray-200'
                            )}
                          >
                            {/* Busca en preachersQuery (predicador actual asignado) y luego en preachersByZoneQuery (predicador nuevo disponible) */}
                            {field.value
                              ? `${preachersQuery?.data?.find((p) => p.id === field.value)?.member?.firstNames ?? ''} ${preachersQuery?.data?.find((p) => p.id === field.value)?.member?.lastNames ?? ''}`.trim() ||
                                `${preachersByZoneQuery?.data?.find((p) => p.id === field.value)?.member?.firstNames ?? ''} ${preachersByZoneQuery?.data?.find((p) => p.id === field.value)?.member?.lastNames ?? ''}`.trim() ||
                                'Busque y seleccione un predicador'
                              : 'Busque y seleccione un predicador'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command>
                          {/* Ambos modos: solo predicadores disponibles (sin grupo familiar) */}
                          {preachersByZoneQuery?.data && preachersByZoneQuery.data.length > 0 ? (
                            <>
                              <CommandInput
                                placeholder='Busque un predicador...'
                                className='h-9 text-[14px]'
                              />
                              <CommandEmpty>Predicador no encontrado.</CommandEmpty>
                              <CommandGroup className='max-h-[200px] h-auto'>
                                {preachersByZoneQuery.data.map((preacher) => (
                                  <CommandItem
                                    className='text-[14px]'
                                    value={getFullNames({
                                      firstNames: preacher?.member?.firstNames ?? '',
                                      lastNames: preacher?.member?.lastNames ?? '',
                                    })}
                                    key={preacher.id}
                                    onSelect={() => {
                                      form.setValue('theirPreacher', preacher.id);
                                      setIsInputTheirPreacherOpen(false);
                                    }}
                                  >
                                    {`${preacher?.member?.firstNames} ${preacher?.member?.lastNames}`}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        preacher.id === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          ) : (
                            <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center w-[20rem] py-2'>
                              ❌ No se encontró predicadores disponibles, todos están asignados a un
                              grupo familiar.
                            </p>
                          )}
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}

                  {mode === 'create' && (
                    <FormDescription className='text-[12.5px] md:text-[13px] text-blue-500 italic font-medium'>
                      * Si no hay predicadores disponibles o necesitas uno nuevo, debes crearlo en{' '}
                      <Link className='text-green-500 underline' to={'/preachers/create'}>
                        Crear Predicador.
                      </Link>
                    </FormDescription>
                  )}
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* recordStatus (update mode only) */}
            {mode === 'update' && (
              <FormField
                control={form.control}
                name='recordStatus'
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormLabel className='text-[14px] font-bold'>Estado</FormLabel>
                    <Select
                      disabled={isInputDisabled}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
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
                        <SelectItem className='text-[14px]' value='active'>
                          Activo
                        </SelectItem>
                        <SelectItem className='text-[14px]' value='inactive'>
                          Inactivo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.getValues('recordStatus') === 'active' && (
                      <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                        *El registro esta <span className='text-green-500'>Activo</span>, para
                        colocarla como <span className='text-red-500'>Inactivo</span> debe inactivar
                        el registro desde el modulo{' '}
                        <span className='font-bold text-red-500'>Inactivar Grupo Familiar.</span>
                      </FormDescription>
                    )}
                    {form.getValues('recordStatus') === 'inactive' && (
                      <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                        * El registro esta <span className='text-red-500'>Inactivo</span>, puede
                        modificar el estado eligiendo otra opción.
                      </FormDescription>
                    )}
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Submit area */}
          <div className='col-start-1 col-end-3 flex flex-col items-center gap-2 mt-2'>
            {!isFormValid && !isPending && (
              <p className='text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, completa todos los campos para guardar el registro.
              </p>
            )}
            {isFormValid && !isPending && (
              <p className='text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente! Para finalizar guarda los cambios.
              </p>
            )}
            <div className='w-full md:w-[20rem]'>
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className={cn(
                  'w-full text-[14px]',
                  isPending &&
                  'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                )}
              >
                {isPending
                  ? 'Procesando...'
                  : mode === 'create'
                    ? 'Registrar Grupo Familiar'
                    : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
