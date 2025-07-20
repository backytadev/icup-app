import { type UseFormReturn } from 'react-hook-form';
import { MemberRole } from '@/shared/enums/member-role.enum';
import { type SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';

interface Options {
  supervisorUpdateForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPromoteButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}
export const useSupervisorRolePromotionHandler = ({
  supervisorUpdateForm,
  setIsInputDisabled,
  setIsPromoteButtonDisabled,
}: Options): void => {
  supervisorUpdateForm.setValue('theirCopastor', '');

  const currentRoles: MemberRole[] = supervisorUpdateForm.getValues('roles');

  const hasRole = (role: MemberRole): boolean => currentRoles.includes(role);

  const isSupervisor = hasRole(MemberRole.Supervisor);
  const isTreasurer = hasRole(MemberRole.Treasurer);
  const isEligibleForCopastor =
    !hasRole(MemberRole.Disciple) &&
    !hasRole(MemberRole.Copastor) &&
    !hasRole(MemberRole.Preacher) &&
    !hasRole(MemberRole.Pastor);

  const updatedRoles = currentRoles.filter(
    (role) => role !== MemberRole.Supervisor && role !== MemberRole.Treasurer
  );

  if (isSupervisor && isEligibleForCopastor && !isTreasurer) {
    supervisorUpdateForm.setValue('roles', [...updatedRoles, MemberRole.Copastor]);
  }

  if (isSupervisor && isTreasurer && isEligibleForCopastor) {
    supervisorUpdateForm.setValue('roles', [...updatedRoles, MemberRole.Copastor]);
  }

  setIsInputDisabled(true);
  setIsPromoteButtonDisabled(true);
};
