import { cn } from '@/shared/lib/utils';

import { ZoneFormFields } from '@/modules/zone/components/forms/ZoneFormFields';
import { useZoneForm } from '@/modules/zone/hooks/forms/useZoneForm';

interface ZoneCreateFormProps {
  className?: string;
}

export const ZoneCreateForm = ({ className }: ZoneCreateFormProps): JSX.Element => {
  const {
    form,
    isInputDisabled,
    isSubmitButtonDisabled,
    isFormValid,
    isInputTheirSupervisorOpen,
    setIsInputTheirSupervisorOpen,
    availableSupervisorsQuery,
    notAvailableSupervisorsData,
    districtsValidation,
    isPending,
    handleSubmit,
  } = useZoneForm({ mode: 'create' });

  return (
    <div className={cn('w-full max-w-[1220px] mx-auto', className)}>
      <div className='bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/50 rounded-xl'>
        <ZoneFormFields
          mode='create'
          form={form}
          isInputDisabled={isInputDisabled}
          isSubmitButtonDisabled={isSubmitButtonDisabled}
          isFormValid={isFormValid}
          isPending={isPending}
          isInputTheirSupervisorOpen={isInputTheirSupervisorOpen}
          setIsInputTheirSupervisorOpen={setIsInputTheirSupervisorOpen}
          availableSupervisorsQuery={availableSupervisorsQuery}
          notAvailableSupervisorsData={notAvailableSupervisorsData}
          districtsValidation={districtsValidation}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
