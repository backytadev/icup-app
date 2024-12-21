/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { format, addDays } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import { PastorInfoCard } from '@/modules/pastor/components/cards/info/PastorInfoCard';

import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import { Button } from '@/shared/components/ui/button';
import { type PastorColumns } from '@/modules/pastor/interfaces/pastor-columns.interface';

export const pastorInfoColumns: Array<ColumnDef<PastorColumns, any>> = [
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
    id: 'firstNames',
    accessorKey: 'member.firstNames',
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Nombres
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'lastNames',
    accessorKey: 'member.lastNames',
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Apellidos
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'gender',
    accessorKey: 'member.gender',
    cell: (info) => {
      const gender = info.getValue();
      return gender === 'male' ? 'M' : 'F';
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
          Género
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'birthDate',
    accessorKey: 'member.birthDate',
    cell: (info) => {
      const birthDate = info.getValue();
      const adjustedDate = birthDate ? addDays(birthDate, 1) : null;
      return format(new Date(adjustedDate), 'dd/MM/yyyy');
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
          Fecha Nacimiento
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'updatedBy',
    accessorKey: 'updatedBy',
    cell: (info) => {
      const firstNames = info.getValue()?.firstNames;
      const lastNames = info.getValue()?.lastNames;
      return firstNames && lastNames
        ? getInitialFullNames({ firstNames: firstNames ?? '', lastNames: lastNames ?? '' })
        : '-';
    },
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px] text-orange-500 hover:text-orange-500'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Actualizado por
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
      return info.getValue() === '-' ? '-' : <PastorInfoCard idRow={id} />;
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
];
