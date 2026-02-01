import { type MinistryResponse } from '@/modules/ministry/types';

export interface MinistryMemberBlock {
  churchId: string | null;
  ministryType: string | null;
  ministryId: string | null;
  ministryRoles: string[];
  churchPopoverOpen: boolean;
  ministryPopoverOpen: boolean;
  ministries: MinistryResponse[];
}
