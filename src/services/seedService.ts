import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Farm, SoilTest, UserProfile, FarmingPlan, CropHistoryEntry, WaterBudgetResponse, ProfitabilityResponse, RecommendationResponse } from '../types';
import { VERIFIED_CROP_CATALOG } from './cropService';

export const INITIAL_FARMS_TEMPLATE = [
  {
    idSuffix: '001',
    name: 'Green Valley Organic Estate',
    location: 'District Nashik, Maharashtra',
    totalAreaAcres: 14.5,
    soilType: 'LOAMY' as const,
    irrigationSource: 'DRIP' as const,
    primaryCropType: 'Pomegranate & Grapes',
    notes: 'Well-drained volcanic soil with automated micro-drip irrigation network.',
  },
  {
    idSuffix: '002',
    name: 'Sunrise Fertile Plains',
    location: 'Bhatinda Agro Corridor, Punjab',
    totalAreaAcres: 28.0,
    soilType: 'CLAY_LOAM' as const,
    irrigationSource: 'CANAL' as const,
    primaryCropType: 'Wheat & Mustard',
    notes: 'Seasonal canal water allocation supplemented with solar borewell backup.',
  },
  {
    idSuffix: '003',
    name: 'Cauvery River Terrace Field',
    location: 'Thanjavur Delta, Tamil Nadu',
    totalAreaAcres: 8.2,
    soilType: 'CLAY' as const,
    irrigationSource: 'CANAL' as const,
    primaryCropType: 'Basmati Rice (Kharif)',
    notes: 'High water-holding capacity, optimal for wetland paddy cultivation.',
  },
  {
    idSuffix: '004',
    name: 'Highland Spice Plantation',
    location: 'Wayanad Ghats, Kerala',
    totalAreaAcres: 6.0,
    soilType: 'SANDY_LOAM' as const,
    irrigationSource: 'SPRINKLER' as const,
    primaryCropType: 'Black Pepper & Cardamom',
    notes: 'Rich forest humic topsoil on terrace slopes.',
  },
];

export const INITIAL_SOIL_TEMPLATE = [
  {
    idSuffix: '001',
    farmSuffix: '001',
    testDate: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString().split('T')[0],
    phLevel: 6.8,
    nitrogenLevel: 320,
    phosphorusLevel: 24,
    potassiumLevel: 210,
    organicMatter: 2.4,
    moistureContent: 22,
    electricalConductivity: 0.45,
    fertilityRating: 'OPTIMAL' as const,
    recommendations:
      'Balanced nutrient profile and near-neutral pH. Maintain current bio-compost and vermiculture schedule.',
  },
  {
    idSuffix: '002',
    farmSuffix: '002',
    testDate: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString().split('T')[0],
    phLevel: 7.9,
    nitrogenLevel: 210,
    phosphorusLevel: 14,
    potassiumLevel: 160,
    organicMatter: 1.1,
    moistureContent: 18,
    electricalConductivity: 0.82,
    fertilityRating: 'DEFICIENT' as const,
    recommendations:
      'Alkaline tendency with low available nitrogen and phosphorus. Apply gypsum dressing (200 kg/ha) and green manure (Sesbania).',
  },
  {
    idSuffix: '003',
    farmSuffix: '003',
    testDate: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString().split('T')[0],
    phLevel: 6.4,
    nitrogenLevel: 380,
    phosphorusLevel: 32,
    potassiumLevel: 280,
    organicMatter: 2.8,
    moistureContent: 35,
    electricalConductivity: 0.38,
    fertilityRating: 'OPTIMAL' as const,
    recommendations:
      'Excellent fertility index with rich organic matter. Highly suitable for Kharif paddy followed by pulse rotation.',
  },
  {
    idSuffix: '004',
    farmSuffix: '004',
    testDate: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString().split('T')[0],
    phLevel: 5.6,
    nitrogenLevel: 260,
    phosphorusLevel: 16,
    potassiumLevel: 195,
    organicMatter: 3.2,
    moistureContent: 24,
    electricalConductivity: 0.28,
    fertilityRating: 'MODERATE' as const,
    recommendations:
      'Moderately acidic hill soil with excellent organic carbon. Broadcast agricultural dolomite lime (1.5 t/ha) to optimize magnesium and pH levels.',
  },
];

export async function seedFirestoreForUser(
  userId: string,
  userEmail?: string,
  userName?: string
): Promise<{
  farmsCount: number;
  testsCount: number;
  cropsCount: number;
  plansCount: number;
  historyCount: number;
  waterCount: number;
  profitCount: number;
}> {
  const now = new Date().toISOString();

  // 1. Seed user profile
  const userProfile: UserProfile = {
    uid: userId,
    email: userEmail || 'farmer@agrosmart360.org',
    fullName: userName || 'P. Jeeva',
    role: 'FARMER',
    termsAccepted: true,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, 'users', userId), userProfile);

  // 2. Seed verified crop catalog into Firestore 'crops' collection
  for (const crop of VERIFIED_CROP_CATALOG) {
    await setDoc(doc(db, 'crops', crop.cropId), crop);
  }

  // 3. Seed farms with consistent IDs
  const farmIds: Record<string, string> = {};
  for (const t of INITIAL_FARMS_TEMPLATE) {
    const farmId = `farm-${userId.substring(0, 6)}-${t.idSuffix}`;
    farmIds[t.idSuffix] = farmId;
    const farmData: Farm = {
      id: farmId,
      userId,
      name: t.name,
      location: t.location,
      totalAreaAcres: t.totalAreaAcres,
      soilType: t.soilType,
      irrigationSource: t.irrigationSource,
      primaryCropType: t.primaryCropType,
      notes: t.notes,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, 'farms', farmId), farmData);
  }

  // 4. Seed soil tests linked to the farms
  for (const t of INITIAL_SOIL_TEMPLATE) {
    const testId = `soil-${userId.substring(0, 6)}-${t.idSuffix}`;
    const farmId = farmIds[t.farmSuffix] || `farm-${userId.substring(0, 6)}-001`;
    const soilData: SoilTest = {
      id: testId,
      farmId,
      userId,
      testDate: t.testDate,
      phLevel: t.phLevel,
      nitrogenLevel: t.nitrogenLevel,
      phosphorusLevel: t.phosphorusLevel,
      potassiumLevel: t.potassiumLevel,
      organicMatter: t.organicMatter,
      moistureContent: t.moistureContent,
      electricalConductivity: t.electricalConductivity,
      fertilityRating: t.fertilityRating,
      recommendations: t.recommendations,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, 'soilTests', testId), soilData);
  }

  // 5. Seed Crop Rotation History entries
  const primaryFarmId = farmIds['001'] || `farm-${userId.substring(0, 6)}-001`;
  const secondaryFarmId = farmIds['002'] || `farm-${userId.substring(0, 6)}-002`;

  const rotationHistoryList: CropHistoryEntry[] = [
    {
      id: `hist-${userId.substring(0, 6)}-01`,
      farmId: primaryFarmId,
      userId,
      cropName: 'Chickpea (Gram)',
      botanicalFamily: 'Fabaceae (Leguminosae)',
      season: 'RABI',
      sowingDate: '2024-10-15',
      harvestDate: '2025-02-20',
      areaPlantedAcres: 12.0,
      yieldMetricTons: 18.5,
      notes: 'Legume cycle successfully recharged residual root-zone soil nitrogen by ~35 kg/ha.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `hist-${userId.substring(0, 6)}-02`,
      farmId: secondaryFarmId,
      userId,
      cropName: 'Bread Wheat',
      botanicalFamily: 'Poaceae',
      season: 'RABI',
      sowingDate: '2024-11-05',
      harvestDate: '2025-04-10',
      areaPlantedAcres: 25.0,
      yieldMetricTons: 52.0,
      notes: 'Good harvest with canal irrigation; soil test indicated need for minor phosphorus top-dressing.',
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const hist of rotationHistoryList) {
    await setDoc(doc(db, 'crop_history', hist.id), hist);
  }

  // 6. Seed Farming Plans
  const farmingPlans: FarmingPlan[] = [
    {
      id: `plan-${userId.substring(0, 6)}-01`,
      farmId: primaryFarmId,
      farmName: 'Green Valley Organic Estate',
      userId,
      title: 'Kharif 2025 Precision Soybean & Maize Cycle',
      season: 'KHARIF',
      targetCrop: 'Soybean',
      areaAcres: 14.5,
      sowingMonth: 'June',
      harvestMonth: 'October',
      expectedYield: 174,
      yieldUnit: 'Quintals',
      expectedProfit: 395000,
      estimatedWaterM3: 6520,
      status: 'PLANNED',
      notes: 'Follows previous chickpea harvest. Drip irrigation schedule automated based on moisture sensor readings.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `plan-${userId.substring(0, 6)}-02`,
      farmId: secondaryFarmId,
      farmName: 'Sunrise Fertile Plains',
      userId,
      title: 'Rabi 2025 Certified Mustard & Wheat Allocation',
      season: 'RABI',
      targetCrop: 'Mustard',
      areaAcres: 20.0,
      sowingMonth: 'October',
      harvestMonth: 'February',
      expectedYield: 160,
      yieldUnit: 'Quintals',
      expectedProfit: 540000,
      estimatedWaterM3: 5200,
      status: 'IN_PROGRESS',
      notes: 'Low water requirement oilseed crop capitalizing on early winter dew and canal allocation.',
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const plan of farmingPlans) {
    await setDoc(doc(db, 'farming_plans', plan.id), plan);
  }

  // 7. Seed Water Budgets
  const sampleWaterBudget: WaterBudgetResponse & { userId: string } = {
    id: `wb-${userId.substring(0, 6)}-01`,
    farmId: primaryFarmId,
    cropName: 'Soybean',
    areaAcres: 14.5,
    areaHectares: 5.87,
    cropWaterDemandMm: 450,
    effectiveRainfallMm: 280,
    netIrrigationRequirementMm: 170,
    grossIrrigationRequirementMm: 188.9,
    totalCropDemandM3: 26405,
    effectiveRainfallContributionM3: 16430,
    netIrrigationM3: 9975,
    grossIrrigationM3: 11083,
    irrigationMethod: 'DRIP',
    irrigationEfficiency: 90,
    waterScarcityIndex: 42,
    waterBalanceStatus: 'SUFFICIENT',
    deficitOrSurplusM3: 3917,
    seasonalSavingsTips: [
      'Micro-drip irrigation saves ~35-40% water compared to conventional surface flooding.',
      'Apply organic mulch (paddy straw) around root zones to reduce soil evaporation loss by up to 25%.',
      'Schedule irrigation cycles during dawn or dusk to avoid midday atmospheric evaporative loss.',
    ],
    modelingAssumptions: [
      'USDA-SCS Effective Precipitation Model applied to seasonal rainfall expectation.',
      'Micro-irrigation distribution efficiency calibrated at 90%.',
    ],
    warnings: [],
    createdAt: now,
    userId,
  };
  await setDoc(doc(db, 'water_budgets', sampleWaterBudget.id), sampleWaterBudget);

  // 8. Seed Profitability Estimates
  const sampleProfitability: ProfitabilityResponse & { userId: string } = {
    id: `prof-${userId.substring(0, 6)}-01`,
    farmId: primaryFarmId,
    cropName: 'Soybean',
    areaAcres: 14.5,
    seedCost: 36250,
    fertilizerCost: 58000,
    labourCost: 79750,
    irrigationCost: 29000,
    equipmentCost: 43500,
    otherCosts: 17400,
    totalCost: 263900,
    costPerAcre: 18200,
    expectedYieldPerAcre: 12.0,
    yieldUnit: 'Quintals',
    expectedTotalYield: 174.0,
    expectedSellingPricePerUnit: 4600,
    estimatedRevenue: 800400,
    estimatedProfit: 536500,
    profitPerAcre: 37000,
    returnOnInvestmentPercent: 203.3,
    breakEvenPricePerUnit: 1516.67,
    currency: 'INR',
    costBreakdownPercent: {
      'Seeds': 13.7,
      'Fertilizer': 22.0,
      'Labour': 30.2,
      'Irrigation': 11.0,
      'Equipment': 16.5,
      'Other': 6.6,
    },
    financialAssumptions: [
      'Excludes capital equipment depreciation and land rental interest charges.',
      'Assumes normal weather window with zero severe lodging or flood damage.',
      'Calibrated for 14.5 acre parcel extent.',
    ],
    riskFactors: [
      'Monsoon arrival delay may impact initial seed germination rate.',
      'Market price volatility post harvest peak arrivals.',
    ],
    userId,
  };
  await setDoc(doc(db, 'profitability_estimates', sampleProfitability.id), sampleProfitability);

  // 9. Seed Sample Recommendations
  const sampleRecommendation: RecommendationResponse & { userId: string } = {
    id: `rec-${userId.substring(0, 6)}-01`,
    farmId: primaryFarmId,
    farmName: 'Green Valley Organic Estate',
    season: 'KHARIF',
    scoreVersion: '2.0.0-ICAR',
    topRecommendations: [
      {
        cropId: 'crop-soybean',
        cropName: 'Soybean (Glycine max)',
        scientificName: 'Glycine max',
        category: 'PULSE',
        suitabilityScore: 92,
        rank: 1,
        componentScores: {
          soilScore: 94,
          climateScore: 90,
          waterScore: 95,
          seasonScore: 100,
          rotationScore: 88,
        },
        sustainability: {
          overallScore: 95,
          waterEfficiencyScore: 95,
          soilConservationScore: 95,
          biodiversityScore: 88,
          organicCompatibilityScore: 90,
          practiceNotes: [
            'Nitrogen-fixing legume provides organic soil fertility credits for next rotation.',
            'Drip micro-irrigation maximizes water productivity.',
          ],
        },
        reasons: [
          'Optimal pH match (6.8 test vs 6.0-7.5 ideal crop threshold).',
          'Compatible loamy soil with excellent internal percolation.',
          'Nitrogen-fixing legume provides organic soil fertility credits for next rotation.',
        ],
        warnings: [],
        criticalConstraintFailed: false,
        estimatedWaterNeedMm: 450,
        estimatedDurationDays: 105,
        sourceReferences: 'ICAR-IISR Indore Soybean Production Technology (2022)',
        dataConfidence: 'HIGH',
        dataCompleteness: 'COMPLETE',
      },
      {
        cropId: 'crop-maize',
        cropName: 'Hybrid Maize / Corn',
        scientificName: 'Zea mays',
        category: 'CEREAL',
        suitabilityScore: 86,
        rank: 2,
        componentScores: {
          soilScore: 90,
          climateScore: 88,
          waterScore: 82,
          seasonScore: 95,
          rotationScore: 85,
        },
        sustainability: {
          overallScore: 80,
          waterEfficiencyScore: 85,
          soilConservationScore: 80,
          biodiversityScore: 85,
          organicCompatibilityScore: 80,
          practiceNotes: [
            'High biomass crop enhances organic matter return when crop residues are incorporated.',
          ],
        },
        reasons: [
          'High responsive yield to warm Kharif climate and loamy soil profile.',
          'Moderate water demand efficiently fulfilled by drip irrigation system.',
        ],
        warnings: ['Heavy nitrogen feeder; split urea or organic vermicompost application recommended.'],
        criticalConstraintFailed: false,
        estimatedWaterNeedMm: 500,
        estimatedDurationDays: 100,
        sourceReferences: 'ICAR-IIMR Ludhiana Maize Compendium',
        dataConfidence: 'HIGH',
        dataCompleteness: 'COMPLETE',
      },
    ],
    otherCandidates: [],
    missingDataNotices: [],
    globalWarnings: [],
    scoreMethodologyExplanation: 'Multi-criteria weighted model: Soil 35%, Water 25%, Season 20%, Climate 10%, Rotation 10%.',
    createdAt: now,
    userId,
  };
  await setDoc(doc(db, 'crop_recommendations', sampleRecommendation.id), sampleRecommendation);

  return {
    farmsCount: INITIAL_FARMS_TEMPLATE.length,
    testsCount: INITIAL_SOIL_TEMPLATE.length,
    cropsCount: VERIFIED_CROP_CATALOG.length,
    plansCount: farmingPlans.length,
    historyCount: rotationHistoryList.length,
    waterCount: 1,
    profitCount: 1,
  };
}
