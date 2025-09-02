export enum RelationType {
  OnlyRelatedHierarchicalCover = 'only_related_hierarchical_cover',
  OnlyRelatedMinistries = 'only_related_ministries',
  RelatedBothMinistriesAndHierarchicalCover = 'related_both_ministries_and_hierarchical_cover',
}

export const RelationTypeNames: Record<RelationType, string> = {
  [RelationType.OnlyRelatedHierarchicalCover]: 'Solo con cobertura jerárquica',
  [RelationType.OnlyRelatedMinistries]: 'Solo con ministerios',
  [RelationType.RelatedBothMinistriesAndHierarchicalCover]:
    'Con ministerios y cobertura jerárquica',
};

type ModuleName = 'disciple' | 'preacher' | 'supervisor' | 'copastor';

export const RelationTypeModuleNames: Record<ModuleName, Record<RelationType, string>> = {
  disciple: {
    [RelationType.OnlyRelatedHierarchicalCover]: 'Solo con grupo familiar',
    [RelationType.OnlyRelatedMinistries]: 'Solo con ministerios',
    [RelationType.RelatedBothMinistriesAndHierarchicalCover]: 'Con ministerios y grupo familiar',
  },
  preacher: {
    [RelationType.OnlyRelatedHierarchicalCover]: 'Solo con supervisor',
    [RelationType.OnlyRelatedMinistries]: 'Solo con ministerios',
    [RelationType.RelatedBothMinistriesAndHierarchicalCover]: 'Con ministerios y supervisor',
  },
  supervisor: {
    [RelationType.OnlyRelatedHierarchicalCover]: 'Solo con copastor',
    [RelationType.OnlyRelatedMinistries]: 'Solo con ministerios',
    [RelationType.RelatedBothMinistriesAndHierarchicalCover]: 'Con ministerios y copastor',
  },
  copastor: {
    [RelationType.OnlyRelatedHierarchicalCover]: 'Solo con pastor',
    [RelationType.OnlyRelatedMinistries]: 'Solo con ministerios',
    [RelationType.RelatedBothMinistriesAndHierarchicalCover]: 'Con ministerios y pastor',
  },
};
