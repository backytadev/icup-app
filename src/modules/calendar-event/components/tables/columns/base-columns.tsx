import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Globe, Hash, Lock, Settings, Tag, UserPen } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  ColumnHeader,
  IdCell,
  TextCell,
  UpdatedByCell,
} from '@/shared/components/data-table';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import { type CalendarEventColumns } from '@/modules/calendar-event/types';
import { CalendarEventCategoryNames } from '@/modules/calendar-event/enums/calendar-event-category.enum';
import { CalendarEventStatusNames } from '@/modules/calendar-event/enums/calendar-event-status.enum';
import { CalendarEventInfoCard, CalendarEventUpdateCard, CalendarEventInactivateCard } from '@/modules/calendar-event/components';

//* Base columns
const idColumn: ColumnDef<CalendarEventColumns, any> = {
  id: 'id',
  accessorKey: 'id',
  cell: (info) => <IdCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='ID' icon={Hash} />,
};

const titleColumn: ColumnDef<CalendarEventColumns, any> = {
  id: 'title',
  accessorKey: 'title',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Título' icon={Tag} />,
};

const categoryColumn: ColumnDef<CalendarEventColumns, any> = {
  id: 'category',
  accessorKey: 'category',
  cell: (info) => {
    const category = info.getValue() as string;
    return (
      <TextCell
        value={
          CalendarEventCategoryNames[category as keyof typeof CalendarEventCategoryNames] ??
          category
        }
      />
    );
  },
  header: ({ column }) => <ColumnHeader column={column} label='Categoría' icon={Tag} />,
};

const statusColumn: ColumnDef<CalendarEventColumns, any> = {
  id: 'status',
  accessorKey: 'status',
  cell: (info) => {
    const status = info.getValue() as string;
    return (
      <TextCell
        value={
          CalendarEventStatusNames[status as keyof typeof CalendarEventStatusNames] ?? status
        }
      />
    );
  },
  header: ({ column }) => <ColumnHeader column={column} label='Estado' icon={Tag} />,
};

const startDateColumn: ColumnDef<CalendarEventColumns, any> = {
  id: 'startDate',
  accessorKey: 'startDate',
  cell: (info) => {
    const value = info.getValue() as Date | undefined;
    return (
      <TextCell
        value={value ? format(new Date(value), "dd MMM yyyy HH:mm", { locale: es }) : '-'}
      />
    );
  },
  header: ({ column }) => <ColumnHeader column={column} label='Inicio' icon={Calendar} />,
};

const isPublicColumn: ColumnDef<CalendarEventColumns, any> = {
  id: 'isPublic',
  accessorKey: 'isPublic',
  cell: (info) => {
    const isPublic = info.getValue() as boolean;
    return (
      <div className='flex items-center gap-1'>
        {isPublic ? (
          <Globe className='w-3.5 h-3.5 text-sky-500' />
        ) : (
          <Lock className='w-3.5 h-3.5 text-slate-400' />
        )}
        <span className='text-[13px]'>{isPublic ? 'Público' : 'Privado'}</span>
      </div>
    );
  },
  header: ({ column }) => <ColumnHeader column={column} label='Visibilidad' icon={Globe} />,
};

const updatedByColumn: ColumnDef<CalendarEventColumns, any> = {
  id: 'updatedBy',
  accessorKey: 'updatedBy',
  cell: (info) => (
    <UpdatedByCell
      firstNames={info.getValue()?.firstNames}
      lastNames={info.getValue()?.lastNames}
      getInitialFullNames={getInitialFullNames}
    />
  ),
  header: ({ column }) => (
    <ColumnHeader
      column={column}
      label='Editado por'
      icon={UserPen}
      colorClass='text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300'
    />
  ),
};

//* Unified Actions column
const actionsColumn: ColumnDef<CalendarEventColumns, any> = {
  id: 'actions',
  accessorKey: 'id',
  cell: (info) => {
    const id = info.row.original.id;
    const value = info.getValue();

    if (value === '-' || !id) {
      return <span>-</span>;
    }

    return (
      <div className='flex items-center justify-center gap-1'>
        <CalendarEventInfoCard idRow={id} />
        <CalendarEventUpdateCard idRow={id} />
        <CalendarEventInactivateCard idRow={id} />
      </div>
    );
  },
  header: () => (
    <ColumnHeader
      label='Acciones'
      icon={Settings}
      sortable={false}
      colorClass='text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
    />
  ),
};

//* Aggregate base columns
const baseColumns: Array<ColumnDef<CalendarEventColumns, any>> = [
  idColumn,
  titleColumn,
  categoryColumn,
  statusColumn,
  startDateColumn,
  isPublicColumn,
];

//* Unified columns export
export const eventUnifiedColumns: Array<ColumnDef<CalendarEventColumns, any>> = [
  ...baseColumns,
  updatedByColumn,
  actionsColumn,
];
