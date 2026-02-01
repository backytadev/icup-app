import { UserRole } from '@/modules/user/enums/user-role.enum';
import { type MenuItem } from '@/shared/interfaces/menu-item.interface';

import {
  FcHome,
  FcLike,
  FcBullish,
  FcManager,
  FcFlowChart,
  FcSportsMode,
  FcStatistics,
  FcBusinessman,
  FcOrganization,
  FcReadingEbook,
  FcBusinesswoman,
  FcPodiumWithSpeaker,
} from 'react-icons/fc';

import { PiChurch } from 'react-icons/pi';

export const menuItems: MenuItem[] = [
  {
    title: 'Panel de Control',
    subTitle: 'Resumen informativo',
    href: '/dashboard',
    Icon: FcBullish,
    allowedRoles: [
      UserRole.SuperUser,
      UserRole.AdminUser,
      UserRole.User,
      UserRole.TreasurerUser,
      UserRole.MinistryUser,
    ],
  },
  {
    title: 'Iglesia',
    subTitle: 'Módulo Iglesia',
    href: '/churches',
    Icon: PiChurch,
    allowedRoles: [UserRole.SuperUser, UserRole.AdminUser, UserRole.User, UserRole.TreasurerUser],
  },
  {
    title: 'Ministerio',
    subTitle: 'Módulo Ministerio',
    href: '/ministries',
    Icon: FcOrganization,
    allowedRoles: [UserRole.SuperUser, UserRole.AdminUser, UserRole.User, UserRole.TreasurerUser],
  },
  {
    title: 'Pastor',
    subTitle: 'Modulo Pastor',
    href: '/pastors',
    Icon: FcPodiumWithSpeaker,
    allowedRoles: [UserRole.SuperUser, UserRole.AdminUser, UserRole.User, UserRole.TreasurerUser],
  },
  {
    title: 'Co-Pastor',
    subTitle: 'Modulo Co-Pastor',
    href: '/copastors',
    Icon: FcBusinesswoman,
    allowedRoles: [UserRole.SuperUser, UserRole.AdminUser, UserRole.User, UserRole.TreasurerUser],
  },
  {
    title: 'Supervisor',
    subTitle: 'Modulo Supervisor',
    href: '/supervisors',
    Icon: FcBusinessman,
    allowedRoles: [UserRole.SuperUser, UserRole.AdminUser, UserRole.User, UserRole.TreasurerUser],
  },
  {
    title: 'Zona',
    subTitle: 'Modulo Zona',
    href: '/zones',
    Icon: FcFlowChart,
    allowedRoles: [UserRole.SuperUser, UserRole.AdminUser, UserRole.User, UserRole.TreasurerUser],
  },
  {
    title: 'Predicador',
    subTitle: 'Modulo Predicador',
    href: '/preachers',
    Icon: FcManager,
    allowedRoles: [UserRole.SuperUser, UserRole.AdminUser, UserRole.User, UserRole.TreasurerUser],
  },
  {
    title: 'Grupo Familiar',
    subTitle: 'Modulo Grupo Familiar',
    href: '/family-groups',
    Icon: FcHome,
    allowedRoles: [UserRole.SuperUser, UserRole.AdminUser, UserRole.User, UserRole.TreasurerUser],
  },
  {
    title: 'Discípulo',
    subTitle: 'Modulo Discípulo',
    href: '/disciples',
    Icon: FcSportsMode,
    allowedRoles: [UserRole.SuperUser, UserRole.AdminUser, UserRole.User, UserRole.TreasurerUser],
  },
  {
    title: 'Ofrenda',
    subTitle: 'Modulo Ofrenda',
    href: '/offerings',
    Icon: FcLike,
    allowedRoles: [
      UserRole.SuperUser,
      UserRole.TreasurerUser,
      UserRole.AdminUser,
      UserRole.User,
      UserRole.MinistryUser,
    ],
  },
  {
    title: 'Usuario',
    subTitle: 'Modulo Usuario',
    href: '/users',
    Icon: FcReadingEbook,
    allowedRoles: [UserRole.SuperUser],
  },

  {
    title: 'Métricas y Estadísticas',
    subTitle: 'Gráficos y estadísticas',
    href: '/metrics',
    Icon: FcStatistics,
    allowedRoles: [UserRole.SuperUser, UserRole.AdminUser, UserRole.User, UserRole.TreasurerUser],
  },
];
