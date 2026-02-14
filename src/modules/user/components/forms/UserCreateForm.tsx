import { useState } from 'react';

import { cn } from '@/shared/lib/utils';

import { UserFormFields } from '@/modules/user/components/forms/UserFormFields';
import { useUserForm } from '@/modules/user/hooks/forms/useUserForm';

interface UserCreateFormProps {
  className?: string;
}

export const UserCreateForm = ({ className }: UserCreateFormProps): JSX.Element => {
  //* Password visibility states
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);

  const {
    form,
    isInputDisabled,
    setIsInputDisabled,
    isSubmitButtonDisabled,
    setIsSubmitButtonDisabled,
    isMessageErrorDisabled,
    isMessageErrorPasswordDisabled,
    isMessageErrorRolesDisabled,
    isInputTheirChurchesOpen,
    setIsInputTheirChurchesOpen,
    isInputTheirMinistriesOpen,
    setIsInputTheirMinistriesOpen,
    churchesQuery,
    ministriesQuery,
    isPending,
    handleSubmit,
  } = useUserForm({ mode: 'create' });

  return (
    <div className={cn('w-full max-w-[1220px] mx-auto', className)}>
      <div className='bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/50 rounded-xl'>
        <UserFormFields
          mode='create'
          form={form}
          isInputDisabled={isInputDisabled}
          isSubmitButtonDisabled={isSubmitButtonDisabled}
          isMessageErrorDisabled={isMessageErrorDisabled}
          isMessageErrorPasswordDisabled={isMessageErrorPasswordDisabled}
          isMessageErrorRolesDisabled={isMessageErrorRolesDisabled}
          setIsInputDisabled={setIsInputDisabled}
          setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
          isInputTheirChurchesOpen={isInputTheirChurchesOpen}
          setIsInputTheirChurchesOpen={setIsInputTheirChurchesOpen}
          isInputTheirMinistriesOpen={isInputTheirMinistriesOpen}
          setIsInputTheirMinistriesOpen={setIsInputTheirMinistriesOpen}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showPasswordConfirm={showPasswordConfirm}
          setShowPasswordConfirm={setShowPasswordConfirm}
          churchesQuery={churchesQuery}
          ministriesQuery={ministriesQuery}
          isPending={isPending}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
