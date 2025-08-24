export enum RelationType {
  OnlyRelatedHierarchicalCover = 'only_related_hierarchical_cover',
  OnlyRelatedMinistries = 'only_related_ministries',
  RelatedBothMinistriesAndHierarchicalCover = 'related_both_ministries_and_hierarchical_cover',
}

export const RelationTypeNames: Record<RelationType, string> = {
  [RelationType.OnlyRelatedHierarchicalCover]: 'Solo con una cobertura jerárquica',
  [RelationType.OnlyRelatedMinistries]: 'Solo con ministerios',
  [RelationType.RelatedBothMinistriesAndHierarchicalCover]:
    'Con ministerios y cobertura jerárquica',
};
