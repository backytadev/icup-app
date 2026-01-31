import {
  useQuery,
  type UseQueryResult,
  type QueryKey,
  type QueryFunction,
} from '@tanstack/react-query';

interface QueryWrapperOptions<TData> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData>;
  enabled?: boolean;
  retry?: boolean | number;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean | 'always';
  refetchInterval?: number | false;
  select?: (data: TData) => TData;
}

export function useQueryWrapper<TData>({
  queryKey,
  queryFn,
  enabled = true,
  retry = false,
  staleTime,
  gcTime,
  refetchOnWindowFocus = true,
  refetchOnMount = true,
  refetchInterval = false,
  select,
}: QueryWrapperOptions<TData>): UseQueryResult<TData, Error> {
  return useQuery<TData, Error>({
    queryKey,
    queryFn,
    enabled,
    retry,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchInterval,
    select,
  });
}

interface SimpleQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData>;
  enabled?: boolean;
}

export function useSimpleQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
}: SimpleQueryOptions<TData>): UseQueryResult<TData, Error> {
  return useQueryWrapper({
    queryKey,
    queryFn,
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

interface ListQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData>;
  enabled?: boolean;
  staleTime?: number;
}

export function useListQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 1000 * 60 * 5, // 5 minutes
}: ListQueryOptions<TData>): UseQueryResult<TData, Error> {
  return useQueryWrapper({
    queryKey,
    queryFn,
    enabled,
    retry: 1,
    staleTime,
    refetchOnWindowFocus: true,
  });
}

interface DetailQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData>;
  enabled?: boolean;
}

export function useDetailQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
}: DetailQueryOptions<TData>): UseQueryResult<TData, Error> {
  return useQueryWrapper({
    queryKey,
    queryFn,
    enabled,
    retry: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnMount: 'always',
  });
}

interface SelectQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData>;
  enabled?: boolean;
}

export function useSelectQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
}: SelectQueryOptions<TData>): UseQueryResult<TData, Error> {
  return useQueryWrapper({
    queryKey,
    queryFn,
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes - select options don't change often
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

interface ManualQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData>;
}

export function useManualQuery<TData>({
  queryKey,
  queryFn,
}: ManualQueryOptions<TData>): UseQueryResult<TData, Error> {
  return useQueryWrapper({
    queryKey,
    queryFn,
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

interface ConditionalListQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData>;
  enabled: boolean;
}

export function useConditionalListQuery<TData>({
  queryKey,
  queryFn,
  enabled,
}: ConditionalListQueryOptions<TData>): UseQueryResult<TData, Error> {
  return useQueryWrapper({
    queryKey,
    queryFn,
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
