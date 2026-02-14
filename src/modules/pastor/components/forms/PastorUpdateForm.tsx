import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { RelationType } from '@/shared/enums/relation-type.enum';
import { useMinistryBlocks } from '@/shared/hooks/useMinistryBlocks';

import { type PastorResponse } from '@/modules/pastor/types/pastor-response.interface';
import { PastorFormSkeleton } from '@/modules/pastor/components/PastorFormSkeleton';
import { PastorFormFields } from '@/modules/pastor/components/forms/PastorFormFields';

import { usePastorForm } from '@/modules/pastor/hooks';

import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';

interface PastorFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: PastorResponse | undefined;
}

export const PastorUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: PastorFormUpdateProps): JSX.Element => {
  //* States
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Custom hooks
  const {
    form,
    isInputDisabled,
    setIsInputDisabled,
    isSubmitButtonDisabled,
    setIsSubmitButtonDisabled,
    isMessageErrorDisabled,
    isInputTheirChurchOpen,
    setIsInputTheirChurchOpen,
    isLoadingData,
    district,
    districtsValidation,
    urbanSectorsValidation,
    isPending,
    handleSubmit: onSubmit,
    ministryBlocks,
    setMinistryBlocks,
    changedChurchId,
    setChangedChurchId,
    isAlertDialogOpen,
    setIsAlertDialogOpen,
    churchesQuery,
  } = usePastorForm({
    mode: 'update',
    id,
    data,
    dialogClose,
    scrollToTop,
  });

  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  const ministryBlockActions = useMinistryBlocks({ setMinistryBlocks });

  //* Watchers
  const relationType = form.watch('relationType');

  //* Effects - Reset ministry blocks on relation type change
  useEffect(() => {
    if (relationType === RelationType.OnlyRelatedHierarchicalCover && ministryBlocks.length > 0) {
      setMinistryBlocks([
        {
          churchId: null,
          ministryType: null,
          ministryId: null,
          ministryRoles: [],
          churchPopoverOpen: false,
          ministryPopoverOpen: false,
          ministries: [],
        },
      ]);
    }
  }, [relationType, ministryBlocks.length, setMinistryBlocks]);

  //* Form handler
  const handleSubmit = (): void => {
    const ministriesData = ministryBlocks.map((ministryData) => {
      return {
        ministryId: ministryData.ministryId,
        ministryRoles: ministryData.ministryRoles,
      };
    });

    const formData = form.getValues();
    onSubmit({
      ...formData,
      theirMinistries: ministriesData.some(
        (item) => !item.ministryId || item.ministryRoles?.length === 0
      )
        ? []
        : ministriesData,
    });
  };

  return (
    <div className='w-full max-w-[1100px] mx-auto -mt-2'>
      {isLoadingData ? (
        <PastorFormSkeleton />
      ) : (
        <div className='w-full'>
          {/* Header */}
          <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 px-6 py-5'>
            <div className='absolute inset-0 overflow-hidden text-white/10'>
              <div className='absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-current opacity-20' />
              <div className='absolute bottom-0 left-0 w-24 h-24 -ml-6 -mb-6 rounded-full bg-current opacity-10' />
            </div>

            <div className='relative z-10 flex flex-col gap-1'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter uppercase tracking-wider'>
                  Actualización
                </span>
                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter uppercase tracking-wider'>
                  Pastor
                </span>
              </div>
              <h2 className='text-xl md:text-2xl font-bold text-white font-outfit leading-tight'>
                Modificar información de Pastor
              </h2>
              <p className='text-white/90 text-[13px] md:text-[14px] font-inter font-medium'>
                {data?.member?.firstNames} {data?.member?.lastNames}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl px-4 py-8 sm:px-10'>
            <PastorFormFields
              mode='update'
              form={form}
              data={data}
              isInputDisabled={isInputDisabled}
              isSubmitButtonDisabled={isSubmitButtonDisabled}
              isMessageErrorDisabled={isMessageErrorDisabled}
              setIsInputDisabled={setIsInputDisabled}
              setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
              isInputTheirChurchOpen={isInputTheirChurchOpen}
              setIsInputTheirChurchOpen={setIsInputTheirChurchOpen}
              isInputBirthDateOpen={isInputBirthDateOpen}
              setIsInputBirthDateOpen={setIsInputBirthDateOpen}
              isInputConvertionDateOpen={isInputConvertionDateOpen}
              setIsInputConvertionDateOpen={setIsInputConvertionDateOpen}
              relationType={relationType}
              residenceDistrict={district}
              districtsValidation={districtsValidation}
              urbanSectorsValidation={urbanSectorsValidation}
              disabledRoles={disabledRoles}
              ministryBlocks={ministryBlocks}
              ministryBlockActions={ministryBlockActions}
              queryChurches={churchesQuery}
              isPending={isPending}
              handleSubmit={handleSubmit}
              changedId={changedChurchId}
              setChangedId={setChangedChurchId}
              isAlertDialogOpen={isAlertDialogOpen}
              setIsAlertDialogOpen={setIsAlertDialogOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
};
