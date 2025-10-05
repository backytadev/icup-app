/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useCallback, useEffect, useRef, useState } from 'react';

import type * as z from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useQuery } from '@tanstack/react-query';
import { TiDeleteOutline } from 'react-icons/ti';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { getExternalDonors } from '@/modules/offering/income/services/offering-income.service';
import { DonorUpdateForm } from '@/modules/offering/income/components/cards/update/DonorUpdateForm';

import {
  OfferingIncomeCreationSubType,
  OfferingIncomeCreationSubTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import {
  OfferingIncomeCreationType,
  OfferingIncomeCreationTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import {
  OfferingIncomeCreationCategory,
  OfferingIncomeCreationCategoryNames,
} from '@/modules/offering/income/enums/offering-income-creation-category.enum';
import { MemberType, MemberTypeNames } from '@/modules/offering/income/enums/member-type.enum';
import { OfferingIncomeCreationShiftTypeNames } from '@/modules/offering/income/enums/offering-income-creation-shift-type.enum';

import { useOfferingIncomeFileDropZone } from '@/modules/offering/income/hooks/useOfferingIncomeFileDropZone';
import { useOfferingIncomeCreationMutation } from '@/modules/offering/income/hooks/useOfferingIncomeCreationMutation';
import { useOfferingIncomeCreationSubmitButtonLogic } from '@/modules/offering/income/hooks/useOfferingIncomeCreationSubmitButtonLogic';

import { offeringIncomeFormSchema } from '@/modules/offering/income/validations/offering-income-form-schema';

import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';
import { OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';

import { useModuleQueries } from '@/modules/offering/shared/hooks/useModuleQueries';
import { useImagesUploadMutation } from '@/modules/offering/shared/hooks/useImagesUploadMutation';

import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { type RejectionProps } from '@/modules/offering/shared/interfaces/rejected-props.interface';

import { getSimpleZones } from '@/modules/zone/services/zone.service';
import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleFamilyGroups } from '@/modules/family-group/services/family-group.service';

import { type PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';
import { type CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';
import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';
import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { type SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';

import { cn } from '@/shared/lib/utils';

import { GenderNames } from '@/shared/enums/gender.enum';
import { getCodeAndNameFamilyGroup } from '@/shared/helpers/get-code-and-name-family-group.helper';

import { PageTitle } from '@/shared/components/page-header/PageTitle';
import { getFullNames, getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

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

type QueryDataResponse =
  | DiscipleResponse[]
  | PreacherResponse[]
  | SupervisorResponse[]
  | CopastorResponse[]
  | PastorResponse[];

export const OfferingIncomeCreatePage = (): JSX.Element => {
  //* States
  const [isInputZoneOpen, setIsInputZoneOpen] = useState<boolean>(false);
  const [isInputFamilyGroupOpen, setIsInputFamilyGroupOpen] = useState<boolean>(false);
  const [isInputChurchOpen, setIsInputChurchOpen] = useState<boolean>(false);
  const [isInputDateOpen, setIsInputDateOpen] = useState<boolean>(false);
  const [isInputDonorOpen, setIsInputDonorOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);

  const [queryData, setQueryData] = useState<QueryDataResponse>();

  const [files, setFiles] = useState<FilesProps[]>([]);
  const [rejected, setRejected] = useState<RejectionProps[]>([]);

  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState<boolean>(false);

  const [isDeleteFileButtonDisabled, setIsDeleteFileButtonDisabled] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  const [isInputMemberDisabled, setIsInputMemberDisabled] = useState<boolean>(true);
  const [isInputMemberOpen, setIsInputMemberOpen] = useState<boolean>(false);

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  //* Form
  const form = useForm<z.infer<typeof offeringIncomeFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(offeringIncomeFormSchema),
    defaultValues: {
      type: '',
      subType: '',
      category: '',
      memberType: '',
      shift: '',
      amount: '',
      date: undefined,
      currency: '',
      comments: '',
      fileNames: [],
      familyGroupId: '',
      memberId: '',
      zoneId: '',
      churchId: '',
      shouldOpenReceiptInBrowser: 'yes',
    },
  });

  //* Watchers
  const type = form.watch('type');
  const churchId = form.watch('churchId');
  const subType = form.watch('subType');
  const category = form.watch('category');
  const isNewExternalDonor = form.watch('isNewExternalDonor');
  const memberType = form.watch('memberType');
  const externalDonorId = form.watch('externalDonorId');
  const shouldOpenReceiptInBrowser = form.watch('shouldOpenReceiptInBrowser');

  //* Custom hooks
  useOfferingIncomeCreationSubmitButtonLogic({
    isInputDisabled,
    isDropZoneDisabled,
    setIsDropZoneDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
    isDeleteFileButtonDisabled,
    offeringIncomeCreationForm: form,
  });

  //* Queries
  const { data } = useQuery({
    queryKey: ['external-donors', churchId],
    queryFn: getExternalDonors,
    retry: false,
    enabled: category === OfferingIncomeCreationCategory.ExternalDonation,
  });

  const churchesQuery = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  const familyGroupsQuery = useQuery({
    queryKey: ['family-groups', churchId],
    queryFn: () => getSimpleFamilyGroups({ isSimpleQuery: false, churchId }),
    retry: false,
    enabled: !!churchId,
  });

  const zonesQuery = useQuery({
    queryKey: ['zones', churchId],
    queryFn: () => getSimpleZones({ isSimpleQuery: false, churchId }),
    retry: false,
    enabled: !!churchId,
  });

  const { pastorsQuery, copastorsQuery, supervisorsQuery, preachersQuery, disciplesQuery } =
    useModuleQueries({ memberType });

  const { onDrop, removeAll, removeFile, removeRejected } = useOfferingIncomeFileDropZone({
    offeringIncomeForm: form,
    files,
    setFiles,
    setRejected,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 1024 * 1000, // 1KB
    onDrop,
    // disabled: isDropZoneDisabled,
    disabled: true,
  });

  const offeringIncomeCreationMutation = useOfferingIncomeCreationMutation({
    setFiles,
    imageUrls,
    shouldOpenReceiptInBrowser,
    setIsInputDisabled,
    setIsInputMemberDisabled,
    setIsSubmitButtonDisabled,
    setIsDeleteFileButtonDisabled,
    offeringIncomeCreationForm: form,
  });

  const uploadImagesMutation = useImagesUploadMutation();

  //* Effects
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (offeringIncomeCreationMutation?.isPending) {
      setIsProcessing(true);
      timer = setTimeout(() => setIsProcessing(false), 4500);
    }

    return () => clearTimeout(timer);
  }, [offeringIncomeCreationMutation?.isPending]);

  useEffect(() => {
    if (memberType === MemberType.Disciple) setQueryData(disciplesQuery.data);
    if (memberType === MemberType.Preacher) setQueryData(preachersQuery.data);
    if (memberType === MemberType.Supervisor) setQueryData(supervisorsQuery.data);
    if (memberType === MemberType.Copastor) setQueryData(copastorsQuery.data);
    if (memberType === MemberType.Pastor) setQueryData(pastorsQuery.data);
  }, [pastorsQuery, copastorsQuery, supervisorsQuery, preachersQuery, disciplesQuery]);

  useEffect(() => {
    if (memberType) {
      setIsInputMemberDisabled(false);
    }
    if (!memberType) {
      setIsInputMemberDisabled(true);
    }
    form.resetField('memberId', {
      keepError: true,
    });
  }, [memberType]);

  useEffect(() => {
    if (
      type === OfferingIncomeCreationType.IncomeAdjustment ||
      subType !== OfferingIncomeCreationSubType.FamilyGroup
    ) {
      form.setValue('shouldOpenReceiptInBrowser', 'no');
    }

    if (subType === OfferingIncomeCreationSubType.FamilyGroup) {
      form.setValue('shouldOpenReceiptInBrowser', 'yes');
    }
  }, [type, subType]);

  useEffect(() => {
    document.title = 'Modulo Ofrenda - IcupApp';
  }, []);

  //* Functions
  const handleContainerScroll = useCallback((): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleContainerClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  //* Form handler
  const handleSubmit = async (
    formData: z.infer<typeof offeringIncomeFormSchema>
  ): Promise<void> => {
    let imageUrls;

    try {
      //* This only works with dropzone (it is inactivate)
      if (files.length >= 1) {
        const uploadResult = await uploadImagesMutation.mutateAsync({
          files: files as any,
          fileType: OfferingFileType.Income,
          offeringType: formData.type,
          offeringSubType: formData.subType ?? null,
        });

        imageUrls = uploadResult.imageUrls;
        setImageUrls(imageUrls ?? []);
      }

      await offeringIncomeCreationMutation.mutateAsync({
        type: formData.type,
        subType: formData.subType,
        category: formData.category,
        isNewExternalDonor: formData.isNewExternalDonor,
        externalDonorId: formData.externalDonorId,
        externalDonorFirstNames: formData.externalDonorFirstNames,
        externalDonorLastNames: formData.externalDonorLastNames,
        externalDonorGender: formData.externalDonorGender,
        externalDonorBirthDate: formData.externalDonorBirthDate,
        externalDonorEmail: formData.externalDonorEmail,
        externalDonorPhoneNumber: formData.externalDonorPhoneNumber,
        externalDonorOriginCountry: formData.externalDonorOriginCountry,
        externalDonorResidenceCountry: formData.externalDonorResidenceCountry,
        externalDonorResidenceCity: formData.externalDonorResidenceCity,
        externalDonorPostalCode: formData.externalDonorPostalCode,
        shift: formData.shift,
        amount: formData.amount,
        currency: formData.currency,
        date: formData.date,
        comments: formData.comments,
        memberType: formData.memberType,
        memberId: formData.memberId,
        familyGroupId: formData.familyGroupId,
        zoneId: formData.zoneId,
        churchId: formData.churchId,
        recordStatus: formData.recordStatus,
        imageUrls: imageUrls ?? [],
      });
    } catch (error) {
      if (uploadImagesMutation.isError) {
        toast.warning(
          '¡Oops! Fallo en la subida de imágenes, por favor actualize el navegador y vuelva a intentarlo.',
          {
            position: 'top-center',
            className: 'justify-center',
          }
        );
      }

      setTimeout(() => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      }, 1500);
    }
  };

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-green-600'>Modulo de Ingreso</PageTitle>

      <h1 className='text-left leading-8 pb-[8px] pt-2 px-4 sm:px-5 2xl:px-10 font-sans font-bold text-green-500 text-[1.6rem] sm:text-[1.75rem] md:text-[1.85rem] lg:text-[1.9rem] xl:text-[2.1rem] 2xl:text-4xl'>
        Crear nuevo ingreso de ofrenda
      </h1>
      <p className='dark:text-slate-300 text-left font-sans font-bold pl-5 pr-6 sm:pl-7 2xl:px-14 text-[13.5px] md:text-[15px] xl:text-base'>
        Por favor llena los siguientes datos para crear un nuevo registro de ingreso.
      </p>

      <div className='flex flex-col items-center pb-8 gap-y-8 md:gap-y-12 px-6 py-4 sm:px-12 sm:py-8 2xl:px-[5rem] 2xl:py-8'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='w-full flex flex-col md:grid grid-cols-2 gap-x-8 gap-y-4'
          >
            <div className='md:col-start-1 md:col-end-2'>
              <FormField
                control={form.control}
                name='churchId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Iglesia
                    </FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Selecciona la iglesia de destino para este registro.
                    </FormDescription>
                    <Popover open={isInputChurchOpen} onOpenChange={setIsInputChurchOpen}>
                      <PopoverTrigger asChild>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Button
                            disabled={isInputDisabled}
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'text-[14px] w-full justify-between',
                              !field.value && 'text-slate-500 font-normal'
                            )}
                          >
                            {field.value
                              ? churchesQuery?.data?.find((zone) => zone.id === field.value)
                                  ?.abbreviatedChurchName
                              : 'Busque y seleccione una iglesia'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command>
                          {churchesQuery?.data?.length && churchesQuery?.data?.length > 0 ? (
                            <>
                              <CommandInput
                                placeholder='Busque una iglesia'
                                className='h-9 text-[14px]'
                              />
                              <CommandEmpty>Iglesia no encontrada.</CommandEmpty>
                              <CommandGroup className='max-h-[200px] h-auto'>
                                {churchesQuery?.data?.map((church) => (
                                  <CommandItem
                                    className='text-[14px]'
                                    value={church.abbreviatedChurchName}
                                    key={church.id}
                                    onSelect={() => {
                                      form.setValue('churchId', church.id);
                                      setIsInputChurchOpen(false);
                                    }}
                                  >
                                    {church.abbreviatedChurchName}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        church.id === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          ) : (
                            churchesQuery?.data?.length === 0 && (
                              <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                ❌No hay iglesias disponibles.
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

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Tipo</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna un tipo de ofrenda al nuevo registro.
                      </FormDescription>
                      <Select
                        disabled={isInputDisabled}
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
                          {Object.entries(OfferingIncomeCreationTypeNames).map(([key, value]) => (
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
                          Asigna un sub-tipo de ofrenda al nuevo registro.
                        </FormDescription>
                        <Select
                          disabled={isInputDisabled}
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
                            {Object.entries(OfferingIncomeCreationSubTypeNames).map(
                              ([key, value]) => (
                                <SelectItem className='text-[14px]' key={key} value={key}>
                                  {value}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-[13px]' />
                      </FormItem>
                    );
                  }}
                />
              )}

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
                          Asigna una categoría al nuevo registro.
                        </FormDescription>
                        <Select
                          disabled={isInputDisabled}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <SelectTrigger>
                              {field.value ? (
                                <SelectValue placeholder='Selecciona una categoría de ofrenda' />
                              ) : (
                                'Selecciona una categoría'
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(OfferingIncomeCreationCategoryNames).map(
                              ([key, value]) =>
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
                                    key ===
                                      OfferingIncomeCreationCategory.FundraisingProChurchGround) && (
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
                                  // subType === OfferingIncomeCreationSubType.SundaySchool ||
                                  //   subType === OfferingIncomeCreationSubType.YouthService ? (
                                  //   (key === OfferingIncomeCreationCategory.OfferingBox ||
                                  //     key === OfferingIncomeCreationCategory.InternalDonation ||
                                  //     key === OfferingIncomeCreationCategory.ExternalDonation ||
                                  //     key ===
                                  //       OfferingIncomeCreationCategory.FundraisingProMinistry
                                  //     ) && (
                                  //     <SelectItem key={key} value={key}>
                                  //       {value}
                                  //     </SelectItem>
                                  //   )
                                  // ) :
                                  <SelectItem key={key} value={key}>
                                    {value}
                                  </SelectItem>
                                )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-[13px]' />
                      </FormItem>
                    );
                  }}
                />
              )}

              {category === OfferingIncomeCreationCategory.ExternalDonation && (
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

              {category === OfferingIncomeCreationCategory.ExternalDonation &&
                !isNewExternalDonor && (
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

                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                              <DialogTrigger asChild>
                                {externalDonorId && (
                                  <Button className='w-[3.3rem] h-5 m-0 py-4 dark:bg-slate-950 dark:hover:bg-slate-900 bg-white hover:bg-slate-100'>
                                    <Pencil className='h-4 w-6 sm:h-6 sm:w-6 dark:text-white text-black' />
                                  </Button>
                                )}
                              </DialogTrigger>

                              <DialogContent
                                ref={topRef}
                                className='md:max-w-[700px] lg:max-w-[760px] xl:max-w-[760px] w-full max-h-full justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto'
                              >
                                <DialogTitle></DialogTitle>
                                <DialogDescription></DialogDescription>
                                <DonorUpdateForm
                                  id={externalDonorId}
                                  data={data?.find((donor) => donor.id === field.value)}
                                  dialogClose={handleContainerClose}
                                  scrollToTop={handleContainerScroll}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>

                          <Popover open={isInputDonorOpen} onOpenChange={setIsInputDonorOpen}>
                            <PopoverTrigger asChild>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Button
                                  disabled={isInputDisabled}
                                  variant='outline'
                                  role='combobox'
                                  className={cn('w-full justify-between ')}
                                >
                                  {field.value
                                    ? `${data?.find((donor) => donor.id === field.value)?.firstNames} ${data?.find((donor) => donor.id === field.value)?.lastNames}`
                                    : 'Busque y seleccione un donante'}
                                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent align='center' className='w-auto px-4 py-2'>
                              <Command>
                                {data?.length && data?.length > 0 ? (
                                  <>
                                    <CommandInput
                                      placeholder='Busque un donante'
                                      className='h-9 text-[14px]'
                                    />
                                    <CommandEmpty>Donante no encontrado.</CommandEmpty>
                                    <CommandGroup className='max-h-[200px] h-auto'>
                                      {data?.map((donor) => (
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
                                              donor.id === field.value ? 'opacity-100' : 'opacity-0'
                                            )}
                                          />
                                        </CommandItem>
                                      ))}

                                      {data?.length === 0 && (
                                        <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                          ❌No hay donantes disponibles.
                                        </p>
                                      )}
                                    </CommandGroup>
                                  </>
                                ) : (
                                  (!data || data?.length === 0) && (
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

              {category === OfferingIncomeCreationCategory.ExternalDonation &&
                isNewExternalDonor && (
                  <div className='flex flex-col md:grid md:grid-cols-1 w-full rounded-md p-3 border-2 dark:border-yellow-500 border-emerald-500'>
                    <span className='text-[14px] italic font-semibold text-blue-500 dark:text-orange-500'>
                      Por favor llena los siguientes datos para registrar al donante.
                    </span>
                    <div className='flex flex-col md:flex-row w-full md:gap-6 mt-2'>
                      <FormField
                        control={form.control}
                        name='externalDonorFirstNames'
                        render={({ field }) => {
                          return (
                            <FormItem className='w-full'>
                              <div className='flex justify-between items-center'>
                                <FormLabel className='text-[14px] md:text-[14.5px] font-bold dark:text-amber-500 text-emerald-500'>
                                  Nombres
                                </FormLabel>
                                <span className='ml-3 inline-block bg-red-200 text-red-600 border text-[9px] md:text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                  Requerido
                                </span>
                              </div>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Input
                                  className='text-[14px]'
                                  disabled={isInputDisabled}
                                  placeholder='Ejem: Ramiro Ignacio'
                                  type='text'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-[13px]' />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name='externalDonorLastNames'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3 md:mt-0 w-full'>
                              <div className='flex justify-between items-center'>
                                <FormLabel className='text-[14px] md:text-[14.5px] font-bold dark:text-amber-500 text-emerald-500'>
                                  Apellidos
                                </FormLabel>
                                <span className='ml-3 inline-block bg-red-200 text-red-600 border text-[9px] md:text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                  Requerido
                                </span>
                              </div>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Input
                                  disabled={isInputDisabled}
                                  placeholder='Ejem: Saavedra Ramirez'
                                  type='text'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-[13px]' />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    <div className='flex flex-col md:flex-row w-full md:gap-6 mt-2'>
                      <FormField
                        control={form.control}
                        name='externalDonorGender'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-0 md:mt-0 w-full'>
                              <div className='flex justify-between items-center'>
                                <FormLabel className='text-[14px] md:text-[14.5px] font-bold dark:text-amber-500 text-emerald-500'>
                                  Género
                                </FormLabel>
                                <span className='ml-3 inline-block bg-red-200 text-red-600 border text-[9px] md:text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                  Requerido
                                </span>
                              </div>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isInputDisabled}
                              >
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <SelectTrigger>
                                    {field.value ? (
                                      <SelectValue placeholder='Selecciona el tipo de Género' />
                                    ) : (
                                      'Selecciona el tipo de género'
                                    )}
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(GenderNames).map(([key, value]) => (
                                    <SelectItem className={`text-[14px]`} key={key} value={key}>
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

                      <FormField
                        control={form.control}
                        name='externalDonorBirthDate'
                        render={({ field }) => (
                          <FormItem className='mt-3 md:mt-0 w-full'>
                            <div className='flex justify-between items-center'>
                              <FormLabel className='text-[14px] md:text-[14.5px] font-bold dark:text-amber-500 text-emerald-500'>
                                Fecha de nacimiento
                              </FormLabel>
                              <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[9px] md:text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                Opcional
                              </span>
                            </div>
                            <Popover
                              open={isInputBirthDateOpen}
                              onOpenChange={setIsInputBirthDateOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl className='flex'>
                                  <Button
                                    disabled={isInputDisabled}
                                    variant={'outline'}
                                    className={cn(
                                      'text-[14px] w-full pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'LLL dd, y', { locale: es })
                                    ) : (
                                      <span className='text-[14px]'>Selecciona la fecha</span>
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

                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='flex flex-col md:flex-row w-full md:gap-6 mt-3'>
                      <FormField
                        control={form.control}
                        name='externalDonorEmail'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3 md:mt-0 w-full'>
                              <div className='flex justify-between items-center'>
                                <FormLabel className='text-[14px] md:text-[14.5px] font-bold dark:text-amber-500 text-emerald-500'>
                                  E-mail
                                </FormLabel>
                                <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[9px] md:text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                  Opcional
                                </span>
                              </div>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Input
                                  disabled={isInputDisabled}
                                  placeholder='Ejem: pedro123@gmail.com'
                                  type='email'
                                  autoComplete='username'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-[13px]' />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name='externalDonorPhoneNumber'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3 md:mt-0 w-full'>
                              <div className='flex justify-between items-center'>
                                <FormLabel className='text-[14px] md:text-[14.5px] font-bold dark:text-amber-500 text-emerald-500'>
                                  Número de teléfono
                                </FormLabel>
                                <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[9px] md:text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                  Opcional
                                </span>
                              </div>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Input
                                  disabled={isInputDisabled}
                                  placeholder='Ejem: +51 999 999 999'
                                  type='text'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-[13px]' />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    <div className='flex flex-col md:flex-row w-full md:gap-6 mt-2'>
                      <FormField
                        control={form.control}
                        name='externalDonorOriginCountry'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-0 md:mt-0 w-full'>
                              <div className='flex justify-between items-center'>
                                <FormLabel className='text-[14px] md:text-[14.5px] font-bold dark:text-amber-500 text-emerald-500'>
                                  País de origen
                                </FormLabel>
                                <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[9px] md:text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                  Opcional
                                </span>
                              </div>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Input
                                  disabled={isInputDisabled}
                                  placeholder='Ejem:  EE.UU, Italia, Mexico...'
                                  type='text'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-[13px]' />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name='externalDonorResidenceCountry'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3 md:mt-0 w-full'>
                              <div className='flex justify-between items-center'>
                                <FormLabel className='text-[14px] md:text-[14.5px] font-bold dark:text-amber-500 text-emerald-500'>
                                  País de residencia
                                </FormLabel>
                                <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[9px] md:text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                  Opcional
                                </span>
                              </div>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Input
                                  disabled={isInputDisabled}
                                  placeholder='Ejem: Perú , Colombia, Argentina...'
                                  type='text'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-[13px]' />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    <div className='flex flex-col md:flex-row w-full md:gap-6 mt-2'>
                      <FormField
                        control={form.control}
                        name='externalDonorResidenceCity'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-0 md:mt-0 w-full'>
                              <div className='flex justify-between items-center'>
                                <FormLabel className='text-[14px] md:text-[14.5px] font-bold dark:text-amber-500 text-emerald-500'>
                                  Ciudad de residencia
                                </FormLabel>
                                <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[9px] md:text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                  Opcional
                                </span>
                              </div>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Input
                                  disabled={isInputDisabled}
                                  placeholder='Ejem:  Madrid, Paris, Lima...'
                                  type='text'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-[13px]' />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name='externalDonorPostalCode'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3 md:mt-0 w-full'>
                              <div className='flex justify-between items-center'>
                                <FormLabel className='text-[14px] md:text-[14.5px] font-bold dark:text-amber-500 text-emerald-500'>
                                  Código Postal
                                </FormLabel>
                                <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[9px] md:text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                  Opcional
                                </span>
                              </div>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Input
                                  disabled={isInputDisabled}
                                  placeholder='Ejem:  000133, 000154...'
                                  type='text'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-[13px]' />
                              <FormMessage className='text-[13px]' />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  </div>
                )}

              {((type === OfferingIncomeCreationType.Offering &&
                subType === OfferingIncomeCreationSubType.Special &&
                category === OfferingIncomeCreationCategory.InternalDonation) ||
                (type === OfferingIncomeCreationType.Offering &&
                  subType === OfferingIncomeCreationSubType.ChurchGround &&
                  category === OfferingIncomeCreationCategory.InternalDonation)) && (
                // (type === OfferingIncomeCreationType.Offering &&
                //   subType === OfferingIncomeCreationSubType.SundaySchool &&
                //   category === OfferingIncomeCreationCategory.InternalDonation) ||
                // (type === OfferingIncomeCreationType.Offering &&
                //   subType === OfferingIncomeCreationSubType.YouthService &&
                //   category === OfferingIncomeCreationCategory.InternalDonation)
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
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isInputDisabled}
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
                            {Object.entries(MemberTypeNames).map(
                              ([key, value]) =>
                                key !== MemberType.ExternalDonor && (
                                  <SelectItem className={`text-[14px]`} key={key} value={key}>
                                    {value}
                                  </SelectItem>
                                )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-[13px]' />
                      </FormItem>
                    );
                  }}
                />
              )}

              {((type === OfferingIncomeCreationType.Offering &&
                subType === OfferingIncomeCreationSubType.Special &&
                category === OfferingIncomeCreationCategory.InternalDonation) ||
                (type === OfferingIncomeCreationType.Offering &&
                  subType === OfferingIncomeCreationSubType.ChurchGround &&
                  category === OfferingIncomeCreationCategory.InternalDonation)) && (
                // (type === OfferingIncomeCreationType.Offering &&
                //   subType === OfferingIncomeCreationSubType.SundaySchool &&
                //   category === OfferingIncomeCreationCategory.InternalDonation) ||
                // (type === OfferingIncomeCreationType.Offering &&
                //   subType === OfferingIncomeCreationSubType.YouthService &&
                //   category === OfferingIncomeCreationCategory.InternalDonation)
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
                                disabled={isInputMemberDisabled}
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'w-full justify-between truncate',
                                  !field.value && 'font-normal'
                                )}
                              >
                                {field.value
                                  ? `${queryData?.find((member) => member.id === field.value)?.member?.firstNames} ${queryData?.find((member) => member.id === field.value)?.member?.lastNames}`
                                  : 'Busque y seleccione un miembro'}
                                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-auto px-4 py-2'>
                            <Command>
                              {queryData?.length && queryData?.length > 0 ? (
                                <>
                                  <CommandInput
                                    placeholder='Busque un miembro...'
                                    className='h-9 text-[14px]'
                                  />
                                  <CommandEmpty>Miembro no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[200px] overflow-y-auto sm:overflow-y-hidden sm:h-auto'>
                                    {queryData?.map((item) => (
                                      <CommandItem
                                        className='text-[14px]'
                                        value={getFullNames({
                                          firstNames: item.member?.firstNames ?? '',
                                          lastNames: item.member?.lastNames ?? '',
                                        })}
                                        key={item.id}
                                        onSelect={() => {
                                          form.setValue('memberId', item.id);
                                          setIsInputMemberOpen(false);
                                        }}
                                      >
                                        {`${item?.member?.firstNames} ${item?.member?.lastNames}`}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            item.id === field.value ? 'opacity-100' : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              ) : (
                                queryData?.length === 0 && (
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
                                disabled={isInputDisabled}
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'w-full justify-between truncate',
                                  !field.value && 'text-slate-500 font-normal'
                                )}
                              >
                                {field.value
                                  ? `${familyGroupsQuery?.data?.find((familyGroup) => familyGroup.id === field.value)?.familyGroupName} 
                                      (${familyGroupsQuery?.data?.find((familyGroup) => familyGroup.id === field.value)?.familyGroupCode}) ~ 
                                        ${getInitialFullNames({ firstNames: familyGroupsQuery?.data?.find((familyGroup) => familyGroup.id === field.value)?.theirPreacher?.firstNames ?? '', lastNames: familyGroupsQuery?.data?.find((familyGroup) => familyGroup.id === field.value)?.theirPreacher?.lastNames ?? '' })}`
                                  : 'Busque y seleccione un grupo familiar'}
                                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-full max-w-[90vw] px-4 py-2'>
                            <Command>
                              {familyGroupsQuery?.data?.length &&
                              familyGroupsQuery?.data?.length > 0 ? (
                                <>
                                  <CommandInput
                                    placeholder='Busque un grupo familiar...'
                                    className='h-9 text-[14px]'
                                  />
                                  <CommandEmpty>Grupo familiar no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[200px] overflow-y-auto sm:overflow-y-hidden sm:h-auto'>
                                    {familyGroupsQuery?.data?.map((familyGroup) => (
                                      <CommandItem
                                        className='"text-[14px] w-full'
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
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            familyGroup.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              ) : (
                                familyGroupsQuery?.data?.length === 0 && (
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
                              disabled={isInputDisabled}
                              variant='outline'
                              role='combobox'
                              className={cn(
                                'w-full justify-between truncate',
                                !field.value && 'text-slate-500 font-normal'
                              )}
                            >
                              {field.value
                                ? `${
                                    zonesQuery?.data?.find((zone) => zone.id === field.value)
                                      ?.zoneName
                                  } ~ ${getInitialFullNames({
                                    firstNames:
                                      zonesQuery?.data?.find((zone) => zone.id === field.value)
                                        ?.theirSupervisor?.firstNames ?? '',
                                    lastNames:
                                      zonesQuery?.data?.find((zone) => zone.id === field.value)
                                        ?.theirSupervisor?.lastNames ?? '',
                                  })}`
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
                                <CommandGroup className='max-h-[200px] overflow-y-auto sm:overflow-y-hidden sm:h-auto'>
                                  {zonesQuery?.data?.map((zone) => (
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

              {subType === OfferingIncomeCreationSubType.SundayService &&
                // subType === OfferingIncomeCreationSubType.SundaySchool
                category === OfferingIncomeCreationCategory.OfferingBox && (
                  <FormField
                    control={form.control}
                    name='shift'
                    render={({ field }) => {
                      return (
                        <FormItem className='mt-3'>
                          <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                            Turno
                          </FormLabel>
                          <FormDescription className='text-[13.5px] md:text-[14px]'>
                            Elige el turno de la ofrenda para el registro.
                          </FormDescription>
                          <Select
                            disabled={isInputDisabled}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
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
                              {Object.entries(OfferingIncomeCreationShiftTypeNames).map(
                                ([key, value]) => (
                                  <SelectItem key={key} value={key}>
                                    {value}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage className='text-[13px]' />
                        </FormItem>
                      );
                    }}
                  />
                )}

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Monto
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Digita la cantidad o monto de la ofrenda.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Monto total de la ofrenda'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='currency'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Divisa / Moneda
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asignar un tipo de divisa o moneda al registro.
                      </FormDescription>
                      <Select
                        disabled={isInputDisabled}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                          {Object.entries(CurrencyTypeNames).map(([key, value]) => (
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

              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem className='mt-3'>
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
                            className={cn(
                              'text-[14px] w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'LLL dd, y', { locale: es })
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
                              // subType === OfferingIncomeCreationSubType.SundaySchool ||
                              subType === OfferingIncomeCreationSubType.FamilyGroup) &&
                            category === OfferingIncomeCreationCategory.OfferingBox
                              ? (date) => {
                                  const today = new Date();
                                  const minDate = new Date('1900-01-01');
                                  const dayOfWeek = date.getDay();
                                  return dayOfWeek !== 0 || date > today || date < minDate;
                                }
                              : // : subType === OfferingIncomeCreationSubType.YouthService &&
                                //     category === OfferingIncomeCreationCategory.OfferingBox
                                //   ? (date) => {
                                //       const today = new Date();
                                //       const minDate = new Date('1900-01-01');
                                //       const dayOfWeek = date.getDay();
                                //       return dayOfWeek !== 6 || date > today || date < minDate;
                                //     }
                                (date) => date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='comments'
                render={({ field }) => {
                  return (
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
                          Escribe una breve descripción sobre el ajuste
                        </FormDescription>
                      )}
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Textarea
                          disabled={isInputDisabled}
                          placeholder={`${
                            type === OfferingIncomeCreationType.IncomeAdjustment
                              ? `Detalles y/u observaciones sobre el ajuste de ingreso...`
                              : 'Detalles y/u observaciones sobre el registro de la ofrenda...'
                          }`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className='md:col-start-2 md:col-end-3 md:border-l-2 border-slate-200 dark:border-slate-800 md:pl-6'>
              <FormField
                control={form.control}
                name='fileNames'
                render={() => {
                  return (
                    <FormItem className='mt-3 md:mt-0'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center'>
                        Subir imagen
                        <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[2px] rounded-full mr-1'>
                          Opcional
                        </span>
                      </FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <div
                          {...getRootProps({
                            className:
                              'h-[10rem] font-medium text-sm sm:text-[15px] p-10 sm:p-12 md:p-16 max-w-[25rem] md:max-w-[25rem] m-auto border border-dashed border-black dark:border-white hover:bg-green-200 dark:hover:text-black ease-in duration-200 text-center',
                          })}
                        >
                          <input {...getInputProps()} className='m-auto w-[20rem]' />

                          {isDragActive ? (
                            <p>Suelte sus archivos aquí ...</p>
                          ) : (
                            <p className='pt-5 md:pt-0'>
                              Arrastre y suelte sus archivos aquí, o haga clic para seleccionar.
                            </p>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className='text-[13px]' />

                      {files && files.length > 3 ? (
                        <span className='text-red-500 font-bold text-[12.5px] md:text-[13px] text-center mx-auto justify-center flex'>
                          ❌ Sobrepasa el limite, elige como máximo solo 3 imágenes.
                        </span>
                      ) : (
                        <span className='font-medium text-[12.5px] md:text-[13px] pl-3 md:pl-6 mt-1 flex flex-col'>
                          <span>✅ Máximo 1 archivos.</span>
                          <span>✅ La imagen del recibo se auto-generara.</span>
                          <span>✅ La imagen generada se guardara en el registro.</span>
                        </span>
                      )}
                    </FormItem>
                  );
                }}
              />

              <section className='mt-10'>
                <div className='flex gap-4 items-center justify-between'>
                  <h2 className='text-[16px] md:text-[18px] font-bold'>Pre-visualización</h2>
                  <button
                    type='button'
                    disabled={isDeleteFileButtonDisabled}
                    onClick={removeAll}
                    className='mt-1 text-[11px] md:text-[11px] w-[8rem] md:w-[10rem] p-2 uppercase tracking-wider font-bold text-red-500 border border-red-400 rounded-md  hover:bg-secondary-400 hover:text-white ease-in duration-200 hover:bg-red-500 transition-colors'
                  >
                    Remover todos los archivos
                  </button>
                </div>

                {/* Accepted files */}
                <h3 className='text-[14.5px] lg:text-[16px] font-semibold mt-5 border-b pb-3'>
                  Archivos Aceptados
                </h3>
                <ul className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-x-5 gap-y-20'>
                  {files.map((file) => (
                    <li key={file.name} className='relative h-32 rounded-md shadow-lg'>
                      <img
                        src={file.preview}
                        alt={file.name}
                        width={100}
                        height={100}
                        onLoad={() => URL.revokeObjectURL(file.preview)}
                        className='h-full w-full object-contain rounded-md'
                      />

                      <Button
                        type='button'
                        disabled={isDeleteFileButtonDisabled}
                        onClick={() => removeFile(file.name)}
                        variant='ghost'
                        className={cn(
                          'w-8 h-8 absolute -top-2 -right-2 p-0 rounded-full flex items-center justify-center',
                          'border-secondary-400 dark:bg-slate-950 bg-white text-red-500 dark:hover:bg-white hover:bg-slate-200 hover:text-red-600 transition-colors',
                          'disabled:opacity-50 disabled:pointer-events-none disabled:bg-slate-100 disabled:border-slate-300 disabled:text-slate-400'
                        )}
                      >
                        <TiDeleteOutline className='w-8 h-8' />
                      </Button>

                      <p className='mt-2 text-neutral-500 text-[12px] font-medium truncate max-w-full text-center'>
                        {file.name}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Rejected Files */}
                <h3 className='text-[14.5px] lg:text-[16px] font-semibold mt-20 border-b pb-3'>
                  Archivos rechazados
                </h3>
                <ul className='mt-2 flex flex-col'>
                  {rejected.map(({ file, errors }) => (
                    <li key={file.name} className='flex items-start justify-between'>
                      <div>
                        <p className='mt-2 text-neutral-500 text-sm font-medium'>{file.name}</p>
                        <ul className='text-[14px] text-red-400 flex gap-3 font-medium'>
                          {errors.map((error) => (
                            <li
                              key={error.code}
                            >{`${error.message === 'File type must be image/*' ? 'Tipo de archivo debe ser una imagen.' : 'Debe ser un archivo menor a 1000KB.'}`}</li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        type='button'
                        disabled={isDeleteFileButtonDisabled}
                        className='mt-1 py-1 text-[11px] md:text-[11.5px] uppercase tracking-wider font-bold text-red-500 border border-red-400 rounded-md px-3 hover:bg-red-500 hover:text-white ease-in duration-200 transition-colors'
                        onClick={() => {
                          removeRejected(file.name);
                        }}
                      >
                        remover
                      </Button>
                    </li>
                  ))}
                </ul>
              </section>

              <FormField
                control={form.control}
                name='shouldOpenReceiptInBrowser'
                render={({ field }) => (
                  <FormItem className='mt-4 border-t pt-3'>
                    <FormLabel className='font-bold text-[14.5px] md:text-[14.5px] text-blue-500'>
                      ¿Deseas abrir la versión imprimible del recibo tras guardar el registro?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        disabled={isInputDisabled}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        className='flex w-full px-0 md:px-4 justify-between'
                      >
                        <FormItem className='flex items-center mt-2 space-x-2 space-y-0'>
                          <FormControl>
                            <RadioGroupItem disabled={isInputDisabled} value='yes' />
                          </FormControl>
                          <FormLabel className='text-[14px] cursor-pointer'>
                            Sí, guardar y abrir el imprimible.
                          </FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center mt-2 space-x-2 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='no' />
                          </FormControl>
                          <FormLabel className='text-[14px] cursor-pointer'>
                            No, solo guardar el registro.
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isMessageErrorDisabled ? (
              <p className='-mb-5 mt-2 md:-mb-2 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, completa todos los campos para crear el registro.
              </p>
            ) : (
              <p className='-mt-2 order-last md:-mt-3 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente! <br />
              </p>
            )}

            <div className='mt-2 col-start-1 col-end-3 row-start-3 row-end-4 w-full md:w-[20rem] md:m-auto'>
              <Toaster position='top-center' richColors />
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className={cn(
                  'w-full text-[14px]',
                  offeringIncomeCreationMutation?.isPending &&
                    isProcessing &&
                    'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                )}
                onClick={() => {
                  setTimeout(() => {
                    if (Object.keys(form.formState.errors).length === 0) {
                      setIsInputDisabled(true);
                      setIsDropZoneDisabled(true);
                      setIsInputMemberDisabled(true);
                      setIsDeleteFileButtonDisabled(true);
                      setIsSubmitButtonDisabled(true);
                    }
                  }, 100);
                }}
              >
                {offeringIncomeCreationMutation?.isPending && isProcessing
                  ? 'Procesando...'
                  : 'Registrar'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default OfferingIncomeCreatePage;
