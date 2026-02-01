import { cn } from '@/shared/lib/utils';

import { MinistryFormFields } from '@/modules/ministry/components/MinistryFormFields';
import { useMinistryForm } from '@/modules/ministry/hooks/forms/useMinistryForm';

interface MinistryCreateFormProps {
  className?: string;
}

export const MinistryCreateForm = ({ className }: MinistryCreateFormProps): JSX.Element => {
  const {
    form,
    isInputDisabled,
    isSubmitButtonDisabled,
    isFormValid,
    isInputTheirPastorOpen,
    setIsInputTheirPastorOpen,
    isInputFoundingDateOpen,
    setIsInputFoundingDateOpen,
    pastorsData,
    district,
    districtsValidation,
    urbanSectorsValidation,
    isPending,
    handleSubmit,
  } = useMinistryForm({ mode: 'create' });

  return (
    <div className={cn('w-full max-w-[1220px] mx-auto', className)}>
      <div className='bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/50 rounded-xl'>
        <MinistryFormFields
          mode='create'
          form={form}
          isInputDisabled={isInputDisabled}
          isSubmitButtonDisabled={isSubmitButtonDisabled}
          isFormValid={isFormValid}
          isPending={isPending}
          isInputTheirPastorOpen={isInputTheirPastorOpen}
          setIsInputTheirPastorOpen={setIsInputTheirPastorOpen}
          isInputFoundingDateOpen={isInputFoundingDateOpen}
          setIsInputFoundingDateOpen={setIsInputFoundingDateOpen}
          pastorsData={pastorsData}
          district={district}
          districtsValidation={districtsValidation}
          urbanSectorsValidation={urbanSectorsValidation}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
