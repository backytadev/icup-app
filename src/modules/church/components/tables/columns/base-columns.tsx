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
      label='Actualizado por'
      icon={UserPen}
      colorClass='text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300'
    />
  ),
};

//* Action columns
const infoActionColumn: ColumnDef<ChurchColumns, any> = {
  id: 'showInfo',
  accessorKey: 'id',
  cell: (info) => (
    <ActionCell id={info.row.original.id} value={info.getValue()}>
      <ChurchInfoCard idRow={info.row.original.id} />
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

const updateActionColumn: ColumnDef<ChurchColumns, any> = {
  id: 'editInfo',
  accessorKey: 'id',
  cell: (info) => (
    <ActionCell id={info.row.original.id} value={info.getValue()}>
      <ChurchUpdateCard idRow={info.row.original.id} />
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

const inactivateActionColumn: ColumnDef<ChurchColumns, any> = {
  id: 'inactivateRecord',
  accessorKey: 'id',
  cell: (info) => (
    <ActionCell id={info.row.original.id} value={info.getValue()}>
      <ChurchInactivateCard idRow={info.row.original.id} />
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
const baseColumns: Array<ColumnDef<ChurchColumns, any>> = [
  idColumn,
  abbreviatedNameColumn,
  phoneColumn,
  districtColumn,
  urbanSectorColumn,
];


//* Configuration columns
export const churchInfoColumns: Array<ColumnDef<ChurchColumns, any>> = [
  ...baseColumns,
  updatedByColumn,
  infoActionColumn,
];

export const churchUpdateColumns: Array<ColumnDef<ChurchColumns, any>> = [
  ...baseColumns,
  infoActionColumn,
  updateActionColumn,
];

export const churchInactivateColumns: Array<ColumnDef<ChurchColumns, any>> = [
  ...baseColumns,
  infoActionColumn,
  inactivateActionColumn,
];
