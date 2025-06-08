import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button';

type DataByType = {
  offeringType: string;
  offeringSubType: string | null;
  amountPEN: number;
  amountUSD: number;
  amountEUR: number;
};

export const columns: Array<ColumnDef<DataByType, any>> = [
  {
    id: 'offeringType',
    accessorKey: 'offeringType',
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Tipo
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'offeringSubType',
    accessorKey: 'offeringSubType',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('offeringSubType')}</div>,
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Sub-Tipo
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'amountPEN',
    accessorKey: 'amountPEN',
    cell: (info) => {
      const amount = info.getValue() as number;
      const value = amount.toFixed(2);
      return value;
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
          Total PEN
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'amountUSD',
    accessorKey: 'amountUSD',
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Total USD
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'amountEUR',
    accessorKey: 'amountEUR',
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[14px] md:text-[14px]'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Total EUR
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
];
