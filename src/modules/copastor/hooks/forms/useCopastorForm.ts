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

import { copastorFormSchema } from '@/modules/copastor/schemas';
import {
  copastorCreateDefaultValues,
  copastorUpdateDefaultValues,
} from '@/modules/copastor/constants';
import { type CopastorFormData } from '@/modules/copastor/types/copastor-form-data.interface';
import { type CopastorResponse } from '@/modules/copastor/types/copastor-response.interface';
import {
  useCopastorCreationMutation,
  useCopastorUpdateMutation,
} from '@/modules/copastor/hooks/mutations';

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
  data: CopastorResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

type UseCopastorFormOptions = CreateModeOptions | UpdateModeOptions;

export interface UseCopastorFormReturn {
  form: UseFormReturn<CopastorFormData>;

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
  isInputTheirPastorOpen: boolean;
  setIsInputTheirPastorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirChurchOpen: boolean;
  setIsInputTheirChurchOpen: React.Dispatch<React.SetStateAction<boolean>>;

  //* Alert dialog state — pastor relation change (update mode)
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isAlertDialogOpen: boolean;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

  //* Location-based helpers
  district: string;
  districtsValidation: ReturnType<typeof validateDistrictsAllowedByModule>;
  urbanSectorsValidation: ReturnType<typeof validateUrbanSectorsAllowedByDistrict>;
  disabledRoles: ReturnType<typeof useRoleValidationByPath>['disabledRoles'];

  //* Ministry blocks state + helpers (from useMinistryBlocks)
  ministryBlocks: MinistryMemberBlock[];
  setMinistryBlocks: React.Dispatch<React.SetStateAction<MinistryMemberBlock[]>>;
  addMinistryBlock: () => void;
  removeMinistryBlock: (index: number) => void;
  updateMinistryBlock: ReturnType<typeof useMinistryBlocks>['updateMinistryBlock'];
  toggleRoleInBlock: ReturnType<typeof useMinistryBlocks>['toggleRoleInBlock'];
  handleSelectChurch: ReturnType<typeof useMinistryBlocks>['handleSelectChurch'];

  //* Queries
  pastorsQuery: UseQueryResult<any, Error>;
  churchesQuery: UseQueryResult<any, Error>;

  //* Computed
  isPending: boolean;
  hasDuplicates: boolean;

  //* Handlers
  handleSubmit: (formData: CopastorFormData) => void;
  handleRolePromotion: () => void;
}

export const useCopastorForm = (options: UseCopastorFormOptions): UseCopastorFormReturn => {
  const { mode } = options;

  //* Extract stable update values once (options is recreated on every render)
  const updateData = mode === 'update' ? (options as UpdateModeOptions).data : undefined;
  const updateId = mode === 'update' ? (options as UpdateModeOptions).id : undefined;

  //* States

  const [isLoadingData, setIsLoadingData] = useState(mode === 'update');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isRelationSelectDisabled, setIsRelationSelectDisabled] = useState(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState(true);
  const [isMessagePromoteDisabled, setIsMessagePromoteDisabled] = useState(false);

  //* Popover / picker open states
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState(false);
  const [isInputTheirChurchOpen, setIsInputTheirChurchOpen] = useState(false);

  //* Alert dialog state — triggers when user picks a different pastor
  const [changedId, setChangedId] = useState<string | undefined>(
    mode === 'update' ? (options as UpdateModeOptions).data?.theirPastor?.id : undefined
  );
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  //* Ministry blocks state
  const [ministryBlocks, setMinistryBlocks] = useState<MinistryMemberBlock[]>([EMPTY_BLOCK]);

  //* Ref that stores the original (unmodified) ministry blocks for promote-button dirty detection.
  //* Initialised to a normalised empty block so the comparison is stable before data loads.
  const originalMinistryBlocksRef = useRef<NormalizedBlock[]>(
    mode === 'update' ? [normalizeBlock(EMPTY_BLOCK)] : []
  );

  //* External hooks

  const { pathname } = useLocation();

  //* Form

  const form = useForm<CopastorFormData>({
    mode: 'onChange',
    resolver: zodResolver(copastorFormSchema),
    defaultValues: mode === 'create' ? copastorCreateDefaultValues : copastorUpdateDefaultValues,
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
  const theirPastor = form.watch('theirPastor');
  const theirChurch = form.watch('theirChurch');
  const recordStatus = form.watch('recordStatus');

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistrict);
  const { disabledRoles } = useRoleValidationByPath({ path: pathname });

  //* Ministry block CRUD helpers (stable references from shared hook)
  const {
    addMinistryBlock,
    removeMinistryBlock,
    updateMinistryBlock,
    toggleRoleInBlock,
    handleSelectChurch,
  } = useMinistryBlocks({ setMinistryBlocks });

  //* Queries

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

  //* Document title
  useEffect(() => {
    document.title = 'Modulo Co-Pastor - IcupApp';
  }, []);

  //* Ensure Copastor role is always set on create
  useEffect(() => {
    if (mode === 'create') {
      form.setValue('roles', [MemberRole.Copastor]);
    }
  }, [form, mode]);

  //* Reset urban sector when district changes (create mode)
  useEffect(() => {
    if (mode === 'create') {
      form.resetField('residenceUrbanSector', { keepError: true });
    }
  }, [residenceDistrict, form, mode]);

  //* Effects: Update mode

  //* Async: load ministry blocks from API and capture the original state for dirty detection
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
        //* Capture original blocks so promote-button dirty detection works correctly
        originalMinistryBlocksRef.current = blocks.map(normalizeBlock);
      }
    };

    void loadMinistryBlocks();
  }, [mode, updateData]);

  //* Populate form via reset() so that formState.isDirty reflects user changes
  //* (setValue leaves dirty=true; reset() sets the baseline the user deviates from)
  useEffect(() => {
    if (mode !== 'update' || !updateData) return;

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
      relationType: updateData.relationType ?? '',
      theirPastor: updateData.theirPastor?.id ?? '',
      recordStatus: updateData.recordStatus,
    });

    setIsLoadingData(false);
  }, [mode, updateData, form]);

  //* Dynamic URL for update mode (restored on unmount)
  useEffect(() => {
    if (mode !== 'update' || !updateId) return;

    const originalUrl = window.location.href;
    const url = new URL(window.location.href);
    url.pathname = `/copastors/update/${updateId}/edit`;
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

  //* Open pastor-change alert dialog when user picks a different pastor
  useEffect(() => {
    if (mode !== 'update') return;

    if (updateData?.theirPastor?.id !== changedId && changedId !== undefined) {
      setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
    }
  }, [changedId, mode, updateData]);

  //* Effects: Relation type side-effects (both modes)

  //* Clear theirPastor whenever relation type changes (user must re-select)
  useEffect(() => {
    if (
      mode !== 'update' &&
      (relationType === RelationType.OnlyRelatedHierarchicalCover ||
        relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover)
    ) {
      form.setValue('theirPastor', '');
    }
  }, [relationType, form]);

  //* Clear ministry blocks when switching to a relation type that doesn't use them
  useEffect(() => {
    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover ||
      relationType === RelationType.RelatedDirectToPastor
    ) {
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

    //* OnlyRelatedHierarchicalCover: needs pastor
    if (relationType === RelationType.OnlyRelatedHierarchicalCover) {
      if (!theirPastor) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* RelatedBothMinistriesAndHierarchicalCover: needs pastor + all ministry blocks complete
    if (relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover) {
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

    //* Default: no extra relation constraint
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

    //* Co-Pastor still in copastor role: needs theirPastor
    if (roles.includes(MemberRole.Copastor)) {
      if (!theirPastor) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else if (!isInputDisabled) {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* Promoted to Pastor role: needs theirChurch
    if (roles.includes(MemberRole.Pastor)) {
      if (!theirChurch) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else if (!isRelationSelectDisabled) {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* Disciple (no Preacher) — OnlyRelatedHierarchicalCover
    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      relationType === RelationType.OnlyRelatedHierarchicalCover
    ) {
      if (!theirPastor) {
        setIsSubmitButtonDisabled(true);
        setIsMessageErrorDisabled(true);
      } else if (!isInputDisabled) {
        setIsSubmitButtonDisabled(false);
        setIsMessageErrorDisabled(false);
      }
      return;
    }

    //* Disciple (no Preacher) — RelatedBothMinistriesAndHierarchicalCover
    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover
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

    //* Default: allow save
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
    theirPastor,
    theirChurch,
    recordStatus,
    ministryBlocks,
    isInputDisabled,
    isRelationSelectDisabled,
  ]);

  //* Promote button: derived (no state needed)
  //*
  //* The promote button is enabled only when:
  //*   - we are in update mode
  //*   - the form fields match the server data (isDirty = false)
  //*   - the ministry blocks have not changed from server data
  //*   - the record is active
  //*   - no mutation is in progress (isInputDisabled = false)
  //*
  //* Using form.reset() above means isDirty works correctly out of the box.
  //* Ministry blocks are compared against originalMinistryBlocksRef (set on load).

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

  const copastorCreationMutation = useCopastorCreationMutation({
    copastorCreationForm: form,
    setIsInputDisabled,
  });

  const copastorUpdateMutation = useCopastorUpdateMutation({
    dialogClose: mode === 'update' ? (options as UpdateModeOptions).dialogClose : NOOP,
    scrollToTop: mode === 'update' ? (options as UpdateModeOptions).scrollToTop : NOOP,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsRelationSelectDisabled,
  });

  const isPending =
    mode === 'create' ? copastorCreationMutation.isPending : copastorUpdateMutation.isPending;

  //* Computed

  const currentBlockMinistryIds = ministryBlocks.map((b) => b.ministryId);
  const hasDuplicates = new Set(currentBlockMinistryIds).size !== currentBlockMinistryIds.length;

  //* Handlers

  const handleSubmit = (formData: CopastorFormData): void => {
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
      copastorCreationMutation.mutate({ ...formData, theirMinistries: resolvedMinistries });
    } else {
      setIsInputDisabled(true);
      setIsSubmitButtonDisabled(true);
      setIsRelationSelectDisabled(true);
      copastorUpdateMutation.mutate({
        id: updateId!,
        formData: { ...formData, theirMinistries: resolvedMinistries },
      });
    }
  };

  //* Inline role-promotion handler (replaces useCopastorRolePromotionHandler).
  //* Switches the copastor's role to Pastor and locks the form for confirmation.
  //* isPromoteButtonDisabled becomes true automatically because isInputDisabled = true.
  const handleRolePromotion = (): void => {
    if (mode !== 'update') return;

    form.setValue('theirPastor', '');

    const currentRoles: MemberRole[] = form.getValues('roles');
    const isCopastor = currentRoles.includes(MemberRole.Copastor);
    const isEligibleForPromotion =
      !currentRoles.includes(MemberRole.Supervisor) &&
      !currentRoles.includes(MemberRole.Preacher) &&
      !currentRoles.includes(MemberRole.Treasurer) &&
      !currentRoles.includes(MemberRole.Pastor) &&
      !currentRoles.includes(MemberRole.Disciple);

    if (isCopastor && isEligibleForPromotion) {
      const updatedRoles = currentRoles.filter((r) => r !== MemberRole.Copastor);
      form.setValue('roles', [...updatedRoles, MemberRole.Pastor]);
    }

    setIsInputDisabled(true);
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
    isInputTheirPastorOpen,
    setIsInputTheirPastorOpen,
    isInputTheirChurchOpen,
    setIsInputTheirChurchOpen,
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
    pastorsQuery,
    churchesQuery,
    isPending,
    hasDuplicates,
    handleSubmit,
    handleRolePromotion,
  };
};
