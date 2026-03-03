import { type UseQueryResult } from '@tanstack/react-query';
import { type UseFormReturn } from 'react-hook-form';

import { AlertUpdateRelation } from '@/shared/components/alerts/AlertUpdateRelation';

import { type DiscipleResponse } from '@/modules/disciple/types/disciple-response.interface';
import { type DiscipleFormData } from '@/modules/disciple/types/disciple-form-data.interface';
import { type FamilyGroupResponse } from '@/modules/family-group/types/family-group-response.interface';

export interface AlertUpdateRelationDiscipleProps {
  data: DiscipleResponse | undefined;
  isAlertDialogOpen: boolean;
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  familyGroupsQuery: UseQueryResult<FamilyGroupResponse[], Error>;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  discipleUpdateForm: UseFormReturn<DiscipleFormData, any, DiscipleFormData | undefined>;
}

export const AlertUpdateRelationDisciple = ({
  data,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  familyGroupsQuery,
  discipleUpdateForm,
  setChangedId,
  changedId,
}: AlertUpdateRelationDiscipleProps): JSX.Element => (
  <AlertUpdateRelation
    mode='familyGroup'
    formFieldName='theirFamilyGroup'
    moduleLabel='Discípulo'
    entityName={`${data?.member?.firstNames ?? ''} ${data?.member?.lastNames ?? ''}`.trim()}
    isAlertDialogOpen={isAlertDialogOpen}
    setIsAlertDialogOpen={setIsAlertDialogOpen}
    changedId={changedId}
    setChangedId={setChangedId}
    data={data}
    query={familyGroupsQuery}
    updateForm={discipleUpdateForm}
  />
);
