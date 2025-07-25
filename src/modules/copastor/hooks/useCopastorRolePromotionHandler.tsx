import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type CopastorFormData } from '@/modules/copastor/interfaces/copastor-form-data.interface';

interface Options {
  copastorUpdateForm: UseFormReturn<CopastorFormData, any, CopastorFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCopastorRolePromotionHandler = ({
  copastorUpdateForm,
  setIsInputDisabled,
  setIsPromoteButtonDisabled,
}: Options): void => {
  copastorUpdateForm.setValue('theirPastor', '');

  const currentRoles: MemberRole[] = copastorUpdateForm.getValues('roles');

  const hasRole = (role: MemberRole): boolean => currentRoles.includes(role);
  const isCopastor = hasRole(MemberRole.Copastor);
  const isEligibleForPromotion =
    !hasRole(MemberRole.Supervisor) &&
    !hasRole(MemberRole.Preacher) &&
    !hasRole(MemberRole.Treasurer) &&
    !hasRole(MemberRole.Pastor) &&
    !hasRole(MemberRole.Disciple);

  const updatedRoles = currentRoles.filter((role) => role !== MemberRole.Copastor);

  if (isCopastor && isEligibleForPromotion) {
    copastorUpdateForm.setValue('roles', [...updatedRoles, MemberRole.Pastor]);
  }

  setIsInputDisabled(true);
  setIsPromoteButtonDisabled(true);
};
