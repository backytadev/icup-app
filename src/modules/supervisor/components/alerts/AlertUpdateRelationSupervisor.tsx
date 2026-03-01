import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';

import { AlertUpdateRelation } from '@/shared/components/alerts';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import { type CopastorResponse } from '@/modules/copastor/types/copastor-response.interface';
import { type SupervisorResponse } from '@/modules/supervisor/types/supervisor-response.interface';
import { type SupervisorFormData } from '@/modules/supervisor/types/supervisor-form-data.interface';

export interface AlertUpdateRelationSupervisorProps {
  data: SupervisorResponse | undefined;
  isAlertDialogOpen: boolean;
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  copastorsQuery: UseQueryResult<CopastorResponse[], Error>;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  supervisorUpdateForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData | undefined>;
}

export const AlertUpdateRelationSupervisor = ({
  data,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  copastorsQuery,
  supervisorUpdateForm,
  setChangedId,
  changedId,
}: AlertUpdateRelationSupervisorProps): JSX.Element => {
  const supervisorFullName = getInitialFullNames({
    firstNames: data?.member?.firstNames ?? '',
    lastNames: data?.member?.lastNames ?? '',
  });

  return (
    <AlertUpdateRelation
      mode='copastor'
      isAlertDialogOpen={isAlertDialogOpen}
      setIsAlertDialogOpen={setIsAlertDialogOpen}
      changedId={changedId}
      setChangedId={setChangedId}
      data={data}
      query={copastorsQuery}
      updateForm={supervisorUpdateForm}
      formFieldName='theirCopastor'
      moduleLabel='Supervisor'
      entityName={supervisorFullName}
      title='Cambio de Co-Pastor'
      subtitle='Estás a punto de actualizar el Co-Pastor asignado al siguiente Supervisor'
      warningMessage='Al realizar el cambio de Co-Pastor para este Supervisor, se eliminarán sus relaciones anteriores y se establecerán las nuevas. Además, todo lo que estaba bajo su cobertura (zona, grupos familiares y discípulos) también será reasignado con las nuevas relaciones.'
    />
  );
};
