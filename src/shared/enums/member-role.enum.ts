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
  BiblicalTeachingMinistryLeader = 'biblical_teaching_ministry_leader',
  BiblicalTeachingMinistryCoLeader = 'biblical_teaching_ministry_co_leader',
  BiblicalTeachingMinistryMember = 'biblical_teaching_ministry_member',
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

  //* Ministries
  [MemberRole.KidsMinistryLeader]: 'Líder ~ (M.Niños)',
  [MemberRole.KidsMinistryCoLeader]: 'Min. Niños (Co-Líder)',
  [MemberRole.KidsMinistryMember]: 'Min. Niños (Miembro)',
  [MemberRole.YouthMinistryLeader]: 'Min. Jóvenes (Líder)',
  [MemberRole.YouthMinistryCoLeader]: 'Min. Jóvenes (Co-Líder)',
  [MemberRole.YouthMinistryMember]: 'Min. Jóvenes (Miembro)',
  [MemberRole.IntercessionMinistryLeader]: 'Min. Intercesión (Líder)',
  [MemberRole.IntercessionMinistryCoLeader]: 'Min. Intercesión (Co-Líder)',
  [MemberRole.IntercessionMinistryMember]: 'Min. Intercesión (Miembro)',
  [MemberRole.EvangelismMinistryLeader]: 'Min. Enseñanza Biblica (Líder)',
  [MemberRole.EvangelismMinistryCoLeader]: 'Min. Enseñanza Biblica (Co-Líder)',
  [MemberRole.EvangelismMinistryMember]: 'Min. Enseñanza Biblica (Miembro)',
  [MemberRole.TechnologyMinistryLeader]: 'Min. Tecnología (Líder)',
  [MemberRole.TechnologyMinistryCoLeader]: 'Min. Tecnología (Co-Líder)',
  [MemberRole.TechnologyMinistryMember]: 'Min. Tecnología (Miembro)',
  [MemberRole.BiblicalTeachingMinistryLeader]: 'Min. Enseñanza Biblica (Líder)',
  [MemberRole.BiblicalTeachingMinistryCoLeader]: 'Min. Enseñanza Biblica (Co-Líder)',
  [MemberRole.BiblicalTeachingMinistryMember]: 'Min. Enseñanza Biblica (Miembro)',
  [MemberRole.WorshipMinistryLeader]: 'Min. Alabanza (Líder)',
  [MemberRole.WorshipMinistryCoLeader]: 'Min. Alabanza (Co-Líder)',
  [MemberRole.WorshipMinistryMember]: 'Min. Alabanza (Miembro)',
};
