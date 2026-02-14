import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

export interface ContextParams {
  churchId?: string;
  ministryId?: string;
}

export const getContextParams = (): ContextParams => {
  const { activeChurchId, activeMinistryId } = useChurchMinistryContextStore.getState();

  const params: ContextParams = {};

  if (activeChurchId) {
    params.churchId = activeChurchId;
  }

  if (activeMinistryId) {
    params.ministryId = activeMinistryId;
  }

  return params;
};
