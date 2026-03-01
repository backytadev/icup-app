/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState, useCallback } from 'react';

import { useForm, type UseFormReturn } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { type UseQueryResult } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { useSimpleQuery } from '@/shared/hooks';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';

import { zoneFormSchema } from '@/modules/zone/schemas/zone-form-schema';
import { type ZoneResponse, type ZoneFormData } from '@/modules/zone/types';
import { zoneCreateDefaultValues, zoneUpdateDefaultValues } from '@/modules/zone/constants';
import { useZoneCreationMutation, useZoneUpdateMutation } from '@/modules/zone/hooks/mutations';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSupervisorsByFilters } from '@/modules/supervisor/services/supervisor.service';
import { SupervisorSearchType } from '@/modules/supervisor/enums/supervisor-search-type.enum';
import { type SupervisorResponse } from '@/modules/supervisor/types/supervisor-response.interface';

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
  data: ZoneResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

type UseZoneFormOptions = CreateModeOptions | UpdateModeOptions;

interface UseZoneFormReturn {
  form: UseFormReturn<ZoneFormData>;
  isInputDisabled: boolean;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitButtonDisabled: boolean;
  isFormValid: boolean;
  isInputTheirSupervisorOpen: boolean;
  setIsInputTheirSupervisorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingData: boolean;
  availableSupervisorsQuery: UseQueryResult<SupervisorResponse[], Error>;
  notAvailableSupervisorsData: SupervisorResponse[] | undefined;
  districtsValidation: ReturnType<typeof validateDistrictsAllowedByModule>;
  isPending: boolean;
  handleSubmit: (formData: ZoneFormData) => void;
  //* Alert dialog states
  changedSupervisorId: string | undefined;
  setChangedSupervisorId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isAlertDialogOpen: boolean;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useZoneForm = (options: UseZoneFormOptions): UseZoneFormReturn => {
  const { mode } = options;

  //* Extract stable values from options (options object is recreated on every render)
  const updateData = mode === 'update' ? (options as UpdateModeOptions).data : undefined;
  const updateId = mode === 'update' ? (options as UpdateModeOptions).id : undefined;

  //* States
  const [isLoadingData, setIsLoadingData] = useState(mode === 'update');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isInputTheirSupervisorOpen, setIsInputTheirSupervisorOpen] = useState<boolean>(false);

  //* Alert dialog state for supervisor change
  const [changedSupervisorId, setChangedSupervisorId] = useState<string | undefined>(
    mode === 'update' ? (options as UpdateModeOptions).data?.theirSupervisor?.id : undefined
  );
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<ZoneFormData>({
    mode: 'onChange',
    resolver: zodResolver(zoneFormSchema),
    defaultValues: mode === 'create' ? zoneCreateDefaultValues : zoneUpdateDefaultValues,
  });

  //* Form state derived - validation comes directly from form
  const { isValid } = form.formState;
  const isFormValid = isValid;

  //* Effects - document title
  useEffect(() => {
    document.title = 'Modulo Zona - IcupApp';
  }, []);

  //* Effects - Update Mode: Populate form with data
  useEffect(() => {
    if (mode !== 'update' || !updateData) return;

    form.setValue('zoneName', updateData.zoneName ?? '');
    form.setValue('country', updateData.country ?? '');
    form.setValue('department', updateData.department ?? '');
    form.setValue('province', updateData.province ?? '');
    form.setValue('district', updateData.district ?? '');
    form.setValue('theirSupervisor', updateData.theirSupervisor?.id);
    form.setValue('recordStatus', updateData.recordStatus);

    setIsLoadingData(false);
  }, [mode, updateData, form]);

  //* Effects - Update Mode: Dynamic URL
  useEffect(() => {
    if (mode !== 'update' || !updateId) return;

    const originalUrl = window.location.href;
    const url = new URL(window.location.href);
    url.pathname = `/zones/search/${updateId}/edit`;
    window.history.replaceState({}, '', url);

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [mode, updateId]);

  //* Effects - Update Mode: Open alert dialog on supervisor change
  useEffect(() => {
    if (mode !== 'update') return;

    if (
      updateData?.theirSupervisor?.id !== changedSupervisorId &&
      changedSupervisorId !== undefined
    ) {
      setIsAlertDialogOpen(true);
    }
  }, [mode, updateData, changedSupervisorId]);

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Query - Create mode: get churches first (to obtain churchId for supervisor query)
  const { data: churchesData } = useSimpleQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    enabled: mode === 'create',
  });

  //* Determine churchId based on mode
  const churchId =
    mode === 'create'
      ? ((churchesData as Array<{ id: string }>)?.[0]?.id ?? '')
      : (updateData?.theirChurch?.id ?? '');

  //* Query - Available supervisors (withNullZone: true): used in the dropdown
  const availableSupervisorsQuery = useSimpleQuery<SupervisorResponse[]>({
    queryKey: ['available-supervisors', churchId, mode],
    queryFn: () =>
      getSupervisorsByFilters({
        searchType: SupervisorSearchType.AvailableSupervisorsByChurch,
        withNullZone: true,
        churchTerm: churchId,
        churchId,
        order: RecordOrder.Ascending,
      }),
    enabled: mode === 'create' ? !!churchesData : !!churchId,
  });

  //* Query - Not available supervisors (withNullZone: false): used to display current supervisor name
  const notAvailableSupervisorsQuery = useSimpleQuery<SupervisorResponse[]>({
    queryKey: ['not-available-supervisors', churchId, mode],
    queryFn: () =>
      getSupervisorsByFilters({
        searchType: SupervisorSearchType.AvailableSupervisorsByChurch,
        withNullZone: false,
        churchTerm: churchId,
        churchId,
        order: RecordOrder.Ascending,
      }),
    enabled: mode === 'update' && !!churchId,
  });

  //* Mutations
  const zoneCreationMutation = useZoneCreationMutation({
    zoneCreationForm: form,
    setIsInputDisabled,
  });

  const zoneUpdateMutation = useZoneUpdateMutation({
    dialogClose: mode === 'update' ? (options as UpdateModeOptions).dialogClose : NOOP,
    scrollToTop: mode === 'update' ? (options as UpdateModeOptions).scrollToTop : NOOP,
    setIsInputDisabled,
  });

  const isPending =
    mode === 'create' ? zoneCreationMutation.isPending : zoneUpdateMutation.isPending;

  //* Form handler
  const handleSubmit = useCallback(
    (formData: ZoneFormData): void => {
      setIsInputDisabled(true);

      if (mode === 'create') {
        zoneCreationMutation.mutate(formData);
      } else {
        zoneUpdateMutation.mutate({ id: updateId ?? '', formData });
      }
    },
    [mode, updateId, zoneCreationMutation, zoneUpdateMutation]
  );

  return {
    form,
    isInputDisabled,
    setIsInputDisabled,
    isSubmitButtonDisabled: !isFormValid || isPending || isInputDisabled,
    isFormValid,
    isInputTheirSupervisorOpen,
    setIsInputTheirSupervisorOpen,
    isLoadingData,
    availableSupervisorsQuery,
    notAvailableSupervisorsData: notAvailableSupervisorsQuery.data,
    districtsValidation,
    isPending,
    handleSubmit,
    //* Alert dialog states
    changedSupervisorId,
    setChangedSupervisorId,
    isAlertDialogOpen,
    setIsAlertDialogOpen,
  };
};
