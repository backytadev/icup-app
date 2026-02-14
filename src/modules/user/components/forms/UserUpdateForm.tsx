import { toast } from 'sonner';

import { type UserResponse } from '@/modules/user/types/user-response.interface';
import { UserFormSkeleton } from '@/modules/user/components/UserFormSkeleton';
import { UserFormFields } from '@/modules/user/components/forms/UserFormFields';
import { useUserForm } from '@/modules/user/hooks/forms/useUserForm';
import { type UserFormData } from '@/modules/user/types/user-form-data.interface';
import { UserRole, UserRoleNames } from '@/modules/user/enums/user-role.enum';

interface UserUpdateFormProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: UserResponse | undefined;
}

export const UserUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: UserUpdateFormProps): JSX.Element => {
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
    isLoadingData,
    churchesQuery,
    ministriesQuery,
    isPending,
    handleSubmit: formSubmit,
  } = useUserForm({
    mode: 'update',
    id,
    data,
    dialogClose,
    scrollToTop,
  });

  //* Form handler with role validation
  const handleSubmit = (formData: UserFormData): void => {
    setIsInputDisabled(true);
    setIsSubmitButtonDisabled(true);

    const hasMinistryUser = formData.roles.includes(UserRole.MinistryUser);

    const hasOtherRoles = formData.roles.some((role) =>
      [UserRole.AdminUser, UserRole.SuperUser, UserRole.TreasurerUser, UserRole.User].includes(role)
    );

    if (hasMinistryUser && hasOtherRoles) {
      toast.error(
        'El rol de Ministerio no puede combinarse con roles de Administrador o Superusuario.',
        {
          position: 'top-center',
          className: 'justify-center text-center font-semibold',
        }
      );

      setIsSubmitButtonDisabled(false);
      setIsInputDisabled(false);

      return;
    }

    formSubmit(formData);
  };

  return (
    <div className='w-full max-w-[1120px] mx-auto -mt-4 md:-mt-5'>
      {isLoadingData ? (
        <UserFormSkeleton />
      ) : (
        <div className='w-full'>
          {/* Header */}
          <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700 px-6 py-5'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                  Actualización
                </span>
                {data?.roles && data.roles.length > 0 && (
                  <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                    {data.roles.map((role) => UserRoleNames[role as UserRole]).join(' | ')}
                  </span>
                )}
              </div>
              <h2 className='text-xl md:text-2xl font-bold text-white font-outfit leading-tight'>
                Modificar Usuario
              </h2>
              <p className='text-white/80 text-[13px] md:text-[14px] font-inter'>
                {data?.firstNames} {data?.lastNames} - {data?.email}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <UserFormFields
              mode='update'
              form={form}
              data={data}
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
              churchesQuery={churchesQuery}
              ministriesQuery={ministriesQuery}
              isPending={isPending}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};
