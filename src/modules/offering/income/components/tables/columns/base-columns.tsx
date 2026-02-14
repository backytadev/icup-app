import { useState } from 'react';

import { Hash, Layers, Tag, Users, DollarSign, Calendar, Settings, UserPen } from 'lucide-react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  ColumnHeader,
  IdCell,
  TextCell,
  UpdatedByCell,
} from '@/shared/components/data-table';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';

import { MemberType } from '@/modules/offering/income/enums/member-type.enum';
import { OfferingIncomeCreationSubTypeNames } from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';
import { filterByZoneOrLeader } from '@/modules/offering/income/helpers/filter-by-preacher-supervisor';

import { type OfferingIncomeColumns } from '@/modules/offering/income/interfaces/offering-income-columns.interface';

import {
  OfferingIncomeInfoCard,
  OfferingIncomeUpdateCard,
  OfferingIncomeCurrencyExchangeCard,
  OfferingIncomeInactivateCard,
  OfferingIncomeGenerateReceipt as OfferingIncomeGenerateTicket,
} from '@/modules/offering/income/components';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import { Button } from '@/shared/components/ui/button';

//* Currency type names map for O(1) lookups
const currencyTypeNamesMap = new Map(Object.entries(CurrencyTypeNames));

//* Base columns
const idColumn: ColumnDef<OfferingIncomeColumns, any> = {
  id: 'id',
  accessorKey: 'id',
  cell: (info) => <IdCell value={info.getValue()} />,
  header: ({ column }) => <ColumnHeader column={column} label='ID' icon={Hash} />,
};

const subTypeColumn: ColumnDef<OfferingIncomeColumns, any> = {
  id: 'subType',
  accessorKey: 'subType',
  cell: (info) => {
    const { type, subType } = info.row.original;
    return <TextCell value={`${type}  ${subType === '-' ? '' : `- ${subType}`}`} />;
  },
  header: ({ column }) => (
    <ColumnHeader column={column} label='Tipo/Subtipo' icon={Layers} />
  ),
};

const categoryColumn: ColumnDef<OfferingIncomeColumns, any> = {
  id: 'category',
  accessorKey: 'category',
  cell: (info) => <TextCell value={info.getValue()} />,
  header: ({ column }) => (
    <ColumnHeader column={column} label='Categoría' icon={Tag} />
  ),
};

const belongingColumn: ColumnDef<OfferingIncomeColumns, any> = {
  id: 'belonging',
  accessorKey: 'subType',
  cell: (info) => {
    const {
      zone,
      pastor,
      church,
      subType,
      preacher,
      copastor,
      disciple,
      supervisor,
      memberType,
      familyGroup,
      externalDonor,
    } = info.row.original;
    const [isOpen, setIsOpen] = useState(false);

    const belongingMap: Record<string, React.ReactNode> = {
      [OfferingIncomeCreationSubTypeNames.family_group]: (
        <div>
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-auto text-slate-500'>
            <div className='flex items-center justify-center gap-2'>
              <h4 className='text-xs font-semibold italic text-sky-500'>
                <span className='text-sm dark:text-white text-black font-normal not-italic'>
                  {familyGroup?.familyGroupName}
                </span>
              </h4>
              <CollapsibleTrigger asChild>
                <Button variant='ghost' size='sm' className='p-0 w-9 hover:text-slate-500'>
                  {isOpen ? (
                    <ChevronUp className='h-5 w-5' />
                  ) : (
                    <ChevronDown className='h-5 w-5' />
                  )}
                  <span className='sr-only'>Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className='space-y-1 mt-1'>
              <p className='text-xs italic dark:text-slate-400 text-slate-500'>
                {`Código: ${familyGroup?.familyGroupCode ?? ''}`}
              </p>
              <p className='text-xs italic dark:text-slate-400 text-slate-500'>
                {`Predicador: ${getInitialFullNames({ firstNames: familyGroup?.preacherFirstNames ?? '', lastNames: familyGroup?.preacherLastNames ?? '' })}`}
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ),
      [OfferingIncomeCreationSubTypeNames.zonal_evangelism]: zone?.zoneName,
      [OfferingIncomeCreationSubTypeNames.zonal_fasting]: zone?.zoneName,
      [OfferingIncomeCreationSubTypeNames.zonal_vigil]: zone?.zoneName,
    };

    if (subType && belongingMap[subType]) {
      return belongingMap[subType];
    }

    if (
      subType === OfferingIncomeCreationSubTypeNames.church_ground ||
      subType === OfferingIncomeCreationSubTypeNames.special
    ) {
      if (memberType) {
        const memberMap: Record<string, string> = {
          [MemberType.Pastor]: `${pastor?.firstNames} ${pastor?.lastNames}`,
          [MemberType.Copastor]: `${copastor?.firstNames} ${copastor?.lastNames}`,
          [MemberType.Supervisor]: `${supervisor?.firstNames} ${supervisor?.lastNames}`,
          [MemberType.Preacher]: `${preacher?.firstNames} ${preacher?.lastNames}`,
          [MemberType.Disciple]: `${disciple?.firstNames} ${disciple?.lastNames}`,
          [MemberType.ExternalDonor]: `${externalDonor?.firstNames} ${externalDonor?.lastNames}`,
        };
        return memberMap[memberType] ?? church?.abbreviatedChurchName ?? 'Desconocido';
      }
      return church?.abbreviatedChurchName ?? 'Desconocido';
    }

    return church?.abbreviatedChurchName || 'Desconocido';
  },
  header: ({ column }) => (
    <ColumnHeader column={column} label='Pertenencia' icon={Users} />
  ),
};

const amountWithCurrencyColumn: ColumnDef<OfferingIncomeColumns, any> = {
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

const dateColumn: ColumnDef<OfferingIncomeColumns, any> = {
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

const copastorOrPreacherColumn: ColumnDef<OfferingIncomeColumns, any> = {
  id: 'copastorOrPreacher',
  header: 'Copastor / Predicador',
  accessorFn: (row) => row.zone?.zoneName || row.familyGroup?.familyGroupName || '—',
  filterFn: filterByZoneOrLeader,
  enableColumnFilter: true,
  enableHiding: true,
};

const updatedByColumn: ColumnDef<OfferingIncomeColumns, any> = {
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
const actionsColumn: ColumnDef<OfferingIncomeColumns, any> = {
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
        <OfferingIncomeInfoCard idRow={id} />
        <OfferingIncomeUpdateCard idRow={id} />
        <OfferingIncomeCurrencyExchangeCard idRow={id} />
        <OfferingIncomeInactivateCard id={id} />
        <OfferingIncomeGenerateTicket idRow={id} />
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
const baseColumns: Array<ColumnDef<OfferingIncomeColumns, any>> = [
  idColumn,
  subTypeColumn,
  categoryColumn,
  belongingColumn,
  amountWithCurrencyColumn,
  dateColumn,
  copastorOrPreacherColumn,
];

//* Unified columns export
export const offeringIncomeUnifiedColumns: Array<ColumnDef<OfferingIncomeColumns, any>> = [
  ...baseColumns,
  updatedByColumn,
  actionsColumn,
];
