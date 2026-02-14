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
          className='font-bold text-[11px] md:text-[12px] px-1'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Tipo
          <ArrowUpDown className='ml-1 h-3 w-3' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='text-[11px] md:text-[12px] px-1'>{row.getValue('offeringType')}</div>,
  },
  {
    id: 'offeringSubType',
    accessorKey: 'offeringSubType',
    cell: ({ row }) => <div className='capitalize text-[11px] md:text-[12px] px-1'>{row.getValue('offeringSubType')}</div>,
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[11px] md:text-[12px] px-1'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Sub-Tipo
          <ArrowUpDown className='ml-1 h-3 w-3' />
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
      return <div className='text-[11px] md:text-[12px] px-1'>{value}</div>;
    },
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[11px] md:text-[12px] px-1'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          PEN
          <ArrowUpDown className='ml-1 h-3 w-3' />
        </Button>
      );
    },
  },
  {
    id: 'amountUSD',
    accessorKey: 'amountUSD',
    cell: (info) => {
      const amount = info.getValue() as number;
      const value = amount.toFixed(2);
      return <div className='text-[11px] md:text-[12px] px-1'>{value}</div>;
    },
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[11px] md:text-[12px] px-1'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          USD
          <ArrowUpDown className='ml-1 h-3 w-3' />
        </Button>
      );
    },
  },
  {
    id: 'amountEUR',
    accessorKey: 'amountEUR',
    cell: (info) => {
      const amount = info.getValue() as number;
      const value = amount.toFixed(2);
      return <div className='text-[11px] md:text-[12px] px-1'>{value}</div>;
    },
    header: ({ column }) => {
      return (
        <Button
          className='font-bold text-[11px] md:text-[12px] px-1'
          variant='ghost'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          EUR
          <ArrowUpDown className='ml-1 h-3 w-3' />
        </Button>
      );
    },
  },
];
