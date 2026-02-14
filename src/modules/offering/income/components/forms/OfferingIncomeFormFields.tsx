/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { memo } from 'react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil, User } from 'lucide-react';
import { TiDeleteOutline } from 'react-icons/ti';
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { type UseOfferingIncomeFormReturn } from '@/modules/offering/income/hooks/forms/useOfferingIncomeForm';

import {
  OfferingIncomeCreationType,
  OfferingIncomeCreationTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import {
  OfferingIncomeCreationSubType,
  OfferingIncomeCreationSubTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import {
  OfferingIncomeCreationCategory,
  OfferingIncomeCreationCategoryNames,
} from '@/modules/offering/income/enums/offering-income-creation-category.enum';
import { MemberType, MemberTypeNames } from '@/modules/offering/income/enums/member-type.enum';
import { OfferingIncomeCreationShiftTypeNames } from '@/modules/offering/income/enums/offering-income-creation-shift-type.enum';

import { ExternalDonorForm } from '@/modules/offering/income/components/forms';

import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';
import { OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';
import { DestroyImageButton } from '@/modules/offering/shared/components/DestroyImageButton';

import { cn } from '@/shared/lib/utils';
import { GenderNames } from '@/shared/enums/gender.enum';
import { getFullNames, getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { getCodeAndNameFamilyGroup } from '@/shared/helpers/get-code-and-name-family-group.helper';

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
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

//* Pre-computed entries
const typeEntries = Object.entries(OfferingIncomeCreationTypeNames);
const subTypeEntries = Object.entries(OfferingIncomeCreationSubTypeNames);
const categoryEntries = Object.entries(OfferingIncomeCreationCategoryNames);
const memberTypeEntries = Object.entries(MemberTypeNames);
const shiftTypeEntries = Object.entries(OfferingIncomeCreationShiftTypeNames);
const currencyTypeEntries = Object.entries(CurrencyTypeNames);
const genderEntries = Object.entries(GenderNames);

//* Memoized sub-components
const SectionHeader = memo(({ title, icon }: { title: string; icon?: string }) => (
  <div className='flex items-center gap-2 mb-3'>
    {icon && <span className='text-lg'>{icon}</span>}
    <h3 className='text-[14.5px] md:text-[15px] font-bold text-slate-700 dark:text-slate-200'>
      {title}
    </h3>
    <div className='flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600'></div>
  </div>
));
SectionHeader.displayName = 'SectionHeader';

//* Form config
const formConfig = {
  create: {
    buttonText: 'Registrar',
    buttonPendingText: 'Procesando...',
    buttonStyle:
      'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white',
    errorMessage: '❌ Datos incompletos, completa todos los campos para crear el registro.',
  },
  update: {
    buttonText: 'Guardar Cambios',
    buttonPendingText: 'Procesando...',
    buttonStyle:
      'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white',
    errorMessage: '❌ Datos incompletos, completa todos los campos para guardar el registro.',
  },
};

type FormMode = 'create' | 'update';

interface OfferingIncomeFormFieldsProps
  extends Omit<
    UseOfferingIncomeFormReturn,
    'mode' | 'isReceiptModalOpen' | 'setIsReceiptModalOpen' | 'receiptPdfBlob' | 'receiptOfferingId'
  > {
  mode: FormMode;
}

export const OfferingIncomeFormFields = ({
  mode,
  form,
  isInputDisabled,
  isSubmitButtonDisabled,
  isMessageErrorDisabled,
  isInputMemberDisabled,
  isPending,
  isProcessing,

  type,
  subType,
  category,
  isNewExternalDonor,
  memberType: _memberType,
  externalDonorId,
  comments,

  isInputZoneOpen,
  setIsInputZoneOpen,
  isInputFamilyGroupOpen,
  setIsInputFamilyGroupOpen,
  isInputDateOpen,
  setIsInputDateOpen,
  isInputDonorOpen,
  setIsInputDonorOpen,
  isInputBirthDateOpen,
  setIsInputBirthDateOpen,
  isInputMemberOpen,
  setIsInputMemberOpen,

  queryData,
  externalDonorsData,
  familyGroupsQuery,
  zonesQuery,
  pastorsQuery,
  copastorsQuery,
  supervisorsQuery,
  preachersQuery,
  disciplesQuery,

  files,
  rejected,
  removeFile,
  removeCloudFile,
  removeRejected,
  isDeleteFileButtonDisabled,

  setIsInputDisabled,
  setIsSubmitButtonDisabled,
  setIsDeleteFileButtonDisabled,
  setIsInputMemberDisabled: _setIsInputMemberDisabled,

  handleSubmit,
  mutation: _mutation,

  isOpen,
  setIsOpen,
  topRef,
  handleContainerClose,
  handleContainerScroll,
}: OfferingIncomeFormFieldsProps): JSX.Element => {
  const config = formConfig[mode];
  const isCreate = mode === 'create';
  const isUpdate = mode === 'update';

  const showPending = isCreate
    ? isPending && isProcessing
    : isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='w-full flex flex-col md:grid grid-cols-2 gap-x-8 gap-y-4 p-5 md:p-6'
      >
        <div className='md:col-start-1 md:col-end-2'>

          {/* SECTION 1: Classification */}
          <div className='space-y-4'>
            <SectionHeader title='Clasificación de Ofrenda' />
            <div className='pl-4 border-l-2 border-amber-200 dark:border-amber-800 space-y-4'>

              {/* Type */}
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Tipo</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        {isCreate
                          ? 'Asigna un tipo de ofrenda al nuevo registro.'
                          : 'Asignar un tipo de ofrenda al registro.'}
                      </FormDescription>
                      <Select
                        disabled={isUpdate || isInputDisabled}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona una tipo de ofrenda' />
                            ) : (
                              'Selecciona una tipo de ofrenda'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {typeEntries.map(([key, value]) => (
                            <SelectItem className='text-[14px]' key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />

              {/* Sub-Type */}
              {type === OfferingIncomeCreationType.Offering && (
                <FormField
                  control={form.control}
                  name='subType'
                  render={({ field }) => {
                    return (
                      <FormItem className='mt-3'>
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                          Sub-Tipo
                        </FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          {isCreate
                            ? 'Asigna un sub-tipo de ofrenda al nuevo registro.'
                            : 'Asignar un sub-tipo de ofrenda al registro.'}
                        </FormDescription>
                        <Select
                          disabled={isUpdate || isInputDisabled}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <SelectTrigger>
                              {field.value ? (
                                <SelectValue placeholder='Selecciona una sub-tipo de ofrenda' />
                              ) : (
                                'Selecciona una sub-tipo de ofrenda'
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subTypeEntries.map(([key, value]) => (
                              <SelectItem className='text-[14px]' key={key} value={key}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-[13px]' />
                      </FormItem>
                    );
                  }}
                />
              )}

              {/* Category */}
              {type === OfferingIncomeCreationType.Offering && (
                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => {
                    return (
                      <FormItem className='mt-3'>
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                          Categoría
                        </FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          Asigna una categoría al {isCreate ? 'nuevo ' : ''}registro.
                        </FormDescription>
                        <Select
                          disabled={isUpdate || isInputDisabled}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <SelectTrigger>
                              {field.value ? (
                                <SelectValue placeholder='Selecciona una categoría de ofrenda' />
                              ) : (
                                isCreate
                                  ? 'Selecciona una categoría'
                                  : 'Selecciona una categoría de ofrenda'
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isCreate
                              ? categoryEntries.map(([key, value]) =>
                                subType === OfferingIncomeCreationSubType.SundayService ||
                                  subType === OfferingIncomeCreationSubType.FamilyGroup ||
                                  subType === OfferingIncomeCreationSubType.GeneralFasting ||
                                  subType === OfferingIncomeCreationSubType.GeneralVigil ||
                                  subType === OfferingIncomeCreationSubType.ZonalFasting ||
                                  subType === OfferingIncomeCreationSubType.ZonalVigil ||
                                  subType === OfferingIncomeCreationSubType.ZonalEvangelism ||
                                  subType === OfferingIncomeCreationSubType.GeneralEvangelism ||
                                  subType === OfferingIncomeCreationSubType.UnitedService ||
                                  subType === OfferingIncomeCreationSubType.ZonalUnitedService ? (
                                  key === OfferingIncomeCreationCategory.OfferingBox && (
                                    <SelectItem key={key} value={key}>
                                      {value}
                                    </SelectItem>
                                  )
                                ) : subType === OfferingIncomeCreationSubType.Special ? (
                                  (key === OfferingIncomeCreationCategory.InternalDonation ||
                                    key === OfferingIncomeCreationCategory.ExternalDonation) && (
                                    <SelectItem key={key} value={key}>
                                      {value}
                                    </SelectItem>
                                  )
                                ) : subType === OfferingIncomeCreationSubType.ChurchGround ? (
                                  (key === OfferingIncomeCreationCategory.InternalDonation ||
                                    key === OfferingIncomeCreationCategory.ExternalDonation ||
                                    key === OfferingIncomeCreationCategory.FundraisingProChurchGround) && (
                                    <SelectItem key={key} value={key}>
                                      {value}
                                    </SelectItem>
                                  )
                                ) : subType === OfferingIncomeCreationSubType.Activities ? (
                                  (key === OfferingIncomeCreationCategory.Events ||
                                    key === OfferingIncomeCreationCategory.FundraisingProTemple ||
                                    key === OfferingIncomeCreationCategory.Meetings ||
                                    key === OfferingIncomeCreationCategory.SocialAid ||
                                    key === OfferingIncomeCreationCategory.General) && (
                                    <SelectItem key={key} value={key}>
                                      {value}
                                    </SelectItem>
                                  )
                                ) : (
                                  subType === OfferingIncomeCreationSubType.SundaySchool ||
                                    subType === OfferingIncomeCreationSubType.YouthService ? (
                                    (key === OfferingIncomeCreationCategory.OfferingBox ||
                                      key === OfferingIncomeCreationCategory.InternalDonation ||
                                      key === OfferingIncomeCreationCategory.ExternalDonation ||
                                      key === OfferingIncomeCreationCategory.FundraisingProMinistry) && (
                                      <SelectItem key={key} value={key}>
                                        {value}
                                      </SelectItem>
                                    )
                                  ) : (
                                    <SelectItem key={key} value={key}>
                                      {value}
                                    </SelectItem>
                                  )
                                )
                              )
                              : categoryEntries.map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-[13px]' />
                      </FormItem>
                    );
                  }}
                />
              )}

            </div>
          </div>
          {/* END SECTION 1: Classification */}

          {/* SECTION 2: Donor Information */}
          {(category === OfferingIncomeCreationCategory.ExternalDonation ||
            category === OfferingIncomeCreationCategory.InternalDonation) && (
              <div className='space-y-4 mt-6'>
                <SectionHeader title='Información del Donante' />
                <div className='pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-4'>

                  {/* External Donor: isNewExternalDonor checkbox (create only) */}
                  {isCreate && category === OfferingIncomeCreationCategory.ExternalDonation && (
                    <FormField
                      control={form.control}
                      name='isNewExternalDonor'
                      render={({ field }) => (
                        <FormItem className='flex flex-row gap-2 items-end mt-3 px-1 py-3 h-[2.5rem]'>
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <Checkbox
                              disabled={isInputDisabled}
                              checked={field?.value}
                              onCheckedChange={(checked) => {
                                form.resetField('externalDonorFirstNames', { keepDirty: true });
                                form.resetField('externalDonorLastNames', { keepDirty: true });
                                form.resetField('externalDonorGender', { keepDirty: true });
                                form.resetField('externalDonorBirthDate', { keepDirty: true });
                                form.resetField('externalDonorEmail', { keepDirty: true });
                                form.resetField('externalDonorPhoneNumber', { keepDirty: true });
                                form.resetField('externalDonorOriginCountry', { keepDirty: true });
                                form.resetField('externalDonorResidenceCountry', { keepDirty: true });
                                form.resetField('externalDonorResidenceCity', { keepDirty: true });
                                form.resetField('externalDonorPostalCode', { keepDirty: true });
                                form.resetField('externalDonorId', { keepDirty: true });
                                field.onChange(checked);
                              }}
                            />
                          </FormControl>
                          <div className='space-y-1 leading-none'>
                            <FormLabel className='text-[14px] md:text-[14px] cursor-pointer'>
                              ¿Esta persona es un nuevo donante?
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}

                  {/* MemberType (conditional) */}
                  {((type === OfferingIncomeCreationType.Offering &&
                    subType === OfferingIncomeCreationSubType.Special &&
                    category === OfferingIncomeCreationCategory.InternalDonation) ||
                    (type === OfferingIncomeCreationType.Offering &&
                      subType === OfferingIncomeCreationSubType.ChurchGround &&
                      category === OfferingIncomeCreationCategory.InternalDonation) ||
                    (type === OfferingIncomeCreationType.Offering &&
                      subType === OfferingIncomeCreationSubType.SundaySchool &&
                      category === OfferingIncomeCreationCategory.InternalDonation) ||
                    (type === OfferingIncomeCreationType.Offering &&
                      subType === OfferingIncomeCreationSubType.YouthService &&
                      category === OfferingIncomeCreationCategory.InternalDonation) ||
                    (isUpdate &&
                      type === OfferingIncomeCreationType.Offering &&
                      (subType === OfferingIncomeCreationSubType.ChurchGround ||
                        subType === OfferingIncomeCreationSubType.Special ||
                        subType === OfferingIncomeCreationSubType.SundaySchool ||
                        subType === OfferingIncomeCreationSubType.YouthService) &&
                      category === OfferingIncomeCreationCategory.ExternalDonation)) && (
                      <FormField
                        control={form.control}
                        name='memberType'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3'>
                              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                                Tipo de Miembro
                              </FormLabel>
                              <Select
                                disabled={isUpdate || isInputDisabled}
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <SelectTrigger>
                                    {field.value ? (
                                      <SelectValue placeholder='Selecciona el tipo de miembro' />
                                    ) : (
                                      'Selecciona el tipo de miembro'
                                    )}
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {memberTypeEntries.map(([key, value]) =>
                                    isCreate && key !== MemberType.ExternalDonor ? (
                                      <SelectItem className='text-[14px]' key={key} value={key}>
                                        {value}
                                      </SelectItem>
                                    ) : isUpdate ? (
                                      <SelectItem className='text-[14px]' key={key} value={key}>
                                        {value}
                                      </SelectItem>
                                    ) : null
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage className='text-[13px]' />
                            </FormItem>
                          );
                        }}
                      />
                    )}

                  {/* External Donor selector */}
                  {category === OfferingIncomeCreationCategory.ExternalDonation &&
                    (isUpdate || !isNewExternalDonor) && (
                      <FormField
                        control={form.control}
                        name='externalDonorId'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3'>
                              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                                Donante
                              </FormLabel>

                              <div className='flex justify-between items-center h-[1.5rem]'>
                                <FormDescription className='text-[13.5px] md:text-[14px]'>
                                  Asigna un donante para este registro.
                                </FormDescription>

                                {isCreate && (
                                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                      {externalDonorId && (
                                        <Button className='w-[3.3rem] h-5 m-0 py-4 dark:bg-slate-950 dark:hover:bg-slate-900 bg-white hover:bg-slate-100'>
                                          <Pencil className='h-4 w-6 sm:h-6 sm:w-6 dark:text-white text-black' />
                                        </Button>
                                      )}
                                    </DialogTrigger>

                                    <DialogContent
                                      ref={topRef as any}
                                      className='md:max-w-[700px] lg:max-w-[760px] xl:max-w-[760px] w-full max-h-full justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto'
                                    >
                                      <DialogTitle></DialogTitle>
                                      <DialogDescription></DialogDescription>
                                      <ExternalDonorForm
                                        id={externalDonorId!}
                                        data={externalDonorsData?.find((donor: any) => donor.id === field.value)}
                                        dialogClose={handleContainerClose}
                                        scrollToTop={handleContainerScroll}
                                        isCreate={false}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>

                              <Popover open={isInputDonorOpen} onOpenChange={setIsInputDonorOpen}>
                                <PopoverTrigger asChild>
                                  <FormControl className='text-[14px] md:text-[14px]'>
                                    <Button
                                      disabled={isUpdate || isInputDisabled}
                                      variant='outline'
                                      role='combobox'
                                      className={cn('w-full justify-between ')}
                                    >
                                      {field.value
                                        ? `${externalDonorsData?.find((donor: any) => donor.id === field.value)?.firstNames} ${externalDonorsData?.find((donor: any) => donor.id === field.value)?.lastNames}`
                                        : 'Busque y seleccione un donante'}
                                      <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align='center' className='w-auto px-4 py-2'>
                                  <Command>
                                    {externalDonorsData?.length && externalDonorsData?.length > 0 ? (
                                      <>
                                        <CommandInput
                                          placeholder='Busque un donante'
                                          className='h-9 text-[14px]'
                                        />
                                        <CommandEmpty>Donante no encontrado.</CommandEmpty>
                                        <CommandGroup className='max-h-[200px] h-auto'>
                                          {externalDonorsData?.map((donor: any) => (
                                            <CommandItem
                                              className='text-[14px]'
                                              value={getFullNames({
                                                firstNames: donor?.firstNames ?? '',
                                                lastNames: donor?.lastNames ?? '',
                                              })}
                                              key={donor?.id}
                                              onSelect={() => {
                                                form.setValue('externalDonorId', donor?.id);
                                                setIsInputDonorOpen(false);
                                              }}
                                            >
                                              {`${donor?.firstNames} ${donor?.lastNames}`}
                                              <CheckIcon
                                                className={cn(
                                                  'ml-auto h-4 w-4',
                                                  donor.id === field.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                                )}
                                              />
                                            </CommandItem>
                                          ))}

                                          {externalDonorsData?.length === 0 && (
                                            <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                              ❌No hay donantes disponibles.
                                            </p>
                                          )}
                                        </CommandGroup>
                                      </>
                                    ) : (
                                      (!externalDonorsData || externalDonorsData?.length === 0) && (
                                        <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                          ❌No hay donantes no disponibles.
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
                    )}

                  {/* New External Donor modal button (create only) */}
                  {isCreate &&
                    category === OfferingIncomeCreationCategory.ExternalDonation &&
                    isNewExternalDonor && (
                      <div className='mt-3'>
                        <div className='p-4 rounded-xl bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/30 border border-violet-200 dark:border-violet-800/40'>
                          <p className='text-sm font-semibold text-violet-700 dark:text-violet-300 font-inter mb-3'>
                            Registro de Donante Externo
                          </p>
                          <p className='text-xs text-violet-600 dark:text-violet-400 font-inter mb-4'>
                            Para continuar, debes registrar los datos del donante externo haciendo clic en el botón de abajo.
                          </p>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                type='button'
                                disabled={isInputDisabled}
                                className='w-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200'
                              >
                                <Pencil className='h-4 w-4 mr-2' />
                                Registrar Donante Externo
                              </Button>
                            </DialogTrigger>

                            <DialogContent
                              ref={topRef as any}
                              className='md:max-w-[700px] lg:max-w-[760px] xl:max-w-[760px] w-full max-h-full justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto'
                            >
                              <DialogTitle>Registrar Donante Externo</DialogTitle>
                              <DialogDescription>
                                Complete los datos del donante externo para continuar con el registro de la ofrenda.
                              </DialogDescription>

                              <div className='w-auto sm:w-[500px] md:w-[650px] lg:w-[700px] -mt-2'>
                                {/* Header */}
                                <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-violet-600 via-violet-700 to-purple-700 dark:from-violet-800 dark:via-violet-900 dark:to-purple-900 px-4 py-4 md:px-6 mb-5'>
                                  <div className='absolute inset-0 overflow-hidden'>
                                    <div className='absolute -top-1/2 -right-1/4 w-48 h-48 rounded-full bg-white/10' />
                                    <div className='absolute -bottom-1/4 -left-1/4 w-32 h-32 rounded-full bg-white/5' />
                                  </div>
                                  <div className='relative z-10'>
                                    <div className='flex items-center gap-3 mb-2'>
                                      <div className='p-2 bg-white/10 rounded-lg'>
                                        <User className='w-5 h-5 text-white/90' />
                                      </div>
                                      <div className='flex-1'>
                                        <h2 className='text-lg md:text-xl font-bold text-white font-outfit'>
                                          Datos del Donante Externo
                                        </h2>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className='px-1 space-y-5'>
                                  {/* Información Personal */}
                                  <div className='space-y-4'>
                                    <div className='flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700'>
                                      <h3 className='text-[13px] md:text-[14px] font-semibold text-violet-600 dark:text-violet-400 font-inter'>
                                        Información Personal
                                      </h3>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                      <FormField
                                        control={form.control}
                                        name='externalDonorFirstNames'
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                                              Nombres
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                disabled={isInputDisabled}
                                                className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                                                placeholder='Ej: Roberto Martin'
                                                type='text'
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage className='text-[12px] font-inter' />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name='externalDonorLastNames'
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                                              Apellidos
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                disabled={isInputDisabled}
                                                className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                                                placeholder='Ej: García Mendoza'
                                                type='text'
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage className='text-[12px] font-inter' />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name='externalDonorGender'
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                                              Género
                                            </FormLabel>
                                            <Select
                                              onValueChange={field.onChange}
                                              value={field.value}
                                              disabled={isInputDisabled}
                                            >
                                              <FormControl>
                                                <SelectTrigger className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'>
                                                  <SelectValue placeholder='Selecciona el género' />
                                                </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                {genderEntries.map(([key, value]) => (
                                                  <SelectItem
                                                    className='text-[13px] md:text-[14px] font-inter'
                                                    key={key}
                                                    value={key}
                                                  >
                                                    {value}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                            <FormMessage className='text-[12px] font-inter' />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name='externalDonorBirthDate'
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                                              Fecha de Nacimiento
                                            </FormLabel>
                                            <Popover
                                              open={isInputBirthDateOpen}
                                              onOpenChange={setIsInputBirthDateOpen}
                                            >
                                              <PopoverTrigger asChild>
                                                <FormControl>
                                                  <Button
                                                    disabled={isInputDisabled}
                                                    variant='outline'
                                                    className={cn(
                                                      'text-[13px] md:text-[14px] w-full pl-3 text-left font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700',
                                                      !field.value && 'text-muted-foreground'
                                                    )}
                                                  >
                                                    {field.value ? (
                                                      format(field.value, 'PPP', { locale: es })
                                                    ) : (
                                                      <span>Selecciona una fecha</span>
                                                    )}
                                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                  </Button>
                                                </FormControl>
                                              </PopoverTrigger>
                                              <PopoverContent className='w-auto p-0' align='start'>
                                                <Calendar
                                                  mode='single'
                                                  selected={field.value}
                                                  onSelect={(date) => {
                                                    field.onChange(date);
                                                    setIsInputBirthDateOpen(false);
                                                  }}
                                                  disabled={(date) =>
                                                    date > new Date() || date < new Date('1900-01-01')
                                                  }
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                            <FormMessage className='text-[12px] font-inter' />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>

                                  {/* Información de Origen */}
                                  <div className='space-y-4'>
                                    <div className='flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700'>
                                      <h3 className='text-[13px] md:text-[14px] font-semibold text-violet-600 dark:text-violet-400 font-inter'>
                                        Información de Origen
                                      </h3>
                                    </div>

                                    <FormField
                                      control={form.control}
                                      name='externalDonorOriginCountry'
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                                            País de Origen
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              disabled={isInputDisabled}
                                              className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                                              placeholder='Ej: España, México, Argentina...'
                                              type='text'
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage className='text-[12px] font-inter' />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  {/* Contacto y Residencia */}
                                  <div className='space-y-4'>
                                    <div className='flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700'>
                                      <h3 className='text-[13px] md:text-[14px] font-semibold text-violet-600 dark:text-violet-400 font-inter'>
                                        Contacto y Residencia
                                      </h3>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                      <FormField
                                        control={form.control}
                                        name='externalDonorEmail'
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                                              Email
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                disabled={isInputDisabled}
                                                className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                                                placeholder='Ej: ejemplo@correo.com'
                                                type='email'
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage className='text-[12px] font-inter' />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name='externalDonorPhoneNumber'
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                                              Teléfono
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                disabled={isInputDisabled}
                                                className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                                                placeholder='Ej: +51 999 999 999'
                                                type='text'
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage className='text-[12px] font-inter' />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name='externalDonorResidenceCountry'
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                                              País de Residencia
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                disabled={isInputDisabled}
                                                className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                                                placeholder='Ej: Perú, Colombia, Chile...'
                                                type='text'
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage className='text-[12px] font-inter' />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name='externalDonorResidenceCity'
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                                              Ciudad de Residencia
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                disabled={isInputDisabled}
                                                className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                                                placeholder='Ej: Lima, Bogotá, Santiago...'
                                                type='text'
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage className='text-[12px] font-inter' />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name='externalDonorPostalCode'
                                        render={({ field }) => (
                                          <FormItem className='md:col-span-2'>
                                            <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                                              Código Postal
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                disabled={isInputDisabled}
                                                className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                                                placeholder='Ej: 15001, 110111, 8320000...'
                                                type='text'
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage className='text-[12px] font-inter' />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className='flex gap-3 pt-2'>
                                    <DialogTrigger asChild>
                                      <Button
                                        type='button'
                                        variant='outline'
                                        className='flex-1 text-[13px] md:text-[14px] font-semibold font-inter border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                      >
                                        Cerrar
                                      </Button>
                                    </DialogTrigger>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    )}

                  {/* Member combobox */}
                  {((type === OfferingIncomeCreationType.Offering &&
                    subType === OfferingIncomeCreationSubType.Special &&
                    category === OfferingIncomeCreationCategory.InternalDonation) ||
                    (type === OfferingIncomeCreationType.Offering &&
                      subType === OfferingIncomeCreationSubType.ChurchGround &&
                      category === OfferingIncomeCreationCategory.InternalDonation) ||
                    (type === OfferingIncomeCreationType.Offering &&
                      subType === OfferingIncomeCreationSubType.SundaySchool &&
                      category === OfferingIncomeCreationCategory.InternalDonation) ||
                    (type === OfferingIncomeCreationType.Offering &&
                      subType === OfferingIncomeCreationSubType.YouthService &&
                      category === OfferingIncomeCreationCategory.InternalDonation)) && (
                      <FormField
                        control={form.control}
                        name='memberId'
                        render={({ field }) => (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Miembro
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Seleccione un miembro para asignarlo al registro.
                            </FormDescription>
                            {disciplesQuery?.isFetching ||
                              preachersQuery?.isFetching ||
                              supervisorsQuery?.isFetching ||
                              copastorsQuery?.isFetching ||
                              pastorsQuery?.isFetching ? (
                              <div className='pt-2 font-black text-[16px] text-center dark:text-gray-300 text-gray-500'>
                                <span>Cargando información...</span>
                              </div>
                            ) : (
                              <Popover open={isInputMemberOpen} onOpenChange={setIsInputMemberOpen}>
                                <PopoverTrigger asChild>
                                  <FormControl className='text-[14px] md:text-[14px]'>
                                    <Button
                                      disabled={isUpdate ? true : isInputMemberDisabled}
                                      variant='outline'
                                      role='combobox'
                                      className={cn(
                                        'w-full justify-between truncate',
                                        !field.value && 'font-normal'
                                      )}
                                    >
                                      {field.value
                                        ? `${(queryData as any)?.find((member: any) => member.id === field.value)?.member?.firstNames} ${(queryData as any)?.find((member: any) => member.id === field.value)?.member?.lastNames}`
                                        : 'Busque y seleccione un miembro'}
                                      <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align='center' className='w-auto px-4 py-2'>
                                  <Command>
                                    {(queryData as any)?.length && (queryData as any)?.length > 0 ? (
                                      <>
                                        <CommandInput
                                          placeholder='Busque un miembro...'
                                          className='h-9 text-[14px]'
                                        />
                                        <CommandEmpty>Miembro no encontrado.</CommandEmpty>
                                        <CommandGroup className='max-h-[200px] overflow-y-auto sm:overflow-y-hidden sm:h-auto'>
                                          {(queryData as any)?.map((member: any) => (
                                            <CommandItem
                                              className='text-[14px]'
                                              value={getFullNames({
                                                firstNames: member?.member?.firstNames ?? '',
                                                lastNames: member?.member?.lastNames ?? '',
                                              })}
                                              key={member.id}
                                              onSelect={() => {
                                                form.setValue('memberId', member.id);
                                                setIsInputMemberOpen(false);
                                              }}
                                            >
                                              {`${member?.member?.firstNames} ${member?.member?.lastNames}`}
                                              <CheckIcon
                                                className={cn(
                                                  'ml-auto h-4 w-4',
                                                  member.id === field.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                                )}
                                              />
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </>
                                    ) : (
                                      (queryData as any)?.length === 0 && (
                                        <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                          ❌No hay miembros disponibles.
                                        </p>
                                      )
                                    )}
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            )}
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        )}
                      />
                    )}

                </div>
              </div>
            )}
          {/* END SECTION 2: Donor Information */}

          {/* SECTION 3: Context (Family Group, Zone, Shift) */}
          {(type === OfferingIncomeCreationType.Offering &&
            ((subType === OfferingIncomeCreationSubType.FamilyGroup &&
              category === OfferingIncomeCreationCategory.OfferingBox) ||
              ([
                OfferingIncomeCreationSubType.ZonalFasting,
                OfferingIncomeCreationSubType.ZonalVigil,
                OfferingIncomeCreationSubType.ZonalUnitedService,
                OfferingIncomeCreationSubType.ZonalEvangelism,
              ].includes(subType as any) &&
                category === OfferingIncomeCreationCategory.OfferingBox) ||
              ([
                OfferingIncomeCreationSubType.SundayService,
                OfferingIncomeCreationSubType.SundaySchool,
              ].includes(subType as any) &&
                category === OfferingIncomeCreationCategory.OfferingBox))) && (
              <div className='space-y-4 mt-6'>
                <SectionHeader title='Contexto de la Ofrenda' />
                <div className='pl-4 border-l-2 border-emerald-200 dark:border-emerald-800 space-y-4'>

                  {/* Family Group combobox */}
                  {type === OfferingIncomeCreationType.Offering &&
                    subType === OfferingIncomeCreationSubType.FamilyGroup &&
                    category === OfferingIncomeCreationCategory.OfferingBox && (
                      <FormField
                        control={form.control}
                        name='familyGroupId'
                        render={({ field }) => (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Grupo Familiar
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Seleccione un grupo familiar para asignarlo al registro.
                            </FormDescription>
                            <Popover
                              open={isInputFamilyGroupOpen}
                              onOpenChange={setIsInputFamilyGroupOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <Button
                                    disabled={isUpdate || isInputDisabled}
                                    variant='outline'
                                    role='combobox'
                                    className={cn(
                                      'w-full justify-between truncate h-[50px] sm:h-auto',
                                      !field.value && 'text-slate-500 font-normal'
                                    )}
                                  >
                                    {field.value ? (
                                      <div className='flex justify-start flex-col sm:gap-2 sm:flex-row'>
                                        {(familyGroupsQuery?.data as any)?.find((fg: any) => fg.id === field.value)?.familyGroupName}{' '}
                                        ({(familyGroupsQuery?.data as any)?.find((fg: any) => fg.id === field.value)?.familyGroupCode}) ~{' '}
                                        <span className='text-left'>
                                          {getInitialFullNames({
                                            firstNames: (familyGroupsQuery?.data as any)?.find((fg: any) => fg.id === field.value)?.theirPreacher?.firstNames ?? '',
                                            lastNames: (familyGroupsQuery?.data as any)?.find((fg: any) => fg.id === field.value)?.theirPreacher?.lastNames ?? '',
                                          })}
                                        </span>
                                      </div>
                                    ) : (
                                      'Busque y seleccione un grupo familiar'
                                    )}
                                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align='center' className='w-full max-w-[90vw] px-4 py-2'>
                                <Command>
                                  {(familyGroupsQuery?.data as any)?.length > 0 ? (
                                    <>
                                      <CommandInput placeholder='Busque un grupo familiar...' className='h-9 text-[14px]' />
                                      <CommandEmpty>Grupo familiar no encontrado.</CommandEmpty>
                                      <CommandGroup className='max-h-[200px] overflow-y-auto sm:overflow-y-hidden sm:h-auto'>
                                        {(familyGroupsQuery?.data as any)?.map((familyGroup: any) => (
                                          <CommandItem
                                            className='text-[14px] w-full'
                                            value={getCodeAndNameFamilyGroup({
                                              code: familyGroup.familyGroupCode,
                                              name: familyGroup.familyGroupName,
                                              preacher: `${getInitialFullNames({ firstNames: familyGroup.theirPreacher?.firstNames ?? '', lastNames: familyGroup.theirPreacher?.lastNames ?? '' })}`,
                                            })}
                                            key={familyGroup.id}
                                            onSelect={() => {
                                              form.setValue('familyGroupId', familyGroup.id);
                                              setIsInputFamilyGroupOpen(false);
                                            }}
                                          >
                                            {`${familyGroup?.familyGroupName} (${familyGroup?.familyGroupCode}) ~ ${getInitialFullNames({ firstNames: familyGroup?.theirPreacher?.firstNames ?? '', lastNames: familyGroup?.theirPreacher?.lastNames ?? '' })}`}
                                            <CheckIcon className={cn('ml-auto h-4 w-4', familyGroup.id === field.value ? 'opacity-100' : 'opacity-0')} />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </>
                                  ) : (
                                    (familyGroupsQuery?.data as any)?.length === 0 && (
                                      <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                        ❌No hay grupos familiares disponibles.
                                      </p>
                                    )
                                  )}
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        )}
                      />
                    )}

                  {/* Zone combobox */}
                  {((type === OfferingIncomeCreationType.Offering &&
                    subType === OfferingIncomeCreationSubType.ZonalFasting &&
                    category === OfferingIncomeCreationCategory.OfferingBox) ||
                    (type === OfferingIncomeCreationType.Offering &&
                      subType === OfferingIncomeCreationSubType.ZonalVigil &&
                      category === OfferingIncomeCreationCategory.OfferingBox) ||
                    (type === OfferingIncomeCreationType.Offering &&
                      subType === OfferingIncomeCreationSubType.ZonalUnitedService &&
                      category === OfferingIncomeCreationCategory.OfferingBox) ||
                    (type === OfferingIncomeCreationType.Offering &&
                      subType === OfferingIncomeCreationSubType.ZonalEvangelism &&
                      category === OfferingIncomeCreationCategory.OfferingBox)) && (
                      <FormField
                        control={form.control}
                        name='zoneId'
                        render={({ field }) => (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Zona</FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Seleccione una zona para asignarlo al registro.
                            </FormDescription>
                            <Popover open={isInputZoneOpen} onOpenChange={setIsInputZoneOpen}>
                              <PopoverTrigger asChild>
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <Button
                                    disabled={isUpdate || isInputDisabled}
                                    variant='outline'
                                    role='combobox'
                                    className={cn('w-full justify-between truncate', !field.value && 'text-slate-500 font-normal')}
                                  >
                                    {field.value
                                      ? `${(zonesQuery?.data as any)?.find((z: any) => z.id === field.value)?.zoneName} ~ ${getInitialFullNames({ firstNames: (zonesQuery?.data as any)?.find((z: any) => z.id === field.value)?.theirSupervisor?.firstNames ?? '', lastNames: (zonesQuery?.data as any)?.find((z: any) => z.id === field.value)?.theirSupervisor?.lastNames ?? '' })}`
                                      : 'Busque y seleccione una zona'}
                                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align='center' className='w-auto px-4 py-2'>
                                <Command>
                                  {(zonesQuery?.data as any)?.length > 0 ? (
                                    <>
                                      <CommandInput placeholder='Busque una zona' className='h-9 text-[14px]' />
                                      <CommandEmpty>Zona no encontrada.</CommandEmpty>
                                      <CommandGroup className='max-h-[200px] overflow-y-auto sm:overflow-y-hidden sm:h-auto'>
                                        {(zonesQuery?.data as any)?.map((zone: any) => (
                                          <CommandItem
                                            className='text-[14px]'
                                            value={`${zone.zoneName} ${getInitialFullNames({ firstNames: zone?.theirSupervisor?.firstNames ?? '', lastNames: zone?.theirSupervisor?.lastNames ?? '' })}`}
                                            key={zone.id}
                                            onSelect={() => {
                                              form.setValue('zoneId', zone.id);
                                              setIsInputZoneOpen(false);
                                            }}
                                          >
                                            {`${zone.zoneName} ~ ${getInitialFullNames({ firstNames: zone?.theirSupervisor?.firstNames ?? '', lastNames: zone?.theirSupervisor?.lastNames ?? '' })}`}
                                            <CheckIcon className={cn('ml-auto h-4 w-4', zone.id === field.value ? 'opacity-100' : 'opacity-0')} />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </>
                                  ) : (
                                    (zonesQuery?.data as any)?.length === 0 && (
                                      <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                        ❌No hay zonas disponibles.
                                      </p>
                                    )
                                  )}
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        )}
                      />
                    )}

                  {/* Shift select */}
                  {(subType === OfferingIncomeCreationSubType.SundayService ||
                    subType === OfferingIncomeCreationSubType.SundaySchool) &&
                    category === OfferingIncomeCreationCategory.OfferingBox && (
                      <FormField
                        control={form.control}
                        name='shift'
                        render={({ field }) => (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Turno</FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Elige el turno de la ofrenda para el registro.
                            </FormDescription>
                            <Select disabled={isUpdate || isInputDisabled} value={field.value} onValueChange={field.onChange}>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona un turno para la ofrenda' />
                                  ) : (
                                    'Selecciona un turno para la ofrenda'
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {shiftTypeEntries.map(([key, value]) => (
                                  <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        )}
                      />
                    )}

                </div>
              </div>
            )}
          {/* END SECTION 3: Context */}

          {/* SECTION 4: Offering Details */}
          <div className='space-y-4 mt-6'>
            <SectionHeader title='Detalles de la Ofrenda' />
            <div className='pl-4 border-l-2 border-purple-200 dark:border-purple-800 space-y-4'>

              {/* Amount + Currency */}
              <div className={cn(isUpdate ? 'md:flex md:gap-5' : '')}>
                <FormField
                  control={form.control}
                  name='amount'
                  render={({ field }) => (
                    <FormItem className={cn('mt-3', isUpdate && 'w-full')}>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Monto</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        {isCreate ? 'Digita la cantidad o monto de la ofrenda.' : 'Digita el monto de la ofrenda.'}
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input disabled={isInputDisabled} placeholder='Monto total de la ofrenda' type='text' {...field} />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='currency'
                  render={({ field }) => (
                    <FormItem className={cn('mt-3', isUpdate && 'w-full')}>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Divisa / Moneda</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asignar un tipo de divisa {isCreate ? 'o moneda ' : ''}al registro.
                      </FormDescription>
                      <Select disabled={isInputDisabled} value={field.value} onValueChange={field.onChange}>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona una tipo de divisa o moneda' />
                            ) : (
                              'Selecciona una tipo de divisa o moneda'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencyTypeEntries.map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date + RecordStatus (update only) */}
              <div className={cn(
                isUpdate && 'md:flex md:gap-5',
                isUpdate && type === OfferingIncomeCreationType.IncomeAdjustment && 'md:flex-col md:gap-0'
              )}>
                <FormField
                  control={form.control}
                  name='date'
                  render={({ field }) => (
                    <FormItem className={cn('mt-3', isUpdate && 'w-full')}>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Fecha</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Selecciona la fecha de la ofrenda.
                      </FormDescription>
                      <Popover open={isInputDateOpen} onOpenChange={setIsInputDateOpen}>
                        <PopoverTrigger asChild>
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <Button
                              disabled={isInputDisabled}
                              variant={'outline'}
                              className={cn('text-[14px] w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                            >
                              {field.value ? (
                                format(field?.value, 'LLL dd, y', { locale: es })
                              ) : (
                                <span className='text-[14px]'>Seleccione la fecha de la ofrenda</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setIsInputDateOpen(false);
                            }}
                            disabled={
                              (subType === OfferingIncomeCreationSubType.SundayService ||
                                subType === OfferingIncomeCreationSubType.SundaySchool ||
                                subType === OfferingIncomeCreationSubType.FamilyGroup) &&
                                category === OfferingIncomeCreationCategory.OfferingBox
                                ? (date) => {
                                  const today = new Date();
                                  const minDate = new Date('1900-01-01');
                                  const dayOfWeek = date.getDay();
                                  return dayOfWeek !== 0 || date > today || date < minDate;
                                }
                                : subType === OfferingIncomeCreationSubType.YouthService &&
                                  category === OfferingIncomeCreationCategory.OfferingBox
                                  ? (date) => {
                                    const today = new Date();
                                    const minDate = new Date('1900-01-01');
                                    const dayOfWeek = date.getDay();
                                    return dayOfWeek !== 6 || date > today || date < minDate;
                                  }
                                  : (date) => date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />

                {isUpdate && (
                  <FormField
                    control={form.control}
                    name='recordStatus'
                    render={({ field }) => (
                      <FormItem className='mt-3 w-full'>
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Estado</FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          Selecciona el estado del registro.
                        </FormDescription>
                        <Select disabled={isInputDisabled} value={field.value} onValueChange={field.onChange}>
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
                            <SelectItem className='text-[14px]' value='active'>Activo</SelectItem>
                            <SelectItem className='text-[14px]' value='inactive'>Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-[13px]' />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Record status descriptions (update only) */}
              {isUpdate && form.getValues('recordStatus') === 'active' && (
                <FormDescription className='pl-2 text-[12px] xl:text-[13px] font-bold pt-2'>
                  *El registro esta <span className='text-green-500'>Activo</span>, para
                  colocarlo como <span className='text-red-500'>Inactivo</span> debe inactivar
                  el registro desde el modulo{' '}
                  <span className='font-bold text-red-500'>Inactivar Ingreso. </span>
                </FormDescription>
              )}
              {isUpdate && form.getValues('recordStatus') === 'inactive' && (
                <FormDescription className='pl-2 text-[12px] xl:text-[13px] font-bold pt-2'>
                  * El registro esta <span className='text-red-500 '>Inactivo</span>, y ya no
                  se podrá activar nuevamente.
                </FormDescription>
              )}

            </div>
          </div>
          {/* END SECTION 4: Offering Details */}

        </div>

        {/* Right column */}
        <div className='md:col-start-2 md:col-end-3 md:border-l-2 border-slate-200 dark:border-slate-800 md:pl-6'>
          {isCreate && (
            <div className='sticky top-6 space-y-6'>
              {/* SECTION 5: Additional Notes (Create Mode) */}
              <div className='space-y-4'>
                <SectionHeader title='Notas Adicionales' />
                <div className='pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-4'>
                  <FormField
                    control={form.control}
                    name='comments'
                    render={({ field }) => (
                      <FormItem className='mt-3'>
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center'>
                          Detalles / Observaciones
                          {type !== OfferingIncomeCreationType.IncomeAdjustment && (
                            <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[2px] rounded-full mr-1'>
                              Opcional
                            </span>
                          )}
                          {type === OfferingIncomeCreationType.IncomeAdjustment && (
                            <span className='ml-3 inline-block bg-orange-200 text-orange-600 border text-[10px] font-bold uppercase px-2 py-[2px] rounded-full mr-1'>
                              Requerido
                            </span>
                          )}
                        </FormLabel>
                        {type === OfferingIncomeCreationType.IncomeAdjustment && (
                          <FormDescription>
                            Escribe una breve descripción sobre el ajuste.
                          </FormDescription>
                        )}
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Textarea
                            disabled={isInputDisabled}
                            placeholder={`${type === OfferingIncomeCreationType.IncomeAdjustment
                              ? `Detalles y/u observaciones sobre el ajuste de ingreso...`
                              : 'Detalles y/u observaciones sobre el registro de la ofrenda...'
                              }`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[13px]' />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Receipt Preview Section - Minimalist */}
              <div className='space-y-4'>
                <SectionHeader title='Recibo de Ofrenda' />
                <div className='pl-4 border-l-2 border-amber-200 dark:border-amber-800 space-y-4'>
                  <FormField
                    control={form.control}
                    name='shouldOpenReceiptInBrowser'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center'>
                          ¿Mostrar recibo tras guardar?
                        </FormLabel>
                        <FormDescription className='text-[13px] md:text-[13.5px]'>
                          El recibo se generará automáticamente con código QR
                        </FormDescription>
                        <FormControl>
                          <RadioGroup
                            disabled={isInputDisabled}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                            className='flex flex-col gap-2 mt-3'
                          >
                            <FormItem className='flex items-center space-x-3 space-y-0'>
                              <FormControl>
                                <RadioGroupItem disabled={isInputDisabled} value='yes' />
                              </FormControl>
                              <FormLabel className='text-[13px] md:text-[13.5px] cursor-pointer font-normal text-slate-700 dark:text-slate-200'>
                                Sí, mostrar para imprimir
                              </FormLabel>
                            </FormItem>
                            <FormItem className='flex items-center space-x-3 space-y-0'>
                              <FormControl>
                                <RadioGroupItem value='no' />
                              </FormControl>
                              <FormLabel className='text-[13px] md:text-[13.5px] cursor-pointer font-normal text-slate-700 dark:text-slate-200'>
                                No, solo guardar
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            </div>
          )}

          {isUpdate && (
            <div className='space-y-6 mt-4 md:mt-0'>
              {/* SECTION 5: Additional Notes (Update Mode) */}
              <div className='space-y-4'>
                <SectionHeader title='Notas Adicionales' />
                <div className='pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-4'>
                  <FormField
                    control={form.control}
                    name='comments'
                    render={({ field }) => (
                      <FormItem className='mt-3'>
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center'>
                          Detalles / Observaciones
                          {type !== OfferingIncomeCreationType.IncomeAdjustment && (
                            <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[2px] rounded-full mr-1'>
                              Opcional
                            </span>
                          )}
                          {type === OfferingIncomeCreationType.IncomeAdjustment && (
                            <span className='ml-3 inline-block bg-orange-200 text-orange-600 border text-[10px] font-bold uppercase px-2 py-[2px] rounded-full mr-1'>
                              Requerido
                            </span>
                          )}
                        </FormLabel>
                        {type === OfferingIncomeCreationType.IncomeAdjustment && (
                          <FormDescription>
                            Escribe una breve descripción sobre el ajuste.
                          </FormDescription>
                        )}
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Textarea
                            className={cn(comments && 'min-h-[120px]')}
                            disabled={isInputDisabled}
                            placeholder={`${type === OfferingIncomeCreationType.IncomeAdjustment
                              ? `Detalles y/u observaciones sobre el ajuste de ingreso...`
                              : 'Detalles y/u observaciones sobre el registro de la ofrenda...'
                              }`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[13px]' />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Receipt Image Section */}
              <div>
                <h3 className='text-[14px] md:text-[14.5px] font-bold flex items-center mb-4'>
                  Imagen del Recibo{' '}
                  <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[2px] rounded-full mr-1'>
                    Solo lectura
                  </span>
                </h3>

                {files && files.length > 0 ? (
                  <ul className='space-y-6'>
                    {files.map((file) => {
                      const filePublicId = (file as any)
                        .split('/')
                        .pop()
                        ?.replace(/\.[^/.]+$/, '')
                        .toLowerCase();

                      return (
                        <li
                          key={file.name ?? file}
                          className='relative rounded-lg shadow-md shadow-gray-400 dark:shadow-slate-900 bg-white dark:bg-slate-900 overflow-hidden max-w-sm mx-auto'
                        >
                          <img
                            src={file.preview ?? file}
                            alt={file.name ?? file}
                            onLoad={() => {
                              URL.revokeObjectURL(file.preview ?? file);
                            }}
                            className='w-full h-auto max-h-80 object-contain rounded-lg'
                          />
                          {file?.name ? (
                            <Button
                              type='button'
                              disabled={isDeleteFileButtonDisabled}
                              className='border-none p-0 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 dark:hover:bg-slate-950 hover:bg-white'
                              onClick={() => removeFile(file.name)}
                            >
                              <TiDeleteOutline className='w-8 h-8 p-0 rounded-full fill-red-500 dark:hover:bg-white hover:bg-slate-200' />
                            </Button>
                          ) : (
                            <DestroyImageButton
                              fileType={OfferingFileType.Income}
                              isDeleteFileButtonDisabled={isDeleteFileButtonDisabled}
                              secureUrl={file as any}
                              removeCloudFile={removeCloudFile}
                            />
                          )}

                          <p className='mt-3 px-3 pb-3 text-center text-slate-500 text-[11px] md:text-[12px] font-medium'>
                            <a href={file as any} target='_blank' rel='noreferrer'>
                              {file.name ??
                                (file as any)
                                  .split('/')
                                  .slice(0, 3)
                                  .join('/')
                                  .replace('res.cloudinary.com', `cloudinary-${filePublicId}.com`)}
                            </a>
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className='border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center max-w-sm mx-auto'>
                    <p className='text-slate-500 dark:text-slate-400 text-sm'>
                      No hay imagen de recibo disponible
                    </p>
                  </div>
                )}

                {rejected && rejected.length > 0 && (
                  <div className='mt-6'>
                    <h3 className='text-[14.5px] lg:text-[16px] font-semibold border-b pb-3 mb-3'>
                      Archivos rechazados
                    </h3>
                    <ul className='space-y-2'>
                      {rejected.map(({ file, errors }) => (
                        <li key={file.name} className='flex items-start justify-between'>
                          <div>
                            <p className='text-neutral-500 text-sm font-medium'>{file.name}</p>
                            <ul className='text-[14px] text-red-400 flex gap-3 font-medium'>
                              {errors.map((error) => (
                                <li key={error.code}>
                                  {error.message === 'File type must be image/*'
                                    ? 'Tipo de archivo debe ser una imagen.'
                                    : 'Debe ser un archivo menor a 1000KB.'}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            type='button'
                            disabled={isDeleteFileButtonDisabled}
                            className='mt-1 py-1 text-[11px] md:text-[11.5px] uppercase tracking-wider font-bold text-red-500 border border-red-400 rounded-md px-3 hover:bg-red-500 hover:text-white ease-in duration-200 transition-colors'
                            onClick={() => removeRejected(file.name)}
                          >
                            remover
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Validation message */}
        {isMessageErrorDisabled ? (
          <p className='-mb-5 mt-2 md:-mb-2 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
            {config.errorMessage}
          </p>
        ) : (
          <p className='-mt-2 order-last md:-mt-3 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
            ¡Campos completados correctamente! <br />
          </p>
        )}

        {/* Submit button */}
        <div className='mt-2 col-start-1 col-end-3 row-start-3 row-end-4 w-full md:w-[20rem] md:m-auto'>
          <Button
            disabled={isSubmitButtonDisabled}
            type='submit'
            className={cn(
              'w-full text-[14px]',
              showPending && config.buttonStyle
            )}
            onClick={() => {
              setTimeout(() => {
                if (Object.keys(form.formState.errors).length === 0) {
                  setIsInputDisabled(true);
                  if (isUpdate) {
                    setIsDeleteFileButtonDisabled(true);
                  }
                  setIsSubmitButtonDisabled(true);
                }
              }, 100);
            }}
          >
            {showPending ? config.buttonPendingText : config.buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
