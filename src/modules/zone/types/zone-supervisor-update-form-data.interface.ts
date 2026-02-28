export interface ZoneSupervisorUpdateFormData {
  newTheirSupervisor: string;
  newZone?: string | undefined;
  currentTheirSupervisor?: string | undefined;
  currentZone?: string | undefined;
}

export type ZoneSupervisorUpdateFormDataKeys =
  | 'newTheirSupervisor'
  | 'newZone'
  | 'currentZone'
  | 'currentTheirSupervisor';
