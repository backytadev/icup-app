import { useQuery, type UseQueryResult, type QueryKey } from '@tanstack/react-query';

interface UseDashboardQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  churchId: string | undefined;
  enabled?: boolean;
}

interface UseDashboardQueryReturn<TData> {
  data: TData | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isEmpty: boolean;
  refetch: UseQueryResult<TData>['refetch'];
}

export function useDashboardQuery<TData>({
  queryKey,
  queryFn,
  churchId,
  enabled = true,
}: UseDashboardQueryOptions<TData>): UseDashboardQueryReturn<TData> {
  const query = useQuery({
    queryKey,
    queryFn,
    retry: false,
    enabled: enabled && !!churchId,
  });

  const isEmpty = (() => {
    if (!query.data) return true;
    if (Array.isArray(query.data)) return query.data.length === 0;
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
