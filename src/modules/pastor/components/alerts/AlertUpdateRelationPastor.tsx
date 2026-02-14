import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';

import { type PastorResponse } from '@/modules/pastor/types/pastor-response.interface';
import { type ChurchResponse } from '@/modules/church/types';
import { type PastorFormData } from '@/modules/pastor/types/pastor-form-data.interface';

import { AlertUpdateRelation } from '@/shared/components/alerts';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

export interface AlertUpdateRelationPastorProps {
  data: PastorResponse | undefined;
  isAlertDialogOpen: boolean;
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  churchesQuery: UseQueryResult<ChurchResponse[], Error>;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pastorUpdateForm: UseFormReturn<PastorFormData, any, PastorFormData | undefined>;
}

export const AlertUpdateRelationPastor = ({
  data,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  churchesQuery,
  pastorUpdateForm,
  setChangedId,
  changedId,
}: AlertUpdateRelationPastorProps): JSX.Element => {
  const pastorFullName = getInitialFullNames({
    firstNames: data?.member?.firstNames ?? '',
    lastNames: data?.member?.lastNames ?? '',
  });

  return (
    <AlertUpdateRelation
      mode='church'
      isAlertDialogOpen={isAlertDialogOpen}
      setIsAlertDialogOpen={setIsAlertDialogOpen}
      changedId={changedId}
      setChangedId={setChangedId}
      data={data}
      query={churchesQuery}
      updateForm={pastorUpdateForm}
      formFieldName='theirChurch'
      moduleLabel='Pastor'
      entityName={pastorFullName}
    />
  );
};
