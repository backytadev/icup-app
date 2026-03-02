import { AlertPromotion } from '@/shared/components/alerts';

export interface AlertPromotionPreacherProps {
  isPromoteButtonDisabled: boolean;
  isInputDisabled: boolean;
  onPromote: () => void;
}

const PREACHER_INFO_ITEMS = [
  'Luego de confirmar esta promoción, deberás asignar una nueva relación. En este caso, deberás asignar un Co-Pastor o un Pastor directo al nuevo Supervisor promovido.',
  'Una vez que guardes los cambios, el sistema eliminará automáticamente la relación que tenía el líder en su rol anterior con su grupo familiar y sus discípulos.',
  'Todos los que dependían de este líder quedarán sin cobertura hasta que se les asigne un nuevo líder en el cargo correspondiente.',
  'Una vez realizada la promoción y actualizadas las relaciones, este líder estará listo para desempeñar sus funciones dentro del nuevo cargo asignado.',
];

export const AlertPromotionPreacher = ({
  isPromoteButtonDisabled,
  isInputDisabled,
  onPromote,
}: AlertPromotionPreacherProps): JSX.Element => {
  return (
    <AlertPromotion
      isPromoteButtonDisabled={isPromoteButtonDisabled}
      isInputDisabled={isInputDisabled}
      onPromote={onPromote}
      title='Promover a este Predicador'
      promotionBadge='Predicador → Supervisor'
      infoItems={PREACHER_INFO_ITEMS}
    />
  );
};
