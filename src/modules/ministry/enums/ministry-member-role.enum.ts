export enum MinistryMemberRole {
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

export const MinistryMemberRoleNames: Record<MinistryMemberRole, string> = {
  [MinistryMemberRole.KidsMinistryLeader]: 'Líder',
  [MinistryMemberRole.KidsMinistryCoLeader]: 'Co-Líder',
  [MinistryMemberRole.KidsMinistryMember]: 'Miembro',
  [MinistryMemberRole.YouthMinistryLeader]: 'Líder',
  [MinistryMemberRole.YouthMinistryCoLeader]: 'Co-Líder',
  [MinistryMemberRole.YouthMinistryMember]: 'Miembro',
  [MinistryMemberRole.IntercessionMinistryLeader]: 'Líder',
  [MinistryMemberRole.IntercessionMinistryCoLeader]: 'Co-Líder',
  [MinistryMemberRole.IntercessionMinistryMember]: 'Miembro',
  [MinistryMemberRole.EvangelismMinistryLeader]: 'Líder',
  [MinistryMemberRole.EvangelismMinistryCoLeader]: 'Co-Líder',
  [MinistryMemberRole.EvangelismMinistryMember]: 'Miembro',
  [MinistryMemberRole.TechnologyMinistryLeader]: 'Líder',
  [MinistryMemberRole.TechnologyMinistryCoLeader]: 'Co-Líder',
  [MinistryMemberRole.TechnologyMinistryMember]: 'Miembro',
  [MinistryMemberRole.BiblicalTeachingMinistryLeader]: 'Líder',
  [MinistryMemberRole.BiblicalTeachingMinistryCoLeader]: 'Co-Líder',
  [MinistryMemberRole.BiblicalTeachingMinistryMember]: 'Miembro',
  [MinistryMemberRole.WorshipMinistryLeader]: 'Líder',
  [MinistryMemberRole.WorshipMinistryCoLeader]: 'Co-Líder',
  [MinistryMemberRole.WorshipMinistryMember]: 'Miembro',
};

//? Individual Roles

//* Kids Ministry
export enum SearchTypesKidsMinistry {
  KidsMinistryLeader = 'kids_ministry_leader',
  KidsMinistryCoLeader = 'kids_ministry_co_leader',
  KidsMinistryMember = 'kids_ministry_member',
}

export const SearchTypesNamesKidsMinistry: Record<SearchTypesKidsMinistry, string> = {
  [SearchTypesKidsMinistry.KidsMinistryLeader]: 'Líder',
  [SearchTypesKidsMinistry.KidsMinistryCoLeader]: 'Co-Líder',
  [SearchTypesKidsMinistry.KidsMinistryMember]: 'Miembro',
};

//* Youth Ministry
export enum SearchTypesYouthMinistry {
  YouthMinistryLeader = 'youth_ministry_leader',
  YouthMinistryCoLeader = 'youth_ministry_co_leader',
  YouthMinistryMember = 'youth_ministry_member',
}

export const SearchTypesNamesYouthMinistry: Record<SearchTypesYouthMinistry, string> = {
  [SearchTypesYouthMinistry.YouthMinistryLeader]: 'Líder',
  [SearchTypesYouthMinistry.YouthMinistryCoLeader]: 'Co-Líder',
  [SearchTypesYouthMinistry.YouthMinistryMember]: 'Miembro',
};

//* Intercession Ministry
export enum SearchTypesIntercessionMinistry {
  IntercessionMinistryLeader = 'intercession_ministry_leader',
  IntercessionMinistryCoLeader = 'intercession_ministry_co_leader',
  IntercessionMinistryMember = 'intercession_ministry_member',
}

export const SearchTypesNamesIntercessionMinistry: Record<SearchTypesIntercessionMinistry, string> =
  {
    [SearchTypesIntercessionMinistry.IntercessionMinistryLeader]: 'Líder',
    [SearchTypesIntercessionMinistry.IntercessionMinistryCoLeader]: 'Co-Líder',
    [SearchTypesIntercessionMinistry.IntercessionMinistryMember]: 'Miembro',
  };

//* Evangelism Ministry
export enum SearchTypesEvangelismMinistry {
  EvangelismMinistryLeader = 'evangelism_ministry_leader',
  EvangelismMinistryCoLeader = 'evangelism_ministry_co_leader',
  EvangelismMinistryMember = 'evangelism_ministry_member',
}

export const SearchTypesNamesEvangelismMinistry: Record<SearchTypesEvangelismMinistry, string> = {
  [SearchTypesEvangelismMinistry.EvangelismMinistryLeader]: 'Líder',
  [SearchTypesEvangelismMinistry.EvangelismMinistryCoLeader]: 'Co-Líder',
  [SearchTypesEvangelismMinistry.EvangelismMinistryMember]: 'Miembro',
};

//* Technology Ministry
export enum SearchTypesTechnologyMinistry {
  TechnologyMinistryLeader = 'technology_ministry_leader',
  TechnologyMinistryCoLeader = 'technology_ministry_co_leader',
  TechnologyMinistryMember = 'technology_ministry_member',
}

export const SearchTypesNamesTechnologyMinistry: Record<SearchTypesTechnologyMinistry, string> = {
  [SearchTypesTechnologyMinistry.TechnologyMinistryLeader]: 'Líder',
  [SearchTypesTechnologyMinistry.TechnologyMinistryCoLeader]: 'Co-Líder',
  [SearchTypesTechnologyMinistry.TechnologyMinistryMember]: 'Miembro',
};

//* Discipleship Ministry
export enum SearchTypesBiblicalTeachingMinistry {
  BiblicalTeachingMinistryLeader = 'biblical_teaching_ministry_leader',
  BiblicalTeachingMinistryCoLeader = 'biblical_teaching_ministry_co_leader',
  BiblicalTeachingMinistryMember = 'biblical_teaching_ministry_member',
}

export const SearchTypesNamesBiblicalTeachingMinistry: Record<
  SearchTypesBiblicalTeachingMinistry,
  string
> = {
  [SearchTypesBiblicalTeachingMinistry.BiblicalTeachingMinistryLeader]: 'Líder',
  [SearchTypesBiblicalTeachingMinistry.BiblicalTeachingMinistryCoLeader]: 'Co-Líder',
  [SearchTypesBiblicalTeachingMinistry.BiblicalTeachingMinistryMember]: 'Miembro',
};

//* Worship Ministry
export enum SearchTypesWorshipMinistry {
  WorshipMinistryLeader = 'worship_ministry_leader',
  WorshipMinistryCoLeader = 'worship_ministry_co_leader',
  WorshipMinistryMember = 'worship_ministry_member',
}

export const SearchTypesNamesWorshipMinistry: Record<SearchTypesWorshipMinistry, string> = {
  [SearchTypesWorshipMinistry.WorshipMinistryLeader]: 'Líder',
  [SearchTypesWorshipMinistry.WorshipMinistryCoLeader]: 'Co-Líder',
  [SearchTypesWorshipMinistry.WorshipMinistryMember]: 'Miembro',
};
