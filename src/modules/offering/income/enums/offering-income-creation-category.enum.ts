export enum OfferingIncomeCreationCategory {
  Events = 'events',
  General = 'general',
  Meetings = 'meetings',
  SocialAid = 'social_aid',
  OfferingBox = 'offering_box',
  InternalDonation = 'internal_donation',
  ExternalDonation = 'external_donation',
  FundraisingProTemple = 'fundraising_pro_temple',
  FundraisingProMinistry = 'fundraising_pro_ministry',
  FundraisingProChurchGround = 'fundraising_pro_church_ground',
}

export const OfferingIncomeCreationCategoryNames: Record<OfferingIncomeCreationCategory, string> = {
  [OfferingIncomeCreationCategory.General]: 'General',
  [OfferingIncomeCreationCategory.SocialAid]: 'Ayuda Social',
  [OfferingIncomeCreationCategory.OfferingBox]: 'Alfolí',
  [OfferingIncomeCreationCategory.InternalDonation]: 'Donación Interna',
  [OfferingIncomeCreationCategory.ExternalDonation]: 'Donación Externa',
  [OfferingIncomeCreationCategory.FundraisingProTemple]: 'Actividad Pro-Templo',
  [OfferingIncomeCreationCategory.FundraisingProChurchGround]: 'Actividad Pro-Terreno',
  [OfferingIncomeCreationCategory.Events]: 'Eventos (campañas, cruzadas, etc.)',
  [OfferingIncomeCreationCategory.FundraisingProMinistry]: 'Actividad Pro-Ministerio',
  [OfferingIncomeCreationCategory.Meetings]: 'Reuniones (enseñanzas, talleres bíblicos, etc.)',
};
