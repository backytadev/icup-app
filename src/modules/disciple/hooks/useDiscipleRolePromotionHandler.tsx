import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';

interface Options {
  discipleUpdateForm: UseFormReturn<DiscipleFormData, any, DiscipleFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDiscipleRolePromotionHandler = ({
  discipleUpdateForm,
  setIsInputDisabled,
  setIsPromoteButtonDisabled,
}: Options): void => {
  discipleUpdateForm.setValue('theirFamilyGroup', '');
  discipleUpdateForm.setValue('theirPastor', '');

  const currentRoles: MemberRole[] = discipleUpdateForm.getValues('roles');

  const hasRole = (role: MemberRole): boolean => currentRoles.includes(role);

  const isDisciple = hasRole(MemberRole.Disciple);
  const isEligibleForPreacher =
    !hasRole(MemberRole.Copastor) &&
    !hasRole(MemberRole.Supervisor) &&
    !hasRole(MemberRole.Pastor) &&
    !hasRole(MemberRole.Treasurer);

  const updatedRoles = currentRoles.filter((role) => role !== MemberRole.Disciple);

  if (isDisciple && isEligibleForPreacher) {
    discipleUpdateForm.setValue('roles', [...updatedRoles, MemberRole.Preacher]);
  }

  setIsInputDisabled(true);
  setIsPromoteButtonDisabled(true);
};
