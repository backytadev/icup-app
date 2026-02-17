import {
  OfferingIncomeCreationType,
  OfferingIncomeCreationTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import {
  OfferingIncomeCreationSubType,
  OfferingIncomeCreationSubTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import { MemberType } from '@/modules/offering/income/enums/member-type.enum';

import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';

import { OfferingIncomeFormFields } from '@/modules/offering/income/components';
import { OfferingIncomeFormSkeleton } from '@/modules/offering/income/components';
import { useOfferingIncomeForm } from '@/modules/offering/income/hooks/forms/useOfferingIncomeForm';

interface OfferingIncomeUpdateFormProps {
  id: string;
  data: OfferingIncomeResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
  onUpdateSuccess?: (offeringId: string) => void;
}

export const OfferingIncomeUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
  onUpdateSuccess,
}: OfferingIncomeUpdateFormProps): JSX.Element => {
  const { mode, isLoadingData, ...hookReturn } = useOfferingIncomeForm({
    mode: 'update',
    id,
    data,
    dialogClose,
    scrollToTop,
    onUpdateSuccess,
  });

  //* Helper to get belonging label
  const getBelongingLabel = (): string => {
    if (
      data?.type === OfferingIncomeCreationType.IncomeAdjustment ||
      data?.subType === OfferingIncomeCreationSubType.SundaySchool ||
      data?.subType === OfferingIncomeCreationSubType.SundayService ||
      data?.subType === OfferingIncomeCreationSubType.GeneralFasting ||
      data?.subType === OfferingIncomeCreationSubType.GeneralVigil ||
      data?.subType === OfferingIncomeCreationSubType.YouthService ||
      data?.subType === OfferingIncomeCreationSubType.Activities
    ) {
      return data?.church?.abbreviatedChurchName ?? '';
    }

    if (data?.subType === OfferingIncomeCreationSubType.FamilyGroup) {
      return `${data?.familyGroup?.familyGroupCode} - ${data?.familyGroup?.familyGroupName}`;
    }

    if (
      data?.subType === OfferingIncomeCreationSubType.ZonalFasting ||
      data?.subType === OfferingIncomeCreationSubType.ZonalVigil
    ) {
      return `${data?.zone?.zoneName} - ${data?.zone?.district}`;
    }

    if (data?.memberType === MemberType.Disciple) {
      return `${data?.disciple?.firstNames} ${data?.disciple?.lastNames}`;
    }
    if (data?.memberType === MemberType.Preacher) {
      return `${data?.preacher?.firstNames} ${data?.preacher?.lastNames}`;
    }
    if (data?.memberType === MemberType.Supervisor) {
      return `${data?.supervisor?.firstNames} ${data?.supervisor?.lastNames}`;
    }
    if (data?.memberType === MemberType.Copastor) {
      return `${data?.copastor?.firstNames} ${data?.copastor?.lastNames}`;
    }
    if (data?.memberType === MemberType.Pastor) {
      return `${data?.pastor?.firstNames} ${data?.pastor?.lastNames}`;
    }

    return '';
  };

  //* Helper to get type label
  const getTypeLabel = (): string => {
    const typeName = OfferingIncomeCreationTypeNames[data?.type as OfferingIncomeCreationType];
    const subTypeName = OfferingIncomeCreationSubTypeNames[
      data?.subType as OfferingIncomeCreationSubType
    ];

    return `${typeName}${data?.subType ? ' - ' : ''}${subTypeName ?? ''}`;
  };

  return (
    <div className='w-full max-w-[1120px]'>
      {isLoadingData ? (

        <div className='w-full'>
          <OfferingIncomeFormSkeleton />
        </div>
      ) : (
        <div className='w-full'>
          {/* Header */}
          <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 dark:from-orange-600 dark:via-amber-600 dark:to-orange-700 px-6 py-5'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                  Actualización
                </span>
                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                  Ingreso
                </span>
              </div>
              <h2 className='text-xl md:text-2xl font-bold text-white font-outfit leading-tight'>
                Modificar Registro de Ofrenda
              </h2>
              <p className='text-white/90 text-[13px] md:text-[14px] font-inter font-medium'>
                {getTypeLabel()}
              </p>
              <p className='text-white/80 text-[12.5px] md:text-[13.5px] font-inter'>
                Pertenencia: {getBelongingLabel()}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <OfferingIncomeFormFields mode='update' isLoadingData={isLoadingData} {...hookReturn} />
          </div>
        </div>
      )}
    </div>
  );
};
