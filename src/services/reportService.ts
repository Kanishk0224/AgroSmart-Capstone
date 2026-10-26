import { Farm, SoilTest, CropRecommendationDto, WaterBudgetResponse, FarmingPlan } from '../types';

export const reportService = {
  downloadCsv(filename: string, csvContent: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  generateFarmsCsv(farms: Farm[]): string {
    let csv = 'Farm ID,Parcel Name,Location,Acreage,Soil Classification,Irrigation System,Primary Crop,Registration Date\n';
    farms.forEach((f) => {
      csv += `${escape(f.id)},${escape(f.name)},${escape(f.location)},${f.totalAreaAcres},${escape(f.soilType)},${escape(f.irrigationSource)},${escape(f.primaryCropType || 'N/A')},${escape(f.createdAt)}\n`;
    });
    return csv;
  },

  generateSoilTestsCsv(tests: SoilTest[], farms: Farm[]): string {
    let csv = 'Test ID,Farm Parcel,Date,pH Level,Nitrogen (kg/ha),Phosphorus (kg/ha),Potassium (kg/ha),Fertility Rating,Agronomic Recommendations\n';
    tests.forEach((t) => {
      const f = farms.find((farm) => farm.id === t.farmId);
      csv += `${escape(t.id)},${escape(f ? f.name : t.farmId)},${escape(t.testDate)},${t.phLevel},${t.nitrogenLevel},${t.phosphorusLevel},${t.potassiumLevel},${escape(t.fertilityRating)},${escape(t.recommendations || '')}\n`;
    });
    return csv;
  },

  generateRecommendationsCsv(recs: CropRecommendationDto[], farmName: string, season: string): string {
    let csv = `Rank,Cultivar Name,Category,Overall Suitability Score,Soil Score,Water Score,Season Score,Climate Score,Rotation Score,Water Need (mm),Duration (Days),Data Confidence\n`;
    recs.forEach((r, idx) => {
      csv += `${idx + 1},${escape(r.cropName)},${escape(r.category)},${r.suitabilityScore},${r.componentScores.soilScore},${r.componentScores.waterScore},${r.componentScores.seasonScore},${r.componentScores.climateScore},${r.componentScores.rotationScore},${r.estimatedWaterNeedMm || 500},${r.estimatedDurationDays || 120},${escape(r.dataConfidence)}\n`;
    });
    return csv;
  },

  generateFarmingPlansCsv(plans: FarmingPlan[]): string {
    let csv = 'Plan ID,Title,Parcel Name,Season,Target Cultivar,Acreage,Sowing Calendar,Harvest Calendar,Expected Yield,Expected Net Profit (INR),Status\n';
    plans.forEach((p) => {
      csv += `${escape(p.id)},${escape(p.title)},${escape(p.farmName)},${escape(p.season)},${escape(p.targetCrop)},${p.areaAcres},${escape(p.sowingMonth)},${escape(p.harvestMonth)},${p.expectedYield} ${p.yieldUnit},${p.expectedProfit},${escape(p.status)}\n`;
    });
    return csv;
  },
};

/**
 * RFC 4180 Escaping with OWASP CSV Injection Sanitization (Formula injection defense).
 */
function escape(val: any): string {
  if (val === undefined || val === null) return '""';
  let clean = String(val).trim();
  // Neutralize spreadsheet formula execution (=, +, -, @)
  if (clean.startsWith('=') || clean.startsWith('+') || clean.startsWith('-') || clean.startsWith('@')) {
    clean = `'${clean}`;
  }
  return `"${clean.replace(/"/g, '""')}"`;
}
