export const BUTTON_VARIANTS = {
  info: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all duration-200',
  update:
    'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-sm hover:shadow-md hover:shadow-amber-500/20 transition-all duration-200',
  delete:
    'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-sm hover:shadow-md hover:shadow-red-500/20 transition-all duration-200',
  confirm:
    'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-sm hover:shadow-md hover:shadow-emerald-500/20 transition-all duration-200',
  cancel:
    'bg-gradient-to-r from-slate-400 to-slate-500 text-white hover:from-slate-500 hover:to-slate-600 shadow-sm transition-all duration-200',
  report:
    'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300',
  reportLoading:
    'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed',
  newSearch:
    'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-sm hover:shadow-md hover:shadow-emerald-500/20 transition-all duration-200',
  clearFilters:
    'bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 shadow-sm hover:shadow-md hover:shadow-rose-500/20 transition-all duration-200',
} as const;

export const MODAL_SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-[720px]',
  xl: 'max-w-[1050px]',
  '2xl': 'max-w-[1160px]',
} as const;

export const MODAL_SIZES_MOBILE = {
  sm: 'max-w-auto sm:max-w-sm',
  md: 'max-w-auto sm:max-w-[590px]',
  lg: 'max-w-auto sm:max-w-[590px]',
  xl: 'max-w-auto sm:max-w-[590px]',
  '2xl': 'max-w-auto sm:max-w-[590px]',
} as const;

export const TRIGGER_BUTTON_BASE =
  'mt-2 py-2 px-2.5 h-[2.25rem] rounded-lg font-medium transition-all duration-200' as const;

export const ICON_SIZE = 'w-7 h-6' as const;
