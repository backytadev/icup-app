import { useMemo } from 'react';
import { Church, MapPin, BookOpen } from 'lucide-react';

import { useAuthStore } from '@/stores/auth/auth.store';
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';
import { UserRole } from '@/modules/user/enums/user-role.enum';

export const ChurchContextBanner = (): JSX.Element | null => {
  const user = useAuthStore((state) => state.user);
  const { activeChurchId, activeMinistryId, availableChurches, availableMinistries } =
    useChurchMinistryContextStore();

  const activeChurch = useMemo(
    () => availableChurches.find((church) => church.id === activeChurchId),
    [availableChurches, activeChurchId]
  );

  const activeMinistry = useMemo(
    () => availableMinistries.find((ministry) => ministry.id === activeMinistryId),
    [availableMinistries, activeMinistryId]
  );

  const isMinistryUser =
    user?.roles?.includes(UserRole.MinistryUser) &&
    !user?.roles?.includes(UserRole.SuperUser) &&
    !user?.roles?.includes(UserRole.AdminUser);

  if (!activeChurch) return null;

  return (
    <div className='sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-sm'>
      <div className='px-3 sm:px-6 lg:px-8 py-2'>
        {/* Mobile Layout */}
        <div className='flex sm:hidden items-center justify-center gap-1.5 text-xs'>
          <div className='flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0'>
            <Church className='w-3 h-3 text-blue-600 dark:text-blue-400' />
          </div>
          <div className='flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700/50 shadow-sm'>
            <span className='font-semibold text-blue-700 dark:text-blue-400 truncate max-w-[120px]'>
              {activeChurch.abbreviatedChurchName || activeChurch.churchName}
            </span>
            {isMinistryUser && activeMinistry && (
              <>
                <span className='text-slate-400 dark:text-slate-500'>•</span>
                <BookOpen className='w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0' />
                <span className='font-medium text-emerald-600 dark:text-emerald-400 truncate max-w-[100px]'>
                  {activeMinistry.customMinistryName}
                </span>
              </>
            )}
            {activeChurch.district && !isMinistryUser && (
              <>
                <span className='text-slate-400 dark:text-slate-500'>•</span>
                <MapPin className='w-2.5 h-2.5 text-slate-500 dark:text-slate-400 flex-shrink-0' />
              </>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className='hidden sm:flex items-center justify-center gap-2 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30'>
              <Church className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
            </div>
            <span className='font-medium text-slate-700 dark:text-slate-300'>
              Te encuentras en:
            </span>
          </div>

          <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700/50 shadow-sm'>
            <span className='font-semibold text-blue-700 dark:text-blue-400'>
              {activeChurch.churchName}
            </span>

            {isMinistryUser && activeMinistry && (
              <>
                <span className='text-slate-400 dark:text-slate-500'>•</span>
                <div className='flex items-center gap-1.5'>
                  <BookOpen className='w-3 h-3 text-emerald-500 dark:text-emerald-400' />
                  <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
                    {activeMinistry.customMinistryName}
                  </span>
                </div>
              </>
            )}

            {activeChurch.district && !isMinistryUser && (
              <>
                <span className='text-slate-400 dark:text-slate-500'>•</span>
                <div className='flex items-center gap-1'>
                  <MapPin className='w-3 h-3 text-slate-500 dark:text-slate-400' />
                  <span className='text-slate-600 dark:text-slate-400 text-xs'>
                    {activeChurch.district}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
