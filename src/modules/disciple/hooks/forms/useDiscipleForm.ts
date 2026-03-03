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
import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { getSimpleSupervisors } from '@/modules/supervisor/services/supervisor.service';
import { getSimpleFamilyGroups } from '@/modules/family-group/services/family-group.service';

import { discipleFormSchema } from '@/modules/disciple/schemas';
import {
  discipleCreateDefaultValues,
  discipleUpdateDefaultValues,
} from '@/modules/disciple/constants';
import { type DiscipleFormData } from '@/modules/disciple/types/disciple-form-data.interface';
import { type DiscipleResponse } from '@/modules/disciple/types/disciple-response.interface';
import {
  useDiscipleCreationMutation,
  useDiscipleUpdateMutation,
} from '@/modules/disciple/hooks/mutations';

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
  data: DiscipleResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

type UseDiscipleFormOptions = CreateModeOptions | UpdateModeOptions;

export interface UseDiscipleFormReturn {
  form: UseFormReturn<DiscipleFormData>;

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
  isInputTheirFamilyGroupOpen: boolean;
  setIsInputTheirFamilyGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirPastorOpen: boolean;
  setIsInputTheirPastorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirSupervisorOpen: boolean;
  setIsInputTheirSupervisorOpen: React.Dispatch<React.SetStateAction<boolean>>;

  //* Alert dialog state — family group relation change (update mode)
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
  familyGroupsQuery: UseQueryResult<any, Error>;
  pastorsQuery: UseQueryResult<any, Error>;
  supervisorsQuery: UseQueryResult<any, Error>;
  churchesQuery: UseQueryResult<any, Error>;

  //* Computed
  isPending: boolean;
  hasDuplicates: boolean;

  //* Handlers
  handleSubmit: (formData: DiscipleFormData) => void;
  handleRolePromotion: () => void;
}

export const useDiscipleForm = (options: UseDiscipleFormOptions): UseDiscipleFormReturn => {
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
  const [isInputTheirFamilyGroupOpen, setIsInputTheirFamilyGroupOpen] = useState(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState(false);
  const [isInputTheirSupervisorOpen, setIsInputTheirSupervisorOpen] = useState(false);

  //* Alert dialog state — fires when user picks a different family group
  const [changedId, setChangedId] = useState<string | undefined>(
    mode === 'update' ? (options as UpdateModeOptions).data?.theirFamilyGroup?.id : undefined
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
  const form = useForm<DiscipleFormData>({
    mode: 'onChange',
    resolver: zodResolver(discipleFormSchema),
    defaultValues:
      mode === 'create' ? discipleCreateDefaultValues : discipleUpdateDefaultValues,
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
  const theirFamilyGroup = form.watch('theirFamilyGroup');
  const theirPastor = form.watch('theirPastor');
  const theirSupervisor = form.watch('theirSupervisor');
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
  const familyGroupsQuery = useQuery({
    queryKey: mode === 'create' ? ['family-groups'] : ['family-groups', updateId],
    queryFn: () => getSimpleFamilyGroups({ isSimpleQuery: false }),
    retry: false,
  });

  const pastorsQuery = useQuery({
    queryKey: mode === 'create' ? ['pastors'] : ['pastors', updateId],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    retry: false,
  });

  const supervisorsQuery = useQuery({
    queryKey: mode === 'create' ? ['supervisors'] : ['supervisors', updateId],
    queryFn: () => getSimpleSupervisors({ isSimpleQuery: true }),
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
      form.setValue('roles', [MemberRole.Disciple]);
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
      theirFamilyGroup:
        relTypeValue === RelationType.OnlyRelatedHierarchicalCover ||
        relTypeValue === RelationType.RelatedBothMinistriesAndHierarchicalCover
          ? (updateData.theirFamilyGroup?.id ?? '')
          : '',
      theirPastor:
        relTypeValue === RelationType.OnlyRelatedMinistries
          ? (updateData.theirPastor?.id ?? '')
          : '',
      theirSupervisor: '',
      theirMinistries: [],
    });

    setIsLoadingData(false);
  }, [mode, updateData, form]);

  //* Dynamic URL for update mode
  useEffect(() => {
    if (mode !== 'update' || !updateId) return;

    const originalUrl = window.location.href;
    const url = new URL(window.location.href);
    url.pathname = `/disciples/update/${updateId}/edit`;
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

  //* Open family-group-change alert dialog when user picks a different family group
  useEffect(() => {
    if (mode !== 'update') return;

    if (updateData?.theirFamilyGroup?.id !== changedId && changedId !== undefined) {
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
      form.setValue('theirPastor', '');
    }

    if (relationType === RelationType.OnlyRelatedMinistries) {
      form.setValue('theirFamilyGroup', '');
    }
  }, [relationType, form]);

  //* Clear ministry blocks when switching to hierarchical-cover-only
  useEffect(() => {
    if (relationType === RelationType.OnlyRelatedHierarchicalCover) {
      setMinistryBlocks([EMPTY_BLOCK]);
    }
  }, [relationType]);

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

    //* OnlyRelatedHierarchicalCover: needs theirFamilyGroup
    if (relationType === RelationType.OnlyRelatedHierarchicalCover) {
      if (!theirFamilyGroup) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* OnlyRelatedMinistries: needs theirPastor + complete ministry blocks
    if (relationType === RelationType.OnlyRelatedMinistries) {
      const allBlocksComplete = ministryBlocks.every(
        (b) => b.churchId && b.ministryId && b.ministryType && b.ministryRoles.length > 0
      );

      if (!theirPastor || !allBlocksComplete) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* RelatedBothMinistriesAndHierarchicalCover: needs theirFamilyGroup + complete ministry blocks
    if (relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover) {
      const allBlocksComplete = ministryBlocks.every(
        (b) => b.churchId && b.ministryId && b.ministryType && b.ministryRoles.length > 0
      );

      if (!theirFamilyGroup || !allBlocksComplete) {
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
    theirFamilyGroup,
    theirPastor,
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

    //* After promotion to Preacher: needs theirSupervisor
    if (roles.includes(MemberRole.Preacher) && !roles.includes(MemberRole.Disciple)) {
      if (!theirSupervisor) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else if (!isRelationSelectDisabled) {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* Disciple — OnlyRelatedHierarchicalCover
    if (
      roles.includes(MemberRole.Disciple) &&
      relationType === RelationType.OnlyRelatedHierarchicalCover
    ) {
      if (!theirFamilyGroup) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else if (!isInputDisabled) {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* Disciple — OnlyRelatedMinistries
    if (
      roles.includes(MemberRole.Disciple) &&
      relationType === RelationType.OnlyRelatedMinistries
    ) {
      const allBlocksComplete = ministryBlocks.every(
        (b) => b.churchId && b.ministryId && b.ministryType && b.ministryRoles.length > 0
      );

      if (!theirPastor || !allBlocksComplete) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else if (!isInputDisabled) {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* Disciple — RelatedBothMinistriesAndHierarchicalCover
    if (
      roles.includes(MemberRole.Disciple) &&
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover
    ) {
      const allBlocksComplete = ministryBlocks.every(
        (b) => b.churchId && b.ministryId && b.ministryType && b.ministryRoles.length > 0
      );

      if (!theirFamilyGroup || !allBlocksComplete) {
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
    theirFamilyGroup,
    theirPastor,
    theirSupervisor,
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
  const discipleCreationMutation = useDiscipleCreationMutation({
    discipleCreationForm: form,
    setIsInputDisabled,
  });

  const discipleUpdateMutation = useDiscipleUpdateMutation({
    dialogClose: mode === 'update' ? (options as UpdateModeOptions).dialogClose : NOOP,
    scrollToTop: mode === 'update' ? (options as UpdateModeOptions).scrollToTop : NOOP,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsRelationSelectDisabled,
  });

  const isPending =
    mode === 'create'
      ? discipleCreationMutation.isPending
      : discipleUpdateMutation.isPending;

  //* Computed
  const currentBlockMinistryIds = ministryBlocks.map((b) => b.ministryId);
  const hasDuplicates = new Set(currentBlockMinistryIds).size !== currentBlockMinistryIds.length;

  //* Handlers
  const handleSubmit = (formData: DiscipleFormData): void => {
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
      discipleCreationMutation.mutate({ ...formData, theirMinistries: resolvedMinistries });
    } else {
      setIsInputDisabled(true);
      setIsSubmitButtonDisabled(true);
      setIsRelationSelectDisabled(true);
      discipleUpdateMutation.mutate({
        id: updateId!,
        formData: { ...formData, theirMinistries: resolvedMinistries },
      });
    }
  };

  //* Inline role-promotion handler: Disciple → Preacher
  const handleRolePromotion = (): void => {
    if (mode !== 'update') return;

    form.setValue('theirFamilyGroup', '');
    form.setValue('theirPastor', '');

    const currentRoles: MemberRole[] = form.getValues('roles');
    const isDisciple = currentRoles.includes(MemberRole.Disciple);
    const isEligibleForPreacher =
      !currentRoles.includes(MemberRole.Copastor) &&
      !currentRoles.includes(MemberRole.Supervisor) &&
      !currentRoles.includes(MemberRole.Pastor);

    if (isDisciple && isEligibleForPreacher) {
      const updatedRoles = currentRoles.filter(
        (r) => r !== MemberRole.Disciple && r !== MemberRole.Treasurer
      );
      form.setValue('roles', [...updatedRoles, MemberRole.Preacher]);
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
    isInputTheirFamilyGroupOpen,
    setIsInputTheirFamilyGroupOpen,
    isInputTheirPastorOpen,
    setIsInputTheirPastorOpen,
    isInputTheirSupervisorOpen,
    setIsInputTheirSupervisorOpen,
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
    familyGroupsQuery,
    pastorsQuery,
    supervisorsQuery,
    churchesQuery,
    isPending,
    hasDuplicates,
    handleSubmit,
    handleRolePromotion,
  };
};
