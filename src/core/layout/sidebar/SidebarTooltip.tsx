import type React from 'react';

import { type IconType } from 'react-icons';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/shared/components/ui/tooltip';

interface MenuBarItem {
  title: string;
  subTitle: string;
  href: string;
  Icon: IconType;
}

interface Props {
  children: React.ReactNode;
  item: MenuBarItem;
}

export const SidebarTooltip = ({ children, item }: Props): JSX.Element => {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent side='right' align='center'>
          <p key={item.title}>{item.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
