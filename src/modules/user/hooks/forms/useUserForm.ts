import { useEffect, useState, useCallback } from 'react';

import { useForm, type UseFormReturn } from 'react-hook-form';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getAllSimpleMinistries } from '@/modules/ministry/services/ministry.service';

import { type ChurchResponse } from '@/modules/church/types';
import { type MinistryResponse } from '@/modules/ministry/types';

import { UserRole, type UserRole as UserRoleType } from '@/modules/user/enums/user-role.enum';
import { type UserFormData } from '@/modules/user/types/user-form-data.interface';
import { type UserResponse } from '@/modules/user/types/user-response.interface';
import { userFormSchema } from '@/modules/user/schemas/user-form-schema';
import { useUserCreationMutation, useUserUpdateMutation } from '@/modules/user/hooks/mutations';
import { userCreateDefaultValues, userUpdateDefaultValues } from '@/modules/user/constants';

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
  data: UserResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

type UseUserFormOptions = CreateModeOptions | UpdateModeOptions;

interface UseUserFormReturn {
  form: UseFormReturn<UserFormData>;
  isInputDisabled: boolean;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitButtonDisabled: boolean;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isMessageErrorDisabled: boolean;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isMessageErrorPasswordDisabled: boolean;
  setIsMessageErrorPasswordDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isMessageErrorRolesDisabled: boolean;
  setIsMessageErrorRolesDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirChurchesOpen: boolean;
  setIsInputTheirChurchesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirMinistriesOpen: boolean;
  setIsInputTheirMinistriesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingData: boolean;
  churchesData: ChurchResponse[] | undefined;
  ministriesData: MinistryResponse[] | undefined;
  isPending: boolean;
  handleSubmit: (formData: UserFormData) => void;
  churchesQuery: UseQueryResult<ChurchResponse[], Error>;
  ministriesQuery: UseQueryResult<MinistryResponse[], Error>;
}

export const useUserForm = (options: UseUserFormOptions): UseUserFormReturn => {
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
  const [isMessageErrorPasswordDisabled, setIsMessageErrorPasswordDisabled] =
    useState<boolean>(true);
  const [isMessageErrorRolesDisabled, setIsMessageErrorRolesDisabled] = useState<boolean>(true);
  const [isInputTheirChurchesOpen, setIsInputTheirChurchesOpen] = useState<boolean>(false);
  const [isInputTheirMinistriesOpen, setIsInputTheirMinistriesOpen] = useState<boolean>(false);

  //* Form
  const form = useForm<UserFormData>({
    mode: 'onChange',
    resolver: zodResolver(userFormSchema),
    defaultValues: mode === 'create' ? userCreateDefaultValues : userUpdateDefaultValues,
  });

  //* Watchers
  const firstNames = form.watch('firstNames');
  const lastNames = form.watch('lastNames');
  const email = form.watch('email');
  const gender = form.watch('gender');
  const password = form.watch('password');
  const passwordConfirm = form.watch('passwordConfirm');
  const roles = form.watch('roles');
  const ministries = form.watch('ministries');
  const recordStatus = form.watch('recordStatus');

  //* Queries
  const churchesQuery = useQuery<ChurchResponse[], Error>({
    queryKey: mode === 'create' ? ['churches-user-create'] : ['churches-user-update', updateId],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  const ministriesQuery = useQuery<MinistryResponse[], Error>({
    queryKey: mode === 'create' ? ['ministries-user-create'] : ['ministries-user-update', updateId],
    queryFn: () => getAllSimpleMinistries(), // No context - get ALL ministries
    retry: false,
  });

  const churchesData = churchesQuery.data;
  const ministriesData = ministriesQuery.data;

  //* Effects - Create Mode
  useEffect(() => {
    document.title = 'Modulo Usuario - IcupApp';
  }, []);

  useEffect(() => {
    if (mode === 'create' && roles) {
      form.setValue('churches', []);
      form.setValue('ministries', []);
    }
  }, [mode, roles, form]);

  //* Auto-extract churches from selected ministries (for MinistryUser)
  useEffect(() => {
    if (!roles?.includes(UserRole.MinistryUser)) return;
    if (!ministries || ministries.length === 0) {
      form.setValue('churches', []);
      return;
    }

    const ministriesData = ministriesQuery.data;
    if (!ministriesData) return;

    // Extract unique church IDs from selected ministries
    const selectedMinistryObjects = ministriesData.filter((m) => ministries.includes(m.id));
    const churchIds = selectedMinistryObjects
      .map((m) => m.theirChurch?.id)
      .filter((id): id is string => id !== undefined && id !== null);

    // Remove duplicates
    const uniqueChurchIds = Array.from(new Set(churchIds));

    form.setValue('churches', uniqueChurchIds);
  }, [ministries, roles, ministriesQuery.data, form]);

  //* Effects - Update Mode: Populate form with data
  useEffect(() => {
    if (mode !== 'update') return;

    if (updateData) {
      form.setValue('firstNames', updateData.firstNames ?? '');
      form.setValue('lastNames', updateData.lastNames ?? '');
      form.setValue('gender', updateData.gender ?? '');
      form.setValue('userName', updateData.userName ?? '');
      form.setValue('email', updateData.email ?? '');
      form.setValue('roles', updateData.roles as UserRoleType[]);
      form.setValue(
        'churches',
        updateData.churches.map((c) => (typeof c === 'string' ? c : c.id)) as string[]
      );
      form.setValue(
        'ministries',
        updateData.ministries.map((c) => (typeof c === 'string' ? c : c.id)) as string[]
      );
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
      url.pathname = `/users/update/${updateId}/edit`;
      window.history.replaceState({}, '', url);

      return () => {
        window.history.replaceState({}, '', originalUrl);
      };
    }
  }, [mode, updateId]);

  //* Submit button logic - Create Mode
  useEffect(() => {
    if (mode !== 'create') return;

    if (form.formState.errors && Object.values(form.formState.errors).length > 0) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      firstNames &&
      lastNames &&
      email &&
      password &&
      passwordConfirm &&
      roles &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
      setIsMessageErrorPasswordDisabled(false);
      setIsMessageErrorRolesDisabled(false);
    }

    if (!firstNames || !lastNames || !email || !password || !passwordConfirm || !roles) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (password !== passwordConfirm) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorPasswordDisabled(true);
    }

    if (roles?.length === 0) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorRolesDisabled(true);
    }
  }, [
    mode,
    form.formState,
    firstNames,
    lastNames,
    email,
    password,
    passwordConfirm,
    roles,
    recordStatus,
    isInputDisabled,
  ]);

  //* Submit button logic - Update Mode
  useEffect(() => {
    if (mode !== 'update') return;

    if (form.formState.errors && Object.values(form.formState.errors).length > 0) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (firstNames && lastNames && email && roles && gender && !isInputDisabled) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (!firstNames || !lastNames || !email || !roles || !gender) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (roles?.length === 0) {
      setIsSubmitButtonDisabled(true);
    }
  }, [
    mode,
    form.formState,
    firstNames,
    lastNames,
    email,
    roles,
    gender,
    recordStatus,
    isInputDisabled,
  ]);

  //* Mutations
  const userCreationMutation = useUserCreationMutation({
    userCreationForm: form,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Memoized callbacks for mutation options
  const noop = useCallback(() => {}, []);

  const userUpdateMutation = useUserUpdateMutation({
    dialogClose: dialogClose ?? noop,
    scrollToTop: scrollToTop ?? noop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  const isPending =
    mode === 'create' ? userCreationMutation.isPending : userUpdateMutation.isPending;

  //* Form handler
  const handleSubmit = useCallback(
    (formData: UserFormData): void => {
      setIsInputDisabled(true);

      // Remove passwordConfirm (not needed in backend)
      const { passwordConfirm, password, ...dataWithoutPassword } = formData;

      if (mode === 'create') {
        // In create mode, include password
        userCreationMutation.mutate({ ...dataWithoutPassword, password });
      } else if (updateId) {
        // In update mode, exclude password (handled by UserPasswordUpdateCard)
        userUpdateMutation.mutate({ id: updateId, formData: { ...dataWithoutPassword } });
      }
    },
    [mode, updateId, userCreationMutation, userUpdateMutation]
  );

  return {
    form,
    isInputDisabled,
    setIsInputDisabled,
    isSubmitButtonDisabled,
    setIsSubmitButtonDisabled,
    isMessageErrorDisabled,
    setIsMessageErrorDisabled,
    isMessageErrorPasswordDisabled,
    setIsMessageErrorPasswordDisabled,
    isMessageErrorRolesDisabled,
    setIsMessageErrorRolesDisabled,
    isInputTheirChurchesOpen,
    setIsInputTheirChurchesOpen,
    isInputTheirMinistriesOpen,
    setIsInputTheirMinistriesOpen,
    isLoadingData,
    churchesData,
    ministriesData,
    isPending,
    handleSubmit,
    churchesQuery,
    ministriesQuery,
  };
};
