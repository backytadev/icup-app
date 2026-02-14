import { Hash, User, UserRound, Settings, UserPen } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { FaVenusMars } from 'react-icons/fa';

import {
  ColumnHeader,
  IdCell,
  NameCell,
  UpdatedByCell,
} from '@/shared/components/data-table';

import {
  UserInfoCard,
  UserUpdateCard,
  UserInactivateCard,
  UserPasswordUpdateCard,
} from '@/modules/user/components';

import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { type UserResponse } from '@/modules/user/types/user-response.interface';
import { type UserRole, UserRoleNames } from '@/modules/user/enums/user-role.enum';

//* Helper function for roles display
function convertRolesToSpanishString(roles: string[]): string {
  return roles.map((role) => UserRoleNames[role as UserRole]).join(' - ');
}

//* Base Columns
const idColumn: ColumnDef<UserResponse, any> = {
  id: 'id',
  accessorKey: 'id',
  cell: (info) => <IdCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='ID' icon={Hash} />,
};

const firstNamesColumn: ColumnDef<UserResponse, any> = {
  id: 'firstNames',
  accessorKey: 'firstNames',
  cell: (info) => <NameCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Nombres' icon={User} />,
};

const lastNamesColumn: ColumnDef<UserResponse, any> = {
  id: 'lastNames',
  accessorKey: 'lastNames',
  cell: (info) => <NameCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Apellidos' icon={UserRound} />,
};

const genderColumn: ColumnDef<UserResponse, any> = {
  id: 'gender',
  accessorKey: 'gender',
  cell: (info) => (info.getValue() === 'male' ? 'M' : 'F'),
  header: ({ column }) => <ColumnHeader column={column} label='Género' icon={FaVenusMars} />,
};

// const emailColumn: ColumnDef<UserResponse, any> = {
//   id: 'email',
//   accessorKey: 'email',
//   cell: (info) => <TextCell value={info.getValue()} />,
//   header: ({ column }) => <ColumnHeader column={column} label='Correo Electrónico' icon={Mail} />,
// };

const rolesColumn: ColumnDef<UserResponse, any> = {
  id: 'roles',
  accessorKey: 'roles',
  cell: (info) => {
    const roles = info.getValue();
    return convertRolesToSpanishString(roles as string[]);
  },
  header: ({ column }) => <ColumnHeader column={column} label='Roles' icon={User} />,
};

const updatedByColumn: ColumnDef<UserResponse, any> = {
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
const actionsColumn: ColumnDef<UserResponse, any> = {
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
        <UserInfoCard idRow={id} />
        <UserUpdateCard idRow={id} />
        <UserPasswordUpdateCard idRow={id} />
        <UserInactivateCard idRow={id} />
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
const baseColumns: Array<ColumnDef<UserResponse, any>> = [
  idColumn,
  firstNamesColumn,
  lastNamesColumn,
  genderColumn,
  // emailColumn,
  rolesColumn,
];

//* Configuration columns
export const userUnifiedColumns: Array<ColumnDef<UserResponse, any>> = [
  ...baseColumns,
  updatedByColumn,
  actionsColumn,
];
