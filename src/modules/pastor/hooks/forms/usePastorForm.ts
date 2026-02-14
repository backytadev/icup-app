import { useEffect, useState, useCallback, useMemo } from 'react';

import { useForm, type UseFormReturn } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { type MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { type PastorResponse } from '@/modules/pastor/types/pastor-response.interface';
import { type PastorFormData } from '@/modules/pastor/types/pastor-form-data.interface';
import { pastorFormSchema } from '@/modules/pastor/schemas/pastor-form-schema';
import {
  usePastorCreationMutation,
  usePastorUpdateMutation,
} from '@/modules/pastor/hooks/mutations';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { type ChurchResponse } from '@/modules/church/types';

type FormMode = 'create' | 'update';

interface BaseOptions {
  mode: FormMode;
}

interface CreateModeOptions extends BaseOptions {
  mode: 'create';
}

interface UpdateModeOptions extends BaseOptions {
  mode: 'update';
  id: string;
  data: PastorResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

type UsePastorFormOptions = CreateModeOptions | UpdateModeOptions;

interface UsePastorFormReturn {
  form: UseFormReturn<PastorFormData>;
  isInputDisabled: boolean;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitButtonDisabled: boolean;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isMessageErrorDisabled: boolean;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirChurchOpen: boolean;
  setIsInputTheirChurchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingData: boolean;
  churchesData: ChurchResponse[] | undefined;
  district: string;
  districtsValidation: ReturnType<typeof validateDistrictsAllowedByModule>;
  urbanSectorsValidation: ReturnType<typeof validateUrbanSectorsAllowedByDistrict>;
  isPending: boolean;
  handleSubmit: (formData: PastorFormData) => void;
  //* Ministry blocks
  ministryBlocks: MinistryMemberBlock[];
  setMinistryBlocks: React.Dispatch<React.SetStateAction<MinistryMemberBlock[]>>;
  //* Alert dialog states
  changedChurchId: string | undefined;
  setChangedChurchId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isAlertDialogOpen: boolean;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  churchesQuery: UseQueryResult<ChurchResponse[], Error>;
}

export const usePastorForm = (options: UsePastorFormOptions): UsePastorFormReturn => {
  const { mode } = options;

  //* Extract primitive values from options to use as stable dependencies
  const updateId = mode === 'update' ? (options as UpdateModeOptions).id : undefined;
  const updateData = mode === 'update' ? (options as UpdateModeOptions).data : undefined;
  const dialogClose = mode === 'update' ? (options as UpdateModeOptions).dialogClose : undefined;
  const scrollToTop = mode === 'update' ? (options as UpdateModeOptions).scrollToTop : undefined;

  //* States
  const [isLoadingData, setIsLoadingData] = useState(mode === 'update');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isInputTheirChurchOpen, setIsInputTheirChurchOpen] = useState<boolean>(false);

  //* Alert dialog states for church change
  const [changedChurchId, setChangedChurchId] = useState<string | undefined>(
    mode === 'update' ? updateData?.theirChurch?.id : undefined
  );
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);

  //* Ministry blocks state
  const [ministryBlocks, setMinistryBlocks] = useState<MinistryMemberBlock[]>([
    {
      churchId: null,
      ministryType: null,
      ministryId: null,
      ministryRoles: [],
      churchPopoverOpen: false,
      ministryPopoverOpen: false,
      ministries: [],
    },
  ]);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<PastorFormData>({
    mode: 'onChange',
    resolver: zodResolver(pastorFormSchema),
    defaultValues: {
      firstNames: '',
      lastNames: '',
      gender: '',
      originCountry: '',
      birthDate: undefined,
      maritalStatus: '',
      numberChildren: '0',
      conversionDate: undefined,
      email: '',
      phoneNumber: '',
      residenceCountry: '',
      residenceDepartment: '',
      residenceProvince: '',
      residenceDistrict: '',
      residenceUrbanSector: '',
      residenceAddress: '',
      referenceAddress: '',
      roles: [MemberRole.Pastor],
      relationType: RelationType.OnlyRelatedHierarchicalCover,
      recordStatus: undefined,
      theirChurch: '',
    },
  });

  //* Watchers
  const firstNames = form.watch('firstNames');
  const lastNames = form.watch('lastNames');
  const gender = form.watch('gender');
  const birthDate = form.watch('birthDate');
  const maritalStatus = form.watch('maritalStatus');
  const originCountry = form.watch('originCountry');
  const numberChildren = form.watch('numberChildren');
  const residenceCountry = form.watch('residenceCountry');
  const residenceDepartment = form.watch('residenceDepartment');
  const residenceProvince = form.watch('residenceProvince');
  const residenceDistrict = form.watch('residenceDistrict');
  const residenceUrbanSector = form.watch('residenceUrbanSector');
  const residenceAddress = form.watch('residenceAddress');
  const referenceAddress = form.watch('referenceAddress');
  const roles = form.watch('roles');
  const relationType = form.watch('relationType');
  const theirChurch = form.watch('theirChurch');
  const recordStatus = form.watch('recordStatus');

  //* Memoized helpers
  const districtsValidation = useMemo(() => validateDistrictsAllowedByModule(pathname), [pathname]);

  const urbanSectorsValidation = useMemo(
    () => validateUrbanSectorsAllowedByDistrict(residenceDistrict),
    [residenceDistrict]
  );

  //* Queries
  const queryKey = useMemo(
    () => (mode === 'create' ? ['churches-pastor-create'] : ['churches-pastor-update', updateId]),
    [mode, updateId]
  );

  const churchesQuery = useQuery<ChurchResponse[], Error>({
    queryKey,
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
  });

  const churchesData = churchesQuery.data;

  //* Effects - Create Mode
  useEffect(() => {
    if (mode === 'create') {
      form.resetField('residenceUrbanSector', { keepError: true });
    }
  }, [residenceDistrict, form, mode]);

  useEffect(() => {
    if (mode === 'create') {
      form.setValue('roles', [MemberRole.Pastor]);
    }
  }, [form, mode]);

  useEffect(() => {
    document.title = 'Modulo Pastor - IcupApp';
  }, []);

  //* Effects - Update Mode: Load ministry blocks
  useEffect(() => {
    if (mode !== 'update') return;

    const fetchMinistriesByChurch = async (churchId: string) => {
      try {
        const respData = await getSimpleMinistries({ isSimpleQuery: true, churchId });
        return respData ?? [];
      } catch (error) {
        return [];
      }
    };

    const loadMinistryBlocks = async () => {
      if (updateData?.member.ministries && updateData.member.ministries.length > 0) {
        const blocks = await Promise.all(
          updateData.member.ministries.map(async (m) => {
            const ministriesList = await fetchMinistriesByChurch(m.churchMinistryId ?? '');
            return {
              churchPopoverOpen: false,
              ministryPopoverOpen: false,
              churchId: m.churchMinistryId ?? '',
              ministryId: m.id ?? '',
              ministryRoles: m.ministryRoles,
              ministries: ministriesList,
              ministryType: m.ministryType,
            };
          })
        );

        setMinistryBlocks(blocks);
      }
    };

    void loadMinistryBlocks();
  }, [mode, updateData, setMinistryBlocks]);

  //* Effects - Update Mode: Populate form with data
  useEffect(() => {
    if (mode !== 'update') return;

    if (updateData) {
      form.setValue('firstNames', updateData.member?.firstNames ?? '');
      form.setValue('lastNames', updateData.member?.lastNames ?? '');
      form.setValue('gender', updateData.member?.gender ?? '');
      form.setValue('originCountry', updateData.member?.originCountry ?? '');
      form.setValue(
        'birthDate',
        new Date(String(updateData.member?.birthDate).replace(/-/g, '/'))
      );
      form.setValue('maritalStatus', updateData.member?.maritalStatus ?? '');
      form.setValue('numberChildren', String(updateData.member?.numberChildren) ?? '0');
      form.setValue(
        'conversionDate',
        updateData.member?.conversionDate && String(updateData.member.conversionDate) !== '1969-12-31'
          ? new Date(String(updateData.member.conversionDate).replace(/-/g, '/'))
          : undefined
      );
      form.setValue('email', updateData.member?.email ?? '');
      form.setValue('phoneNumber', updateData.member?.phoneNumber ?? '');
      form.setValue('residenceCountry', updateData.member?.residenceCountry ?? '');
      form.setValue('residenceDepartment', updateData.member?.residenceDepartment ?? '');
      form.setValue('residenceProvince', updateData.member?.residenceProvince ?? '');
      form.setValue('residenceDistrict', updateData.member?.residenceDistrict ?? '');
      form.setValue('residenceUrbanSector', updateData.member?.residenceUrbanSector ?? '');
      form.setValue('residenceAddress', updateData.member?.residenceAddress ?? '');
      form.setValue('referenceAddress', updateData.member?.referenceAddress ?? '');
      form.setValue('roles', updateData.member?.roles as MemberRole[]);
      form.setValue('relationType', updateData.relationType ?? '');
      form.setValue('theirChurch', updateData.theirChurch?.id);
      form.setValue('recordStatus', updateData.recordStatus);
    }

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [mode, updateData, form]);

  //* Effects - Update Mode: Dynamic URL
  useEffect(() => {
    if (mode === 'update' && updateId) {
      const originalUrl = window.location.href;
      const url = new URL(window.location.href);
      url.pathname = `/pastors/update/${updateId}/edit`;
      window.history.replaceState({}, '', url);

      return () => {
        window.history.replaceState({}, '', originalUrl);
      };
    }
  }, [mode, updateId]);

  //* Effects - Update Mode: Controller district and urban sector
  useEffect(() => {
    if (mode === 'update') {
      form.resetField('residenceUrbanSector', { keepError: true });
    }
  }, [mode, residenceDistrict, form]);

  //* Effect to open alert dialog when church changes in update mode
  useEffect(() => {
    if (
      mode === 'update' &&
      updateData?.theirChurch?.id !== changedChurchId &&
      changedChurchId !== undefined
    ) {
      const timeoutId = setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [mode, updateData?.theirChurch?.id, changedChurchId]);

  //* Submit button logic - Create Mode
  useEffect(() => {
    if (mode !== 'create') return;

    if (
      form.formState.errors &&
      Object.values(form.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Conditions for OnlyRelatedHierarchicalCover
    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      roles.includes(MemberRole.Pastor) &&
      !theirChurch &&
      !isInputDisabled &&
      Object.values(form.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      theirChurch &&
      !isInputDisabled &&
      roles.includes(MemberRole.Pastor) &&
      Object.values(form.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    //* Conditions for RelatedBothMinistriesAndHierarchicalCover
    if (
      ((!theirChurch &&
        relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
        ministryBlocks?.every(
          (item: MinistryMemberBlock) =>
            item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
        )) ||
        (theirChurch &&
          relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
          ministryBlocks?.some(
            (item: MinistryMemberBlock) =>
              !item.churchId ||
              !item.ministryId ||
              !item.ministryType ||
              item.ministryRoles.length === 0
          ))) &&
      roles.includes(MemberRole.Pastor) &&
      Object.values(form.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
      roles.includes(MemberRole.Pastor) &&
      theirChurch &&
      Object.values(form.formState.errors).length === 0 &&
      !isInputDisabled &&
      ministryBlocks?.every(
        (item: MinistryMemberBlock) =>
          item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
      )
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      !firstNames ||
      !lastNames ||
      !gender ||
      !birthDate ||
      !maritalStatus ||
      !originCountry ||
      !numberChildren ||
      !residenceCountry ||
      !residenceDepartment ||
      !residenceProvince ||
      !residenceDistrict ||
      !residenceUrbanSector ||
      !residenceAddress ||
      !referenceAddress ||
      roles.length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    mode,
    form.formState,
    firstNames,
    lastNames,
    gender,
    birthDate,
    maritalStatus,
    originCountry,
    numberChildren,
    residenceCountry,
    residenceDepartment,
    residenceProvince,
    residenceDistrict,
    residenceUrbanSector,
    residenceAddress,
    referenceAddress,
    roles,
    relationType,
    theirChurch,
    ministryBlocks,
    isInputDisabled,
  ]);

  //* Submit button logic - Update Mode
  useEffect(() => {
    if (mode !== 'update') return;

    if (
      form.formState.errors &&
      Object.values(form.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      theirChurch &&
      roles.includes(MemberRole.Pastor) &&
      Object.values(form.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    //* Conditions for OnlyRelatedHierarchicalCover
    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      !theirChurch
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      !isInputDisabled &&
      theirChurch &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      Object.values(form.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    //* Conditions for RelatedBothMinistriesAndHierarchicalCover
    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      !isInputDisabled &&
      ((theirChurch &&
        relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
        ministryBlocks?.some(
          (item: MinistryMemberBlock) =>
            !item.churchId ||
            !item.ministryId ||
            !item.ministryType ||
            item.ministryRoles.length === 0
        )) ||
        (!theirChurch &&
          relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
          ministryBlocks?.every(
            (item: MinistryMemberBlock) =>
              item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
          ))) &&
      Object.values(form.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      !isInputDisabled &&
      theirChurch &&
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
      ministryBlocks?.every(
        (item: MinistryMemberBlock) =>
          item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
      ) &&
      Object.values(form.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      !firstNames ||
      !lastNames ||
      !gender ||
      !birthDate ||
      !maritalStatus ||
      !originCountry ||
      !numberChildren ||
      !residenceCountry ||
      !residenceDepartment ||
      !residenceProvince ||
      !residenceDistrict ||
      !residenceUrbanSector ||
      !residenceAddress ||
      !referenceAddress ||
      roles.length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    mode,
    form.formState,
    firstNames,
    lastNames,
    gender,
    birthDate,
    maritalStatus,
    originCountry,
    numberChildren,
    residenceCountry,
    residenceDepartment,
    residenceProvince,
    residenceDistrict,
    residenceUrbanSector,
    residenceAddress,
    referenceAddress,
    roles,
    relationType,
    theirChurch,
    recordStatus,
    ministryBlocks,
    isInputDisabled,
  ]);

  //* Mutations
  const pastorCreationMutation = usePastorCreationMutation({
    pastorCreationForm: form,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Memoized callbacks for mutation options
  const noop = useCallback(() => {}, []);

  const pastorUpdateMutation = usePastorUpdateMutation({
    dialogClose: dialogClose ?? noop,
    scrollToTop: scrollToTop ?? noop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  const isPending =
    mode === 'create' ? pastorCreationMutation.isPending : pastorUpdateMutation.isPending;

  //* Form handler
  const handleSubmit = useCallback(
    (formData: PastorFormData): void => {
      setIsInputDisabled(true);

      if (mode === 'create') {
        pastorCreationMutation.mutate(formData);
      } else if (updateId) {
        pastorUpdateMutation.mutate({ id: updateId, formData });
      }
    },
    [mode, updateId, pastorCreationMutation, pastorUpdateMutation]
  );

  return {
    form,
    isInputDisabled,
    setIsInputDisabled,
    isSubmitButtonDisabled,
    setIsSubmitButtonDisabled,
    isMessageErrorDisabled,
    setIsMessageErrorDisabled,
    isInputTheirChurchOpen,
    setIsInputTheirChurchOpen,
    isLoadingData,
    churchesData,
    district: residenceDistrict,
    districtsValidation,
    urbanSectorsValidation,
    isPending,
    handleSubmit,
    //* Ministry blocks
    ministryBlocks,
    setMinistryBlocks,
    //* Alert dialog states
    changedChurchId,
    setChangedChurchId,
    isAlertDialogOpen,
    setIsAlertDialogOpen,
    churchesQuery,
  };
};
