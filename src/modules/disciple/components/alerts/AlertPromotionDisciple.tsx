import { AlertPromotion } from '@/shared/components/alerts/AlertPromotion';

const DISCIPLE_INFO_ITEMS = [
  'Luego de confirmar esta promoción, deberás asignar una nueva relación. En este caso, deberás asignar un Supervisor al nuevo Predicador promovido.',
  'Una vez que guardes los cambios, el sistema eliminará automáticamente las relaciones que tenía el discípulo anteriormente.',
  'Una vez realizada la promoción y actualizadas las relaciones, este líder estará listo para desempeñar sus funciones dentro del nuevo cargo asignado.',
];

export interface AlertPromotionDiscipleProps {
  isPromoteButtonDisabled: boolean;
  isInputDisabled: boolean;
  onPromote: () => void;
}

export const AlertPromotionDisciple = ({
  isPromoteButtonDisabled,
  isInputDisabled,
  onPromote,
}: AlertPromotionDiscipleProps): JSX.Element => (
  <AlertPromotion
    isPromoteButtonDisabled={isPromoteButtonDisabled}
    isInputDisabled={isInputDisabled}
    onPromote={onPromote}
    title='Promover a este Discípulo'
    promotionBadge='Discípulo → Predicador'
    infoItems={DISCIPLE_INFO_ITEMS}
  />
);
