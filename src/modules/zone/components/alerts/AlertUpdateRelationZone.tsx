import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';

import { AlertUpdateRelation } from '@/shared/components/alerts';

import { type ZoneResponse, type ZoneFormData } from '@/modules/zone/types';
import { type SupervisorResponse } from '@/modules/supervisor/types/supervisor-response.interface';

export interface AlertUpdateRelationZoneProps {
  data: ZoneResponse | undefined;
  isAlertDialogOpen: boolean;
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  availableSupervisorsQuery: UseQueryResult<SupervisorResponse[], Error>;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  zoneUpdateForm: UseFormReturn<ZoneFormData, any, ZoneFormData | undefined>;
}

export const AlertUpdateRelationZone = ({
  data,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  availableSupervisorsQuery,
  zoneUpdateForm,
  setChangedId,
  changedId,
}: AlertUpdateRelationZoneProps): JSX.Element => {
  return (
    <AlertUpdateRelation
      mode='supervisor'
      isAlertDialogOpen={isAlertDialogOpen}
      setIsAlertDialogOpen={setIsAlertDialogOpen}
      changedId={changedId}
      setChangedId={setChangedId}
      data={data}
      query={availableSupervisorsQuery}
      updateForm={zoneUpdateForm}
      formFieldName='theirSupervisor'
      entityName={data?.zoneName}
    />
  );
};
