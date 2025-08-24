export enum OfferingExpenseSearchSubType {
  //* Operative Expenses
  VenueRental = 'venue_rental',
  PublicServices = 'public_services',
  TransportationAndTravelAllowance = 'transportation_and_travel_allowance',
  InsuranceAndTaxes = 'insurance_and_taxes',
  SecurityAndSurveillance = 'security_and_surveillance',
  OtherAdministrativeExpenses = 'other_administrative_expenses',

  //* Maintenance and Repair Expenses
  PlumbingServices = 'plumbing_services',
  ElectricalServices = 'electrical_services',
  PaintingAndTouchUpsServices = 'painting_and_touch_ups_services',
  CleaningServices = 'cleaning_services',
  HeatingAndACSystemMaintenance = 'heating_and_ac_system_maintenance',
  SoundEquipmentMaintenance = 'sound_equipment_maintenance',
  LightingEquipmentMaintenance = 'lighting_equipment_maintenance',
  LightingEquipmentRepairs = 'lighting_equipment_repairs',
  SoundEquipmentRepairs = 'sound_equipment_repairs',
  GardenAndExteriorMaintenance = 'garden_and_exterior_maintenance',
  GeneralEquipmentRepairs = 'general_equipment_repairs',
  GeneralEquipmentMaintenance = 'general_equipment_maintenance',
  FurnitureRepairAndMaintenance = 'furniture_repair_and_maintenance',
  ComputerEquipmentRepairAndMaintenance = 'computer_equipment_repair_and_maintenance',
  RoofAndStructuralRepairs = 'roof_and_structural_repairs',
  DoorAndWindowRepairs = 'door_and_window_repairs',

  //* Decoration Expenses
  PurchaseFlowersAndPlants = 'purchase_flowers_and_plants',
  PurchaseDecorativeFurniture = 'purchase_decorative_furniture',
  PurchaseDecorativeItems = 'purchase_decorative_items',
  DecorationServices = 'decoration_services',
  LightingAndIlluminationServices = 'lighting_and_illumination_services',
  StageSetupServices = 'stage_setup_services',
  EventDecorationRentals = 'event_decoration_rentals',
  CleaningPostEventServices = 'cleaning_post_event_services',

  //* Equipment and Technology Expenses
  SoundEquipment = 'sound_equipment',
  ProjectionEquipment = 'projection_equipment',
  HvacEquipment = 'hvac_equipment',
  LightingEquipment = 'lighting_equipment',
  SecurityEquipment = 'security_equipment',
  ComputerEquipment = 'computer_equipment',
  ConstructionEquipment = 'construction_equipment',
  OfficeEquipment = 'office_equipment',
  KitchenEquipment = 'kitchen_equipment',
  CleaningEquipment = 'cleaning_equipment',
  AudioVideoRecordingEquipment = 'audio_video_recording_equipment',
  OfficeFurniture = 'office_furniture',
  KitchenFurniture = 'kitchen_furniture',
  GeneralFurniture = 'general_furniture',
  MusicalInstruments = 'musical_instruments',
  InternetTelephoneServices = 'internet_and_telephone_services',
  HostingSoftwareServices = 'hosting_and_software_services',

  //* Supplies Expenses
  KitchenUtensils = 'kitchen_utensils',
  OfficeSupplies = 'office_supplies',
  CookingIngredients = 'cooking_ingredients',
  CleaningMaterials = 'cleaning_materials',
  PackagingMaterials = 'packaging_and_storage_materials',
  SundaySchoolMaterials = 'sunday_school_educational_materials',
  RenovationMaterials = 'renovation_materials',
  PaintingSupplies = 'painting_supplies',
  ElectricalSupplies = 'electrical_supplies',
  ConstructionTools = 'construction_tools',
  AudioVisualSupplies = 'audio_visual_supplies',
  SafetyEquipment = 'safety_equipment',
  FirstAidSupplies = 'first_aid_supplies',

  //* Planing Events Expenses
  AdvertisingAndEventPromotion = 'advertising_and_event_promotion',
  SpecialGuestsFees = 'special_guests_fess',
  SecurityPersonnelFees = 'security_personnel_fees',
  SupportStaffFees = 'support_staff_fees',
  ExternalVenueRental = 'external_venue_rental',
  FoodAndBeverage = 'food_and_beverage',
  TransportationSpecialGuests = 'transportation_special_guests',
  EquipmentTransportation = 'equipment_transportation',
  RentalTechnicalEquipment = 'rental_technical_equipment',
  PrivateMobilityRental = 'private_mobility_rental',
  EducationalMaterials = 'educational_materials',
  GiftsAndPrizesParticipants = 'gifts_and_prizes_participants',
  OtherRelatedExpenses = 'other_related_expenses',

  //* Other Expenses
  FraternalSupport = 'fraternal_support',
  EmergencyRepairs = 'emergency_repairs',
  HospitalityExpenses = 'hospitality_expenses',
  MissionDonations = 'mission_donations',
  TrainingAndEducation = 'training_and_education',
  LegalAndAdministrative = 'legal_and_administrative',
  SpecialsProjects = 'special_projects',
}

export const OfferingExpenseSearchSubTypeNames: Record<OfferingExpenseSearchSubType, string> = {
  // Operative Expenses
  [OfferingExpenseSearchSubType.VenueRental]: 'Alquiler de local',
  [OfferingExpenseSearchSubType.PublicServices]: 'Servicios públicos',
  [OfferingExpenseSearchSubType.InsuranceAndTaxes]: 'Seguros y/o impuestos',
  [OfferingExpenseSearchSubType.TransportationAndTravelAllowance]: 'Transporte y/o viáticos',
  [OfferingExpenseSearchSubType.SecurityAndSurveillance]: 'Seguridad y vigilancia',
  [OfferingExpenseSearchSubType.OtherAdministrativeExpenses]: 'Otros gastos administrativos',

  // Maintenance and Repair Expenses
  [OfferingExpenseSearchSubType.PlumbingServices]: 'Servicios de gasfiteria',
  [OfferingExpenseSearchSubType.ElectricalServices]: 'Servicios de electricidad',
  [OfferingExpenseSearchSubType.PaintingAndTouchUpsServices]: 'Servicios de pintura y retoques',
  [OfferingExpenseSearchSubType.CleaningServices]: 'Servicios de limpieza',
  [OfferingExpenseSearchSubType.HeatingAndACSystemMaintenance]: 'Mantenimiento de SC y AC',
  [OfferingExpenseSearchSubType.SoundEquipmentMaintenance]: 'Mant. Equipos de sonido',
  [OfferingExpenseSearchSubType.LightingEquipmentMaintenance]: 'Mant. Equipos de iluminación',
  [OfferingExpenseSearchSubType.GardenAndExteriorMaintenance]: 'Mant. Jardines y exteriores',
  [OfferingExpenseSearchSubType.FurnitureRepairAndMaintenance]: 'Mant. Muebles',
  [OfferingExpenseSearchSubType.ComputerEquipmentRepairAndMaintenance]:
    'Mant. Equipos informáticos',
  [OfferingExpenseSearchSubType.GeneralEquipmentMaintenance]: 'Mant. Equipos en general',
  [OfferingExpenseSearchSubType.GeneralEquipmentRepairs]: 'Rep. Equipos en general',
  [OfferingExpenseSearchSubType.RoofAndStructuralRepairs]: 'Rep. Techo y estructuras',
  [OfferingExpenseSearchSubType.DoorAndWindowRepairs]: 'Rep. Puertas y ventanas',
  [OfferingExpenseSearchSubType.SoundEquipmentRepairs]: 'Rep. Equipos de sonido',
  [OfferingExpenseSearchSubType.LightingEquipmentRepairs]: 'Rep. Equipos de iluminación',

  // Decoration Expenses
  [OfferingExpenseSearchSubType.PurchaseFlowersAndPlants]: 'Adq. Flores y plantas',
  [OfferingExpenseSearchSubType.PurchaseDecorativeFurniture]: 'Adq. Muebles decorativos',
  [OfferingExpenseSearchSubType.PurchaseDecorativeItems]: 'Adq. Artículos decorativos',
  [OfferingExpenseSearchSubType.DecorationServices]: 'Serv. Decoración general',
  [OfferingExpenseSearchSubType.LightingAndIlluminationServices]: 'Serv. Iluminación y efectos',
  [OfferingExpenseSearchSubType.StageSetupServices]: 'Serv. Montaje de escenario',
  [OfferingExpenseSearchSubType.EventDecorationRentals]: 'Alq. Decoraciones especiales',
  [OfferingExpenseSearchSubType.CleaningPostEventServices]: 'Serv. Limpieza post-evento',

  // Equipment and Technology Expenses
  [OfferingExpenseSearchSubType.SoundEquipment]: 'Equipos de sonido',
  [OfferingExpenseSearchSubType.ProjectionEquipment]: 'Equipos de proyección',
  [OfferingExpenseSearchSubType.HvacEquipment]: 'Equipos de ventilación, SC y AC',
  [OfferingExpenseSearchSubType.LightingEquipment]: 'Equipos de iluminación',
  [OfferingExpenseSearchSubType.SecurityEquipment]: 'Equipos de seguridad',
  [OfferingExpenseSearchSubType.OfficeEquipment]: 'Equipos de oficina',
  [OfferingExpenseSearchSubType.ComputerEquipment]: 'Equipos informáticos',
  [OfferingExpenseSearchSubType.ConstructionEquipment]: 'Equipos de construcción',
  [OfferingExpenseSearchSubType.KitchenEquipment]: 'Equipos de cocina',
  [OfferingExpenseSearchSubType.CleaningEquipment]: 'Equipos de limpieza',
  [OfferingExpenseSearchSubType.AudioVideoRecordingEquipment]: 'Equipos de grabación (a/v)',
  [OfferingExpenseSearchSubType.OfficeFurniture]: 'Mobiliarios informáticos',
  [OfferingExpenseSearchSubType.KitchenFurniture]: 'Mobiliarios de cocina',
  [OfferingExpenseSearchSubType.GeneralFurniture]: 'Mobiliarios en general',
  [OfferingExpenseSearchSubType.MusicalInstruments]: 'Instrumentos musicales',
  [OfferingExpenseSearchSubType.InternetTelephoneServices]: 'Serv. Internet y telefonía',
  [OfferingExpenseSearchSubType.HostingSoftwareServices]: 'Serv. Hosting y software',

  // Supplies Expenses
  [OfferingExpenseSearchSubType.KitchenUtensils]: 'Utensilios de cocina',
  [OfferingExpenseSearchSubType.CookingIngredients]: 'Insumos de cocina',
  [OfferingExpenseSearchSubType.OfficeSupplies]: 'Utensilios de oficina',
  [OfferingExpenseSearchSubType.CleaningMaterials]: 'Materiales de limpieza',
  [OfferingExpenseSearchSubType.PackagingMaterials]: 'Materiales de almacenamiento',
  [OfferingExpenseSearchSubType.SundaySchoolMaterials]: 'Material educativo (Esc. Dom.)',
  [OfferingExpenseSearchSubType.RenovationMaterials]: 'Repuestos en general',
  [OfferingExpenseSearchSubType.PaintingSupplies]: 'Utensilios de pintura',
  [OfferingExpenseSearchSubType.ElectricalSupplies]: 'Materiales de electricidad',
  [OfferingExpenseSearchSubType.ConstructionTools]: 'Herramientas de construcción',
  [OfferingExpenseSearchSubType.AudioVisualSupplies]: 'Utensilios de audio y video ',
  [OfferingExpenseSearchSubType.SafetyEquipment]: 'Utensilios de seguridad.',
  [OfferingExpenseSearchSubType.FirstAidSupplies]: 'Insumos y utensilios de primeros auxilios',

  // Planing Events Expenses
  [OfferingExpenseSearchSubType.AdvertisingAndEventPromotion]: 'Publicidad y promoción de eventos',
  [OfferingExpenseSearchSubType.SpecialGuestsFees]: 'Hon. Invitados especiales',
  [OfferingExpenseSearchSubType.SupportStaffFees]: 'Hon. Personal de apoyo',
  [OfferingExpenseSearchSubType.SecurityPersonnelFees]: 'Hon. Personal de seguridad',
  [OfferingExpenseSearchSubType.ExternalVenueRental]: 'Alq. Local externo',
  [OfferingExpenseSearchSubType.RentalTechnicalEquipment]: 'Alq. Equipos técnicos',
  [OfferingExpenseSearchSubType.TransportationSpecialGuests]: 'Trans. Invitados especiales',
  [OfferingExpenseSearchSubType.EquipmentTransportation]: 'Trans. Equipos',
  [OfferingExpenseSearchSubType.PrivateMobilityRental]: 'Alq. Movilidad particular',
  [OfferingExpenseSearchSubType.FoodAndBeverage]: 'Alimentación y bebida',
  [OfferingExpenseSearchSubType.EducationalMaterials]: 'Material didáctico',
  [OfferingExpenseSearchSubType.GiftsAndPrizesParticipants]: 'Premios y regalos',
  [OfferingExpenseSearchSubType.OtherRelatedExpenses]: 'Otros gastos relacionados',

  // Other Expenses
  [OfferingExpenseSearchSubType.FraternalSupport]: 'Apoyo a hermanos de la iglesia',
  [OfferingExpenseSearchSubType.EmergencyRepairs]: 'Rep. urgentes de instalaciones y equipos',
  [OfferingExpenseSearchSubType.HospitalityExpenses]: 'Alojamiento y alimentación de invitados',
  [OfferingExpenseSearchSubType.MissionDonations]: 'Apoyo económico a misiones y misioneros',
  [OfferingExpenseSearchSubType.TrainingAndEducation]: 'Capacitación para líderes y pastores',
  [OfferingExpenseSearchSubType.LegalAndAdministrative]: 'Gastos legales o administrativos',
  [OfferingExpenseSearchSubType.SpecialsProjects]: 'Proyectos especiales',
};

//* Operative Expenses
export enum SubTypeOfferingExpenseSearchByOperativeExpenses {
  VenueRental = 'venue_rental',
  PublicServices = 'public_services',
  TransportationAndTravelAllowance = 'transportation_and_travel_allowance',
  InsuranceAndTaxes = 'insurance_and_taxes',
  SecurityAndSurveillance = 'security_and_surveillance',
  OtherAdministrativeExpenses = 'other_administrative_expenses',
}

export const SubTypeNamesOfferingExpenseSearchByOperativeExpenses: Record<
  SubTypeOfferingExpenseSearchByOperativeExpenses,
  string
> = {
  [SubTypeOfferingExpenseSearchByOperativeExpenses.VenueRental]: 'Alquiler de local',
  [SubTypeOfferingExpenseSearchByOperativeExpenses.PublicServices]: 'Servicios públicos',
  [SubTypeOfferingExpenseSearchByOperativeExpenses.InsuranceAndTaxes]: 'Seguros y/o impuestos',
  [SubTypeOfferingExpenseSearchByOperativeExpenses.TransportationAndTravelAllowance]:
    'Transporte y/o viáticos',
  [SubTypeOfferingExpenseSearchByOperativeExpenses.SecurityAndSurveillance]:
    'Seguridad y vigilancia',
  [SubTypeOfferingExpenseSearchByOperativeExpenses.OtherAdministrativeExpenses]:
    'Otros gastos administrativos',
};

//* Maintenance and Repair Expenses
export enum SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses {
  PlumbingServices = 'plumbing_services',
  ElectricalServices = 'electrical_services',
  PaintingAndTouchUpsServices = 'painting_and_touch_ups_services',
  CleaningServices = 'cleaning_services',
  HeatingAndACSystemMaintenance = 'heating_and_ac_system_maintenance',
  SoundEquipmentMaintenance = 'sound_equipment_maintenance',
  LightingEquipmentMaintenance = 'lighting_equipment_maintenance',
  LightingEquipmentRepairs = 'lighting_equipment_repair',
  SoundEquipmentRepairs = 'sound_equipment_repairs',
  GardenAndExteriorMaintenance = 'garden_and_exterior_maintenance',
  GeneralEquipmentRepairs = 'general_equipment_repairs',
  GeneralEquipmentMaintenance = 'general_equipment_maintenance',
  FurnitureRepairAndMaintenance = 'furniture_repair_and_maintenance',
  ComputerEquipmentRepairAndMaintenance = 'computer_equipment_repair_and_maintenance',
  RoofAndStructuralRepairs = 'roof_and_structural_repairs',
  DoorAndWindowRepairs = 'door_and_window_repairs',
}

export const SubTypeNamesOfferingExpenseSearchByMaintenanceAndRepairExpenses: Record<
  SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses,
  string
> = {
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.PlumbingServices]:
    'Servicios de gasfiteria',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.ElectricalServices]:
    'Servicios de electricidad',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.PaintingAndTouchUpsServices]:
    'Servicios de pintura y retoques',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.CleaningServices]:
    'Servicios de limpieza',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.HeatingAndACSystemMaintenance]:
    'Mantenimiento de SC y AC',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.SoundEquipmentMaintenance]:
    'Mant. Equipos de sonido',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.LightingEquipmentMaintenance]:
    'Mant. Equipos de iluminación',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.GardenAndExteriorMaintenance]:
    'Mant. Jardines y exteriores',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.FurnitureRepairAndMaintenance]:
    'Mant. Muebles',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.ComputerEquipmentRepairAndMaintenance]:
    'Mant. Equipos informáticos',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.GeneralEquipmentMaintenance]:
    'Mant. Equipos en general',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.GeneralEquipmentRepairs]:
    'Rep. Equipos en general',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.RoofAndStructuralRepairs]:
    'Rep. Techo y estructuras',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.DoorAndWindowRepairs]:
    'Rep. Puertas y ventanas',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.SoundEquipmentRepairs]:
    'Rep. Equipos de sonido',
  [SubTypeOfferingExpenseSearchByMaintenanceAndRepairExpenses.LightingEquipmentRepairs]:
    'Rep. Equipos de iluminación',
};

//* Decoration Expenses
export enum SubTypeOfferingExpenseSearchByDecorationExpenses {
  PurchaseFlowersAndPlants = 'purchase_flowers_and_plants',
  PurchaseDecorativeFurniture = 'purchase_decorative_furniture',
  PurchaseDecorativeItems = 'purchase_decorative_items',
  DecorationServices = 'decoration_services',
  LightingAndIlluminationServices = 'lighting_and_illumination_services',
  StageSetupServices = 'stage_setup_services',
  EventDecorationRentals = 'event_decoration_rentals',
  CleaningPostEventServices = 'cleaning_post_event_services',
}

export const SubTypeNamesOfferingExpenseSearchByDecorationExpenses: Record<
  SubTypeOfferingExpenseSearchByDecorationExpenses,
  string
> = {
  [SubTypeOfferingExpenseSearchByDecorationExpenses.PurchaseFlowersAndPlants]:
    'Compra de flores y plantas',
  [SubTypeOfferingExpenseSearchByDecorationExpenses.PurchaseDecorativeFurniture]:
    'Compra de muebles decorativos',
  [SubTypeOfferingExpenseSearchByDecorationExpenses.PurchaseDecorativeItems]:
    'Compra de artículos decorativos',
  [SubTypeOfferingExpenseSearchByDecorationExpenses.DecorationServices]:
    'Servicios de decoración general',
  [SubTypeOfferingExpenseSearchByDecorationExpenses.LightingAndIlluminationServices]:
    'Servicios de iluminación y efectos',
  [SubTypeOfferingExpenseSearchByDecorationExpenses.StageSetupServices]:
    'Servicios de montaje de escenario',
  [SubTypeOfferingExpenseSearchByDecorationExpenses.EventDecorationRentals]:
    'Alquiler de decoraciones especiales',
  [SubTypeOfferingExpenseSearchByDecorationExpenses.CleaningPostEventServices]:
    'Servicios de limpieza post-evento',
};

//* Equipment and Technology Expenses
export enum SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses {
  SoundEquipment = 'sound_equipment',
  ProjectionEquipment = 'projection_equipment',
  HvacEquipment = 'hvac_equipment',
  LightingEquipment = 'lighting_equipment',
  SecurityEquipment = 'security_equipment',
  ComputerEquipment = 'computer_equipment',
  OfficeEquipment = 'office_equipment',
  KitchenEquipment = 'kitchen_equipment',
  ConstructionEquipment = 'construction_equipment',
  CleaningEquipment = 'cleaning_equipment',
  AudioVideoRecordingEquipment = 'audio_video_recording_equipment',
  OfficeFurniture = 'office_furniture',
  KitchenFurniture = 'kitchen_furniture',
  GeneralFurniture = 'general_furniture',
  MusicalInstruments = 'musical_instruments',
  InternetTelephoneServices = 'internet_and_telephone_services',
  HostingSoftwareServices = 'hosting_and_software_services',
}

export const SubTypeNamesOfferingExpenseSearchByEquipmentAndTechnologyExpenses: Record<
  SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses,
  string
> = {
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.SoundEquipment]:
    'Equipos de sonido',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.ProjectionEquipment]:
    'Equipos de proyección',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.HvacEquipment]:
    'Equipos de ventilación, SC y AC',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.LightingEquipment]:
    'Equipos de iluminación',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.SecurityEquipment]:
    'Equipos de seguridad',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.OfficeEquipment]:
    'Equipos de oficina',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.ComputerEquipment]:
    'Equipos informáticos',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.ConstructionEquipment]:
    'Equipos de construcción',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.KitchenEquipment]:
    'Equipos de cocina',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.CleaningEquipment]:
    'Equipos de limpieza',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.AudioVideoRecordingEquipment]:
    'Equipos de grabación (a/v)',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.OfficeFurniture]:
    'Mobiliarios informáticos',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.KitchenFurniture]:
    'Mobiliarios de cocina',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.GeneralFurniture]:
    'Mobiliarios en general',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.MusicalInstruments]:
    'Instrumentos musicales',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.InternetTelephoneServices]:
    'Serv. Internet y telefonía',
  [SubTypeOfferingExpenseSearchByEquipmentAndTechnologyExpenses.HostingSoftwareServices]:
    'Serv. Hosting y software',
};

//* Supplies Expenses
export enum SubTypeOfferingExpenseSearchBySuppliesExpenses {
  KitchenUtensils = 'kitchen_utensils',
  OfficeSupplies = 'office_supplies',
  CookingIngredients = 'cooking_ingredients',
  CleaningMaterials = 'cleaning_materials',
  PackagingMaterials = 'packaging_and_storage_materials',
  SundaySchoolMaterials = 'sunday_school_educational_materials',
  RenovationMaterials = 'renovation_materials',
  PaintingSupplies = 'painting_supplies',
  ElectricalSupplies = 'electrical_supplies',
  ConstructionTools = 'construction_tools',
  AudioVisualSupplies = 'audio_visual_supplies',
  SafetyEquipment = 'safety_equipment',
  FirstAidSupplies = 'first_aid_supplies',
}

export const SubTypeNamesOfferingExpenseSearchBySuppliesExpenses: Record<
  SubTypeOfferingExpenseSearchBySuppliesExpenses,
  string
> = {
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.KitchenUtensils]: 'Utensilios de cocina',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.CookingIngredients]: 'Ingredientes de cocina',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.OfficeSupplies]: 'Utensilios de oficina',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.CleaningMaterials]: 'Materiales de limpieza',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.PackagingMaterials]:
    'Materiales de almacenamiento',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.SundaySchoolMaterials]:
    'Material educativo Esc. Dominical',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.RenovationMaterials]: 'Repuestos en general',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.PaintingSupplies]:
    'Utensilios y materiales de pintura',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.ElectricalSupplies]: 'Materiales de electricidad',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.ConstructionTools]:
    'Herramientas de construcción',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.AudioVisualSupplies]:
    'Utensilios de audio y video ',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.SafetyEquipment]: 'Utensilios de seguridad.',
  [SubTypeOfferingExpenseSearchBySuppliesExpenses.FirstAidSupplies]:
    'Insumos y utensilios de primeros auxilios',
};

//* Planing Events Expenses
export enum SubTypeOfferingExpenseSearchByPlaningEventsExpenses {
  AdvertisingAndEventPromotion = 'advertising_and_event_promotion',
  SpecialGuestsFees = 'special_guests_fess',
  SecurityPersonnelFees = 'security_personnel_fees',
  SupportStaffFees = 'support_staff_fees',
  ExternalVenueRental = 'external_venue_rental',
  FoodAndBeverage = 'food_and_beverage',
  TransportationSpecialGuests = 'transportation_special_guests',
  EquipmentTransportation = 'equipment_transportation',
  RentalTechnicalEquipment = 'rental_technical_equipment',
  PrivateMobilityRental = 'private_mobility_rental',
  EducationalMaterials = 'educational_materials',
  GiftsAndPrizesParticipants = 'gifts_and_prizes_participants',
  OtherRelatedExpenses = 'other_related_expenses',
}

export const SubTypeNamesOfferingExpenseSearchByPlaningEventsExpenses: Record<
  SubTypeOfferingExpenseSearchByPlaningEventsExpenses,
  string
> = {
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.AdvertisingAndEventPromotion]:
    'Publicidad y promoción de eventos',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.SpecialGuestsFees]:
    'Honorarios de invitados especiales',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.SecurityPersonnelFees]:
    'Honorarios de personal de seguridad',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.SupportStaffFees]:
    'Honorarios de personal de apoyo',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.ExternalVenueRental]:
    'Alquiler de local externo',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.RentalTechnicalEquipment]:
    'Alquiler de equipos técnicos',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.TransportationSpecialGuests]:
    'Transporte de invitados especiales',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.EquipmentTransportation]:
    'Transporte de equipos',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.FoodAndBeverage]: 'Alimentación y bebida',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.EducationalMaterials]: 'Material didáctico',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.PrivateMobilityRental]:
    'Alquiler de movilidad particular',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.GiftsAndPrizesParticipants]:
    'Premios y regalos',
  [SubTypeOfferingExpenseSearchByPlaningEventsExpenses.OtherRelatedExpenses]:
    'Otros gastos relacionados',
};

//* Other Expenses
export enum SubTypeOfferingExpenseSearchByOtherExpenses {
  FraternalSupport = 'fraternal_support',
  EmergencyRepairs = 'emergency_repairs',
  HospitalityExpenses = 'hospitality_expenses',
  MissionDonations = 'mission_donations',
  TrainingAndEducation = 'training_and_education',
  LegalAndAdministrative = 'legal_and_administrative',
  SpecialsProjects = 'special_projects',
}

export const SubTypeNamesOfferingExpenseSearchByOtherExpenses: Record<
  SubTypeOfferingExpenseSearchByOtherExpenses,
  string
> = {
  [SubTypeOfferingExpenseSearchByOtherExpenses.FraternalSupport]: 'Apoyo a hermanos de la iglesia',
  [SubTypeOfferingExpenseSearchByOtherExpenses.MissionDonations]:
    'Apoyo económico a misiones y misioneros',
  [SubTypeOfferingExpenseSearchByOtherExpenses.HospitalityExpenses]:
    'Alojamiento y alimentación de invitados',
  [SubTypeOfferingExpenseSearchByOtherExpenses.TrainingAndEducation]:
    'Capacitación para líderes y pastores',
  [SubTypeOfferingExpenseSearchByOtherExpenses.LegalAndAdministrative]:
    'Gastos legales o administrativos',
  [SubTypeOfferingExpenseSearchByOtherExpenses.EmergencyRepairs]:
    'Rep. urgentes de instalaciones y equipos',
  [SubTypeOfferingExpenseSearchByOtherExpenses.SpecialsProjects]: 'Proyectos especiales',
};
