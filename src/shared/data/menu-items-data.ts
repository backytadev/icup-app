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
  },
  { title: 'Iglesia', subTitle: 'Módulo Iglesia', href: '/churches', Icon: PiChurch },
  { title: 'Pastor', subTitle: 'Modulo Pastor', href: '/pastors', Icon: FcPodiumWithSpeaker },
  { title: 'Co-Pastor', subTitle: 'Modulo Co-Pastor', href: '/copastors', Icon: FcBusinesswoman },
  { title: 'Supervisor', subTitle: 'Modulo Supervisor', href: '/supervisors', Icon: FcBusinessman },
  { title: 'Zona', subTitle: 'Modulo Zona', href: '/zones', Icon: FcFlowChart },
  { title: 'Predicador', subTitle: 'Modulo Predicador', href: '/preachers', Icon: FcManager },
  {
    title: 'Grupo Familiar',
    subTitle: 'Modulo Grupo Familiar',
    href: '/family-groups',
    Icon: FcHome,
  },
  { title: 'Discípulo', subTitle: 'Modulo Discípulo', href: '/disciples', Icon: FcSportsMode },
  { title: 'Ofrenda', subTitle: 'Modulo Ofrenda', href: '/offerings', Icon: FcLike },
  { title: 'Usuario', subTitle: 'Modulo Usuario', href: '/users', Icon: FcReadingEbook },
  {
    title: 'Ministerio',
    subTitle: 'Módulo Ministerio',
    href: '/ministries',
    Icon: FcOrganization,
  },
  {
    title: 'Métricas y Estadísticas',
    subTitle: 'Gráficos y estadísticas',
    href: '/metrics',
    Icon: FcStatistics,
  },
];
