import { FilterFn } from '@tanstack/react-table';

export const filterByZoneOrLeader: FilterFn<any> = (row, columnId, filterValue) => {
  if (!columnId) return true;
  if (!filterValue) return true;

  const search = filterValue.toLowerCase();

  const supervisorFullName =
    `${row.original.zone?.supervisorFirstNames ?? ''} ${row.original.zone?.supervisorLastNames ?? ''}`.toLowerCase();
  const preacherFullName =
    `${row.original.familyGroup?.preacherFirstNames ?? ''} ${row.original.familyGroup?.preacherLastNames ?? ''}`.toLowerCase();

  return supervisorFullName.includes(search) || preacherFullName.includes(search);
};
