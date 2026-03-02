import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';

import { AlertUpdateRelation } from '@/shared/components/alerts';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import { type SupervisorResponse } from '@/modules/supervisor/types/supervisor-response.interface';
import { type PreacherResponse } from '@/modules/preacher/types/preacher-response.interface';
import { type PreacherFormData } from '@/modules/preacher/types/preacher-form-data.interface';

export interface AlertUpdateRelationPreacherProps {
  data: PreacherResponse | undefined;
  isAlertDialogOpen: boolean;
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  supervisorsQuery: UseQueryResult<SupervisorResponse[], Error>;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  preacherUpdateForm: UseFormReturn<PreacherFormData, any, PreacherFormData | undefined>;
}

export const AlertUpdateRelationPreacher = ({
  data,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  supervisorsQuery,
  preacherUpdateForm,
  setChangedId,
  changedId,
}: AlertUpdateRelationPreacherProps): JSX.Element => {
  const preacherFullName = getInitialFullNames({
    firstNames: data?.member?.firstNames ?? '',
    lastNames: data?.member?.lastNames ?? '',
  });

  return (
    <AlertUpdateRelation
      mode='supervisor'
      isAlertDialogOpen={isAlertDialogOpen}
      setIsAlertDialogOpen={setIsAlertDialogOpen}
      changedId={changedId}
      setChangedId={setChangedId}
      data={data}
      query={supervisorsQuery}
      updateForm={preacherUpdateForm}
      formFieldName='theirSupervisor'
      moduleLabel='Predicador'
      entityName={preacherFullName}
      title='Cambio de Supervisor'
      subtitle='Estás a punto de actualizar el Supervisor asignado al siguiente Predicador'
      warningMessage='Al realizar el cambio de Supervisor para este Predicador, se eliminarán sus relaciones anteriores y se establecerán las nuevas. Además, el grupo familiar y discípulos bajo su cobertura también serán reasignados con las nuevas relaciones.'
    />
  );
};
