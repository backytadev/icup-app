import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';

interface Options {
  preacherUpdateForm: UseFormReturn<PreacherFormData, any, PreacherFormData | undefined>;
  setIsDisabledInput: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDisabledPromoteButton: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePreacherRolePromotionHandler = ({
  preacherUpdateForm,
  setIsDisabledInput,
  setIsDisabledPromoteButton,
}: Options): void => {
  preacherUpdateForm.setValue('theirSupervisor', '');

  const currentRoles: MemberRole[] = preacherUpdateForm.getValues('roles');

  const hasRole = (role: MemberRole): boolean => currentRoles.includes(role);

  const isPreacher = hasRole(MemberRole.Preacher);
  const isTreasurer = hasRole(MemberRole.Treasurer);
  const isEligibleForSupervisor =
    !hasRole(MemberRole.Disciple) &&
    !hasRole(MemberRole.Copastor) &&
    !hasRole(MemberRole.Supervisor) &&
    !hasRole(MemberRole.Pastor);

  const rolesExcludingPreacherAndTreasurer = currentRoles.filter(
    (role) => role !== MemberRole.Preacher && role !== MemberRole.Treasurer
  );

  const rolesExcludingOnlyPreacher = currentRoles.filter((role) => role !== MemberRole.Preacher);

  if (isPreacher && isEligibleForSupervisor && !isTreasurer) {
    preacherUpdateForm.setValue('roles', [
      ...rolesExcludingPreacherAndTreasurer,
      MemberRole.Supervisor,
    ]);
  }

  if (isPreacher && isTreasurer && isEligibleForSupervisor) {
    preacherUpdateForm.setValue('roles', [
      ...rolesExcludingOnlyPreacher,
      MemberRole.Supervisor,
      MemberRole.Treasurer,
    ]);
  }

  setIsDisabledInput(true);
  setIsDisabledPromoteButton(true);
};
