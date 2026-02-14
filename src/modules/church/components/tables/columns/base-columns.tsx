import { Hash, Building2, Phone, MapPin, Map, Settings, UserPen } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  ColumnHeader,
  IdCell,
  TextCell,
  NameCell,
  UpdatedByCell,
} from '@/shared/components/data-table';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import { type ChurchColumns } from '@/modules/church/types';
import { ChurchInfoCard, ChurchUpdateCard, ChurchInactivateCard } from '@/modules/church/components';

//* Base columns
const idColumn: ColumnDef<ChurchColumns, any> = {
  id: 'id',
  accessorKey: 'id',
  cell: (info) => <IdCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='ID' icon={Hash} />,
};

const abbreviatedNameColumn: ColumnDef<ChurchColumns, any> = {
  id: 'abbreviatedChurchName',
  accessorKey: 'abbreviatedChurchName',
  cell: (info) => <NameCell value={info.getValue()} />,
  header: ({ column }) => (
    <ColumnHeader column={column} label='Nombre Abreviado' icon={Building2} />
  ),
};

const phoneColumn: ColumnDef<ChurchColumns, any> = {
  id: 'phoneNumber',
  accessorKey: 'phoneNumber',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Nro. Teléfono' icon={Phone} />,
};

const districtColumn: ColumnDef<ChurchColumns, any> = {
  id: 'district',
  accessorKey: 'district',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Distrito' icon={MapPin} />,
};

const urbanSectorColumn: ColumnDef<ChurchColumns, any> = {
  id: 'urbanSector',
  accessorKey: 'urbanSector',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Sector Urbano' icon={Map} />,
};

const updatedByColumn: ColumnDef<ChurchColumns, any> = {
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

//* Unified Actions column - combines Info, Update and Inactivate actions
const actionsColumn: ColumnDef<ChurchColumns, any> = {
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
        <ChurchInfoCard idRow={id} />
        <ChurchUpdateCard idRow={id} />
        <ChurchInactivateCard idRow={id} />
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
const baseColumns: Array<ColumnDef<ChurchColumns, any>> = [
  idColumn,
  abbreviatedNameColumn,
  phoneColumn,
  districtColumn,
  urbanSectorColumn,
];

export const churchUnifiedColumns: Array<ColumnDef<ChurchColumns, any>> = [
  ...baseColumns,
  updatedByColumn,
  actionsColumn,
];
