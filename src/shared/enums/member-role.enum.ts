export enum MemberRole {
  //* Main Roles
  Pastor = 'pastor',
  Copastor = 'copastor',
  Supervisor = 'supervisor',
  Preacher = 'preacher',
  Treasurer = 'treasurer',
  Disciple = 'disciple',

  //* Council of Elders Roles
  Presbyter = 'presbyter',

  //* Ministries Roles
  KidsMinistryLeader = 'kids_ministry_leader',
  KidsMinistryCoLeader = 'kids_ministry_co_leader',
  KidsMinistryMember = 'kids_ministry_member',
  YouthMinistryLeader = 'youth_ministry_leader',
  YouthMinistryCoLeader = 'youth_ministry_co_leader',
  YouthMinistryMember = 'youth_ministry_member',
  IntercessionMinistryLeader = 'intercession_ministry_leader',
  IntercessionMinistryCoLeader = 'intercession_ministry_co_leader',
  IntercessionMinistryMember = 'intercession_ministry_member',
  EvangelismMinistryLeader = 'evangelism_ministry_leader',
  EvangelismMinistryCoLeader = 'evangelism_ministry_co_leader',
  EvangelismMinistryMember = 'evangelism_ministry_member',
  TechnologyMinistryLeader = 'technology_ministry_leader',
  TechnologyMinistryCoLeader = 'technology_ministry_co_leader',
  TechnologyMinistryMember = 'technology_ministry_member',
  DiscipleshipMinistryLeader = 'discipleship_ministry_leader',
  DiscipleshipMinistryCoLeader = 'discipleship_ministry_co_leader',
  DiscipleshipMinistryMember = 'discipleship_ministry_member',
  WorshipMinistryLeader = 'worship_ministry_leader',
  WorshipMinistryCoLeader = 'worship_ministry_co_leader',
  WorshipMinistryMember = 'worship_ministry_member',
}

export const MemberRoleNames: Record<MemberRole, string> = {
  //* Main Roles
  [MemberRole.Pastor]: 'Pastor(a)',
  [MemberRole.Copastor]: 'Co-Pastor(a)',
  [MemberRole.Supervisor]: 'Supervisor(a)',
  [MemberRole.Preacher]: 'Predicador(a)',
  [MemberRole.Treasurer]: 'Tesorero(a)',
  [MemberRole.Disciple]: 'Discípulo',

  //* Council of Elders Roles
  [MemberRole.Presbyter]: 'Presbítero(a)',

  // todo: al terminar modificar este apartado para que solo apunte a los cards qui se definira el rol de ministerio
  //* Ministries
  [MemberRole.KidsMinistryLeader]: 'Líder ~ (M.Niños)',
  [MemberRole.KidsMinistryCoLeader]: 'Min. Niños (Co-Líder)',
  [MemberRole.KidsMinistryMember]: 'Min. Niños (Miembro)',
  [MemberRole.YouthMinistryLeader]: 'Min. Jóvenes (Líder)',
  [MemberRole.YouthMinistryCoLeader]: 'Min. Jóvenes (Co-Líder)',
  [MemberRole.YouthMinistryMember]: 'Miembro ~ (Min. Jóvenes)',
  [MemberRole.IntercessionMinistryLeader]: 'Min. Intercesión (Líder)',
  [MemberRole.IntercessionMinistryCoLeader]: 'Min. Intercesión (Co-Líder)',
  [MemberRole.IntercessionMinistryMember]: 'Min. Intercesión (Miembro)',
  [MemberRole.EvangelismMinistryLeader]: 'Min. Evangelismo (Líder)',
  [MemberRole.EvangelismMinistryCoLeader]: 'Min. Evangelismo (Co-Líder)',
  [MemberRole.EvangelismMinistryMember]: 'Min. Evangelismo (Miembro)',
  [MemberRole.TechnologyMinistryLeader]: 'Min. Tecnología (Líder)',
  [MemberRole.TechnologyMinistryCoLeader]: 'Min. Tecnología (Co-Líder)',
  [MemberRole.TechnologyMinistryMember]: 'Min. Tecnología (Miembro)',
  [MemberRole.DiscipleshipMinistryLeader]: 'Min. Discipulado (Líder)',
  [MemberRole.DiscipleshipMinistryCoLeader]: 'Min. Discipulado (Co-Líder)',
  [MemberRole.DiscipleshipMinistryMember]: 'Min. Discipulado (Miembro)',
  [MemberRole.WorshipMinistryLeader]: 'Min. Alabanza (Líder)',
  [MemberRole.WorshipMinistryCoLeader]: 'Min. Alabanza (Co-Líder)',
  [MemberRole.WorshipMinistryMember]: 'Min. Alabanza (Miembro)',
};
