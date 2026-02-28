/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState, useCallback } from 'react';

import { useForm, type UseFormReturn } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { familyGroupFormSchema } from '@/modules/family-group/schemas';
import { type FamilyGroupResponse, type FamilyGroupFormData } from '@/modules/family-group/types';
import {
  familyGroupCreateDefaultValues,
  familyGroupUpdateDefaultValues,
} from '@/modules/family-group/constants';
import {
  useFamilyGroupCreationMutation,
  useFamilyGroupUpdateMutation,
} from '@/modules/family-group/hooks/mutations';

import { getSimpleZones } from '@/modules/zone/services/zone.service';
import { type ZoneResponse } from '@/modules/zone/types';
import { getPreachersByFilters } from '@/modules/preacher/services/preacher.service';
import { PreacherSearchType } from '@/modules/preacher/enums/preacher-search-type.enum';
import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';

//* Constant noop function - stable reference, no need for useCallback
const NOOP = (): void => {};

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
  data: FamilyGroupResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

type UseFamilyGroupFormOptions = CreateModeOptions | UpdateModeOptions;

interface UseFamilyGroupFormReturn {
  form: UseFormReturn<FamilyGroupFormData>;
  isInputDisabled: boolean;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitButtonDisabled: boolean;
  isFormValid: boolean;
  isInputTheirZoneOpen: boolean;
  setIsInputTheirZoneOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirPreacherOpen: boolean;
  setIsInputTheirPreacherOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirZoneDisabled: boolean;
  setIsInputTheirZoneDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirPreacherDisabled: boolean;
  setIsInputTheirPreacherDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingData: boolean;
  zonesQuery: UseQueryResult<ZoneResponse[], Error>;
  preachersQuery: UseQueryResult<PreacherResponse[], Error>;
  preachersByZoneQuery: UseQueryResult<PreacherResponse[], Error>;
  districtsValidation: ReturnType<typeof validateDistrictsAllowedByModule>;
  urbanSectorsValidation: ReturnType<typeof validateUrbanSectorsAllowedByDistrict>;
  isPending: boolean;
  handleSubmit: (formData: FamilyGroupFormData) => void;
}

export const useFamilyGroupForm = (
  options: UseFamilyGroupFormOptions
): UseFamilyGroupFormReturn => {
  const { mode } = options;

  //* Extract stable values from options (options object is recreated on every render)
  const updateData = mode === 'update' ? (options as UpdateModeOptions).data : undefined;
  const updateId = mode === 'update' ? (options as UpdateModeOptions).id : undefined;

  //* States
  const [isLoadingData, setIsLoadingData] = useState(mode === 'update');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isInputTheirZoneOpen, setIsInputTheirZoneOpen] = useState<boolean>(false);
  const [isInputTheirPreacherOpen, setIsInputTheirPreacherOpen] = useState<boolean>(false);
  const [isInputTheirZoneDisabled, setIsInputTheirZoneDisabled] = useState<boolean>(
    mode === 'update'
  );
  const [isInputTheirPreacherDisabled, setIsInputTheirPreacherDisabled] = useState<boolean>(true);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<FamilyGroupFormData>({
    mode: 'onChange',
    resolver: zodResolver(familyGroupFormSchema),
    defaultValues:
      mode === 'create' ? familyGroupCreateDefaultValues : familyGroupUpdateDefaultValues,
  });

  //* Watchers
  const district = form.watch('district');
  const theirZone = form.watch('theirZone');

  //* Form state derived - validation comes directly from form
  const { isValid } = form.formState;
  const isFormValid = isValid;

  //* Effects - document title
  useEffect(() => {
    document.title = 'Modulo Grupo Familiar - IcupApp';
  }, []);

  //* Effects - district changes: reset urbanSector
  useEffect(() => {
    if (mode === 'create') {
      form.resetField('urbanSector', { keepError: true });
    }
  }, [district, form, mode]);

  //* Effects - theirZone changes (create mode): enable/reset preacher
  useEffect(() => {
    if (mode !== 'create') return;

    if (theirZone) {
      setIsInputTheirPreacherDisabled(false);
    }
    form.resetField('theirPreacher', { keepError: true });
  }, [theirZone, form, mode]);

  //* Effects - theirZone changes (update mode): reset preacher based on record status
  useEffect(() => {
    if (mode !== 'update') return;

    if (
      theirZone &&
      (!updateData?.theirPreacher?.id || updateData?.recordStatus === RecordStatus.Inactive)
    ) {
      setIsInputTheirPreacherDisabled(false);
    }

    // Only reset preacher when user actively changed the zone (not during initial data population)
    if (theirZone !== (updateData?.theirZone?.id ?? '')) {
      form.resetField('theirPreacher', { keepError: true });
    }
  }, [theirZone, form, mode, updateData]);

  //* Effects - theirPreacher changes (update mode): [lock removed — preacher always editable in update]

  //* Effects - Update Mode: Populate form with data
  useEffect(() => {
    if (mode !== 'update' || !updateData) return;

    form.setValue('familyGroupName', updateData.familyGroupName ?? '');
    form.setValue('serviceTime', updateData.serviceTime ?? '');
    form.setValue('country', updateData.country ?? '');
    form.setValue('department', updateData.department ?? '');
    form.setValue('province', updateData.province ?? '');
    form.setValue('district', updateData.district ?? '');
    form.setValue('urbanSector', updateData.urbanSector ?? '');
    form.setValue('address', updateData.address ?? '');
    form.setValue('referenceAddress', updateData.referenceAddress ?? '');
    form.setValue('theirZone', updateData.theirZone?.id ?? '');
    form.setValue('theirPreacher', updateData.theirPreacher?.id ?? '');
    form.setValue('recordStatus', updateData.recordStatus);

    setIsInputTheirPreacherDisabled(false);
    setIsLoadingData(false);
  }, [mode, updateData, form]);

  //* Effects - Update Mode: Dynamic URL
  useEffect(() => {
    if (mode !== 'update' || !updateId) return;

    const originalUrl = window.location.href;
    const url = new URL(window.location.href);
    url.pathname = `/family-groups/search/${updateId}/edit`;
    window.history.replaceState({}, '', url);

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [mode, updateId]);

  //* Helpers - pure functions
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(district);

  //* Query - Zones (both modes)
  const zonesQuery = useQuery<ZoneResponse[], Error>({
    queryKey: ['zones', mode],
    queryFn: () => getSimpleZones({ isSimpleQuery: true }),
    retry: false,
  });

  //* Query - Preachers by zone (filtered)
  const queryZoneTerm = theirZone ?? '';
  const preachersByZoneQuery = useQuery<PreacherResponse[], Error>({
    queryKey: [
      mode === 'create' ? 'creation-preachers-by-zone' : 'update-preachers-by-zone',
      queryZoneTerm,
    ],
    queryFn: () =>
      getPreachersByFilters({
        searchType: PreacherSearchType.AvailablePreachersByZone,
        zoneTerm: queryZoneTerm,
        withNullFamilyGroup: true,
        order: RecordOrder.Ascending,
      }),
    enabled: !!queryZoneTerm,
    retry: false,
  });

  //* Query - Simple preachers for update mode (to display current preacher name)
  const simplePreachers = useQuery<PreacherResponse[], Error>({
    queryKey: ['simple-preachers-fg', updateData?.theirChurch?.id],
    queryFn: () =>
      getPreachersByFilters({
        searchType: PreacherSearchType.AvailablePreachersByZone,
        zoneTerm: updateData?.theirZone?.id ?? '',
        withNullFamilyGroup: false,
        order: RecordOrder.Ascending,
      }),
    enabled: mode === 'update' && !!updateData?.theirZone?.id,
    retry: false,
  });

  //* Mutations
  const familyGroupCreationMutation = useFamilyGroupCreationMutation({
    familyGroupCreationForm: form,
    setIsInputDisabled,
  });

  const familyGroupUpdateMutation = useFamilyGroupUpdateMutation({
    dialogClose: mode === 'update' ? (options as UpdateModeOptions).dialogClose : NOOP,
    scrollToTop: mode === 'update' ? (options as UpdateModeOptions).scrollToTop : NOOP,
    setIsInputDisabled,
  });

  const isPending =
    mode === 'create'
      ? familyGroupCreationMutation.isPending
      : familyGroupUpdateMutation.isPending;

  //* Form handler
  const handleSubmit = useCallback(
    (formData: FamilyGroupFormData): void => {
      setIsInputDisabled(true);

      if (mode === 'create') {
        familyGroupCreationMutation.mutate(formData);
      } else {
        familyGroupUpdateMutation.mutate({ id: updateId ?? '', formData });
      }
    },
    [mode, updateId, familyGroupCreationMutation, familyGroupUpdateMutation]
  );

  return {
    form,
    isInputDisabled,
    setIsInputDisabled,
    isSubmitButtonDisabled: !isFormValid || isPending || isInputDisabled,
    isFormValid,
    isInputTheirZoneOpen,
    setIsInputTheirZoneOpen,
    isInputTheirPreacherOpen,
    setIsInputTheirPreacherOpen,
    isInputTheirZoneDisabled,
    setIsInputTheirZoneDisabled,
    isInputTheirPreacherDisabled,
    setIsInputTheirPreacherDisabled,
    isLoadingData,
    zonesQuery,
    preachersQuery: simplePreachers,
    preachersByZoneQuery,
    districtsValidation,
    urbanSectorsValidation,
    isPending,
    handleSubmit,
  };
};
