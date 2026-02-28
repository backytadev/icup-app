import { type ZoneResponse } from '@/modules/zone/types';
import { ZoneFormFields } from '@/modules/zone/components/forms/ZoneFormFields';
import { ZoneFormSkeleton } from '@/modules/zone/components/ZoneFormSkeleton';
import { useZoneForm } from '@/modules/zone/hooks/forms/useZoneForm';

interface ZoneUpdateFormProps {
  id: string;
  data: ZoneResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

export const ZoneUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: ZoneUpdateFormProps): JSX.Element => {
  const {
    form,
    isInputDisabled,
    isSubmitButtonDisabled,
    isFormValid,
    isInputTheirSupervisorOpen,
    setIsInputTheirSupervisorOpen,
    isLoadingData,
    availableSupervisorsQuery,
    notAvailableSupervisorsData,
    districtsValidation,
    isPending,
    handleSubmit,
    changedSupervisorId,
    setChangedSupervisorId,
    isAlertDialogOpen,
    setIsAlertDialogOpen,
  } = useZoneForm({ mode: 'update', id, data, dialogClose, scrollToTop });

  return (
    <div className='w-full max-w-[1120px] mx-auto -mt-2'>
      {isLoadingData ? (
        <ZoneFormSkeleton />
      ) : (
        <div className='w-full'>
          {/* Header */}
          <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700 px-6 py-5'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                  Actualización
                </span>
              </div>
              <h2 className='text-xl md:text-2xl font-bold text-white font-outfit leading-tight'>
                Modificar Zona
              </h2>
              <p className='text-white/80 text-[13px] md:text-[14px] font-inter'>
                {data?.zoneName} - {data?.district}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <ZoneFormFields
              mode='update'
              form={form}
              data={data}
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
              changedSupervisorId={changedSupervisorId}
              setChangedSupervisorId={setChangedSupervisorId}
              isAlertDialogOpen={isAlertDialogOpen}
              setIsAlertDialogOpen={setIsAlertDialogOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
};
