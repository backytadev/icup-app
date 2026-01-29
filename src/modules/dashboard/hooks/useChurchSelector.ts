import { useEffect, useState, useCallback } from 'react';

import { type z } from 'zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { dashBoardSearchFormSchema } from '@/modules/dashboard/validations/dashboard-search-form-schema';

import type { ChurchResponse } from '@/modules/church/types';

type DashboardFormData = z.infer<typeof dashBoardSearchFormSchema>;

interface SearchParams {
  churchId?: string;
}

interface UseChurchSelectorOptions {
  queryKey: string;
}

interface UseChurchSelectorReturn {
  form: UseFormReturn<DashboardFormData>;
  searchParams: SearchParams | undefined;
  isPopoverOpen: boolean;
  setIsPopoverOpen: (open: boolean) => void;
  churchesQuery: UseQueryResult<ChurchResponse[], Error>;
  selectedChurchCode: string;
  handleChurchSelect: (churchId: string) => void;
}

export const useChurchSelector = ({
  queryKey,
}: UseChurchSelectorOptions): UseChurchSelectorReturn => {
  const [searchParams, setSearchParams] = useState<SearchParams | undefined>(undefined);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const form = useForm<DashboardFormData>({
    resolver: zodResolver(dashBoardSearchFormSchema),
    mode: 'onChange',
    defaultValues: {
      churchId: '',
    },
  });

  const churchesQuery = useQuery({
    queryKey: [`churches-for-${queryKey}`],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  // Set default church on load
  useEffect(() => {
    if (churchesQuery.data && churchesQuery.data.length > 0) {
      const defaultChurchId = churchesQuery.data[0]?.id;
      if (defaultChurchId) {
        setSearchParams({ churchId: defaultChurchId });
        form.setValue('churchId', defaultChurchId);
      }
    }
  }, [churchesQuery.data, form]);

  const handleChurchSelect = useCallback(
    (churchId: string) => {
      form.setValue('churchId', churchId);
      setSearchParams({ churchId });
      setIsPopoverOpen(false);
    },
    [form]
  );

  // Get selected church code for display
  const selectedChurchCode = (() => {
    const churchId = form.getValues('churchId') ?? searchParams?.churchId;
    const church = churchesQuery.data?.find((c) => c.id === churchId);
    if (church) {
      return church.churchCode.split('-').slice(0, 2).join('-');
    }
    return 'ICUP-CENTRAL';
  })();

  return {
    form,
    searchParams,
    isPopoverOpen,
    setIsPopoverOpen,
    churchesQuery,
    selectedChurchCode,
    handleChurchSelect,
  };
};
