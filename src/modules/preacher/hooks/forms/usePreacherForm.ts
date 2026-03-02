import { useEffect, useRef, useMemo, useState } from 'react';

import { useForm, type UseFormReturn } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';
import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';
import { useMinistryBlocks } from '@/shared/hooks/useMinistryBlocks';
import { type MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { getSimpleCopastors } from '@/modules/copastor/services/copastor.service';
import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { getSimpleSupervisors } from '@/modules/supervisor/services/supervisor.service';

import { preacherFormSchema } from '@/modules/preacher/schemas';
import {
  preacherCreateDefaultValues,
  preacherUpdateDefaultValues,
} from '@/modules/preacher/constants';
import { type PreacherFormData } from '@/modules/preacher/types/preacher-form-data.interface';
import { type PreacherResponse } from '@/modules/preacher/types/preacher-response.interface';
import {
  usePreacherCreationMutation,
  usePreacherUpdateMutation,
} from '@/modules/preacher/hooks/mutations';

const NOOP = (): void => {};

const EMPTY_BLOCK: MinistryMemberBlock = {
  churchId: null,
  ministryType: null,
  ministryId: null,
  ministryRoles: [],
  churchPopoverOpen: false,
  ministryPopoverOpen: false,
  ministries: [],
};

interface NormalizedBlock {
  churchId: string;
  ministryId: string;
  ministryType: string;
  ministryRoles: string[];
}

const normalizeBlock = (b: MinistryMemberBlock): NormalizedBlock => ({
  churchId: b.churchId ?? '',
  ministryId: b.ministryId ?? '',
  ministryType: b.ministryType ?? '',
  ministryRoles: [...(b.ministryRoles ?? [])].sort(),
});

//* Discriminated union for mode options
interface CreateModeOptions {
  mode: 'create';
}

interface UpdateModeOptions {
  mode: 'update';
  id: string;
  data: PreacherResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

type UsePreacherFormOptions = CreateModeOptions | UpdateModeOptions;

export interface UsePreacherFormReturn {
  form: UseFormReturn<PreacherFormData>;

  //* Loading state (update mode only)
  isLoadingData: boolean;

  //* Input / interaction state
  isInputDisabled: boolean;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isRelationSelectDisabled: boolean;
  setIsRelationSelectDisabled: React.Dispatch<React.SetStateAction<boolean>>;

  //* Button / message state
  isSubmitButtonDisabled: boolean;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isMessageErrorDisabled: boolean;
  isPromoteButtonDisabled: boolean;
  isMessagePromoteDisabled: boolean;
  setIsMessagePromoteDisabled: React.Dispatch<React.SetStateAction<boolean>>;

  //* Popover / picker open states
  isInputBirthDateOpen: boolean;
  setIsInputBirthDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputConvertionDateOpen: boolean;
  setIsInputConvertionDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirSupervisorOpen: boolean;
  setIsInputTheirSupervisorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirCopastorOpen: boolean;
  setIsInputTheirCopastorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirPastorRelationDirectOpen: boolean;
  setIsInputTheirPastorRelationDirectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirPastorOnlyMinistriesOpen: boolean;
  setIsInputTheirPastorOnlyMinistriesOpen: React.Dispatch<React.SetStateAction<boolean>>;

  //* Alert dialog state — supervisor relation change (update mode)
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isAlertDialogOpen: boolean;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

  //* Location-based helpers
  district: string;
  districtsValidation: ReturnType<typeof validateDistrictsAllowedByModule>;
  urbanSectorsValidation: ReturnType<typeof validateUrbanSectorsAllowedByDistrict>;
  disabledRoles: ReturnType<typeof useRoleValidationByPath>['disabledRoles'];

  //* Ministry blocks state + helpers
  ministryBlocks: MinistryMemberBlock[];
  setMinistryBlocks: React.Dispatch<React.SetStateAction<MinistryMemberBlock[]>>;
  addMinistryBlock: () => void;
  removeMinistryBlock: (index: number) => void;
  updateMinistryBlock: ReturnType<typeof useMinistryBlocks>['updateMinistryBlock'];
  toggleRoleInBlock: ReturnType<typeof useMinistryBlocks>['toggleRoleInBlock'];
  handleSelectChurch: ReturnType<typeof useMinistryBlocks>['handleSelectChurch'];

  //* Queries
  supervisorsQuery: UseQueryResult<any, Error>;
  copastorsQuery: UseQueryResult<any, Error>;
  pastorsQuery: UseQueryResult<any, Error>;
  churchesQuery: UseQueryResult<any, Error>;

  //* Computed
  isPending: boolean;
  hasDuplicates: boolean;

  //* Handlers
  handleSubmit: (formData: PreacherFormData) => void;
  handleRolePromotion: () => void;
}

export const usePreacherForm = (options: UsePreacherFormOptions): UsePreacherFormReturn => {
  const { mode } = options;

  const updateData = mode === 'update' ? (options as UpdateModeOptions).data : undefined;
  const updateId = mode === 'update' ? (options as UpdateModeOptions).id : undefined;

  //* States
  const [isLoadingData, setIsLoadingData] = useState(mode === 'update');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isRelationSelectDisabled, setIsRelationSelectDisabled] = useState(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState(true);
  const [isMessagePromoteDisabled, setIsMessagePromoteDisabled] = useState(false);

  //* Popover open states
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState(false);
  const [isInputTheirSupervisorOpen, setIsInputTheirSupervisorOpen] = useState(false);
  const [isInputTheirCopastorOpen, setIsInputTheirCopastorOpen] = useState(false);
  const [isInputTheirPastorRelationDirectOpen, setIsInputTheirPastorRelationDirectOpen] =
    useState(false);
  const [isInputTheirPastorOnlyMinistriesOpen, setIsInputTheirPastorOnlyMinistriesOpen] =
    useState(false);

  //* Alert dialog state — fires when user picks a different supervisor
  const [changedId, setChangedId] = useState<string | undefined>(
    mode === 'update' ? (options as UpdateModeOptions).data?.theirSupervisor?.id : undefined
  );
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  //* Ministry blocks
  const [ministryBlocks, setMinistryBlocks] = useState<MinistryMemberBlock[]>([EMPTY_BLOCK]);
  const originalMinistryBlocksRef = useRef<NormalizedBlock[]>(
    mode === 'update' ? [normalizeBlock(EMPTY_BLOCK)] : []
  );

  //* External hooks
  const { pathname } = useLocation();

  //* Form
  const form = useForm<PreacherFormData>({
    mode: 'onChange',
    resolver: zodResolver(preacherFormSchema),
    defaultValues:
      mode === 'create' ? preacherCreateDefaultValues : preacherUpdateDefaultValues,
  });

  //* Watchers
  const firstNames = form.watch('firstNames');
  const lastNames = form.watch('lastNames');
  const gender = form.watch('gender');
  const birthDate = form.watch('birthDate');
  const conversionDate = form.watch('conversionDate');
  const maritalStatus = form.watch('maritalStatus');
  const email = form.watch('email');
  const phoneNumber = form.watch('phoneNumber');
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
  const theirSupervisor = form.watch('theirSupervisor');
  const theirCopastor = form.watch('theirCopastor');
  const theirPastorRelationDirect = form.watch('theirPastorRelationDirect');
  const theirPastorOnlyMinistries = form.watch('theirPastorOnlyMinistries');
  const isDirectRelationToPastor = form.watch('isDirectRelationToPastor');
  const recordStatus = form.watch('recordStatus');

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistrict);
  const { disabledRoles } = useRoleValidationByPath({ path: pathname });

  //* Ministry block CRUD helpers
  const {
    addMinistryBlock,
    removeMinistryBlock,
    updateMinistryBlock,
    toggleRoleInBlock,
    handleSelectChurch,
  } = useMinistryBlocks({ setMinistryBlocks });

  //* Queries
  const supervisorsQuery = useQuery({
    queryKey: mode === 'create' ? ['supervisors'] : ['supervisors', updateId],
    queryFn: () => getSimpleSupervisors({ isSimpleQuery: true }),
    retry: false,
  });

  const copastorsQuery = useQuery({
    queryKey: mode === 'create' ? ['copastors'] : ['copastors', updateId],
    queryFn: () => getSimpleCopastors({ isSimpleQuery: true }),
    retry: false,
  });

  const pastorsQuery = useQuery({
    queryKey: mode === 'create' ? ['pastors'] : ['pastors', updateId],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    retry: false,
  });

  const churchesQuery = useQuery({
    queryKey: mode === 'create' ? ['churches'] : ['churches', updateId],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  //* Effects: Create mode

  useEffect(() => {
    if (mode === 'create') {
      form.setValue('roles', [MemberRole.Preacher]);
    }
  }, [form, mode]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetField('residenceUrbanSector', { keepError: true });
    }
  }, [residenceDistrict, form, mode]);

  //* Effects: Update mode

  //* Load ministry blocks from API
  useEffect(() => {
    if (mode !== 'update' || !updateData) return;

    const fetchMinistriesByChurch = async (churchId: string): Promise<any[]> => {
      try {
        const result = await getSimpleMinistries({ isSimpleQuery: true, churchId });
        return result ?? [];
      } catch {
        return [];
      }
    };

    const loadMinistryBlocks = async (): Promise<void> => {
      if (updateData?.member?.ministries && updateData.member.ministries.length > 0) {
        const blocks: MinistryMemberBlock[] = await Promise.all(
          updateData.member.ministries.map(async (m: any) => ({
            churchPopoverOpen: false,
            ministryPopoverOpen: false,
            churchId: m.churchMinistryId ?? '',
            ministryId: m.id ?? '',
            ministryRoles: m.ministryRoles,
            ministries: await fetchMinistriesByChurch(m.churchMinistryId ?? ''),
            ministryType: m.ministryType,
          }))
        );

        setMinistryBlocks(blocks);
        originalMinistryBlocksRef.current = blocks.map(normalizeBlock);
      }
    };

    void loadMinistryBlocks();
  }, [mode, updateData]);

  //* Populate form via reset() so isDirty works correctly
  useEffect(() => {
    if (mode !== 'update' || !updateData) return;

    const relTypeValue = updateData.relationType ?? '';

    form.reset({
      firstNames: updateData.member?.firstNames ?? '',
      lastNames: updateData.member?.lastNames ?? '',
      gender: updateData.member?.gender ?? '',
      originCountry: updateData.member?.originCountry ?? '',
      birthDate: new Date(String(updateData.member?.birthDate).replace(/-/g, '/')),
      maritalStatus: updateData.member?.maritalStatus ?? '',
      numberChildren: String(updateData.member?.numberChildren ?? '0'),
      conversionDate:
        updateData.member?.conversionDate &&
        String(updateData.member.conversionDate) !== '1969-12-31'
          ? new Date(String(updateData.member.conversionDate).replace(/-/g, '/'))
          : undefined,
      email: updateData.member?.email ?? '',
      phoneNumber: updateData.member?.phoneNumber ?? '',
      residenceCountry: updateData.member?.residenceCountry ?? '',
      residenceDepartment: updateData.member?.residenceDepartment ?? '',
      residenceProvince: updateData.member?.residenceProvince ?? '',
      residenceDistrict: updateData.member?.residenceDistrict ?? '',
      residenceUrbanSector: updateData.member?.residenceUrbanSector ?? '',
      residenceAddress: updateData.member?.residenceAddress ?? '',
      referenceAddress: updateData.member?.referenceAddress ?? '',
      roles: updateData.member?.roles as MemberRole[],
      relationType: relTypeValue,
      recordStatus: updateData.recordStatus,
      theirSupervisor:
        relTypeValue === RelationType.OnlyRelatedHierarchicalCover ||
        relTypeValue === RelationType.RelatedBothMinistriesAndHierarchicalCover
          ? (updateData.theirSupervisor?.id ?? '')
          : '',
      theirPastorOnlyMinistries:
        relTypeValue === RelationType.OnlyRelatedMinistries
          ? (updateData.theirPastor?.id ?? '')
          : '',
      theirCopastor: '',
      theirPastorRelationDirect: '',
      isDirectRelationToPastor: false,
    });

    setIsLoadingData(false);
  }, [mode, updateData, form]);

  //* Dynamic URL for update mode
  useEffect(() => {
    if (mode !== 'update' || !updateId) return;

    const originalUrl = window.location.href;
    const url = new URL(window.location.href);
    url.pathname = `/preachers/update/${updateId}/edit`;
    window.history.replaceState({}, '', url);

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [mode, updateId]);

  //* Reset urban sector when district changes (update mode)
  useEffect(() => {
    if (mode === 'update') {
      form.resetField('residenceUrbanSector', { keepError: true });
    }
  }, [mode, residenceDistrict, form]);

  //* Open supervisor-change alert dialog when user picks a different supervisor
  useEffect(() => {
    if (mode !== 'update') return;

    if (updateData?.theirSupervisor?.id !== changedId && changedId !== undefined) {
      setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
    }
  }, [changedId, mode, updateData]);

  //* Clear relation fields when relation type changes
  useEffect(() => {
    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover ||
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover
    ) {
      form.setValue('theirPastorOnlyMinistries', '');
    }

    if (relationType === RelationType.OnlyRelatedMinistries) {
      form.setValue('theirSupervisor', '');
    }
  }, [relationType, form]);

  //* Clear ministry blocks when switching to relation type without ministries
  useEffect(() => {
    if (relationType === RelationType.OnlyRelatedHierarchicalCover) {
      setMinistryBlocks([EMPTY_BLOCK]);
    }
  }, [relationType]);

  //* Clear promotion fields when isDirectRelationToPastor changes
  useEffect(() => {
    if (mode !== 'update') return;
    if (isDirectRelationToPastor) {
      form.setValue('theirCopastor', '');
    } else {
      form.setValue('theirPastorRelationDirect', '');
    }
  }, [isDirectRelationToPastor, form, mode]);

  //* Submit button logic: Create mode
  useEffect(() => {
    if (mode !== 'create') return;

    const hasErrors = Object.values(form.formState.errors).length > 0;
    const missingBasicFields =
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
      roles.length === 0;

    if (hasErrors || missingBasicFields) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
      return;
    }

    //* OnlyRelatedHierarchicalCover: needs theirSupervisor
    if (relationType === RelationType.OnlyRelatedHierarchicalCover) {
      if (!theirSupervisor) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* OnlyRelatedMinistries: needs theirPastorOnlyMinistries + complete ministry blocks
    if (relationType === RelationType.OnlyRelatedMinistries) {
      const allBlocksComplete = ministryBlocks.every(
        (b) => b.churchId && b.ministryId && b.ministryType && b.ministryRoles.length > 0
      );

      if (!theirPastorOnlyMinistries || !allBlocksComplete) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* RelatedBothMinistriesAndHierarchicalCover: needs theirSupervisor + complete ministry blocks
    if (relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover) {
      const allBlocksComplete = ministryBlocks.every(
        (b) => b.churchId && b.ministryId && b.ministryType && b.ministryRoles.length > 0
      );

      if (!theirSupervisor || !allBlocksComplete) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    setIsSubmitButtonDisabled(false);
    setIsMessageErrorDisabled(false);
  }, [
    mode,
    form.formState,
    firstNames,
    lastNames,
    gender,
    conversionDate,
    birthDate,
    maritalStatus,
    email,
    phoneNumber,
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
    theirSupervisor,
    theirPastorOnlyMinistries,
    ministryBlocks,
    isInputDisabled,
  ]);

  //* Submit button logic: Update mode
  useEffect(() => {
    if (mode !== 'update') return;

    const hasErrors = Object.values(form.formState.errors).length > 0;
    const missingBasicFields =
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
      roles.length === 0;

    if (hasErrors || missingBasicFields) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
      return;
    }

    //* After promotion to Supervisor: needs theirCopastor or theirPastorRelationDirect
    if (roles.includes(MemberRole.Supervisor)) {
      if (isDirectRelationToPastor) {
        //* Direct to pastor path
        if (!theirPastorRelationDirect) {
          setIsSubmitButtonDisabled(true);
          setIsMessageErrorDisabled(true);
        } else if (!isRelationSelectDisabled) {
          setIsSubmitButtonDisabled(false);
          setIsMessageErrorDisabled(false);
        }
      } else {
        //* Via copastor path
        if (!theirCopastor) {
          setIsSubmitButtonDisabled(true);
          setIsMessageErrorDisabled(true);
        } else if (!isRelationSelectDisabled) {
          setIsSubmitButtonDisabled(false);
          setIsMessageErrorDisabled(false);
        }
      }
      return;
    }

    //* Preacher — OnlyRelatedHierarchicalCover
    if (
      roles.includes(MemberRole.Preacher) &&
      relationType === RelationType.OnlyRelatedHierarchicalCover
    ) {
      if (!theirSupervisor) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else if (!isInputDisabled) {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* Preacher — OnlyRelatedMinistries
    if (
      roles.includes(MemberRole.Preacher) &&
      relationType === RelationType.OnlyRelatedMinistries
    ) {
      const allBlocksComplete = ministryBlocks.every(
        (b) => b.churchId && b.ministryId && b.ministryType && b.ministryRoles.length > 0
      );

      if (!theirPastorOnlyMinistries || !allBlocksComplete) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else if (!isInputDisabled) {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* Preacher — RelatedBothMinistriesAndHierarchicalCover
    if (
      roles.includes(MemberRole.Preacher) &&
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover
    ) {
      const allBlocksComplete = ministryBlocks.every(
        (b) => b.churchId && b.ministryId && b.ministryType && b.ministryRoles.length > 0
      );

      if (!theirSupervisor || !allBlocksComplete) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else if (!isInputDisabled) {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* Default
    if (!isInputDisabled) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }
  }, [
    mode,
    form.formState,
    firstNames,
    lastNames,
    gender,
    conversionDate,
    birthDate,
    maritalStatus,
    email,
    phoneNumber,
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
    theirSupervisor,
    theirCopastor,
    theirPastorRelationDirect,
    theirPastorOnlyMinistries,
    isDirectRelationToPastor,
    recordStatus,
    ministryBlocks,
    isInputDisabled,
    isRelationSelectDisabled,
  ]);

  //* Promote button: derived (no state needed)
  //* Enabled only when form matches server data, record is active, no mutation in progress
  const isMinistryBlocksDirty = useMemo(() => {
    if (mode !== 'update') return false;
    const current = ministryBlocks.map(normalizeBlock);
    return JSON.stringify(current) !== JSON.stringify(originalMinistryBlocksRef.current);
  }, [mode, ministryBlocks]);

  const isPromoteButtonDisabled =
    mode !== 'update' ||
    form.formState.isDirty ||
    isMinistryBlocksDirty ||
    recordStatus !== 'active' ||
    isInputDisabled;

  //* Mutations
  const preacherCreationMutation = usePreacherCreationMutation({
    preacherCreationForm: form,
    setIsInputDisabled,
  });

  const preacherUpdateMutation = usePreacherUpdateMutation({
    dialogClose: mode === 'update' ? (options as UpdateModeOptions).dialogClose : NOOP,
    scrollToTop: mode === 'update' ? (options as UpdateModeOptions).scrollToTop : NOOP,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsRelationSelectDisabled,
  });

  const isPending =
    mode === 'create'
      ? preacherCreationMutation.isPending
      : preacherUpdateMutation.isPending;

  //* Computed
  const currentBlockMinistryIds = ministryBlocks.map((b) => b.ministryId);
  const hasDuplicates = new Set(currentBlockMinistryIds).size !== currentBlockMinistryIds.length;

  //* Handlers
  const handleSubmit = (formData: PreacherFormData): void => {
    const ministriesData = ministryBlocks.map(({ ministryId, ministryRoles }) => ({
      ministryId,
      ministryRoles,
    }));

    const resolvedMinistries = ministriesData.some(
      (item) => !item.ministryId || item.ministryRoles?.length === 0
    )
      ? []
      : ministriesData;

    if (mode === 'create') {
      setIsInputDisabled(true);
      preacherCreationMutation.mutate({ ...formData, theirMinistries: resolvedMinistries });
    } else {
      setIsInputDisabled(true);
      setIsSubmitButtonDisabled(true);
      setIsRelationSelectDisabled(true);
      preacherUpdateMutation.mutate({
        id: updateId!,
        formData: { ...formData, theirMinistries: resolvedMinistries },
      });
    }
  };

  //* Inline role-promotion handler: Preacher → Supervisor
  const handleRolePromotion = (): void => {
    if (mode !== 'update') return;

    form.setValue('theirSupervisor', '');

    const currentRoles: MemberRole[] = form.getValues('roles');
    const isPreacher = currentRoles.includes(MemberRole.Preacher);
    const isTreasurer = currentRoles.includes(MemberRole.Treasurer);
    const isEligibleForSupervisor =
      !currentRoles.includes(MemberRole.Disciple) &&
      !currentRoles.includes(MemberRole.Copastor) &&
      !currentRoles.includes(MemberRole.Supervisor) &&
      !currentRoles.includes(MemberRole.Pastor);

    if (isPreacher && isEligibleForSupervisor && !isTreasurer) {
      const without = currentRoles.filter(
        (r) => r !== MemberRole.Preacher && r !== MemberRole.Treasurer
      );
      form.setValue('roles', [...without, MemberRole.Supervisor]);
    }

    if (isPreacher && isTreasurer && isEligibleForSupervisor) {
      const without = currentRoles.filter((r) => r !== MemberRole.Preacher);
      form.setValue('roles', [...without, MemberRole.Supervisor]);
    }

    setIsInputDisabled(true);
    setIsMessagePromoteDisabled(true);
  };

  return {
    form,
    isLoadingData,
    isInputDisabled,
    setIsInputDisabled,
    isRelationSelectDisabled,
    setIsRelationSelectDisabled,
    isSubmitButtonDisabled,
    setIsSubmitButtonDisabled,
    isMessageErrorDisabled,
    isPromoteButtonDisabled,
    isMessagePromoteDisabled,
    setIsMessagePromoteDisabled,
    isInputBirthDateOpen,
    setIsInputBirthDateOpen,
    isInputConvertionDateOpen,
    setIsInputConvertionDateOpen,
    isInputTheirSupervisorOpen,
    setIsInputTheirSupervisorOpen,
    isInputTheirCopastorOpen,
    setIsInputTheirCopastorOpen,
    isInputTheirPastorRelationDirectOpen,
    setIsInputTheirPastorRelationDirectOpen,
    isInputTheirPastorOnlyMinistriesOpen,
    setIsInputTheirPastorOnlyMinistriesOpen,
    changedId,
    setChangedId,
    isAlertDialogOpen,
    setIsAlertDialogOpen,
    district: residenceDistrict,
    districtsValidation,
    urbanSectorsValidation,
    disabledRoles,
    ministryBlocks,
    setMinistryBlocks,
    addMinistryBlock,
    removeMinistryBlock,
    updateMinistryBlock,
    toggleRoleInBlock,
    handleSelectChurch,
    supervisorsQuery,
    copastorsQuery,
    pastorsQuery,
    churchesQuery,
    isPending,
    hasDuplicates,
    handleSubmit,
    handleRolePromotion,
  };
};
