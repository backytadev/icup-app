import { cn } from '@/shared/lib/utils';
import { useLocation } from 'react-router-dom';

const bibleVerses = [
  'El Señor es mi pastor; nada me faltará. - Salmos 23:1',
  'Todo lo puedo en Cristo que me fortalece. - Filipenses 4:13',
  'Porque yo sé los planes que tengo para ustedes, planes de bienestar y no de calamidad. - Jeremías 29:11',
  'El amor es paciente, es bondadoso. - 1 Corintios 13:4',
  'Dios trabaja para el bien de aquellos que lo aman. - Romanos 8:28',
  'El Señor es mi luz y mi salvación; ¿a quién temeré? - Salmos 27:1',
  'Los que esperan a Jehová tendrán nuevas fuerzas. - Isaías 40:31',
  'El Señor es bueno, un refugio en tiempos de angustia. - Nahúm 1:7',
  'Bienaventurados los pacificadores. - Mateo 5:9',
  'El Señor está cerca de los que lo invocan. - Salmos 145:18',
  'El que habita al abrigo del Altísimo morará bajo su sombra. - Salmos 91:1',
  'Bendice alma mía al Señor, y no olvides sus beneficios. - Salmos 103:2',
  'Con Dios haremos proezas. - Salmos 60:12',
  'Jehová peleará por vosotros, y vosotros estaréis tranquilos. - Éxodo 14:14',
  'Esforzaos y cobrad ánimo, no temáis ni tengáis miedo. - Deuteronomio 31:6',
  'El Señor está contigo dondequiera que vayas. - Josué 1:9',
  'Dios es nuestro refugio y nuestra fuerza, una ayuda siempre presente en las dificultades. - Salmos 46:1',
  'Clama a mí, y yo te responderé. - Jeremías 33:3',
  'Él sana a los quebrantados de corazón y venda sus heridas. - Salmos 147:3',
  'Mi paz os doy; no os la doy como el mundo la da. - Juan 14:27',
  'No se turbe vuestro corazón, ni tenga miedo. - Juan 14:1',
  'El gozo del Señor es mi fortaleza. - Nehemías 8:10',
  'Tu palabra es una lámpara a mis pies y una luz para mi camino. - Salmos 119:105',
  'El que confía en el Señor será como el monte de Sion, que no se mueve, sino que permanece para siempre. - Salmos 125:1',
  'El Señor abrirá los cielos para enviar lluvia a su tiempo y bendecir la obra de tus manos. - Deuteronomio 28:12',
  'Y sabemos que en todas las cosas Dios trabaja para el bien de los que le aman. - Romanos 8:28',
  'El Señor te guardará de todo mal; Él guardará tu vida. - Salmos 121:7',
  'Cree en el Señor Jesucristo, y serás salvo tú y tu casa. - Hechos 16:31',
  'Y todo lo que pidiereis en oración, creyendo, lo recibiréis. - Mateo 21:22',
];

const generalPaths = [
  '/churches',
  '/pastors',
  '/copastors',
  '/supervisors',
  '/zones',
  '/family-groups',
  '/offerings',
  '/offerings/income',
  '/offerings/expenses',
  '/preachers',
  '/disciples',
  '/users',
  '/metrics',
  '/dashboard',
];

const searchOrUpdatePaths = ['/general-search', '/search-by-term', '/update', '/inactivate', '/'];

const metricsPaths = [
  '/metrics/member',
  '/metrics/family-group',
  '/metrics/offering-income',
  '/metrics/offering-expenses',
  '/metrics/offering-comparative',
];

const getRandomVerse = (): string => {
  const randomIndex = Math.floor(Math.random() * bibleVerses.length);
  return bibleVerses[randomIndex];
};

const isSearchOrUpdatePath = (pathname: string): boolean => {
  return searchOrUpdatePaths.some((path) => pathname.includes(path));
};

const isMetricsPath = (pathname: string): boolean => {
  return metricsPaths.includes(pathname);
};

interface SpinnerProps {
  isPendingRequest?: boolean;
  variant?: 'default' | 'overlay';
}

export const LoadingSpinner = ({ isPendingRequest, variant = 'default' }: SpinnerProps): JSX.Element => {
  const verse = getRandomVerse();
  const { pathname } = useLocation();

  const showDotsAnimation = generalPaths.includes(pathname) && variant !== 'overlay';

  // Overlay variant - clean, centered spinner without background
  if (variant === 'overlay') {
    return (
      <div className='flex flex-col items-center justify-center gap-5'>
        {/* Modern spinner */}
        <div className='relative'>
          {/* Outer ring */}
          <div className='w-16 h-16 rounded-full border-4 border-slate-200/60 dark:border-slate-600/40' />
          {/* Spinning gradient ring */}
          <div
            className={cn(
              'absolute inset-0 w-16 h-16 rounded-full',
              'border-4 border-transparent border-t-blue-500 border-r-blue-400',
              'animate-spin'
            )}
          />
          {/* Inner glow */}
          <div className='absolute inset-2 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent' />
        </div>

        {/* Loading text */}
        <span className='text-blue-600 dark:text-blue-400 text-sm font-medium font-inter'>
          Cargando...
        </span>

        {/* Bible verse */}
        <div
          className={cn(
            'max-w-sm text-center px-4 py-3 rounded-xl',
            'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm',
            'border border-slate-200/60 dark:border-slate-700/50',
            'shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50',
            'opacity-0 animate-fade-in-scale'
          )}
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <p className='text-sm text-slate-600 dark:text-slate-300 font-inter italic leading-relaxed'>
            &ldquo;{verse.split(' - ')[0]}&rdquo;
          </p>
          <p className='mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium'>
            — {verse.split(' - ')[1]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        'bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950',
        isPendingRequest && '-mt-[20rem] md:-mt-[15rem] h-auto',
        !isPendingRequest && 'min-h-screen',
        isSearchOrUpdatePath(pathname) && 'min-h-screen',
        isMetricsPath(pathname) && 'bg-slate-50/40 dark:bg-slate-950/10'
      )}
    >
      <div className='flex flex-col items-center justify-center px-6 py-12'>
        {showDotsAnimation ? (
          // Modern dots animation
          <div className='flex flex-col items-center gap-6'>
            <div className='flex items-center gap-2'>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'w-3.5 h-3.5 rounded-full',
                    'bg-gradient-to-br from-blue-500 to-blue-600',
                    'animate-bounce shadow-lg shadow-blue-500/30'
                  )}
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className='text-blue-600 dark:text-blue-400 text-base font-medium font-inter animate-pulse'>
              Cargando...
            </span>
          </div>
        ) : (
          // Full spinner with verse
          <div className='flex flex-col items-center gap-6'>
            {/* Modern spinner */}
            <div className='relative'>
              {/* Outer ring */}
              <div className='w-20 h-20 rounded-full border-4 border-slate-200 dark:border-slate-700' />
              {/* Spinning gradient ring */}
              <div
                className={cn(
                  'absolute inset-0 w-20 h-20 rounded-full',
                  'border-4 border-transparent border-t-blue-500 border-r-blue-400',
                  'animate-spin'
                )}
              />
              {/* Inner glow */}
              <div className='absolute inset-2 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent' />
            </div>

            {/* Loading text */}
            <span className='text-blue-600 dark:text-blue-400 text-base font-medium font-inter'>
              Cargando...
            </span>

            {/* Bible verse */}
            <div
              className={cn(
                'max-w-md text-center px-4 py-3 rounded-xl',
                'bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm',
                'border border-slate-200/50 dark:border-slate-700/50',
                'shadow-sm',
                'opacity-0 animate-fade-in-scale'
              )}
              style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
            >
              <p className='text-sm md:text-base text-slate-600 dark:text-slate-300 font-inter italic leading-relaxed'>
                &ldquo;{verse.split(' - ')[0]}&rdquo;
              </p>
              <p className='mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium'>
                — {verse.split(' - ')[1]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
