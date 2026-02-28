import { Hash, Globe, Building2, MapPin, Map, UserPen, Settings } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  ColumnHeader,
  IdCell,
  TextCell,
  NameCell,
  UpdatedByCell,
} from '@/shared/components/data-table';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import { type ZoneColumns } from '@/modules/zone/types';
import {
  ZoneInfoCard,
  ZoneUpdateCard,
  ZoneSupervisorUpdateCard,
  ZoneInactivateCard,
} from '@/modules/zone/components';

//* Base columns
const idColumn: ColumnDef<ZoneColumns, any> = {
  id: 'id',
  accessorKey: 'id',
  cell: (info) => <IdCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='ID' icon={Hash} />,
};

const zoneNameColumn: ColumnDef<ZoneColumns, any> = {
  id: 'zoneName',
  accessorKey: 'zoneName',
  cell: (info) => <NameCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Zona' icon={Globe} />,
};

const departmentColumn: ColumnDef<ZoneColumns, any> = {
  id: 'department',
  accessorKey: 'department',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Departamento' icon={Building2} />,
};

const provinceColumn: ColumnDef<ZoneColumns, any> = {
  id: 'province',
  accessorKey: 'province',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Provincia' icon={MapPin} />,
};

const districtColumn: ColumnDef<ZoneColumns, any> = {
  id: 'district',
  accessorKey: 'district',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Distrito' icon={Map} />,
};

const updatedByColumn: ColumnDef<ZoneColumns, any> = {
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

//* Unified Actions column - combines Info, Update, Supervisor and Inactivate actions
const actionsColumn: ColumnDef<ZoneColumns, any> = {
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
        <ZoneInfoCard idRow={id} />
        <ZoneUpdateCard idRow={id} />
        <ZoneSupervisorUpdateCard idRow={id} />
        <ZoneInactivateCard idRow={id} />
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
const baseColumns: Array<ColumnDef<ZoneColumns, any>> = [
  idColumn,
  zoneNameColumn,
  departmentColumn,
  provinceColumn,
  districtColumn,
];

//* Configuration columns
export const zoneUnifiedColumns: Array<ColumnDef<ZoneColumns, any>> = [
  ...baseColumns,
  updatedByColumn,
  actionsColumn,
];
