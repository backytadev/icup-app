import { Hash, User, Calendar, UserPen, Settings } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  ColumnHeader,
  IdCell,
  TextCell,
  NameCell,
  UpdatedByCell,
} from '@/shared/components/data-table';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';

import { type PreacherColumns } from '@/modules/preacher/types';
import {
  PreacherInfoCard,
  PreacherUpdateCard,
  PreacherInactivateCard,
} from '@/modules/preacher/components';

//* Base columns
const idColumn: ColumnDef<PreacherColumns, any> = {
  id: 'id',
  accessorKey: 'id',
  cell: (info) => <IdCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='ID' icon={Hash} />,
};

const firstNamesColumn: ColumnDef<PreacherColumns, any> = {
  id: 'firstNames',
  accessorKey: 'member.firstNames',
  cell: (info) => <NameCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Nombres' icon={User} />,
};

const lastNamesColumn: ColumnDef<PreacherColumns, any> = {
  id: 'lastNames',
  accessorKey: 'member.lastNames',
  cell: (info) => <NameCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Apellidos' icon={User} />,
};

const genderColumn: ColumnDef<PreacherColumns, any> = {
  id: 'gender',
  accessorKey: 'member.gender',
  cell: (info) => {
    const gender = info.getValue();
    return gender === 'male' ? 'M' : 'F';
  },
  header: ({ column }) => <ColumnHeader column={column} label='Género' icon={User} />,
};

const birthDateColumn: ColumnDef<PreacherColumns, any> = {
  id: 'birthDate',
  accessorKey: 'member.birthDate',
  cell: (info) => (
    <TextCell value={info.getValue() ? formatDateToLimaDayMonthYear(info.getValue()) : '-'} />
  ),
  header: ({ column }) => (
    <ColumnHeader column={column} label='F. Nacimiento' icon={Calendar} />
  ),
};

const updatedByColumn: ColumnDef<PreacherColumns, any> = {
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
const actionsColumn: ColumnDef<PreacherColumns, any> = {
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
        <PreacherInfoCard idRow={id} />
        <PreacherUpdateCard idRow={id} />
        <PreacherInactivateCard idRow={id} />
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
const baseColumns: Array<ColumnDef<PreacherColumns, any>> = [
  idColumn,
  firstNamesColumn,
  lastNamesColumn,
  genderColumn,
  birthDateColumn,
];

//* Unified columns export
export const preacherUnifiedColumns: Array<ColumnDef<PreacherColumns, any>> = [
  ...baseColumns,
  updatedByColumn,
  actionsColumn,
];
