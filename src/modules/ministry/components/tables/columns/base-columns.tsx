import { Hash, Building2, Phone, MapPin, Map, UserPen, Settings } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  ColumnHeader,
  IdCell,
  TextCell,
  NameCell,
  UpdatedByCell,
} from '@/shared/components/data-table';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import { type MinistryColumns } from '@/modules/ministry/types';
import { MinistryInfoCard, MinistryUpdateCard, MinistryInactivateCard } from '@/modules/ministry/components';

//* Base columns
const idColumn: ColumnDef<MinistryColumns, any> = {
  id: 'id',
  accessorKey: 'id',
  cell: (info) => <IdCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='ID' icon={Hash} />,
};

const ministryTypeColumn: ColumnDef<MinistryColumns, any> = {
  id: 'ministryType',
  accessorKey: 'ministryType',
  cell: (info) => <NameCell value={info.getValue()} />,
  header: ({ column }) => (
    <ColumnHeader column={column} label='Ministerio' icon={Building2} />
  ),
};

const customMinistryNameColumn: ColumnDef<MinistryColumns, any> = {
  id: 'customMinistryName',
  accessorKey: 'customMinistryName',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Nombre' icon={Phone} />,
};

const districtColumn: ColumnDef<MinistryColumns, any> = {
  id: 'district',
  accessorKey: 'district',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Distrito' icon={MapPin} />,
};

const urbanSectorColumn: ColumnDef<MinistryColumns, any> = {
  id: 'urbanSector',
  accessorKey: 'urbanSector',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='Sector Urbano' icon={Map} />,
};

const updatedByColumn: ColumnDef<MinistryColumns, any> = {
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
const actionsColumn: ColumnDef<MinistryColumns, any> = {
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
        <MinistryInfoCard idRow={id} />
        <MinistryUpdateCard idRow={id} />
        <MinistryInactivateCard idRow={id} />
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
const baseColumns: Array<ColumnDef<MinistryColumns, any>> = [
  idColumn,
  ministryTypeColumn,
  customMinistryNameColumn,
  districtColumn,
  urbanSectorColumn,
];

//* Configuration columns
export const ministryUnifiedColumns: Array<ColumnDef<MinistryColumns, any>> = [
  ...baseColumns,
  updatedByColumn,
  actionsColumn,
];
