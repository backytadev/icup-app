import { useState, useEffect, useRef, useCallback } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Loader2, Map, MapPin, Navigation, Search, X } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

//* Default center: Lima, Perú
const DEFAULT_CENTER: [number, number] = [-12.0464, -77.0428];
const DEFAULT_ZOOM = 13;

//* Nominatim result shape (OpenStreetMap geocoding — free, no API key)
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

//* Custom SVG pin icon — avoids Leaflet image import issues in Vite
const createPinIcon = (): L.DivIcon =>
  L.divIcon({
    className: '',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
        <path d="M16 0C9.373 0 4 5.373 4 12c0 9.625 12 30 12 30S28 21.625 28 12C28 5.373 22.627 0 16 0z"
          fill="#0d9488" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="12" r="5.5" fill="white"/>
      </svg>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });

//* Handles map click to place the marker
const ClickHandler = ({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}): null => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

//* Invalidates Leaflet size after the Dialog renders the map container
const MapResizer = ({ trigger }: { trigger: boolean }): null => {
  const map = useMap();
  useEffect(() => {
    if (trigger) {
      const timer = setTimeout(() => { map.invalidateSize(); }, 120);
      return () => { clearTimeout(timer); };
    }
  }, [trigger, map]);
  return null;
};

//* Flies to a new location (geolocation or search result)
const FlyToLocation = ({ position }: { position: [number, number] | null }): null => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.2 });
    }
  }, [position, map]);
  return null;
};

export interface MapLocationPickerProps {
  latitude: string;
  longitude: string;
  onLocationChange: (lat: string, lng: string) => void;
  disabled?: boolean;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

export const MapLocationPicker = ({
  latitude,
  longitude,
  onLocationChange,
  disabled = false,
  defaultCenter = DEFAULT_CENTER,
  defaultZoom = DEFAULT_ZOOM,
}: MapLocationPickerProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [tempLat, setTempLat] = useState<number | null>(null);
  const [tempLng, setTempLng] = useState<number | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  //* Address search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const hasCoords =
    Boolean(latitude) &&
    Boolean(longitude) &&
    !isNaN(parseFloat(latitude)) &&
    !isNaN(parseFloat(longitude));

  const currentLat = hasCoords ? parseFloat(latitude) : null;
  const currentLng = hasCoords ? parseFloat(longitude) : null;

  //* Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  //* Debounced Nominatim search
  const handleSearchInput = useCallback((value: string): void => {
    setSearchQuery(value);
    setShowResults(false);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (value.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const params = new URLSearchParams({
          q: value,
          format: 'json',
          limit: '5',
          addressdetails: '0',
        });
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?${params.toString()}`,
          { headers: { 'Accept-Language': 'es' } },
        );
        const data: NominatimResult[] = await res.json();
        setSearchResults(data);
        setShowResults(data.length > 0);
      } catch {
        toast.error('Error al buscar la dirección.', { position: 'top-center' });
      } finally {
        setIsSearching(false);
      }
    }, 500);
  }, []);

  const handleSelectResult = (result: NominatimResult): void => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setTempLat(lat);
    setTempLng(lng);
    setFlyTarget([lat, lng]);
    setSearchQuery(result.display_name);
    setShowResults(false);
    setSearchResults([]);
  };

  const handleClearSearch = (): void => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  //* Open dialog — seed temp coords from current form values
  const handleOpen = (): void => {
    if (disabled) return;
    setTempLat(currentLat);
    setTempLng(currentLng);
    setFlyTarget(null);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setOpen(true);
  };

  const handleMapClick = (lat: number, lng: number): void => {
    setTempLat(lat);
    setTempLng(lng);
    setFlyTarget(null);
    setShowResults(false);
  };

  const handleConfirm = (): void => {
    if (tempLat !== null && tempLng !== null) {
      onLocationChange(tempLat.toFixed(6), tempLng.toFixed(6));
    }
    setOpen(false);
  };

  const handleClearLocation = (): void => {
    onLocationChange('', '');
  };

  const handleUseMyLocation = (): void => {
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización.', { position: 'top-center' });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setTempLat(lat);
        setTempLng(lng);
        setFlyTarget([lat, lng]);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error(
            'Permiso de ubicación denegado. Actívalo en la configuración del navegador.',
            { position: 'top-center' },
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          toast.error('No se pudo obtener tu ubicación. Inténtalo de nuevo.', {
            position: 'top-center',
          });
        } else {
          toast.error('Tiempo de espera agotado al obtener la ubicación.', {
            position: 'top-center',
          });
        }
      },
      { timeout: 10000 },
    );
  };

  const markerPosition: [number, number] | null =
    tempLat !== null && tempLng !== null ? [tempLat, tempLng] : null;

  const mapCenter: [number, number] =
    currentLat !== null && currentLng !== null
      ? [currentLat, currentLng]
      : defaultCenter;

  return (
    <>
      {/* Trigger button */}
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          disabled={disabled}
          variant='outline'
          onClick={handleOpen}
          className={cn(
            'flex-1 h-11 justify-start gap-2 text-sm',
            hasCoords
              ? 'border-teal-300 text-teal-700 bg-teal-50 hover:bg-teal-100 dark:border-teal-700 dark:text-teal-300 dark:bg-teal-950/30 dark:hover:bg-teal-950/50'
              : 'text-slate-500 dark:text-slate-400',
          )}
        >
          <MapPin
            className={cn(
              'w-4 h-4 shrink-0',
              hasCoords ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400',
            )}
          />
          {hasCoords
            ? `${parseFloat(latitude).toFixed(5)}, ${parseFloat(longitude).toFixed(5)}`
            : 'Seleccionar en mapa'}
        </Button>

        {hasCoords && (
          <Button
            type='button'
            disabled={disabled}
            variant='ghost'
            size='icon'
            onClick={handleClearLocation}
            className='h-11 w-11 shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors'
            title='Quitar ubicación'
          >
            <X className='w-4 h-4' />
          </Button>
        )}
      </div>

      {/* Map dialog */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) setOpen(false); }}>
        <DialogContent className='max-w-2xl w-[95vw] p-0 overflow-hidden gap-0'>
          <DialogHeader className='px-5 pt-5 pb-3'>
            <DialogTitle className='text-[15px] font-bold flex items-center gap-2'>
              <Map className='w-4 h-4 text-teal-600 dark:text-teal-400' />
              Seleccionar ubicación
            </DialogTitle>
            <p className='text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5'>
              Busca una dirección o haz clic directamente en el mapa para colocar el pin.
            </p>
          </DialogHeader>

          {/* Address search */}
          <div className='px-5 pb-3' ref={searchContainerRef}>
            <div className='relative'>
              <div className='relative flex items-center'>
                {isSearching
                  ? <Loader2 className='absolute left-3 w-4 h-4 text-slate-400 animate-spin pointer-events-none' />
                  : <Search className='absolute left-3 w-4 h-4 text-slate-400 pointer-events-none' />
                }
                <Input
                  value={searchQuery}
                  onChange={(e) => { handleSearchInput(e.target.value); }}
                  placeholder='Buscar dirección, lugar o ciudad...'
                  className='pl-9 pr-9 h-10 text-sm'
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowResults(false);
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    type='button'
                    onClick={handleClearSearch}
                    className='absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors'
                  >
                    <X className='w-3.5 h-3.5' />
                  </button>
                )}
              </div>

              {/* Results dropdown */}
              {showResults && searchResults.length > 0 && (
                <ul className={cn(
                  'absolute z-[9999] top-full mt-1 w-full',
                  'rounded-lg border border-slate-200 dark:border-slate-700',
                  'bg-white dark:bg-slate-900 shadow-lg overflow-hidden',
                )}>
                  {searchResults.map((result) => (
                    <li key={result.place_id}>
                      <button
                        type='button'
                        onClick={() => { handleSelectResult(result); }}
                        className={cn(
                          'w-full text-left px-3 py-2.5 flex items-start gap-2.5',
                          'text-[12.5px] text-slate-700 dark:text-slate-300',
                          'hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors',
                          'border-b border-slate-100 dark:border-slate-800 last:border-0',
                        )}
                      >
                        <MapPin className='w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5' />
                        <span className='line-clamp-2 leading-snug'>{result.display_name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Map */}
          <div className='px-5'>
            <div
              className='rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700'
              style={{ height: 320 }}
            >
              <MapContainer
                center={mapCenter}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <ClickHandler onMapClick={handleMapClick} />
                <MapResizer trigger={open} />
                <FlyToLocation position={flyTarget} />
                {markerPosition && (
                  <Marker position={markerPosition} icon={createPinIcon()} />
                )}
              </MapContainer>
            </div>
          </div>

          {/* Footer: coordinates + actions */}
          <div className='px-5 py-4 flex flex-wrap items-center gap-2.5'>
            {/* Coords display */}
            <div
              className={cn(
                'flex-1 min-w-0 px-3 py-2 rounded-lg border text-[12.5px] font-mono truncate',
                markerPosition
                  ? 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-300'
                  : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800/30',
              )}
            >
              {markerPosition
                ? `${tempLat?.toFixed(6)},  ${tempLng?.toFixed(6)}`
                : 'Sin ubicación — haz clic en el mapa'}
            </div>

            {/* My location */}
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={isLocating}
              onClick={handleUseMyLocation}
              className='gap-1.5 text-[12.5px] h-9 shrink-0'
            >
              <Navigation className='w-3.5 h-3.5' />
              {isLocating ? 'Localizando...' : 'Mi ubicación'}
            </Button>

            {/* Cancel */}
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => { setOpen(false); }}
              className='text-[12.5px] h-9 text-slate-500 shrink-0'
            >
              Cancelar
            </Button>

            {/* Confirm */}
            <Button
              type='button'
              size='sm'
              disabled={!markerPosition}
              onClick={handleConfirm}
              className='bg-teal-600 hover:bg-teal-700 text-white text-[12.5px] h-9 shrink-0'
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
