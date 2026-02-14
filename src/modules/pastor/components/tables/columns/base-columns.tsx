import { Hash, User, UserRound, Cake, UserPen, Settings } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  ColumnHeader,
  IdCell,
  TextCell,
  NameCell,
  UpdatedByCell,
} from '@/shared/components/data-table';

import {
  PastorInfoCard,
  PastorUpdateCard,
  PastorInactivateCard,
} from '@/modules/pastor/components';

import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { type PastorResponse } from '@/modules/pastor/types/pastor-response.interface';
import { FaVenusMars } from 'react-icons/fa';

//* Base Columns
const idColumn: ColumnDef<PastorResponse, any> = {
  id: 'id',
  accessorKey: 'id',
  cell: (info) => <IdCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='ID' icon={Hash} />,
};

const firstNamesColumn: ColumnDef<PastorResponse, any> = {
  id: 'firstNames',
  accessorKey: 'member.firstNames',
  cell: (info) => <NameCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Nombres' icon={User} />,
};

const lastNamesColumn: ColumnDef<PastorResponse, any> = {
  id: 'lastNames',
  accessorKey: 'member.lastNames',
  cell: (info) => <NameCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Apellidos' icon={UserRound} />,
};

const genderColumn: ColumnDef<PastorResponse, any> = {
  id: 'gender',
  accessorKey: 'member.gender',
  cell: (info) => (info.getValue() === 'male' ? 'M' : 'F'),
  header: ({ column }) => <ColumnHeader column={column} label='Género' icon={FaVenusMars} />,
};

const birthDateColumn: ColumnDef<PastorResponse, any> = {
  id: 'birthDate',
  accessorKey: 'member.birthDate',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Fecha Nac.' icon={Cake} />,
};

const updatedByColumn: ColumnDef<PastorResponse, any> = {
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
const actionsColumn: ColumnDef<PastorResponse, any> = {
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
        <PastorInfoCard idRow={id} />
        <PastorUpdateCard idRow={id} />
        <PastorInactivateCard idRow={id} />
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
const baseColumns: Array<ColumnDef<PastorResponse, any>> = [
  idColumn,
  firstNamesColumn,
  lastNamesColumn,
  genderColumn,
  birthDateColumn,
];

//* Configuration columns
export const pastorUnifiedColumns: Array<ColumnDef<PastorResponse, any>> = [
  ...baseColumns,
  updatedByColumn,
  actionsColumn,
];
