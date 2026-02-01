import { Hash, Building2, Phone, MapPin, Map, Info, Pencil, Power, UserPen } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  ColumnHeader,
  IdCell,
  TextCell,
  NameCell,
  UpdatedByCell,
  ActionCell,
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
      label='Actualizado por'
      icon={UserPen}
      colorClass='text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300'
    />
  ),
};

//* Action columns
const infoActionColumn: ColumnDef<MinistryColumns, any> = {
  id: 'showInfo',
  accessorKey: 'id',
  cell: (info) => (
    <ActionCell id={info.row.original.id} value={info.getValue()}>
      <MinistryInfoCard idRow={info.row.original.id} />
    </ActionCell>
  ),
  header: () => (
    <ColumnHeader
      label='Info'
      icon={Info}
      sortable={false}
      colorClass='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
    />
  ),
};

const updateActionColumn: ColumnDef<MinistryColumns, any> = {
  id: 'editInfo',
  accessorKey: 'id',
  cell: (info) => (
    <ActionCell id={info.row.original.id} value={info.getValue()}>
      <MinistryUpdateCard idRow={info.row.original.id} />
    </ActionCell>
  ),
  header: () => (
    <ColumnHeader
      label='Actualizar'
      icon={Pencil}
      sortable={false}
      colorClass='text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300'
    />
  ),
};

const inactivateActionColumn: ColumnDef<MinistryColumns, any> = {
  id: 'inactivateRecord',
  accessorKey: 'id',
  cell: (info) => (
    <ActionCell id={info.row.original.id} value={info.getValue()}>
      <MinistryInactivateCard idRow={info.row.original.id} />
    </ActionCell>
  ),
  header: () => (
    <ColumnHeader
      label='Inactivar'
      icon={Power}
      sortable={false}
      colorClass='text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
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
export const ministryInfoColumns: Array<ColumnDef<MinistryColumns, any>> = [
  ...baseColumns,
  updatedByColumn,
  infoActionColumn,
];

export const ministryUpdateColumns: Array<ColumnDef<MinistryColumns, any>> = [
  ...baseColumns,
  infoActionColumn,
  updateActionColumn,
];

export const ministryInactivateColumns: Array<ColumnDef<MinistryColumns, any>> = [
  ...baseColumns,
  infoActionColumn,
  inactivateActionColumn,
];
