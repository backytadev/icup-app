import { useEffect, useState, useCallback, useMemo } from 'react';

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

  //* Extract primitive values from options to use as stable dependencies
  const updateId = mode === 'update' ? (options as UpdateModeOptions).id : undefined;
  const updateData = mode === 'update' ? (options as UpdateModeOptions).data : undefined;
  const dialogClose = mode === 'update' ? (options as UpdateModeOptions).dialogClose : undefined;
  const scrollToTop = mode === 'update' ? (options as UpdateModeOptions).scrollToTop : undefined;

  //* States
  const [isLoadingData, setIsLoadingData] = useState(mode === 'update');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);
  const [isInputFoundingDateOpen, setIsInputFoundingDateOpen] = useState<boolean>(false);

  //* Alert dialog states for pastor change
  const [changedPastorId, setChangedPastorId] = useState<string | undefined>(
    mode === 'update' ? updateData?.theirPastor?.id : undefined
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

  //* Effects - Update Mode: Populate form with data (primitive dependency)
  useEffect(() => {
    if (mode !== 'update') return;

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

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [mode, updateData, form]);

  //* Effects - Update Mode: Dynamic URL (primitive dependency)
  useEffect(() => {
    if (mode === 'update' && updateId) {
      const originalUrl = window.location.href;
      const url = new URL(window.location.href);
      url.pathname = `/ministries/update/${updateId}/edit`;
      window.history.replaceState({}, '', url);

      return () => {
        window.history.replaceState({}, '', originalUrl);
      };
    }
  }, [mode, updateId]);

  //* Memoized helpers - only recalculate when dependencies change
  const districtsValidation = useMemo(() => validateDistrictsAllowedByModule(pathname), [pathname]);

  const urbanSectorsValidation = useMemo(
    () => validateUrbanSectorsAllowedByDistrict(district),
    [district]
  );

  //* Queries - stable queryKey
  const queryKey = useMemo(
    () => (mode === 'create' ? ['pastors'] : ['pastors', updateId]),
    [mode, updateId]
  );

  const { data: pastorsData } = useSimpleQuery<PastorResponse[]>({
    queryKey,
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
  });

  //* Query for pastors (used in the alert dialog)
  const pastorsQuery = useQuery<PastorResponse[], Error>({
    queryKey: ['pastors-for-alert', updateId],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    enabled: mode === 'update',
  });

  //* Effect to open alert dialog when pastor changes in update mode
  useEffect(() => {
    if (
      mode === 'update' &&
      updateData?.theirPastor?.id !== changedPastorId &&
      changedPastorId !== undefined
    ) {
      const timeoutId = setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [mode, updateData?.theirPastor?.id, changedPastorId]);

  //* Mutations
  const ministryCreationMutation = useMinistryCreationMutation({
    ministryCreationForm: form,
    setIsInputDisabled,
  });

  //* Memoized callbacks for mutation options
  const noop = useCallback(() => {}, []);

  const ministryUpdateMutation = useMinistryUpdateMutation({
    dialogClose: dialogClose ?? noop,
    scrollToTop: scrollToTop ?? noop,
    setIsInputDisabled,
  });

  const isPending =
    mode === 'create' ? ministryCreationMutation.isPending : ministryUpdateMutation.isPending;

  //* Form handler with primitive dependencies
  const handleSubmit = useCallback(
    (formData: MinistryFormData): void => {
      //* Disable inputs immediately when submitting
      setIsInputDisabled(true);

      if (mode === 'create') {
        ministryCreationMutation.mutate(formData);
      } else if (updateId) {
        ministryUpdateMutation.mutate({ id: updateId, formData });
      }
    },
    [mode, updateId, ministryCreationMutation, ministryUpdateMutation]
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
