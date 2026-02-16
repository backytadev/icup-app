import { Hash, Layers, DollarSign, Calendar, UserPen, Settings } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  ColumnHeader,
  IdCell,
  TextCell,
  UpdatedByCell,
} from '@/shared/components/data-table';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';
import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';

import { type OfferingExpenseColumns } from '@/modules/offering/expense/interfaces/offering-expense-columns.interface';

import {
  OfferingExpenseInfoCard,
  OfferingExpenseUpdateCard,
  OfferingExpenseInactivateCard,
} from '@/modules/offering/expense/components';

//* Currency type names map for O(1) lookups
const currencyTypeNamesMap = new Map(Object.entries(CurrencyTypeNames));

//* Base columns
const idColumn: ColumnDef<OfferingExpenseColumns, any> = {
  id: 'id',
  accessorKey: 'id',
  cell: (info) => <IdCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='ID' icon={Hash} />,
};

const typeWithSubTypeColumn: ColumnDef<OfferingExpenseColumns, any> = {
  id: 'type',
  accessorKey: 'type',
  cell: (info) => {
    const { type, subType } = info.row.original;
    return <TextCell value={`${type}  ${subType === '-' ? '' : `- ${subType}`}`} />;
  },
  header: ({ column }) => (
    <ColumnHeader column={column} label='Tipo/Subtipo' icon={Layers} />
  ),
};

const amountWithCurrencyColumn: ColumnDef<OfferingExpenseColumns, any> = {
  id: 'amountWithCurrency',
  accessorKey: 'amount',
  cell: (info) => {
    const amount = info.getValue();
    const currency = info.row.original.currency;
    const currencyLabel = currencyTypeNamesMap.get(currency ?? '') ?? 'Moneda desconocida';
    return <TextCell value={`${amount} ${currencyLabel}`} />;
  },
  header: ({ column }) => (
    <ColumnHeader column={column} label='Monto' icon={DollarSign} />
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

const updatedByColumn: ColumnDef<OfferingExpenseColumns, any> = {
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
        <OfferingExpenseInactivateCard id={id} />
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

//* Unified columns export (complete table with actions)
export const offeringExpenseUnifiedColumns: Array<ColumnDef<OfferingExpenseColumns, any>> = [
  idColumn,
  typeWithSubTypeColumn,
  amountWithCurrencyColumn,
  dateColumn,
  updatedByColumn,
  actionsColumn,
];
