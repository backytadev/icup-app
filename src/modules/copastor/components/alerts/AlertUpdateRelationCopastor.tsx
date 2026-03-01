import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';

import { AlertUpdateRelation } from '@/shared/components/alerts';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import { type PastorResponse } from '@/modules/pastor/types';
import { type CopastorResponse } from '@/modules/copastor/types/copastor-response.interface';
import { type CopastorFormData } from '@/modules/copastor/types/copastor-form-data.interface';

export interface AlertUpdateRelationCopastorProps {
  data: CopastorResponse | undefined;
  isAlertDialogOpen: boolean;
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  pastorsQuery: UseQueryResult<PastorResponse[], Error>;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  copastorUpdateForm: UseFormReturn<CopastorFormData, any, CopastorFormData | undefined>;
}

export const AlertUpdateRelationCopastor = ({
  data,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  pastorsQuery,
  copastorUpdateForm,
  setChangedId,
  changedId,
}: AlertUpdateRelationCopastorProps): JSX.Element => {
  const copastorFullName = getInitialFullNames({
    firstNames: data?.member?.firstNames ?? '',
    lastNames: data?.member?.lastNames ?? '',
  });

  return (
    <AlertUpdateRelation
      mode='pastor'
      isAlertDialogOpen={isAlertDialogOpen}
      setIsAlertDialogOpen={setIsAlertDialogOpen}
      changedId={changedId}
      setChangedId={setChangedId}
      data={data}
      query={pastorsQuery}
      updateForm={copastorUpdateForm}
      formFieldName='theirPastor'
      moduleLabel='Co-Pastor'
      entityName={copastorFullName}
      title='Cambio de Pastor'
      subtitle='Estás a punto de actualizar el Pastor asignado al siguiente Co-Pastor'
      warningMessage='Al realizar el cambio de Pastor para este Co-Pastor, se eliminarán sus relaciones anteriores y se establecerán las nuevas. Además, todo lo que estaban bajo su cobertura (zonas, supervisores, grupos familiares y discípulos) también serán reasignados con las nuevas relaciones.'
    />
  );
};
