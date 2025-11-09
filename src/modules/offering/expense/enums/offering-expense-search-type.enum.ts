export enum OfferingExpenseSearchType {
  OperationalExpenses = 'operational_expenses',
  MaintenanceAndRepairExpenses = 'maintenance_and_repair_expenses',
  DecorationExpenses = 'decoration_expenses',
  EquipmentAndTechnologyExpenses = 'equipment_and_technology_expenses',
  SuppliesExpenses = 'supplies_expenses',
  PlaningEventsExpenses = 'planing_events_expenses',
  OtherExpenses = 'other_expenses',
  ExpensesAdjustment = 'expenses_adjustment',
  RecordStatus = 'record_status',
}

export const OfferingExpenseSearchTypeNames: Record<OfferingExpenseSearchType, string> = {
  [OfferingExpenseSearchType.OperationalExpenses]: 'Gastos Operativos',
  [OfferingExpenseSearchType.MaintenanceAndRepairExpenses]: 'Gastos de Reparación y Mantenimiento',
  [OfferingExpenseSearchType.DecorationExpenses]: 'Gastos de Decoración',
  [OfferingExpenseSearchType.EquipmentAndTechnologyExpenses]: 'Gastos de Equipamiento y Tecnología',
  [OfferingExpenseSearchType.SuppliesExpenses]: 'Gastos de Materiales y Suministros',
  [OfferingExpenseSearchType.PlaningEventsExpenses]: 'Gastos de Planificación de Eventos',
  [OfferingExpenseSearchType.OtherExpenses]: 'Otros Gastos',
  [OfferingExpenseSearchType.ExpensesAdjustment]: 'Ajuste por Salida',
  [OfferingExpenseSearchType.RecordStatus]: 'Estado de Registro',
};
