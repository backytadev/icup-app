export enum MinistryType {
  KidsMinistry = 'kids_ministry',
  YouthMinistry = 'youth_ministry',
  IntercessionMinistry = 'intercession_ministry',
  EvangelismMinistry = 'evangelism_ministry',
  TechnologyMinistry = 'technology_ministry',
  BiblicalTeachingMinistry = 'biblical_teaching_ministry',
  WorshipMinistry = 'worship_ministry',
}

export const MinistryTypeNames: Record<MinistryType, string> = {
  [MinistryType.KidsMinistry]: 'Ministerio de Niños',
  [MinistryType.YouthMinistry]: 'Ministerio de Jóvenes',
  [MinistryType.IntercessionMinistry]: 'Ministerio de Intercesión',
  [MinistryType.EvangelismMinistry]: 'Ministerio de Evangelismo',
  [MinistryType.TechnologyMinistry]: 'Ministerio Tecnología',
  [MinistryType.BiblicalTeachingMinistry]: 'Ministerio de Enseñanza Biblica',
  [MinistryType.WorshipMinistry]: 'Ministerio de Alabanza',
};
