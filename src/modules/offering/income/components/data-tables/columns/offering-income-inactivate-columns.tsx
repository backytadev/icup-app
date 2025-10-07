/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState } from 'react';

import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

import { OfferingIncomeInfoCard } from '@/modules/offering/income/components/cards/info/OfferingIncomeInfoCard';
import { OfferingIncomeInactivateCard } from '@/modules/offering/income/components/cards/inactivate/OfferingIncomeInactivateCard';

import { type OfferingIncomeColumns } from '@/modules/offering/income/interfaces/offering-income-columns.interface';
import { OfferingIncomeCreationSubTypeNames } from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';

import { Button } from '@/shared/components/ui/button';

import { MemberType } from '@/modules/offering/income/enums/member-type.enum';
import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';
import { filterByZoneOrLeader } from '@/modules/offering/income/helpers/filter-by-preacher-supervisor';

import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';

export const offeringIncomeInactivateColumns: Array<ColumnDef<OfferingIncomeColumns, any>> = [
  {
    id: 'id',
    accessorKey: 'id',
    cell: (info) => {
      const id = info.getValue();
      return id.substring(0, 7);
    },
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          ID
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'subType',
    accessorKey: 'subType',
    cell: (info) => {
      const { type, subType } = info.row.original;

      return `${type}  ${subType === '-' ? '' : `- ${subType}`}`;
    },
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Tipo/Subtipo
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },

  {
    id: 'category',
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Categoría
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
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

      const belongingMap = {
        [OfferingIncomeCreationSubTypeNames.family_group]: (
          <div>
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-auto text-slate-500'>
              <div className='flex items-center justify-center gap-2'>
                <h4 className='text-xs font-semibold italic text-sky-500'>
                  <span className='text-sm dark:text-white text-black  font-normal not-italic'>
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
        [OfferingIncomeCreationSubTypeNames.church_ground]: memberType
          ? {
              [MemberType.Pastor]: `${pastor?.firstNames} ${pastor?.lastNames}`,
              [MemberType.Copastor]: `${copastor?.firstNames} ${copastor?.lastNames}`,
              [MemberType.Supervisor]: `${supervisor?.firstNames} ${supervisor?.lastNames}`,
              [MemberType.Preacher]: `${preacher?.firstNames} ${preacher?.lastNames}`,
              [MemberType.Disciple]: `${disciple?.firstNames} ${disciple?.lastNames}`,
              [MemberType.ExternalDonor]: `${externalDonor?.firstNames} ${externalDonor?.lastNames}`,
            }[memberType] // access the value before the member type computed properties
          : church?.abbreviatedChurchName,
        [OfferingIncomeCreationSubTypeNames.special]: {
          [MemberType.Pastor]: `${pastor?.firstNames} ${pastor?.lastNames}`,
          [MemberType.Copastor]: `${copastor?.firstNames} ${copastor?.lastNames}`,
          [MemberType.Supervisor]: `${supervisor?.firstNames} ${supervisor?.lastNames}`,
          [MemberType.Preacher]: `${preacher?.firstNames} ${preacher?.lastNames}`,
          [MemberType.Disciple]: `${disciple?.firstNames} ${disciple?.lastNames}`,
          [MemberType.ExternalDonor]: `${externalDonor?.firstNames} ${externalDonor?.lastNames}`,
        }[memberType!],
      };

      return belongingMap[subType!] || church?.abbreviatedChurchName || 'Desconocido';
    },
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Pertenencia
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'amountWithCurrency',
    accessorKey: 'amount',
    cell: (info) => {
      const amount = info.getValue();
      const currency = info.row.original.currency;
      const entry = Object.entries(CurrencyTypeNames).find(([key]) => key === currency);
      const currencyLabel = entry ? entry[1] : 'Moneda desconocida';

      return `${amount} ${currencyLabel}`;
    },
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Monto
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'date',
    accessorKey: 'date',
    cell: (info) => {
      const date = info.getValue();
      const adjustedDate = date ? date : null;
      return formatDateToLimaDayMonthYear(adjustedDate);
    },
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Fecha
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'copastorOrPreacher',
    header: 'Copastor / Predicador',
    accessorFn: (row) => row.zone?.zoneName || row.familyGroup?.familyGroupName || '—',
    filterFn: filterByZoneOrLeader,
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    id: 'showInfo',
    accessorKey: 'id',
    cell: (info) => {
      const id = info.row.original.id;
      return info.getValue() === '-' ? '-' : <OfferingIncomeInfoCard idRow={id} />;
    },
    header: () => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px] text-blue-500 hover:text-blue-500'
          variant='ghost'
        >
          Info
        </Button>
      );
    },
  },
  {
    id: 'inactivateRecord',
    accessorKey: 'id',
    cell: (info) => {
      const id = info.row.original.id;
      return info.getValue() === '-' ? '-' : <OfferingIncomeInactivateCard id={id} />;
    },
    header: () => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px] text-red-500 hover:text-red-500'
          variant='ghost'
        >
          Inactivar
        </Button>
      );
    },
  },
];
