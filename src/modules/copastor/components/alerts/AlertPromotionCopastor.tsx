import { AlertPromotion } from '@/shared/components/alerts';

export interface AlertPromotionCopastorProps {
  isPromoteButtonDisabled: boolean;
  isInputDisabled: boolean;
  onPromote: () => void;
}

const COPASTOR_INFO_ITEMS = [
  'Luego de confirmar esta promoción, deberás asignar una nueva relación. En este caso, deberás asignar una Iglesia al nuevo Pastor promovido.',
  'Una vez que guardes los cambios, el sistema eliminará automáticamente la relación que tenía el líder en su rol anterior con sus supervisores, zonas, predicadores, grupos familiares y discípulos.',
  'Todos los que dependían de este líder quedarán sin cobertura hasta que se les asigne un nuevo líder en el cargo correspondiente.',
  'Una vez realizada la promoción y actualizadas las relaciones, este líder estará listo para desempeñar sus funciones dentro del nuevo cargo asignado.',
];

export const AlertPromotionCopastor = ({
  isPromoteButtonDisabled,
  isInputDisabled,
  onPromote,
}: AlertPromotionCopastorProps): JSX.Element => {
  return (
    <AlertPromotion
      isPromoteButtonDisabled={isPromoteButtonDisabled}
      isInputDisabled={isInputDisabled}
      onPromote={onPromote}
      title='Promover a este Co-Pastor'
      promotionBadge='Co-Pastor → Pastor'
      infoItems={COPASTOR_INFO_ITEMS}
    />
  );
};
