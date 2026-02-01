import { type MinistryResponse } from '@/modules/ministry/types';
import { MinistryFormSkeleton } from '@/modules/ministry/components/MinistryFormSkeleton';
import { MinistryFormFields } from '@/modules/ministry/components/MinistryFormFields';
import { useMinistryForm } from '@/modules/ministry/hooks/forms/useMinistryForm';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';

interface MinistryFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: MinistryResponse | undefined;
}

export const MinistryUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: MinistryFormUpdateProps): JSX.Element => {
  const {
    form,
    isInputDisabled,
    isSubmitButtonDisabled,
    isFormValid,
    isInputTheirPastorOpen,
    setIsInputTheirPastorOpen,
    isInputFoundingDateOpen,
    setIsInputFoundingDateOpen,
    isLoadingData,
    pastorsData,
    district,
    districtsValidation,
    urbanSectorsValidation,
    isPending,
    handleSubmit,
    //* Alert dialog props
    changedPastorId,
    setChangedPastorId,
    isAlertDialogOpen,
    setIsAlertDialogOpen,
    pastorsQuery,
  } = useMinistryForm({
    mode: 'update',
    id,
    data,
    dialogClose,
    scrollToTop,
  });

  return (
    <div className='w-full max-w-[1120px] mx-auto'>
      {isLoadingData ? (
        <MinistryFormSkeleton />
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
                  {MinistryTypeNames[data?.ministryType as MinistryType]}
                </span>
              </div>
              <h2 className='text-xl md:text-2xl font-bold text-white font-outfit leading-tight'>
                Modificar Ministerio
              </h2>
              <p className='text-white/80 text-[13px] md:text-[14px] font-inter'>
                {data?.customMinistryName} - {data?.district}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <MinistryFormFields
              mode='update'
              form={form}
              data={data}
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
              //* Alert dialog props
              changedPastorId={changedPastorId}
              setChangedPastorId={setChangedPastorId}
              isAlertDialogOpen={isAlertDialogOpen}
              setIsAlertDialogOpen={setIsAlertDialogOpen}
              pastorsQuery={pastorsQuery}
            />
          </div>
        </div>
      )}
    </div>
  );
};
