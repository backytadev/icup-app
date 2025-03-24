/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { ArrowUpDown } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import { OfferingIncomeInfoCard } from '@/modules/offering/income/components/cards/info/OfferingIncomeInfoCard';
import { OfferingIncomeUpdateCard } from '@/modules/offering/income/components/cards/update/OfferingIncomeUpdateCard';

import { OfferingIncomeCreationSubTypeNames } from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import { OfferingIncomeCurrencyExchangeCard } from '@/modules/offering/income/components/cards/update/OfferingIncomeCurrencyExchangeCard';

import { MemberType } from '@/modules/offering/income/enums/member-type.enum';

import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';
import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';
import { type OfferingIncomeColumns } from '@/modules/offering/income/interfaces/offering-income-columns.interface';

import { Button } from '@/shared/components/ui/button';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

export const offeringIncomeUpdateColumns: Array<ColumnDef<OfferingIncomeColumns, any>> = [
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

      const belongingMap = {
        [OfferingIncomeCreationSubTypeNames.family_group]: (
          <>
            <span>{familyGroup?.familyGroupName}</span>
            <p className='text-xs italic dark:text-slate-400 text-slate-500'>{`Pred: ${getInitialFullNames({ firstNames: familyGroup?.preacherFirstNames ?? '', lastNames: familyGroup?.preacherLastNames ?? '' })}`}</p>
          </>
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
    id: 'editInfo',
    accessorKey: 'id',
    cell: (info) => {
      const id = info.row.original.id;
      return info.getValue() === '-' ? '-' : <OfferingIncomeUpdateCard idRow={id} />;
    },
    header: () => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px] text-orange-500 hover:text-orange-500'
          variant='ghost'
        >
          Actualizar
        </Button>
      );
    },
  },
  {
    id: 'currencyExchange',
    accessorKey: 'id',
    cell: (info) => {
      const id = info.row.original.id;
      return info.getValue() === '-' ? '-' : <OfferingIncomeCurrencyExchangeCard idRow={id} />;
    },
    header: () => {
      return (
        <Button
          className='font-bold text-[13px] md:text-[14px] text-teal-500 hover:text-teal-500'
          variant='ghost'
        >
          Cambio
        </Button>
      );
    },
  },
];
