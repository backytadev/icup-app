import { useEffect, useState, useCallback } from 'react';

import type * as z from 'zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { Department } from '@/shared/enums/department.enum';

import { type ChurchResponse } from '@/modules/church/types';
import { getMainChurch } from '@/modules/church/services/church.service';
import { churchFormSchema } from '@/modules/church/schemas';

import { useChurchCreationMutation } from '@/modules/church/hooks/mutations';
import { useChurchCreationSubmitButtonLogic } from '@/modules/church/hooks/forms';

import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

type ChurchFormData = z.infer<typeof churchFormSchema>;

interface UseChurchCreateFormReturn {
  form: UseFormReturn<ChurchFormData>;
  isInputDisabled: boolean;
  isSubmitButtonDisabled: boolean;
  isMessageErrorDisabled: boolean;
  isInputMainChurchOpen: boolean;
  setIsInputMainChurchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputFoundingDateOpen: boolean;
  setIsInputFoundingDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mainChurchData: ChurchResponse[] | undefined;
  isAnexe: boolean;
  district: string;
  districtsValidation: ReturnType<typeof validateDistrictsAllowedByModule>;
  urbanSectorsValidation: ReturnType<typeof validateUrbanSectorsAllowedByDistrict>;
  isPending: boolean;
  handleSubmit: (formData: ChurchFormData) => void;
}

export const useChurchCreateForm = (): UseChurchCreateFormReturn => {
  //* States
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isInputMainChurchOpen, setIsInputMainChurchOpen] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isInputFoundingDateOpen, setIsInputFoundingDateOpen] = useState<boolean>(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<ChurchFormData>({
    mode: 'onChange',
    resolver: zodResolver(churchFormSchema),
    defaultValues: {
      churchName: '',
      abbreviatedChurchName: '',
      isAnexe: false,
      email: '',
      phoneNumber: '',
      country: Country.Perú,
      department: Department.Lima,
      province: Province.Lima,
      district: '',
      urbanSector: '',
      address: '',
      serviceTimes: [],
      referenceAddress: '',
      theirMainChurch: '',
    },
  });

  //* Watchers
  const isAnexe = form.watch('isAnexe') ?? false;
  const district = form.watch('district') ?? '';

  //* Effects
  useEffect(() => {
    form.resetField('urbanSector', { keepError: true });
  }, [district, form]);

  useEffect(() => {
    form.resetField('theirMainChurch', { keepError: true });
  }, [isAnexe, form]);

  useEffect(() => {
    document.title = 'Modulo Iglesia - IcupApp';
  }, []);

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(district);

  //* Custom hooks
  useChurchCreationSubmitButtonLogic({
    churchCreationForm: form,
    isInputDisabled,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
  });

  const churchCreationMutation = useChurchCreationMutation({
    churchCreationForm: form,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const { data: mainChurchData } = useQuery({
    queryKey: ['mainChurch'],
    queryFn: getMainChurch,
    retry: false,
  });

  //* Form handler
  const handleSubmit = useCallback(
    (formData: ChurchFormData): void => {
      churchCreationMutation.mutate(formData);
    },
    [churchCreationMutation]
  );

  return {
    form,
    isInputDisabled,
    isSubmitButtonDisabled,
    isMessageErrorDisabled,
    isInputMainChurchOpen,
    setIsInputMainChurchOpen,
    isInputFoundingDateOpen,
    setIsInputFoundingDateOpen,
    mainChurchData,
    isAnexe,
    district,
    districtsValidation,
    urbanSectorsValidation,
    isPending: churchCreationMutation.isPending,
    handleSubmit,
  };
};
