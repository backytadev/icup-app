/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useQuery } from '@tanstack/react-query';
import { TiDeleteOutline } from 'react-icons/ti';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

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

import { useOfferingIncomeSetData } from '@/modules/offering/income/hooks/useOfferingIncomeSetData';
import { useOfferingIncomeFileDropZone } from '@/modules/offering/income/hooks/useOfferingIncomeFileDropZone';
import { useOfferingIncomeUpdateMutation } from '@/modules/offering/income/hooks/useOfferingIncomeUpdateMutation';
import { useOfferingIncomeUpdateSubmitButtonLogic } from '@/modules/offering/income/hooks/useOfferingIncomeUpdateSubmitButtonLogic';

import { getSimpleZones } from '@/modules/zone/services/zone.service';
import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleFamilyGroups } from '@/modules/family-group/services/family-group.service';
import { getExternalDonors } from '@/modules/offering/income/services/offering-income.service';

import { useModuleQueries } from '@/modules/offering/shared/hooks/useModuleQueries';
import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';
import { OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';
import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { DestroyImageButton } from '@/modules/offering/shared/components/DestroyImageButton';
import { useImagesUploadMutation } from '@/modules/offering/shared/hooks/useImagesUploadMutation';
import { type RejectionProps } from '@/modules/offering/shared/interfaces/rejected-props.interface';

import { offeringIncomeFormSchema } from '@/modules/offering/income/validations/offering-income-form-schema';
import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';
import { OfferingIncomeFormSkeleton } from '@/modules/offering/income/components/cards/update/OfferingIncomeFormSkeleton';

import { type PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';
import { type CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';
import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';
import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { type SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';

import { cn } from '@/shared/lib/utils';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { getFullNames, getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { getCodeAndNameFamilyGroup } from '@/shared/helpers/get-code-and-name-family-group.helper';

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
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

type QueryDataResponse =
  | DiscipleResponse[]
  | PreacherResponse[]
  | SupervisorResponse[]
  | CopastorResponse[]
  | PastorResponse[];

interface OfferingIncomeFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: OfferingIncomeResponse | undefined;
}

export const OfferingIncomeFormUpdate = ({
  id,
  dialogClose,
  scrollToTop,
  data,
}: OfferingIncomeFormUpdateProps): JSX.Element => {
  //* States
  const [isInputDateOpen, setIsInputDateOpen] = useState<boolean>(false);
  const [isInputRelationOpen, setIsInputRelationOpen] = useState<boolean>(false);

  const [queryData, setQueryData] = useState<QueryDataResponse>();

  const [files, setFiles] = useState<FilesProps[]>([]);
  const [rejected, setRejected] = useState<RejectionProps[]>([]);

  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState<boolean>(false);

  const [isDeleteFileButtonDisabled, setIsDeleteFileButtonDisabled] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isInputMemberOpen, setIsInputMemberOpen] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [isInputDonorOpen, setIsInputDonorOpen] = useState<boolean>(false);

  //* Form
  const form = useForm<z.infer<typeof offeringIncomeFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(offeringIncomeFormSchema),
    defaultValues: {
      type: '',
      subType: '',
      category: '',
      churchId: '',
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
    },
  });

  //* Watchers
  const type = form.watch('type');
  const category = form.watch('category');
  const churchId = form.watch('churchId');
  const subType = form.watch('subType');
  const comments = form.watch('comments');
  const memberType = form.watch('memberType');

  //* Custom hooks
  useOfferingIncomeSetData({
    id,
    data,
    setFiles,
    setIsLoadingData,
    offeringIncomeUpdateForm: form,
  });

  useOfferingIncomeUpdateSubmitButtonLogic({
    files,
    isDeleteFileButtonDisabled,
    isDropZoneDisabled,
    isInputDisabled,
    offeringIncomeUpdateForm: form,
    setIsDropZoneDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries

  const externalDonorsQuery = useQuery({
    queryKey: ['external-donors', churchId],
    queryFn: getExternalDonors,
    retry: false,
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

  const { onDrop, removeFile, removeCloudFile, removeRejected } = useOfferingIncomeFileDropZone({
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

  const offeringIncomeUpdateMutation = useOfferingIncomeUpdateMutation({
    dialogClose,
    scrollToTop,
    imageUrls,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsDeleteFileButtonDisabled,
  });

  const uploadImagesMutation = useImagesUploadMutation();

  //* Effects
  useEffect(() => {
    if (memberType === MemberType.Disciple) setQueryData(disciplesQuery.data);
    if (memberType === MemberType.Preacher) setQueryData(preachersQuery.data);
    if (memberType === MemberType.Supervisor) setQueryData(supervisorsQuery.data);
    if (memberType === MemberType.Copastor) setQueryData(copastorsQuery.data);
    if (memberType === MemberType.Pastor) setQueryData(pastorsQuery.data);
  }, [pastorsQuery, copastorsQuery, supervisorsQuery, preachersQuery, disciplesQuery]);

  useEffect(() => {
    if (data?.recordStatus === RecordStatus.Inactive) {
      setIsInputDisabled(true);
      setIsDropZoneDisabled(true);
      setIsDeleteFileButtonDisabled(true);
    }
  }, []);

  //* Form handler
  const handleSubmit = async (
    formData: z.infer<typeof offeringIncomeFormSchema>
  ): Promise<void> => {
    const filesOnly = files.filter((item) => item instanceof File);

    let imageUrls;

    try {
      //* This only works with dropzone (it is inactivate)
      if (filesOnly.length >= 1) {
        const uploadResult = await uploadImagesMutation.mutateAsync({
          files: filesOnly as any,
          fileType: OfferingFileType.Income,
          offeringType: formData.type,
          offeringSubType: formData.subType ?? null,
        });

        imageUrls = uploadResult.imageUrls;
        setImageUrls(imageUrls ?? []);
      }

      await offeringIncomeUpdateMutation.mutateAsync({
        id,
        formData: {
          type: formData.type,
          subType: formData.subType,
          category: formData.category,
          shift: formData.shift,
          amount: formData.amount,
          currency: formData.currency,
          date: formData.date,
          comments: formData.comments,
          memberType: formData.memberType,
          memberId: formData.memberId,
          externalDonorId: formData.externalDonorId,
          familyGroupId: formData.familyGroupId,
          zoneId: formData.zoneId,
          churchId: formData.churchId,
          recordStatus: formData.recordStatus,
          imageUrls: imageUrls ?? [],
        },
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
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[520px] md:w-[680px] lg:w-[990px] xl:w-[1100px]'
    >
      {/* <div className='text-center'> */}
      <h2 className='text-center text-orange-500 font-bold text-[22px] sm:text-[26px] md:text-[28px]'>
        Modificar información del registro
      </h2>
      {/* </div> */}

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <OfferingIncomeFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='flex flex-col mb-4 pl-0 md:pl-4'>
                <span className='italic dark:text-amber-400 font-bold text-[16.5px] md:text-[18px] text-amber-500'>
                  Tipo de registro:{' '}
                  {`${OfferingIncomeCreationTypeNames[data?.type as OfferingIncomeCreationType]} ${data?.subType ? '-' : ''} ${OfferingIncomeCreationSubTypeNames[data?.subType as OfferingIncomeCreationSubType] ?? ''}`}
                </span>
                <span className='italic dark:text-slate-300 text-slate-500 font-bold text-[16px] md:text-[17px] md:ml-1'>
                  Pertenencia:{' '}
                  {`${
                    data?.type === OfferingIncomeCreationType.IncomeAdjustment ||
                    // data?.subType === OfferingIncomeCreationSubType.SundaySchool ||
                    data?.subType === OfferingIncomeCreationSubType.SundayService ||
                    data?.subType === OfferingIncomeCreationSubType.GeneralFasting ||
                    data?.subType === OfferingIncomeCreationSubType.GeneralVigil ||
                    // data?.subType === OfferingIncomeCreationSubType.YouthService ||
                    data?.subType === OfferingIncomeCreationSubType.Activities
                      ? data?.church?.abbreviatedChurchName
                      : data?.subType === OfferingIncomeCreationSubType.FamilyGroup
                        ? `${data?.familyGroup?.familyGroupCode} - ${data?.familyGroup?.familyGroupName}`
                        : data?.subType === OfferingIncomeCreationSubType.ZonalFasting ||
                            data?.subType === OfferingIncomeCreationSubType.ZonalVigil
                          ? `${data?.zone?.zoneName} - ${data?.zone?.district}`
                          : data?.memberType === MemberType.Disciple
                            ? `${data?.disciple?.firstNames} ${data?.disciple?.lastNames}`
                            : data?.memberType === MemberType.Preacher
                              ? `${data?.preacher?.firstNames} ${data?.preacher?.lastNames}`
                              : data?.memberType === MemberType.Supervisor
                                ? `${data?.supervisor?.firstNames} ${data?.supervisor?.lastNames}`
                                : data?.memberType === MemberType.Copastor
                                  ? `${data?.copastor?.firstNames} ${data?.copastor?.lastNames}`
                                  : `${data?.pastor?.firstNames} ${data?.pastor?.lastNames}`
                  }`}
                </span>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='w-full flex flex-col px-2 sm:px-8 md:grid md:grid-cols-2 gap-x-8 gap-y-4'
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
                            Seleccione una iglesia para asignarla al registro.
                          </FormDescription>
                          <Popover open={isInputRelationOpen} onOpenChange={setIsInputRelationOpen}>
                            <PopoverTrigger asChild>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Button
                                  disabled
                                  variant='outline'
                                  role='combobox'
                                  className={cn(
                                    'w-full justify-between',
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
                                            setIsInputRelationOpen(false);
                                          }}
                                        >
                                          {church.abbreviatedChurchName}
                                          <CheckIcon
                                            className={cn(
                                              'ml-auto h-4 w-4',
                                              church.id === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
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
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Tipo
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asignar un tipo de ofrenda al registro.
                            </FormDescription>
                            <Select disabled value={field.value} onValueChange={field.onChange}>
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
                                {Object.entries(OfferingIncomeCreationTypeNames).map(
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
                                Asignar un sub-tipo de ofrenda al registro.
                              </FormDescription>
                              <Select disabled value={field.value} onValueChange={field.onChange}>
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
                              <Select disabled value={field.value} onValueChange={field.onChange}>
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <SelectTrigger>
                                    {field.value ? (
                                      <SelectValue placeholder='Selecciona una categoría de ofrenda' />
                                    ) : (
                                      'Selecciona una categoría de ofrenda'
                                    )}
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(OfferingIncomeCreationCategoryNames).map(
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

                    {((type === OfferingIncomeCreationType.Offering &&
                      subType === OfferingIncomeCreationSubType.Special &&
                      category === OfferingIncomeCreationCategory.InternalDonation) ||
                      (type === OfferingIncomeCreationType.Offering &&
                        subType === OfferingIncomeCreationSubType.ChurchGround &&
                        category === OfferingIncomeCreationCategory.InternalDonation) ||
                      // (type === OfferingIncomeCreationType.Offering &&
                      //   subType === OfferingIncomeCreationSubType.SundaySchool &&
                      //   category === OfferingIncomeCreationCategory.InternalDonation) ||
                      // (type === OfferingIncomeCreationType.Offering &&
                      //   subType === OfferingIncomeCreationSubType.YouthService &&
                      //   category === OfferingIncomeCreationCategory.InternalDonation) ||
                      (type === OfferingIncomeCreationType.Offering &&
                        subType === OfferingIncomeCreationSubType.ChurchGround &&
                        category === OfferingIncomeCreationCategory.ExternalDonation) ||
                      (type === OfferingIncomeCreationType.Offering &&
                        subType === OfferingIncomeCreationSubType.Special &&
                        category === OfferingIncomeCreationCategory.ExternalDonation)) && (
                      //  || (type === OfferingIncomeCreationType.Offering &&
                      //   subType === OfferingIncomeCreationSubType.SundaySchool &&
                      //   category === OfferingIncomeCreationCategory.ExternalDonation) ||
                      // (type === OfferingIncomeCreationType.Offering &&
                      //   subType === OfferingIncomeCreationSubType.YouthService &&
                      //   category === OfferingIncomeCreationCategory.ExternalDonation)
                      <FormField
                        control={form.control}
                        name='memberType'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3'>
                              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                                Tipo de Miembro
                              </FormLabel>
                              <Select disabled onValueChange={field.onChange} value={field.value}>
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
                                  {Object.entries(MemberTypeNames).map(([key, value]) => (
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
                    )}

                    {category === OfferingIncomeCreationCategory.ExternalDonation && (
                      <FormField
                        control={form.control}
                        name='externalDonorId'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3'>
                              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                                Donante
                              </FormLabel>

                              <FormDescription className='text-[13.5px] md:text-[14px]'>
                                Asigna un donante para este registro.
                              </FormDescription>

                              <Popover open={isInputDonorOpen} onOpenChange={setIsInputDonorOpen}>
                                <PopoverTrigger asChild>
                                  <FormControl className='text-[14px] md:text-[14px]'>
                                    <Button
                                      disabled
                                      variant='outline'
                                      role='combobox'
                                      className={cn('w-full justify-between ')}
                                    >
                                      {field.value
                                        ? `${externalDonorsQuery?.data?.find((donor) => donor.id === field.value)?.firstNames} ${externalDonorsQuery?.data?.find((donor) => donor.id === field.value)?.lastNames}`
                                        : 'Busque y seleccione un donante'}
                                      <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align='center' className='w-auto px-4 py-2'>
                                  <Command>
                                    {externalDonorsQuery?.data?.length &&
                                    externalDonorsQuery?.data?.length > 0 ? (
                                      <>
                                        <CommandInput
                                          placeholder='Busque un donante'
                                          className='h-9 text-[14px]'
                                        />
                                        <CommandEmpty>Donante no encontrado.</CommandEmpty>
                                        <CommandGroup className='max-h-[200px] h-auto'>
                                          {externalDonorsQuery?.data?.map((donor) => (
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

                                          {externalDonorsQuery?.data?.length === 0 && (
                                            <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                              ❌No hay donantes disponibles.
                                            </p>
                                          )}
                                        </CommandGroup>
                                      </>
                                    ) : (
                                      (!externalDonorsQuery?.data ||
                                        externalDonorsQuery?.data?.length === 0) && (
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

                    {((type === OfferingIncomeCreationType.Offering &&
                      subType === OfferingIncomeCreationSubType.Special &&
                      category === OfferingIncomeCreationCategory.InternalDonation) ||
                      (type === OfferingIncomeCreationType.Offering &&
                        subType === OfferingIncomeCreationSubType.ChurchGround &&
                        category === OfferingIncomeCreationCategory.InternalDonation)) && (
                      // || (type === OfferingIncomeCreationType.Offering &&
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
                                      disabled
                                      variant='outline'
                                      role='combobox'
                                      className={cn(
                                        'w-full justify-between ',
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
                                        <CommandGroup className='max-h-[200px] h-auto'>
                                          {queryData?.map((member) => (
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
                                open={isInputRelationOpen}
                                onOpenChange={setIsInputRelationOpen}
                              >
                                <PopoverTrigger asChild>
                                  <FormControl className='text-[14px] md:text-[14px]'>
                                    <Button
                                      disabled
                                      variant='outline'
                                      role='combobox'
                                      className={cn(
                                        'w-full justify-between',
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
                                <PopoverContent align='center' className='w-auto px-4 py-2'>
                                  <Command>
                                    {familyGroupsQuery?.data?.length &&
                                    familyGroupsQuery?.data?.length > 0 ? (
                                      <>
                                        <CommandInput
                                          placeholder='Busque un grupo familiar...'
                                          className='h-9 text-[14px]'
                                        />
                                        <CommandEmpty>Grupo familiar no encontrado.</CommandEmpty>
                                        <CommandGroup className='max-h-[200px] h-auto'>
                                          {familyGroupsQuery?.data?.map((familyGroup) => (
                                            <CommandItem
                                              className='text-[14px]'
                                              value={getCodeAndNameFamilyGroup({
                                                code: familyGroup.familyGroupCode,
                                                name: familyGroup.familyGroupName,
                                                preacher: `${getInitialFullNames({ firstNames: familyGroup.theirPreacher?.firstNames ?? '', lastNames: familyGroup.theirPreacher?.lastNames ?? '' })}`,
                                              })}
                                              key={familyGroup.id}
                                              onSelect={() => {
                                                form.setValue('familyGroupId', familyGroup.id);
                                                setIsInputRelationOpen(false);
                                              }}
                                            >
                                              {`${familyGroup?.familyGroupName} ${familyGroup?.familyGroupCode}`}
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
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Zona
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Seleccione una zona para asignarlo al registro.
                            </FormDescription>
                            <Popover
                              open={isInputRelationOpen}
                              onOpenChange={setIsInputRelationOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <Button
                                    disabled
                                    variant='outline'
                                    role='combobox'
                                    className={cn(
                                      'w-full justify-between',
                                      !field.value && 'text-slate-500 font-normal'
                                    )}
                                  >
                                    {field.value
                                      ? `${
                                          zonesQuery?.data?.find((zone) => zone.id === field.value)
                                            ?.zoneName
                                        } ~ ${getInitialFullNames({
                                          firstNames:
                                            zonesQuery?.data?.find(
                                              (zone) => zone.id === field.value
                                            )?.theirSupervisor?.firstNames ?? '',
                                          lastNames:
                                            zonesQuery?.data?.find(
                                              (zone) => zone.id === field.value
                                            )?.theirSupervisor?.lastNames ?? '',
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
                                      <CommandGroup className='max-h-[200px] h-auto'>
                                        {zonesQuery?.data?.map((zone) => (
                                          <CommandItem
                                            className='text-[14px]'
                                            value={`${zone.zoneName} ${getInitialFullNames({ firstNames: zone?.theirSupervisor?.firstNames ?? '', lastNames: zone?.theirSupervisor?.lastNames ?? '' })}`}
                                            key={zone.id}
                                            onSelect={() => {
                                              form.setValue('zoneId', zone.id);
                                              setIsInputRelationOpen(false);
                                            }}
                                          >
                                            {`${zone.zoneName} ~ ${getInitialFullNames({ firstNames: zone?.theirSupervisor?.firstNames ?? '', lastNames: zone?.theirSupervisor?.lastNames ?? '' })}`}
                                            <CheckIcon
                                              className={cn(
                                                'ml-auto h-4 w-4',
                                                zone.id === field.value
                                                  ? 'opacity-100'
                                                  : 'opacity-0'
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
                      // || subType === OfferingIncomeCreationSubType.SundaySchool
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
                                <Select disabled value={field.value} onValueChange={field.onChange}>
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

                    <div className='md:flex md:gap-5'>
                      <FormField
                        control={form.control}
                        name='amount'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3 w-full'>
                              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                                Monto
                              </FormLabel>
                              <FormDescription className='text-[13.5px] md:text-[14px]'>
                                Digita el monto de la ofrenda.
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
                            <FormItem className='mt-3 w-full'>
                              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                                Divisa / Moneda
                              </FormLabel>
                              <FormDescription className='text-[13.5px] md:text-[14px]'>
                                Asignar un tipo de divisa al registro.
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
                    </div>

                    <div
                      className={cn(
                        'md:flex md:gap-5',
                        type === OfferingIncomeCreationType.IncomeAdjustment &&
                          'md:flex-col md:gap-0'
                      )}
                    >
                      <FormField
                        control={form.control}
                        name='date'
                        render={({ field }) => (
                          <FormItem className='mt-3 w-full'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Fecha
                            </FormLabel>
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
                                      format(field?.value, 'LLL dd, y', { locale: es })
                                    ) : (
                                      <span className='text-[14px]'>
                                        Seleccione la fecha de la ofrenda
                                      </span>
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
                        name='recordStatus'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3 w-full'>
                              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                                Estado
                              </FormLabel>
                              <FormDescription className='text-[13.5px] md:text-[14px]'>
                                Selecciona el estado del registro.
                              </FormDescription>
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

                              <FormMessage className='text-[13px]' />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    {form.getValues('recordStatus') === 'active' && (
                      <FormDescription className='pl-2 text-[12px] xl:text-[13px] font-bold pt-2'>
                        *El registro esta <span className='text-green-500'>Activo</span>, para
                        colocarlo como <span className='text-red-500'>Inactivo</span> debe inactivar
                        el registro desde el modulo{' '}
                        <span className='font-bold text-red-500'>Inactivar Ingreso. </span>
                      </FormDescription>
                    )}
                    {form.getValues('recordStatus') === 'inactive' && (
                      <FormDescription className='pl-2 text-[12px] xl:text-[13px] font-bold pt-2'>
                        * El registro esta <span className='text-red-500 '>Inactivo</span>, y ya no
                        se podrá activar nuevamente.
                      </FormDescription>
                    )}

                    <FormField
                      control={form.control}
                      name='comments'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center'>
                              Detalles / Observaciones
                              <span className='ml-3 inline-block bg-orange-200 text-orange-600 border text-[10px] font-bold uppercase px-2 py-[2px] rounded-full mr-1'>
                                Requerido
                              </span>
                            </FormLabel>
                            {type === OfferingIncomeCreationType.IncomeAdjustment && (
                              <FormDescription>
                                Escribe una breve descripción sobre el ajuste.
                              </FormDescription>
                            )}
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Textarea
                                className={cn(comments && 'h-full')}
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
                      disabled
                      name='fileNames'
                      render={() => {
                        return (
                          <FormItem className='mt-4 md:mt-0'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center'>
                              Subir imagen{' '}
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
                                  <p> Suelte sus archivos aquí ...</p>
                                ) : (
                                  <p className='pt-5 md:pt-0'>
                                    Arrastre y suelte sus archivos aquí, o haga clic para
                                    seleccionar.
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
                              <span className='font-medium text-[11.5px] md:text-[13px] pl-1 md:pl-5 mt-1 flex flex-col'>
                                <span>✅ Máximo 1 archivos.</span>
                                <span>
                                  ✅ El campo se bloqueara al llegar o pasar los 1 archivos.
                                </span>
                              </span>
                            )}
                          </FormItem>
                        );
                      }}
                    />

                    <section className='mt-10'>
                      <div className='flex gap-4 items-center justify-between'>
                        <h2 className='text-[16px] md:text-[18px] font-bold'>Pre-visualización</h2>
                      </div>

                      {/* Accepted files */}
                      <h3 className='text-[14.5px] lg:text-[16px] font-semibold mt-5 border-b pb-3'>
                        Archivos Aceptados
                      </h3>
                      <ul className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-x-5 gap-y-20'>
                        {files?.map((file) => {
                          const filePublicId = (file as any)
                            .split('/')
                            .pop()
                            ?.replace(/\.[^/.]+$/, '')
                            .toLowerCase();

                          return (
                            <li
                              key={file.name ?? file}
                              className='py-2 flex flex-col relative h-32 rounded-md shadow-md shadow-gray-400 dark:shadow-slate-900 bg-white dark:bg-slate-900 text-slate-900 dark:text-gray-100'
                            >
                              <img
                                src={file.preview ?? file}
                                alt={file.name ?? file}
                                width={100}
                                height={100}
                                onLoad={() => {
                                  URL.revokeObjectURL(file.preview ?? file);
                                }}
                                className='h-full w-full object-contain rounded-md'
                              />
                              {file?.name ? (
                                <Button
                                  type='button'
                                  disabled={isDeleteFileButtonDisabled}
                                  className='border-none p-0 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 dark:hover:bg-slate-950 hover:bg-white'
                                  onClick={() => {
                                    removeFile(file.name);
                                  }}
                                >
                                  <TiDeleteOutline className='w-8 h-8 p-0  rounded-full fill-red-500 dark:hover:bg-white hover:bg-slate-200' />
                                </Button>
                              ) : (
                                <DestroyImageButton
                                  fileType={OfferingFileType.Income}
                                  isDeleteFileButtonDisabled={isDeleteFileButtonDisabled}
                                  secureUrl={file as any}
                                  removeCloudFile={removeCloudFile}
                                />
                              )}

                              <p className='mt-4 text-center text-slate-500 text-[11px] md:text-[12px] font-medium'>
                                <a href={file as any} target='_blank' rel='noreferrer'>
                                  {file.name ??
                                    (file as any)
                                      .split('/')
                                      .slice(0, 3)
                                      .join('/')
                                      .replace(
                                        'res.cloudinary.com',
                                        `cloudinary-${filePublicId}.com`
                                      )}
                                </a>
                              </p>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Rejected Files */}
                      <h3 className='text-[14.5px] lg:text-[16px] font-semibold mt-20 border-b pb-3'>
                        Archivos rechazados
                      </h3>
                      <ul className='mt-2 flex flex-col'>
                        {rejected.map(({ file, errors }) => (
                          <li key={file.name} className='flex items-start justify-between'>
                            <div>
                              <p className='mt-2 text-neutral-500 text-sm font-medium'>
                                {file.name}
                              </p>
                              <ul className='text-[14px] text-red-400 flex gap-3 font-medium'>
                                {errors.map((error) => (
                                  <li
                                    key={error.code}
                                  >{`${error.message === 'File type must be image/*' ? 'Tipo de archivo debe ser una imagen.' : 'Debe ser un archivo menor a 1000KB.'}`}</li>
                                ))}
                              </ul>
                            </div>
                            <button
                              type='button'
                              disabled={isDeleteFileButtonDisabled}
                              className='mt-1 py-1 text-[11px] md:text-[11.5px] uppercase tracking-wider font-bold text-red-500 border border-red-400 rounded-md px-3 hover:bg-red-500 hover:text-white ease-in duration-200 transition-colors'
                              onClick={() => {
                                removeRejected(file.name);
                              }}
                            >
                              remover
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  {isMessageErrorDisabled ? (
                    <p className='-mb-5 mt-2 md:-mb-2 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                      ❌ Este registro no pude ser modificado, hable con el administrador del
                      sistema.
                    </p>
                  ) : (
                    <p className='-mt-2 order-last md:-mt-3 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                      ¡Campos completados correctamente! <br />
                    </p>
                  )}

                  <div className='mt-2 col-start-1 col-end-3 row-start-3 row-end-4 w-full md:w-[20rem] md:m-auto'>
                    <Button
                      disabled={isSubmitButtonDisabled}
                      type='submit'
                      className={cn(
                        'w-full text-[14px]',
                        offeringIncomeUpdateMutation?.isPending &&
                          'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                      )}
                      onClick={() => {
                        setTimeout(() => {
                          if (Object.keys(form.formState.errors).length === 0) {
                            setIsInputDisabled(true);
                            setIsDropZoneDisabled(true);
                            setIsDeleteFileButtonDisabled(true);
                            setIsSubmitButtonDisabled(true);
                          }
                        }, 100);
                      }}
                    >
                      {offeringIncomeUpdateMutation?.isPending
                        ? 'Procesando...'
                        : 'Guardar Cambios'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};
