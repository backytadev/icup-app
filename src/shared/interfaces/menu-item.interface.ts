import { UserRole } from '@/modules/user/enums/user-role.enum';
import { type IconType } from 'react-icons';

export interface MenuItem {
  title: string;
  subTitle: string;
  href: string;
  Icon: IconType;
  allowedRoles: UserRole[];
}
