import { ArrowUpDown } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';

/* ================================ */
/*        Column Header             */
/* ================================ */

interface ColumnHeaderProps {
  column?: any;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  sortable?: boolean;
  colorClass?: string;
}

export const ColumnHeader = ({
  column,
  label,
  icon: Icon,
  sortable = true,
  colorClass,
}: ColumnHeaderProps): JSX.Element => {
  const handleSort = (): void => {
    if (sortable && column) {
      column.toggleSorting(column.getIsSorted() === 'asc');
    }
  };

  return (
    <Button
      className={cn(
        'font-semibold text-[13px] md:text-[14px] font-inter',
        'hover:bg-slate-100 dark:hover:bg-slate-800',
        'transition-colors duration-200',
        colorClass
      )}
      variant='ghost'
      onClick={handleSort}
    >
      {Icon && <Icon className='mr-1.5 h-4 w-4 opacity-70' />}
      {label}
      {sortable && <ArrowUpDown className='ml-1.5 h-3.5 w-3.5 opacity-50' />}
    </Button>
  );
};

/* ================================ */
/*           Cell Components        */
/* ================================ */

interface IdCellProps {
  value: string;
}

export const IdCell = ({ value }: IdCellProps): JSX.Element => (
  <span className='px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[12px]'>
    {value?.substring(0, 7) ?? '-'}
  </span>
);

interface TextCellProps {
  value: string | undefined;
  className?: string;
}

export const TextCell = ({ value, className }: TextCellProps): JSX.Element => (
  <span className={cn('text-slate-700 dark:text-slate-300', className)}>
    {value ?? '-'}
  </span>
);

interface NameCellProps {
  value: string | undefined;
}

export const NameCell = ({ value }: NameCellProps): JSX.Element => (
  <span className='font-medium text-slate-800 dark:text-slate-200'>
    {value ?? '-'}
  </span>
);

interface UpdatedByCellProps {
  firstNames: string | undefined;
  lastNames: string | undefined;
  getInitialFullNames: (params: { firstNames: string; lastNames: string }) => string;
}

export const UpdatedByCell = ({
  firstNames,
  lastNames,
  getInitialFullNames,
}: UpdatedByCellProps): JSX.Element => {
  const fullName =
    firstNames && lastNames
      ? getInitialFullNames({ firstNames: firstNames ?? '', lastNames: lastNames ?? '' })
      : '-';

  return (
    <span className='px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-[13px] font-medium'>
      {fullName}
    </span>
  );
};

/* ================================ */
/*         Action Cell              */
/* ================================ */

interface ActionCellProps {
  id: string;
  value: string;
  children: React.ReactNode;
}

export const ActionCell = ({ id, value, children }: ActionCellProps): JSX.Element => {
  if (value === '-' || !id) {
    return <span>-</span>;
  }
  return <>{children}</>;
};
