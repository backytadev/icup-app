/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Hash, Layers, Tag, DollarSign, Banknote, Calendar, Settings } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  ColumnHeader,
  IdCell,
  TextCell,
} from '@/shared/components/data-table';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';
import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';

import { type OfferingExpenseColumns } from '@/modules/offering/expense/interfaces/offering-expense-columns.interface';

import { OfferingExpenseInfoCard } from '@/modules/offering/expense/components/cards/info/OfferingExpenseInfoCard';
import { OfferingExpenseUpdateCard } from '@/modules/offering/expense/components/cards/update/OfferingExpenseUpdateCard';
import { OfferingExpenseInactivateCard } from '@/modules/offering/expense/components/cards/inactivate/OfferingExpenseInactivateCard';

//* Currency type names map for O(1) lookups
const currencyTypeNamesMap = new Map(Object.entries(CurrencyTypeNames));

//* Base columns
const idColumn: ColumnDef<OfferingExpenseColumns, any> = {
  id: 'id',
  accessorKey: 'id',
  cell: (info) => <IdCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='ID' icon={Hash} />,
};

const typeColumn: ColumnDef<OfferingExpenseColumns, any> = {
  id: 'type',
  accessorKey: 'type',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => (
    <ColumnHeader column={column} label='Tipo' icon={Layers} />
  ),
};

const subTypeColumn: ColumnDef<OfferingExpenseColumns, any> = {
  id: 'subType',
  accessorKey: 'subType',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => (
    <ColumnHeader column={column} label='Sub-tipo' icon={Tag} />
  ),
};

const amountColumn: ColumnDef<OfferingExpenseColumns, any> = {
  id: 'amount',
  accessorKey: 'amount',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => (
    <ColumnHeader column={column} label='Monto' icon={DollarSign} />
  ),
};

const currencyColumn: ColumnDef<OfferingExpenseColumns, any> = {
  id: 'currency',
  accessorKey: 'currency',
  cell: (info) => {
    const currency = info.getValue();
    const currencyLabel = currencyTypeNamesMap.get(currency ?? '') ?? 'Moneda desconocida';
    return <TextCell value={currencyLabel} />;
  },
  header: ({ column }) => (
    <ColumnHeader column={column} label='Divisa' icon={Banknote} />
  ),
};

const dateColumn: ColumnDef<OfferingExpenseColumns, any> = {
  id: 'date',
  accessorKey: 'date',
  cell: (info) => {
    const date = info.getValue();
    const adjustedDate = date ? date : null;
    return <TextCell value={formatDateToLimaDayMonthYear(adjustedDate)} />;
  },
  header: ({ column }) => (
    <ColumnHeader column={column} label='Fecha' icon={Calendar} />
  ),
};

//* Unified Actions column
const actionsColumn: ColumnDef<OfferingExpenseColumns, any> = {
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
        <OfferingExpenseInfoCard idRow={id} />
        <OfferingExpenseUpdateCard idRow={id} />
        <OfferingExpenseInactivateCard idRow={id} />
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
const baseColumns: Array<ColumnDef<OfferingExpenseColumns, any>> = [
  idColumn,
  typeColumn,
  subTypeColumn,
  amountColumn,
  currencyColumn,
  dateColumn,
];

//* Unified columns export
export const offeringExpenseUnifiedColumns: Array<ColumnDef<OfferingExpenseColumns, any>> = [
  ...baseColumns,
  actionsColumn,
];
