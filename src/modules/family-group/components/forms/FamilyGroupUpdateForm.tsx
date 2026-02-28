import { type FamilyGroupResponse } from '@/modules/family-group/types';
import { FamilyGroupFormFields } from '@/modules/family-group/components/forms/FamilyGroupFormFields';
import { FamilyGroupFormSkeleton } from '@/modules/family-group/components/FamilyGroupFormSkeleton';
import { useFamilyGroupForm } from '@/modules/family-group/hooks/forms/useFamilyGroupForm';

interface FamilyGroupUpdateFormProps {
  id: string;
  data: FamilyGroupResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

export const FamilyGroupUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: FamilyGroupUpdateFormProps): JSX.Element => {
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
    isLoadingData,
    zonesQuery,
    preachersQuery,
    preachersByZoneQuery,
    urbanSectorsValidation,
    districtsValidation,
    isPending,
    handleSubmit,
  } = useFamilyGroupForm({ mode: 'update', id, data, dialogClose, scrollToTop });

  return (
    <div className='w-full max-w-[1120px] mx-auto -mt-3'>
      {isLoadingData ? (
        <FamilyGroupFormSkeleton />
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
                Modificar Grupo Familiar
              </h2>
              <p className='text-white/80 text-[13px] md:text-[14px] font-inter'>
                {data?.familyGroupName} - {data?.district}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <FamilyGroupFormFields
              mode='update'
              form={form}
              data={data}
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
      )}
    </div>
  );
};
