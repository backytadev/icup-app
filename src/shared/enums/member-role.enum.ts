export enum MemberRole {
  Pastor = 'pastor',
  Copastor = 'copastor',
  Supervisor = 'supervisor',
  Preacher = 'preacher',
  Treasurer = 'treasurer',
  Disciple = 'disciple',
}

export const MemberRoleNames: Record<MemberRole, string> = {
  [MemberRole.Disciple]: 'Discípulo',
  [MemberRole.Pastor]: 'Pastor',
  [MemberRole.Copastor]: 'Co-Pastor',
  [MemberRole.Supervisor]: 'Supervisor',
  [MemberRole.Preacher]: 'Predicador',
  [MemberRole.Treasurer]: 'Tesorero',
};



