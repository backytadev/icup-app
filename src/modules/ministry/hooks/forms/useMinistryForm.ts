import { useEffect, useState, useCallback } from 'react';

import { useForm, type UseFormReturn } from 'react-hook-form';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSimpleQuery } from '@/shared/hooks';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { type MinistryServiceTime } from '@/modules/ministry/enums/ministry-service-time.enum';
import { type MinistryResponse, type MinistryFormData } from '@/modules/ministry/types';
import { ministryFormSchema } from '@/modules/ministry/schemas/ministry-form-schema';
import {
  ministryCreateDefaultValues,
  ministryUpdateDefaultValues,
} from '@/modules/ministry/constants';
import {
  useMinistryCreationMutation,
  useMinistryUpdateMutation,
} from '@/modules/ministry/hooks/mutations';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { type PastorResponse } from '@/modules/pastor/types/pastor-response.interface';

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
  data: MinistryResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

type UseMinistryFormOptions = CreateModeOptions | UpdateModeOptions;

interface UseMinistryFormReturn {
  form: UseFormReturn<MinistryFormData>;
  isInputDisabled: boolean;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitButtonDisabled: boolean;
  isFormValid: boolean;
  isInputTheirPastorOpen: boolean;
  setIsInputTheirPastorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputFoundingDateOpen: boolean;
  setIsInputFoundingDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingData: boolean;
  pastorsData: PastorResponse[] | undefined;
  district: string;
  districtsValidation: ReturnType<typeof validateDistrictsAllowedByModule>;
  urbanSectorsValidation: ReturnType<typeof validateUrbanSectorsAllowedByDistrict>;
  isPending: boolean;
  handleSubmit: (formData: MinistryFormData) => void;
  //* Alert dialog states
  changedPastorId: string | undefined;
  setChangedPastorId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isAlertDialogOpen: boolean;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pastorsQuery: UseQueryResult<PastorResponse[], Error>;
}

export const useMinistryForm = (options: UseMinistryFormOptions): UseMinistryFormReturn => {
  const { mode } = options;

  //* States
  const [isLoadingData, setIsLoadingData] = useState(mode === 'update');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);
  const [isInputFoundingDateOpen, setIsInputFoundingDateOpen] = useState<boolean>(false);

  //* Alert dialog states for pastor change
  const [changedPastorId, setChangedPastorId] = useState<string | undefined>(
    mode === 'update' ? (options as UpdateModeOptions).data?.theirPastor?.id : undefined
  );
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<MinistryFormData>({
    mode: 'onChange',
    resolver: zodResolver(ministryFormSchema),
    defaultValues: mode === 'create' ? ministryCreateDefaultValues : ministryUpdateDefaultValues,
  });

  //* Watchers
  const district = form.watch('district') ?? '';

  //* Form state derived - validation comes directly from form
  const { isValid } = form.formState;
  const isFormValid = isValid;

  //* Effects - Create Mode
  useEffect(() => {
    if (mode === 'create') {
      form.resetField('urbanSector', { keepError: true });
    }
  }, [district, form, mode]);

  useEffect(() => {
    document.title = 'Modulo Ministerio - IcupApp';
  }, []);

  //* Effects - Update Mode: Populate form with data
  useEffect(() => {
    if (mode !== 'update') return;

    const updateData = (options as UpdateModeOptions).data;
    if (updateData) {
      form.setValue('customMinistryName', updateData.customMinistryName!);
      form.setValue('ministryType', updateData.ministryType ?? '');
      form.setValue('foundingDate', new Date(String(updateData.foundingDate).replace(/-/g, '/')));
      form.setValue('serviceTimes', updateData.serviceTimes as MinistryServiceTime[]);
      form.setValue('email', updateData.email ?? '');
      form.setValue('phoneNumber', updateData.phoneNumber ?? '');
      form.setValue('country', updateData.country ?? '');
      form.setValue('department', updateData.department ?? '');
      form.setValue('province', updateData.province ?? '');
      form.setValue('district', updateData.district ?? '');
      form.setValue('urbanSector', updateData.urbanSector ?? '');
      form.setValue('address', updateData.address ?? '');
      form.setValue('referenceAddress', updateData.referenceAddress ?? '');
      form.setValue('theirPastor', updateData.theirPastor?.id);
      form.setValue('recordStatus', updateData.recordStatus);
    }

    //* Set loading to false immediately after data is populated
    setIsLoadingData(false);
  }, [mode, options, form]);

  //* Effects - Update Mode: Dynamic URL
  useEffect(() => {
    if (mode !== 'update') return;

    const updateId = (options as UpdateModeOptions).id;
    const originalUrl = window.location.href;
    const url = new URL(window.location.href);
    url.pathname = `/ministries/update/${updateId}/edit`;
    window.history.replaceState({}, '', url);

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [mode, options]);

  //* Helpers - pure functions, no need for useMemo (cheap computations)
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(district);

  //* Queries - direct array literal (no useMemo needed for simple arrays)
  const queryKey =
    mode === 'create' ? ['pastors'] : ['pastors', (options as UpdateModeOptions).id];

  const { data: pastorsData } = useSimpleQuery<PastorResponse[]>({
    queryKey,
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
  });

  //* Query for pastors (used in the alert dialog)
  const pastorsQuery = useQuery<PastorResponse[], Error>({
    queryKey: ['pastors-for-alert', mode === 'update' ? (options as UpdateModeOptions).id : undefined],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    enabled: mode === 'update',
  });

  //* Effect to open alert dialog when pastor changes in update mode
  useEffect(() => {
    if (mode !== 'update') return;

    const updateData = (options as UpdateModeOptions).data;
    if (
      updateData?.theirPastor?.id !== changedPastorId &&
      changedPastorId !== undefined
    ) {
      setIsAlertDialogOpen(true);
    }
  }, [mode, options, changedPastorId]);

  //* Mutations
  const ministryCreationMutation = useMinistryCreationMutation({
    ministryCreationForm: form,
    setIsInputDisabled,
  });

  const ministryUpdateMutation = useMinistryUpdateMutation({
    dialogClose: mode === 'update' ? (options as UpdateModeOptions).dialogClose : NOOP,
    scrollToTop: mode === 'update' ? (options as UpdateModeOptions).scrollToTop : NOOP,
    setIsInputDisabled,
  });

  const isPending =
    mode === 'create' ? ministryCreationMutation.isPending : ministryUpdateMutation.isPending;

  //* Form handler
  const handleSubmit = useCallback(
    (formData: MinistryFormData): void => {
      //* Disable inputs immediately when submitting
      setIsInputDisabled(true);

      if (mode === 'create') {
        ministryCreationMutation.mutate(formData);
      } else {
        const updateId = (options as UpdateModeOptions).id;
        ministryUpdateMutation.mutate({ id: updateId, formData });
      }
    },
    [mode, options, ministryCreationMutation, ministryUpdateMutation]
  );

  return {
    form,
    isInputDisabled,
    setIsInputDisabled,
    isSubmitButtonDisabled: !isFormValid || isPending || isInputDisabled,
    isFormValid,
    isInputTheirPastorOpen,
    setIsInputTheirPastorOpen,
    isInputFoundingDateOpen,
    setIsInputFoundingDateOpen,
    isLoadingData,
    pastorsData,
    district,
    districtsValidation,
    urbanSectorsValidation,
    isPending,
    handleSubmit,
    //* Alert dialog states
    changedPastorId,
    setChangedPastorId,
    isAlertDialogOpen,
    setIsAlertDialogOpen,
    pastorsQuery,
  };
};
