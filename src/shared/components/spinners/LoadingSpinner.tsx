/* eslint-disable @typescript-eslint/strict-boolean-expressions */

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
}

export const LoadingSpinner = ({ isPendingRequest }: SpinnerProps): JSX.Element => {
  const verse = getRandomVerse();
  const { pathname } = useLocation();

  return (
    <div
      className={cn(
        'h-screen flex items-center justify-center text-slate-100 dark:bg-slate-950',
        isPendingRequest && '-mt-[20rem] md:-mt-[15rem]',
        !isPendingRequest &&
          'md:h-screen md:flex md:flex-col md:items-center md:justify-center md:-mt-[4rem]',
        isSearchOrUpdatePath(pathname) && 'h-screen',
        isMetricsPath(pathname) && 'bg-slate-50/40 dark:bg-slate-950/10'
      )}
    >
      <div className='flex flex-col items-center justify-center px-4 mt-[2rem]'>
        {generalPaths.includes(pathname) ? (
          <div className='flex flex-col items-center justify-center space-y-4 min-h-screen'>
            <div className='flex space-x-2'>
              <div className='w-4 h-4 bg-blue-500 rounded-full animate-bounce'></div>
              <div className='w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-200'></div>
              <div className='w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-400'></div>
            </div>
            <span className='text-blue-500 text-lg font-medium'>Cargando...</span>
          </div>
        ) : (
          <>
            <div
              className={cn(
                'loader ease-linear rounded-full border-8 border-t-8 border-blue-500 h-32 w-32 mb-2',
                pathname === '/dashboard' && '-mt-10'
              )}
            ></div>
            <h2 className='text-center text-black dark:text-white text-[15px] md:text-[18px] font-semibold'>
              {verse}
            </h2>
          </>
        )}
      </div>
    </div>
  );
};
