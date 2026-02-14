import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';

import { type PastorResponse } from '@/modules/pastor/types';
import { type MinistryResponse, type MinistryFormData } from '@/modules/ministry/types';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';

import { AlertUpdateRelation } from '@/shared/components/alerts';

export interface AlertUpdateRelationMinistryProps {
  data: MinistryResponse | undefined;
  isAlertDialogOpen: boolean;
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  pastorsQuery: UseQueryResult<PastorResponse[], Error>;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ministryUpdateForm: UseFormReturn<MinistryFormData, unknown, MinistryFormData | undefined>;
}

export const AlertUpdateRelationMinistry = ({
  data,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  pastorsQuery,
  ministryUpdateForm,
  setChangedId,
  changedId,
}: AlertUpdateRelationMinistryProps): JSX.Element => {
  return (
    <AlertUpdateRelation
      mode='pastor'
      isAlertDialogOpen={isAlertDialogOpen}
      setIsAlertDialogOpen={setIsAlertDialogOpen}
      changedId={changedId}
      setChangedId={setChangedId}
      data={data}
      query={pastorsQuery}
      updateForm={ministryUpdateForm}
      formFieldName='theirPastor'
      moduleLabel={MinistryTypeNames[data?.ministryType as MinistryType]}
      entityName={data?.customMinistryName}
    />
  );
};
