import { useQuery, type UseQueryResult, type QueryKey } from '@tanstack/react-query';

interface UseMetricsQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  activeChurchId: string | null | undefined;
  enabled?: boolean;
}

interface UseMetricsQueryReturn<TData> {
  data: TData | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isEmpty: boolean;
  refetch: UseQueryResult<TData>['refetch'];
}

export function useMetricsQuery<TData>({
  queryKey,
  queryFn,
  activeChurchId,
  enabled = true,
}: UseMetricsQueryOptions<TData>): UseMetricsQueryReturn<TData> {
  const query = useQuery({
    queryKey,
    queryFn,
    retry: false,
    enabled: enabled && !!activeChurchId,
  });

  const isEmpty = (() => {
    if (!query.data) return true;
    if (Array.isArray(query.data)) return query.data.length === 0;
    if (typeof query.data === 'object') return Object.keys(query.data).length === 0;
    return false;
  })();

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isEmpty: !query.isLoading && !query.isFetching && isEmpty,
    refetch: query.refetch,
  };
}
