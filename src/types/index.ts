export type UserRole = 'FARMER' | 'ADMIN';

export type SoilType =
  | 'CLAY'
  | 'SANDY'
  | 'LOAMY'
  | 'SILT'
  | 'PEATY'
  | 'CHALKY'
  | 'CLAY_LOAM'
  | 'SANDY_LOAM';

export type IrrigationSource =
  | 'CANAL'
  | 'BOREWELL'
  | 'DRIP'
  | 'SPRINKLER'
  | 'RAIN_FED'
  | 'RIVER_LIFT'
  | 'WELL';

export type FertilityRating = 'OPTIMAL' | 'DEFICIENT' | 'EXCESSIVE' | 'MODERATE';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: number;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  location: string;
  totalAreaAcres: number;
  soilType: SoilType;
  irrigationSource: IrrigationSource;
  primaryCropType?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SoilTest {
  id: string;
  farmId: string;
  userId: string;
  testDate: string;
  phLevel: number; // 0.0 - 14.0
  nitrogenLevel: number; // kg/ha or mg/kg
  phosphorusLevel: number; // kg/ha or mg/kg
  potassiumLevel: number; // kg/ha or mg/kg
  organicMatter?: number; // %
  moistureContent?: number; // %
  electricalConductivity?: number; // dS/m
  fertilityRating: FertilityRating;
  recommendations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalFarms: number;
  totalAcres: number;
  totalSoilTests: number;
  averagePh: number;
  optimalSoilPercent: number;
  deficientTestsCount: number;
  primaryCrops: { crop: string; count: number }[];
  soilTypeDistribution: { type: string; count: number }[];
  latestSoilTests: SoilTest[];
  recentFarms: Farm[];
}

export type CropCategory = 'CEREAL' | 'PULSE' | 'OILSEED' | 'FIBRE' | 'CASH_CROP' | 'HORTICULTURE';
export type CropSeason = 'KHARIF' | 'RABI' | 'ZAID' | 'ALL_SEASON';
export type DataConfidence = 'HIGH' | 'MEDIUM' | 'PROVISIONAL';

export interface Crop {
  cropId: string;
  cropName: string;
  scientificName?: string;
  category: CropCategory;
  suitableSoilTypes: string[];
  minimumSuitablePH: number;
  maximumSuitablePH: number;
  minNitrogenKgPerHa?: number;
  maxNitrogenKgPerHa?: number;
  minPhosphorusKgPerHa?: number;
  maxPhosphorusKgPerHa?: number;
  minPotassiumKgPerHa?: number;
  maxPotassiumKgPerHa?: number;
  minTemperatureCelsius?: number;
  maxTemperatureCelsius?: number;
  minRainfallMm?: number;
  maxRainfallMm?: number;
  suitableSeasons: CropSeason[];
  waterRequirementMm?: number;
  growingDurationDaysMin?: number;
  growingDurationDaysMax?: number;
  botanicalFamily?: string;
  isNitrogenFixer?: boolean;
  isDeepRooted?: boolean;
  goodFollowers?: string[];
  badFollowers?: string[];
  sourceReferences?: string;
  sourceUpdatedAt?: string;
  dataConfidence: DataConfidence;
  description?: string;
}

export interface ComponentScores {
  soilScore: number;
  climateScore: number;
  waterScore: number;
  seasonScore: number;
  rotationScore: number;
}

export interface SustainabilityScore {
  overallScore: number;
  waterEfficiencyScore: number;
  soilConservationScore: number;
  biodiversityScore: number;
  organicCompatibilityScore: number;
  practiceNotes: string[];
}

export interface CropRecommendationDto {
  cropId: string;
  cropName: string;
  scientificName?: string;
  category: string;
  suitabilityScore: number;
  rank: number;
  componentScores: ComponentScores;
  sustainability: SustainabilityScore;
  reasons: string[];
  warnings: string[];
  criticalConstraintFailed: boolean;
  failureReason?: string;
  estimatedWaterNeedMm?: number;
  estimatedDurationDays?: number;
  sourceReferences?: string;
  dataConfidence: DataConfidence;
  dataCompleteness: 'COMPLETE' | 'PARTIAL' | 'MINIMAL';
}

export interface RecommendationResponse {
  id: string;
  farmId: string;
  farmName: string;
  season: string;
  scoreVersion: string;
  topRecommendations: CropRecommendationDto[];
  otherCandidates: CropRecommendationDto[];
  missingDataNotices: string[];
  globalWarnings: string[];
  scoreMethodologyExplanation: string;
  createdAt: string;
}

export interface RecommendationHistoryItem {
  id: string;
  farmId: string;
  userId: string;
  season: string;
  scoreVersion: string;
  soilType?: string;
  phLevel?: number;
  nitrogenLevel?: number;
  phosphorusLevel?: number;
  potassiumLevel?: number;
  temperature?: number;
  rainfall?: number;
  irrigationMethod?: string;
  previousCrop?: string;
  createdAt: string;
}

export interface WaterBudgetResponse {
  id: string;
  farmId: string;
  cropName: string;
  areaAcres: number;
  areaHectares: number;
  cropWaterDemandMm: number;
  effectiveRainfallMm: number;
  netIrrigationRequirementMm: number;
  grossIrrigationRequirementMm: number;
  totalCropDemandM3: number;
  effectiveRainfallContributionM3: number;
  netIrrigationM3: number;
  grossIrrigationM3: number;
  irrigationMethod: string;
  irrigationEfficiency: number;
  waterScarcityIndex: number;
  waterBalanceStatus: 'SURPLUS' | 'SUFFICIENT' | 'MODERATE_DEFICIT' | 'SEVERE_DEFICIT' | 'DATA_INSUFFICIENT';
  deficitOrSurplusM3: number;
  seasonalSavingsTips: string[];
  modelingAssumptions: string[];
  warnings: string[];
  createdAt: string;
}

export interface CropRotationEvaluation {
  candidateCrop: string;
  previousCrop: string;
  rotationScore: number;
  reasons: string[];
  warnings: string[];
  previousCropFamily: string;
}

export interface CropHistoryEntry {
  id: string;
  farmId: string;
  userId: string;
  cropName: string;
  botanicalFamily?: string;
  season: string;
  sowingDate?: string;
  harvestDate?: string;
  areaPlantedAcres?: number;
  yieldMetricTons?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfitabilityResponse {
  id: string;
  farmId: string;
  cropName: string;
  areaAcres: number;
  seedCost: number;
  fertilizerCost: number;
  labourCost: number;
  irrigationCost: number;
  equipmentCost: number;
  otherCosts: number;
  totalCost: number;
  costPerAcre: number;
  expectedYieldPerAcre: number;
  yieldUnit: string;
  expectedTotalYield: number;
  expectedSellingPricePerUnit: number;
  estimatedRevenue: number;
  estimatedProfit: number;
  profitPerAcre: number;
  returnOnInvestmentPercent: number;
  breakEvenPricePerUnit: number;
  currency: string;
  costBreakdownPercent: Record<string, number>;
  financialAssumptions: string[];
  riskFactors: string[];
}

export interface FarmingPlan {
  id: string;
  farmId: string;
  farmName: string;
  userId: string;
  title: string;
  season: CropSeason;
  targetCrop: string;
  areaAcres: number;
  sowingMonth: string;
  harvestMonth: string;
  expectedYield: number;
  yieldUnit: string;
  expectedProfit: number;
  estimatedWaterM3: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'HARVESTED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyForecast {
  date: string;
  maxTempCelsius: number;
  minTempCelsius: number;
  precipitationProbabilityPercent: number;
  precipitationSumMm: number;
  condition: string;
}

export interface WeatherTelemetry {
  farmId: string;
  farmName: string;
  location: string;
  latitude: number;
  longitude: number;
  provider: string;
  observationTime: string;
  retrievalTime: string;
  dataFreshness: 'FRESH' | 'CACHED' | 'LOCAL_BASELINE';
  currentTemperatureCelsius: number;
  currentRelativeHumidityPercent: number;
  currentWindSpeedKmh: number;
  currentPrecipitationMm: number;
  currentCondition: string;
  dailyForecasts: DailyForecast[];
}

export interface WeatherAdvisory {
  id: string;
  farmId: string;
  title: string;
  description: string;
  severity: 'INFO' | 'ADVISORY' | 'WARNING' | 'URGENT';
  category: string;
  forecastPeriod: string;
  dataSource: string;
  createdAt: string;
  expiresAt: string;
  isActionRequired: boolean;
}

export interface MlPredictionResult {
  predictedCrop: string;
  confidence: number;
  modelVersion: string;
  validationStatus: string;
  uncertaintyWarning?: string;
  alternatives: { crop: string; probability: number }[];
  caveats: string[];
  isAvailable: boolean;
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'RECOMMENDATION' | 'SOIL_ALERT' | 'WEATHER_ALERT' | 'REPORT_READY' | 'SYSTEM';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}


