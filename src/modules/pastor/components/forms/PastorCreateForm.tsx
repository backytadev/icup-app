import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { Department } from '@/shared/enums/department.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';

import { usePastorForm } from '@/modules/pastor/hooks';
import { PastorFormFields } from '@/modules/pastor/components/forms/PastorFormFields';

import { cn } from '@/shared/lib/utils';

import { useMinistryBlocks } from '@/shared/hooks/useMinistryBlocks';
import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';

interface PastorCreateFormProps {
  className?: string;
}

export const PastorCreateForm = ({ className }: PastorCreateFormProps): JSX.Element => {
  //* States
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);

  //* Library hooks
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
    churchesQuery,
    district,
    districtsValidation,
    urbanSectorsValidation,
    isPending,
    handleSubmit: onSubmit,
    ministryBlocks,
    setMinistryBlocks,
  } = usePastorForm({ mode: 'create' });

  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  const ministryBlockActions = useMinistryBlocks({ setMinistryBlocks });

  //* Watchers
  const relationType = form.watch('relationType');

  //* Effects - Set default values
  useEffect(() => {
    form.setValue('residenceCountry', Country.Perú);
    form.setValue('residenceDepartment', Department.Lima);
    form.setValue('residenceProvince', Province.Lima);
  }, [form]);

  //* Effects - Reset church on relation type change
  useEffect(() => {
    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover ||
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover
    ) {
      form.setValue('theirChurch', '');
    }
  }, [relationType, form]);

  //* Effects - Reset ministry blocks on relation type change
  useEffect(() => {
    if (
      (relationType === RelationType.OnlyRelatedHierarchicalCover ||
        relationType === RelationType.RelatedDirectToPastor) &&
      ministryBlocks.length > 0
    ) {
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
    <div className={cn('w-full max-w-[1220px] mx-auto', className)}>
      <div className='bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/50 rounded-xl'>
        <PastorFormFields
          mode='create'
          form={form}
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
          disabledRoles={disabledRoles ?? []}
          ministryBlocks={ministryBlocks}
          ministryBlockActions={ministryBlockActions}
          queryChurches={churchesQuery}
          isPending={isPending}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
