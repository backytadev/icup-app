import { cn } from '@/shared/lib/utils';

import { ChurchFormFields } from '@/modules/church/components/ChurchFormFields';
import { useChurchForm } from '@/modules/church/hooks/forms/useChurchForm';

interface ChurchCreateFormProps {
  className?: string;
}

export const ChurchCreateForm = ({ className }: ChurchCreateFormProps): JSX.Element => {
  const {
    form,
    isInputDisabled,
    isSubmitButtonDisabled,
    isFormValid,
    isInputMainChurchOpen,
    setIsInputMainChurchOpen,
    isInputFoundingDateOpen,
    setIsInputFoundingDateOpen,
    mainChurchData,
    isAnexe,
    district,
    districtsValidation,
    urbanSectorsValidation,
    isPending,
    handleSubmit,
  } = useChurchForm({ mode: 'create' });

  return (
    <div className={cn('w-full max-w-[1220px] mx-auto', className)}>
      <div className='bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/50 rounded-xl'>
        <ChurchFormFields
          mode='create'
          form={form}
          isInputDisabled={isInputDisabled}
          isSubmitButtonDisabled={isSubmitButtonDisabled}
          isFormValid={isFormValid}
          isPending={isPending}
          isInputMainChurchOpen={isInputMainChurchOpen}
          setIsInputMainChurchOpen={setIsInputMainChurchOpen}
          isInputFoundingDateOpen={isInputFoundingDateOpen}
          setIsInputFoundingDateOpen={setIsInputFoundingDateOpen}
          mainChurchData={mainChurchData}
          isAnexe={isAnexe}
          district={district}
          districtsValidation={districtsValidation}
          urbanSectorsValidation={urbanSectorsValidation}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
