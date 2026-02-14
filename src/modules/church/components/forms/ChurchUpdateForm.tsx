import { type ChurchResponse } from '@/modules/church/types';
import { ChurchFormSkeleton } from '@/modules/church/components/ChurchFormSkeleton';
import { ChurchFormFields } from '@/modules/church/components/forms/ChurchFormFields';
import { useChurchForm } from '@/modules/church/hooks/forms/useChurchForm';

interface ChurchFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: ChurchResponse | undefined;
}

export const ChurchUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: ChurchFormUpdateProps): JSX.Element => {
  const {
    form,
    isInputDisabled,
    isSubmitButtonDisabled,
    isFormValid,
    isInputMainChurchOpen,
    setIsInputMainChurchOpen,
    isInputFoundingDateOpen,
    setIsInputFoundingDateOpen,
    isLoadingData,
    mainChurchData,
    isAnexe,
    district,
    districtsValidation,
    urbanSectorsValidation,
    isPending,
    handleSubmit,
  } = useChurchForm({
    mode: 'update',
    id,
    data,
    dialogClose,
    scrollToTop,
  });

  return (
    <div className='w-full max-w-[1120px] mx-auto'>
      {isLoadingData ? (
        <ChurchFormSkeleton />
      ) : (
        <div className='w-full'>
          {/* Header */}
          <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700 px-6 py-5'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                  Actualización
                </span>
                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                  {data?.isAnexe ? 'Anexo' : 'Iglesia Central'}
                </span>
              </div>
              <h2 className='text-xl md:text-2xl font-bold text-white font-outfit leading-tight'>
                Modificar Iglesia
              </h2>
              <p className='text-white/80 text-[13px] md:text-[14px] font-inter'>
                {data?.abbreviatedChurchName} - {data?.district}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <ChurchFormFields
              mode='update'
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
      )}
    </div>
  );
};
