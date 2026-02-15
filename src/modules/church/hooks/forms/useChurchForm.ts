import { useEffect, useState, useCallback } from 'react';

import { useForm, type UseFormReturn } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSimpleQuery } from '@/shared/hooks';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { type ChurchServiceTime } from '@/modules/church/enums';
import { type ChurchResponse, type ChurchFormData } from '@/modules/church/types';
import { churchFormSchema } from '@/modules/church/schemas';
import { getMainChurch } from '@/modules/church/services/church.service';
import { churchCreateDefaultValues, churchUpdateDefaultValues } from '@/modules/church/constants';
import {
  useChurchCreationMutation,
  useChurchUpdateMutation,
} from '@/modules/church/hooks/mutations';

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
  data: ChurchResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

type UseChurchFormOptions = CreateModeOptions | UpdateModeOptions;

interface UseChurchFormReturn {
  form: UseFormReturn<ChurchFormData>;
  isInputDisabled: boolean;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitButtonDisabled: boolean;
  isFormValid: boolean;
  isInputMainChurchOpen: boolean;
  setIsInputMainChurchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputFoundingDateOpen: boolean;
  setIsInputFoundingDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingData: boolean;
  mainChurchData: ChurchResponse[] | undefined;
  isAnexe: boolean;
  district: string;
  districtsValidation: ReturnType<typeof validateDistrictsAllowedByModule>;
  urbanSectorsValidation: ReturnType<typeof validateUrbanSectorsAllowedByDistrict>;
  isPending: boolean;
  handleSubmit: (formData: ChurchFormData) => void;
}

export const useChurchForm = (options: UseChurchFormOptions): UseChurchFormReturn => {
  const { mode } = options;

  //* States
  const [isLoadingData, setIsLoadingData] = useState(mode === 'update');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isInputMainChurchOpen, setIsInputMainChurchOpen] = useState<boolean>(false);
  const [isInputFoundingDateOpen, setIsInputFoundingDateOpen] = useState<boolean>(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<ChurchFormData>({
    mode: 'onChange',
    resolver: zodResolver(churchFormSchema),
    defaultValues: mode === 'create' ? churchCreateDefaultValues : churchUpdateDefaultValues,
  });

  //* Watchers
  const isAnexe = form.watch('isAnexe') ?? false;
  const district = form.watch('district') ?? '';

  //* Form state derived - validation comes directly from form
  const { isValid, isDirty } = form.formState;
  const isFormValid = isValid && (mode === 'create' || isDirty);

  //* Effects - Create Mode
  useEffect(() => {
    if (mode === 'create') {
      form.resetField('urbanSector', { keepError: true });
    }
  }, [district, form, mode]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetField('theirMainChurch', { keepError: true });
    }
  }, [isAnexe, form, mode]);

  useEffect(() => {
    document.title = 'Modulo Iglesia - IcupApp';
  }, []);

  //* Effects - Update Mode: Populate form with data
  useEffect(() => {
    if (mode !== 'update') return;

    const updateData = (options as UpdateModeOptions).data;
    if (updateData) {
      form.setValue('churchName', updateData.churchName!);
      form.setValue('abbreviatedChurchName', updateData.abbreviatedChurchName!);
      form.setValue('foundingDate', new Date(String(updateData.foundingDate).replace(/-/g, '/')));
      form.setValue('serviceTimes', updateData.serviceTimes as ChurchServiceTime[]);
      form.setValue('email', updateData.email ?? '');
      form.setValue('phoneNumber', updateData.phoneNumber ?? '');
      form.setValue('country', updateData.country ?? '');
      form.setValue('department', updateData.department ?? '');
      form.setValue('province', updateData.province ?? '');
      form.setValue('district', updateData.district ?? '');
      form.setValue('urbanSector', updateData.urbanSector ?? '');
      form.setValue('address', updateData.address ?? '');
      form.setValue('referenceAddress', updateData.referenceAddress ?? '');
      form.setValue('isAnexe', updateData.isAnexe);
      form.setValue('theirMainChurch', updateData.theirMainChurch?.id);
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
    url.pathname = `/churches/search/${updateId}/edit`;
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
    mode === 'create'
      ? ['mainChurch']
      : ['mainChurch', (options as UpdateModeOptions).id];

  const { data: mainChurchData } = useSimpleQuery<ChurchResponse[]>({
    queryKey,
    queryFn: getMainChurch,
  });

  //* Mutations
  const churchCreationMutation = useChurchCreationMutation({
    churchCreationForm: form,
    setIsInputDisabled,
  });

  const churchUpdateMutation = useChurchUpdateMutation({
    dialogClose: mode === 'update' ? (options as UpdateModeOptions).dialogClose : NOOP,
    scrollToTop: mode === 'update' ? (options as UpdateModeOptions).scrollToTop : NOOP,
    setIsInputDisabled,
  });

  const isPending =
    mode === 'create' ? churchCreationMutation.isPending : churchUpdateMutation.isPending;

  //* Form handler
  const handleSubmit = useCallback(
    (formData: ChurchFormData): void => {
      //* Disable inputs immediately when submitting
      setIsInputDisabled(true);

      if (mode === 'create') {
        churchCreationMutation.mutate(formData);
      } else {
        const updateId = (options as UpdateModeOptions).id;
        churchUpdateMutation.mutate({ id: updateId, formData });
      }
    },
    [mode, options, churchCreationMutation, churchUpdateMutation]
  );

  return {
    form,
    isInputDisabled,
    setIsInputDisabled,
    isSubmitButtonDisabled: !isFormValid || isPending || isInputDisabled,
    isFormValid,
    isInputMainChurchOpen,
    setIsInputMainChurchOpen,
    isInputFoundingDateOpen,
    setIsInputFoundingDateOpen,
    isLoadingData,
    mainChurchData,
    isAnexe,
    district,
    districtsValidation,
    urbanSectorsValidation,
    isPending,
    handleSubmit,
  };
};
