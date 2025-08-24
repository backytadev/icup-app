export enum MinistryInactivationCategory {
  Administrative = 'administrative',
  LeadershipIssues = 'leadership_issues',
  CommunityRelatedIssues = 'community_related_issues',
  LackOfActivityOrCommitment = 'lack_of_activity_or_commitment',
}

export const MinistryInactivationCategoryNames: Record<MinistryInactivationCategory, string> = {
  [MinistryInactivationCategory.Administrative]: 'Razones administrativas',
  [MinistryInactivationCategory.LackOfActivityOrCommitment]:
    'Razones por falta de actividad o compromiso',
  [MinistryInactivationCategory.LeadershipIssues]: 'Razones por problemas de liderazgo',
  [MinistryInactivationCategory.CommunityRelatedIssues]: 'Razones relacionados con la comunidad',
};
