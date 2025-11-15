import { GeneralComparativeOfferingExpensesResponse } from '@/modules/metrics/interfaces/offering-comparative-metrics/general-comparative-offering-expenses-response.interface';
import { GeneralComparativeOfferingIncomeResponse } from '@/modules/metrics/interfaces/offering-comparative-metrics/general-comparative-offering-income-response.interface';
import { IncomeAndExpensesComparativeResponse } from '@/modules/metrics/interfaces/offering-comparative-metrics/income-and-expenses-comparative-response.interface';

export interface ComparativeFinancialBalanceSummaryResponse {
  calculateBalanceSummary: IncomeAndExpensesComparativeResponse[];
  calculateSummaryIncome: GeneralComparativeOfferingIncomeResponse[];
  calculateSummaryExpenses: GeneralComparativeOfferingExpensesResponse[];
}
