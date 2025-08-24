export enum MinistryInactivationReason {
  //* Administrative reasons
  MergerWithAnotherMinistry = 'merger_with_another_ministry',
  Relocation = 'relocation',
  TemporaryClosure = 'temporary_closure',
  DataReorganization = 'data_reorganization',

  //* Reasons for lack of activity or commitment
  GeneralInactivity = 'general_inactivity',
  LackOfParticipation = 'lack_of_participation',
  LowDiscipleCommitment = 'low_disciple_commitment',

  //* Reasons related to the community
  MembershipDecline = 'membership_decline',
  InternalConflicts = 'internal_conflicts',
  LeadershipVacancy = 'leadership_vacancy',

  //* Reasons related to the leadership
  LeaderResignation = 'leader_resignation',
  LeadershipConflicts = 'leadership_conflicts',
  LeadershipIncapacity = 'leadership_incapacity',
}

export const MinistryInactivationReasonNames: Record<MinistryInactivationReason, string> = {
  [MinistryInactivationReason.MergerWithAnotherMinistry]: 'Fusión con otro ministerio.',
  [MinistryInactivationReason.Relocation]: 'Cambio de ubicación.',
  [MinistryInactivationReason.TemporaryClosure]: 'Cierre temporal por remodelación.',
  [MinistryInactivationReason.DataReorganization]: 'Reorganización de registros.',

  [MinistryInactivationReason.GeneralInactivity]: 'Inactividad general el ministerio.',
  [MinistryInactivationReason.LackOfParticipation]:
    'Falta de participación en actividades o eventos.',
  [MinistryInactivationReason.LowDiscipleCommitment]:
    'Bajo compromiso de los discípulos asignados.',

  [MinistryInactivationReason.MembershipDecline]: 'Disminución significativa de miembros.',
  [MinistryInactivationReason.InternalConflicts]:
    'Conflictos internos graves entre líderes o miembros.',
  [MinistryInactivationReason.LeadershipVacancy]:
    'Falta de liderazgo, ausencia de pastores o líderes.',

  [MinistryInactivationReason.LeaderResignation]: 'Renuncia o inactividad prolongada del líder.',
  [MinistryInactivationReason.LeadershipConflicts]:
    'Conflictos graves entre el líder y los discípulos .',
  [MinistryInactivationReason.LeadershipIncapacity]:
    'Incapacidad del liderazgo para cumplir con las responsabilidades.',
};

//? Individuals
//* Administrative reasons
export enum AdministrativeReasons {
  MergerWithAnotherMinistry = 'merger_with_another_ministry',
  Relocation = 'relocation',
  TemporaryClosure = 'temporary_closure',
  DataReorganization = 'data_reorganization',
}

export const AdministrativeReasonsNames: Record<AdministrativeReasons, string> = {
  [AdministrativeReasons.MergerWithAnotherMinistry]: 'Fusión con otro ministerio.',
  [AdministrativeReasons.Relocation]: 'Cambio de ubicación.',
  [AdministrativeReasons.TemporaryClosure]: 'Cierre temporal por remodelación.',
  [AdministrativeReasons.DataReorganization]: 'Reorganización de registros.',
};

//* Reasons for lack of activity or commitment
export enum LackOfActivityOrCommitmentReasons {
  GeneralInactivity = 'general_inactivity',
  LackOfParticipation = 'lack_of_participation',
  LowDiscipleCommitment = 'low_disciple_commitment',
}

export const LackOfActivityOrCommitmentReasonsNames: Record<
  LackOfActivityOrCommitmentReasons,
  string
> = {
  [LackOfActivityOrCommitmentReasons.GeneralInactivity]: 'Inactividad general del ministerio',
  [LackOfActivityOrCommitmentReasons.LackOfParticipation]:
    'Falta de liderazgo, ausencia de líderes',
  [LackOfActivityOrCommitmentReasons.LowDiscipleCommitment]:
    'Disminución significativa de miembros',
};

//* Reasons related to the community
export enum CommunityRelatedIssuesReasons {
  MembershipDecline = 'membership_decline',
  InternalConflicts = 'internal_conflicts',
  LeadershipVacancy = 'leadership_vacancy',
}

export const CommunityRelatedIssuesReasonsNames: Record<CommunityRelatedIssuesReasons, string> = {
  [CommunityRelatedIssuesReasons.MembershipDecline]: 'Disminución significativa de miembros.',
  [CommunityRelatedIssuesReasons.InternalConflicts]:
    'Conflictos internos graves entre líderes o miembros.',
  [CommunityRelatedIssuesReasons.LeadershipVacancy]:
    'Falta de liderazgo, ausencia de pastores o líderes.',
};

//* Reasons for leadership problems
export enum LeadershipIssuesReasons {
  LeaderResignation = 'leader_resignation',
  LeadershipConflicts = 'leadership_conflicts',
  LeadershipIncapacity = 'leadership_incapacity',
}

export const LeadershipIssuesReasonsNames: Record<LeadershipIssuesReasons, string> = {
  [MinistryInactivationReason.LeaderResignation]: 'Renuncia o inactividad prolongada del líder.',
  [MinistryInactivationReason.LeadershipConflicts]:
    'Conflictos graves entre el líder y los discípulos .',
  [MinistryInactivationReason.LeadershipIncapacity]:
    'Incapacidad del liderazgo para cumplir con las responsabilidades.',
};
