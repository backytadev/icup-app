import { MinistryResponse } from '@/modules/ministry/interfaces/ministry-response.interface';

export interface MinistryMemberBlock {
  churchId: string | null;
  ministryType: string | null;
  ministryId: string | null;
  ministryRoles: string[];
  churchPopoverOpen: boolean;
  ministryPopoverOpen: boolean;
  ministries: MinistryResponse[];
}
