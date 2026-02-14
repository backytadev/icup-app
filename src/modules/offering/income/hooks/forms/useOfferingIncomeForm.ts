/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useCallback, useEffect, useState } from 'react';

import type * as z from 'zod';
import { toast } from 'sonner';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { MemberType } from '@/modules/offering/income/enums/member-type.enum';
import { OfferingIncomeCreationType } from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import { OfferingIncomeCreationSubType } from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';

import { offeringIncomeFormSchema } from '@/modules/offering/income/schemas/offering-income-form-schema';
import { type OfferingIncomeFormData } from '@/modules/offering/income/interfaces/offering-income-form-data.interface';
import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';

import { useOfferingIncomeSetData } from './useOfferingIncomeSetData';
import { useOfferingIncomeFileDropZone } from './useOfferingIncomeFileDropZone';
import { useOfferingIncomeCreationMutation } from '../mutations/useOfferingIncomeCreationMutation';
import { useOfferingIncomeUpdateMutation } from '../mutations/useOfferingIncomeUpdateMutation';
import { useOfferingIncomeCreationSubmitButtonLogic } from './useOfferingIncomeCreationSubmitButtonLogic';
import { useOfferingIncomeUpdateSubmitButtonLogic } from './useOfferingIncomeUpdateSubmitButtonLogic';

import { getExternalDonors } from '@/modules/offering/income/services/offering-income.service';

import { getSimpleZones } from '@/modules/zone/services/zone.service';
import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleFamilyGroups } from '@/modules/family-group/services/family-group.service';

import { useModuleQueries } from '@/modules/offering/shared/hooks/useModuleQueries';
import { OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';
import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';
import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { type RejectionProps } from '@/modules/offering/shared/interfaces/rejected-props.interface';
import { useImagesUploadMutation } from '@/modules/offering/shared/hooks/useImagesUploadMutation';

import { RecordStatus } from '@/shared/enums/record-status.enum';

import { type PastorResponse } from '@/modules/pastor/types/pastor-response.interface';
import { type CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';
import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';
import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { type SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';

//* Types
type FormMode = 'create' | 'update';

type QueryDataResponse =
  | DiscipleResponse[]
  | PreacherResponse[]
  | SupervisorResponse[]
  | CopastorResponse[]
  | PastorResponse[];

interface CreateModeOptions {
  mode: 'create';
}

interface UpdateModeOptions {
  mode: 'update';
  id: string;
  data: OfferingIncomeResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
  onUpdateSuccess?: (offeringId: string) => void;
}

type UseOfferingIncomeFormOptions = CreateModeOptions | UpdateModeOptions;

export interface UseOfferingIncomeFormReturn {
  //* Mode
  mode: FormMode;

  //* Form
  form: UseFormReturn<OfferingIncomeFormData>;

  //* UI states
  isInputDisabled: boolean;
  isSubmitButtonDisabled: boolean;
  isMessageErrorDisabled: boolean;
  isInputMemberDisabled: boolean;
  isLoadingData: boolean;
  isPending: boolean;
  isProcessing: boolean;

  //* Watchers
  type: string;
  subType: string | undefined;
  category: string | undefined;
  isNewExternalDonor: boolean | undefined;
  memberType: string | undefined;
  externalDonorId: string | undefined;
  comments: string | undefined;

  //* Popover states
  isInputZoneOpen: boolean;
  setIsInputZoneOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputFamilyGroupOpen: boolean;
  setIsInputFamilyGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDateOpen: boolean;
  setIsInputDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDonorOpen: boolean;
  setIsInputDonorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputBirthDateOpen: boolean;
  setIsInputBirthDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputMemberOpen: boolean;
  setIsInputMemberOpen: React.Dispatch<React.SetStateAction<boolean>>;

  //* Update-only popover
  isInputChurchOpen: boolean;
  setIsInputChurchOpen: React.Dispatch<React.SetStateAction<boolean>>;

  //* Query data
  queryData: QueryDataResponse | undefined;
  externalDonorsData: any;
  familyGroupsQuery: ReturnType<typeof useQuery>;
  zonesQuery: ReturnType<typeof useQuery>;
  churchesQuery: ReturnType<typeof useQuery>;
  pastorsQuery: ReturnType<typeof useQuery>;
  copastorsQuery: ReturnType<typeof useQuery>;
  supervisorsQuery: ReturnType<typeof useQuery>;
  preachersQuery: ReturnType<typeof useQuery>;
  disciplesQuery: ReturnType<typeof useQuery>;

  //* Dropzone (update only)
  files: FilesProps[];
  rejected: RejectionProps[];
  getRootProps: ReturnType<typeof useDropzone>['getRootProps'];
  getInputProps: ReturnType<typeof useDropzone>['getInputProps'];
  isDragActive: boolean;
  removeFile: (name: any) => void;
  removeCloudFile: (name: any) => void;
  removeRejected: (name: any) => void;
  isDeleteFileButtonDisabled: boolean;

  //* State setters (for submit button onClick)
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDropZoneDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteFileButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInputMemberDisabled: React.Dispatch<React.SetStateAction<boolean>>;

  //* Submit
  handleSubmit: (formData: z.infer<typeof offeringIncomeFormSchema>) => Promise<void>;

  //* Mutation
  mutation: any;

  //* Update-only: response data for header
  responseData: OfferingIncomeResponse | undefined;

  //* Dialog helpers (update only)
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  topRef: React.RefObject<HTMLDivElement | null>;
  handleContainerClose: () => void;
  handleContainerScroll: () => void;

  //* Receipt modal (create only)
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  receiptPdfBlob: Blob | null;
  receiptOfferingId: string;
}

export const useOfferingIncomeForm = (
  options: UseOfferingIncomeFormOptions
): UseOfferingIncomeFormReturn => {
  const { mode } = options;

  //* Extract update-only values
  const updateId = mode === 'update' ? (options as UpdateModeOptions).id : '';
  const updateData = mode === 'update' ? (options as UpdateModeOptions).data : undefined;
  const dialogClose = mode === 'update' ? (options as UpdateModeOptions).dialogClose : undefined;
  const scrollToTop = mode === 'update' ? (options as UpdateModeOptions).scrollToTop : undefined;
  const onUpdateSuccess = mode === 'update' ? (options as UpdateModeOptions).onUpdateSuccess : undefined;

  //* Context
  const activeChurchId = useChurchMinistryContextStore((state) => state.activeChurchId);

  //* States
  const [isInputZoneOpen, setIsInputZoneOpen] = useState<boolean>(false);
  const [isInputFamilyGroupOpen, setIsInputFamilyGroupOpen] = useState<boolean>(false);
  const [isInputDateOpen, setIsInputDateOpen] = useState<boolean>(false);
  const [isInputDonorOpen, setIsInputDonorOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputMemberOpen, setIsInputMemberOpen] = useState<boolean>(false);
  const [isInputChurchOpen, setIsInputChurchOpen] = useState<boolean>(false);

  const [queryData, setQueryData] = useState<QueryDataResponse>();

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  //* Receipt modal states (create only)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [receiptPdfBlob, setReceiptPdfBlob] = useState<Blob | null>(null);
  const [receiptOfferingId, setReceiptOfferingId] = useState<string>('');
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  const [isInputMemberDisabled, setIsInputMemberDisabled] = useState<boolean>(true);

  const [isLoadingData, setIsLoadingData] = useState(mode === 'update');

  const [isProcessing, setIsProcessing] = useState(false);

  //* Update-only states
  const [files, setFiles] = useState<FilesProps[]>([]);
  const [rejected, setRejected] = useState<RejectionProps[]>([]);
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState<boolean>(false);
  const [isDeleteFileButtonDisabled, setIsDeleteFileButtonDisabled] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  //* Dialog helpers (for donor update dialog in create mode, and general use)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const topRef = { current: null } as React.RefObject<HTMLDivElement | null>;

  const handleContainerScroll = useCallback((): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleContainerClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  //* Form
  const form = useForm<z.infer<typeof offeringIncomeFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(offeringIncomeFormSchema),
    defaultValues:
      mode === 'create'
        ? {
            type: OfferingIncomeCreationType.Offering,
            subType: '',
            category: '',
            memberType: '',
            shift: '',
            amount: '',
            date: undefined,
            currency: CurrencyType.PEN,
            comments: '',
            familyGroupId: '',
            memberId: '',
            zoneId: '',
            churchId: activeChurchId || undefined,
            shouldOpenReceiptInBrowser: 'yes',
          }
        : {
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
            familyGroupId: '',
            memberId: '',
            zoneId: '',
          },
  });

  //* Watchers
  const type = form.watch('type');
  const subType = form.watch('subType');
  const category = form.watch('category');
  const isNewExternalDonor = form.watch('isNewExternalDonor');
  const memberType = form.watch('memberType');
  const externalDonorId = form.watch('externalDonorId');
  const comments = form.watch('comments');
  const shouldOpenReceiptInBrowser = form.watch('shouldOpenReceiptInBrowser');
  const churchId = form.watch('churchId');

  //* Submit button logic hooks
  if (mode === 'create') {
    useOfferingIncomeCreationSubmitButtonLogic({
      isInputDisabled,
      isDropZoneDisabled: false,
      setIsDropZoneDisabled: () => {},
      setIsMessageErrorDisabled,
      setIsSubmitButtonDisabled,
      isDeleteFileButtonDisabled: false,
      offeringIncomeCreationForm: form,
    });
  } else {
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
  }

  //* Set data (update only)
  if (mode === 'update') {
    useOfferingIncomeSetData({
      id: updateId,
      data: updateData,
      setFiles,
      setIsLoadingData,
      offeringIncomeUpdateForm: form,
    });
  }

  //* Queries
  const externalDonorsQuery = useQuery({
    queryKey: ['external-donors', mode === 'create' ? activeChurchId : churchId],
    queryFn: getExternalDonors,
    retry: false,
    enabled: mode === 'create' ? category === 'external_donation' && !!activeChurchId : true,
  });

  const familyGroupsQuery = useQuery({
    queryKey: ['family-groups', mode === 'create' ? activeChurchId : churchId],
    queryFn: () =>
      getSimpleFamilyGroups({
        isSimpleQuery: false,
        churchId: mode === 'create' ? activeChurchId || undefined : churchId,
      }),
    retry: false,
    enabled: mode === 'create' ? !!activeChurchId : !!churchId,
  });

  const zonesQuery = useQuery({
    queryKey: ['zones', mode === 'create' ? activeChurchId : churchId],
    queryFn: () =>
      getSimpleZones({
        isSimpleQuery: false,
        churchId: mode === 'create' ? activeChurchId || undefined : churchId,
      }),
    retry: false,
    enabled: mode === 'create' ? !!activeChurchId : !!churchId,
  });

  const churchesQuery = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
    enabled: mode === 'update',
  });

  const { pastorsQuery, copastorsQuery, supervisorsQuery, preachersQuery, disciplesQuery } =
    useModuleQueries({ memberType });

  //* Dropzone (update only - but hooks must be called unconditionally)
  const { onDrop, removeFile, removeCloudFile, removeRejected } = useOfferingIncomeFileDropZone({
    offeringIncomeForm: form,
    files,
    setFiles,
    setRejected,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 1024 * 1000,
    onDrop,
    disabled: true,
  });

  //* Receipt modal handler
  const handleReceiptGenerated = useCallback((blob: Blob, offeringId: string) => {
    setReceiptPdfBlob(blob);
    setReceiptOfferingId(offeringId);
    setIsReceiptModalOpen(true);
  }, []);

  //* Mutations
  const offeringIncomeCreationMutation = useOfferingIncomeCreationMutation({
    setFiles: () => {},
    imageUrls: [],
    shouldOpenReceiptInBrowser,
    setIsInputDisabled,
    setIsInputMemberDisabled,
    setIsSubmitButtonDisabled,
    setIsDeleteFileButtonDisabled: () => {},
    offeringIncomeCreationForm: form,
    onReceiptGenerated: handleReceiptGenerated,
  });

  const noop = useCallback(() => {}, []);
  const uploadImagesMutation = useImagesUploadMutation();

  const offeringIncomeUpdateMutation = useOfferingIncomeUpdateMutation({
    dialogClose: dialogClose ?? noop,
    scrollToTop: scrollToTop ?? noop,
    imageUrls,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsDeleteFileButtonDisabled,
    onUpdateSuccess,
    offeringId: updateId,
  });

  const mutation =
    mode === 'create' ? offeringIncomeCreationMutation : offeringIncomeUpdateMutation;
  const isPending = mutation.isPending;

  //* Effects - Processing state (create only)
  useEffect(() => {
    if (mode !== 'create') return;
    let timer: NodeJS.Timeout;

    if (offeringIncomeCreationMutation?.isPending) {
      setIsProcessing(true);
      timer = setTimeout(() => setIsProcessing(false), 4500);
    }

    return () => clearTimeout(timer);
  }, [offeringIncomeCreationMutation?.isPending, mode]);

  //* Effects - Query data based on member type
  useEffect(() => {
    if (memberType === MemberType.Disciple) setQueryData(disciplesQuery.data);
    if (memberType === MemberType.Preacher) setQueryData(preachersQuery.data);
    if (memberType === MemberType.Supervisor) setQueryData(supervisorsQuery.data);
    if (memberType === MemberType.Copastor) setQueryData(copastorsQuery.data);
    if (memberType === MemberType.Pastor) setQueryData(pastorsQuery.data);
  }, [pastorsQuery, copastorsQuery, supervisorsQuery, preachersQuery, disciplesQuery]);

  //* Effects - Member disabled logic
  useEffect(() => {
    if (memberType) {
      setIsInputMemberDisabled(false);
    }
    if (!memberType) {
      setIsInputMemberDisabled(true);
    }
    form.resetField('memberId', { keepError: true });
  }, [memberType]);

  //* Effects - Receipt browser state (create only)
  useEffect(() => {
    if (mode !== 'create') return;

    if (
      type === OfferingIncomeCreationType.IncomeAdjustment ||
      subType !== OfferingIncomeCreationSubType.FamilyGroup
    ) {
      form.setValue('shouldOpenReceiptInBrowser', 'no');
    }

    if (subType === OfferingIncomeCreationSubType.FamilyGroup) {
      form.setValue('shouldOpenReceiptInBrowser', 'yes');
    }
  }, [type, subType, mode]);

  //* Effects - Inactive record (update only)
  useEffect(() => {
    if (mode !== 'update') return;

    if (updateData?.recordStatus === RecordStatus.Inactive) {
      setIsInputDisabled(true);
      setIsDropZoneDisabled(true);
      setIsDeleteFileButtonDisabled(true);
    }
  }, [mode, updateData]);

  //* Effects - Document title
  useEffect(() => {
    document.title = 'Modulo Ofrenda - IcupApp';
  }, []);

  //* Form handler
  const handleSubmit = async (
    formData: z.infer<typeof offeringIncomeFormSchema>
  ): Promise<void> => {
    if (mode === 'create') {
      let imageUrls;
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

      try {
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
          churchId: activeChurchId ?? '',
          recordStatus: formData.recordStatus,
          imageUrls: imageUrls ?? [],
        });
      } catch (error) {
        toast.error('Error al crear el ingreso de ofrenda', {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          setIsInputDisabled(false);
          setIsSubmitButtonDisabled(false);
        }, 1500);
      }
    } else {
      const filesOnly = files.filter((item) => item instanceof File);

      try {
        let uploadedImageUrls;

        if (filesOnly.length >= 1) {
          const uploadResult = await uploadImagesMutation.mutateAsync({
            files: filesOnly as any,
            fileType: OfferingFileType.Income,
            offeringType: formData.type,
            offeringSubType: formData.subType ?? null,
          });

          uploadedImageUrls = uploadResult.imageUrls;
          setImageUrls(uploadedImageUrls ?? []);
        }

        await offeringIncomeUpdateMutation.mutateAsync({
          id: updateId,
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
    }
  };

  return {
    mode,
    form,

    isInputDisabled,
    isSubmitButtonDisabled,
    isMessageErrorDisabled,
    isInputMemberDisabled,
    isLoadingData,
    isPending,
    isProcessing,

    type,
    subType,
    category,
    isNewExternalDonor,
    memberType,
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

    isInputChurchOpen,
    setIsInputChurchOpen,

    queryData,
    externalDonorsData: externalDonorsQuery?.data,
    familyGroupsQuery,
    zonesQuery,
    churchesQuery,
    pastorsQuery,
    copastorsQuery,
    supervisorsQuery,
    preachersQuery,
    disciplesQuery,

    files,
    rejected,
    getRootProps,
    getInputProps,
    isDragActive,
    removeFile,
    removeCloudFile,
    removeRejected,
    isDeleteFileButtonDisabled,

    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsDropZoneDisabled,
    setIsDeleteFileButtonDisabled,
    setIsInputMemberDisabled,

    handleSubmit,
    mutation,

    responseData: updateData,

    isOpen,
    setIsOpen,
    topRef,
    handleContainerClose,
    handleContainerScroll,

    isReceiptModalOpen,
    setIsReceiptModalOpen,
    receiptPdfBlob,
    receiptOfferingId,
  };
};
