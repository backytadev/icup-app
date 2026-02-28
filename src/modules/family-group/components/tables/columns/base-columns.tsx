import { Hash, Home, BookKey, MapPin, Map, UserPen, Settings } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  ColumnHeader,
  IdCell,
  TextCell,
  NameCell,
  UpdatedByCell,
} from '@/shared/components/data-table';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import { type FamilyGroupColumns } from '@/modules/family-group/types';
import {
  FamilyGroupInfoCard,
  FamilyGroupUpdateCard,
  FamilyGroupPreacherUpdateCard,
  FamilyGroupInactivateCard,
} from '@/modules/family-group/components';

//* Base columns
const idColumn: ColumnDef<FamilyGroupColumns, any> = {
  id: 'id',
  accessorKey: 'id',
  cell: (info) => <IdCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='ID' icon={Hash} />,
};

const familyGroupNameColumn: ColumnDef<FamilyGroupColumns, any> = {
  id: 'familyGroupName',
  accessorKey: 'familyGroupName',
  cell: (info) => <NameCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Grupo Familiar' icon={Home} />,
};

const familyGroupCodeColumn: ColumnDef<FamilyGroupColumns, any> = {
  id: 'familyGroupCode',
  accessorKey: 'familyGroupCode',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Código' icon={BookKey} />,
};

const districtColumn: ColumnDef<FamilyGroupColumns, any> = {
  id: 'district',
  accessorKey: 'district',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Distrito' icon={MapPin} />,
};

const urbanSectorColumn: ColumnDef<FamilyGroupColumns, any> = {
  id: 'urbanSector',
  accessorKey: 'urbanSector',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Sector Urbano' icon={Map} />,
};

const updatedByColumn: ColumnDef<FamilyGroupColumns, any> = {
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

//* Actions column - Info, Update, PreacherUpdate, Inactivate
const actionsColumn: ColumnDef<FamilyGroupColumns, any> = {
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
        <FamilyGroupInfoCard idRow={id} />
        <FamilyGroupUpdateCard idRow={id} />
        <FamilyGroupPreacherUpdateCard idRow={id} />
        <FamilyGroupInactivateCard idRow={id} />
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
const baseColumns: Array<ColumnDef<FamilyGroupColumns, any>> = [
  idColumn,
  familyGroupNameColumn,
  familyGroupCodeColumn,
  districtColumn,
  urbanSectorColumn,
];

//* Unified columns
export const familyGroupUnifiedColumns: Array<ColumnDef<FamilyGroupColumns, any>> = [
  ...baseColumns,
  updatedByColumn,
  actionsColumn,
];
