import { cn } from '@/shared/lib/utils';

import { FamilyGroupFormFields } from '@/modules/family-group/components/forms/FamilyGroupFormFields';
import { useFamilyGroupForm } from '@/modules/family-group/hooks/forms/useFamilyGroupForm';

interface FamilyGroupCreateFormProps {
  className?: string;
}

export const FamilyGroupCreateForm = ({ className }: FamilyGroupCreateFormProps): JSX.Element => {
  const {
    form,
    isInputDisabled,
    isSubmitButtonDisabled,
    isFormValid,
    isInputTheirZoneOpen,
    setIsInputTheirZoneOpen,
    isInputTheirPreacherOpen,
    setIsInputTheirPreacherOpen,
    isInputTheirZoneDisabled,
    isInputTheirPreacherDisabled,
    zonesQuery,
    preachersQuery,
    preachersByZoneQuery,
    urbanSectorsValidation,
    districtsValidation,
    isPending,
    handleSubmit,
  } = useFamilyGroupForm({ mode: 'create' });

  return (
    <div className={cn('w-full max-w-[1220px] mx-auto', className)}>
      <div className='bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/50 rounded-xl'>
        <FamilyGroupFormFields
          mode='create'
          form={form}
          isInputDisabled={isInputDisabled}
          isSubmitButtonDisabled={isSubmitButtonDisabled}
          isFormValid={isFormValid}
          isPending={isPending}
          isInputTheirZoneOpen={isInputTheirZoneOpen}
          setIsInputTheirZoneOpen={setIsInputTheirZoneOpen}
          isInputTheirPreacherOpen={isInputTheirPreacherOpen}
          setIsInputTheirPreacherOpen={setIsInputTheirPreacherOpen}
          isInputTheirZoneDisabled={isInputTheirZoneDisabled}
          isInputTheirPreacherDisabled={isInputTheirPreacherDisabled}
          zonesQuery={zonesQuery}
          preachersQuery={preachersQuery}
          preachersByZoneQuery={preachersByZoneQuery}
          urbanSectorsValidation={urbanSectorsValidation}
          districtsValidation={districtsValidation}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
