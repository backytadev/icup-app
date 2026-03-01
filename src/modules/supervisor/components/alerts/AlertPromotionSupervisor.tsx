import { AlertPromotion } from '@/shared/components/alerts';

export interface AlertPromotionSupervisorProps {
  isPromoteButtonDisabled: boolean;
  isInputDisabled: boolean;
  onPromote: () => void;
}

const SUPERVISOR_INFO_ITEMS = [
  'Luego de confirmar esta promoción, deberás asignar una nueva relación. En este caso, deberás asignar un Pastor al nuevo Co-Pastor promovido.',
  'Una vez que guardes los cambios, el sistema eliminará automáticamente la relación que tenía el líder en su rol anterior con su zona, predicadores, grupos familiares y discípulos.',
  'Todos los que dependían de este líder quedarán sin cobertura hasta que se les asigne un nuevo líder en el cargo correspondiente.',
  'Una vez realizada la promoción y actualizadas las relaciones, este líder estará listo para desempeñar sus funciones dentro del nuevo cargo asignado.',
];

export const AlertPromotionSupervisor = ({
  isPromoteButtonDisabled,
  isInputDisabled,
  onPromote,
}: AlertPromotionSupervisorProps): JSX.Element => {
  return (
    <AlertPromotion
      isPromoteButtonDisabled={isPromoteButtonDisabled}
      isInputDisabled={isInputDisabled}
      onPromote={onPromote}
      title='Promover a este Supervisor'
      promotionBadge='Supervisor → Co-Pastor'
      infoItems={SUPERVISOR_INFO_ITEMS}
    />
  );
};
