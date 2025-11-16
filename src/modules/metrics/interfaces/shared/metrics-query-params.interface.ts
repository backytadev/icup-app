export interface MetricsQueryParams {
  searchType: string;
  metricType?: string;
  church: string;
  copastor?: string;
  year?: string;
  zone?: string;
  currency?: string;
  month?: string;
  district?: string;
  startMonth?: string;
  endMonth?: string;
  limit?: string;
  offset?: string;
  order?: string;
  allZones?: boolean;
  allFamilyGroups?: boolean;
  isSingleMonth?: boolean;
}
