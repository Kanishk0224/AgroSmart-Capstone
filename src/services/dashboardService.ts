import { farmService } from './farmService';
import { soilService } from './soilService';
import { DashboardStats, Farm, SoilTest } from '../types';

export const dashboardService = {
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const [farms, soilTests] = await Promise.all([
      farmService.getFarms(userId),
      soilService.getSoilTests(userId),
    ]);

    const totalFarms = farms.length;
    const totalAcres = farms.reduce((acc, f) => acc + (f.totalAreaAcres || 0), 0);
    const totalSoilTests = soilTests.length;

    const averagePh =
      soilTests.length > 0
        ? Number(
            (
              soilTests.reduce((acc, t) => acc + (t.phLevel || 0), 0) /
              soilTests.length
            ).toFixed(2)
          )
        : 6.5;

    const optimalTests = soilTests.filter((t) => t.fertilityRating === 'OPTIMAL');
    const optimalSoilPercent =
      soilTests.length > 0
        ? Math.round((optimalTests.length / soilTests.length) * 100)
        : 0;

    const deficientTestsCount = soilTests.filter(
      (t) => t.fertilityRating === 'DEFICIENT'
    ).length;

    // Crop distribution
    const cropCounts: Record<string, number> = {};
    farms.forEach((f) => {
      if (f.primaryCropType) {
        const crop = f.primaryCropType.split('&')[0].trim();
        cropCounts[crop] = (cropCounts[crop] || 0) + 1;
      }
    });
    const primaryCrops = Object.entries(cropCounts).map(([crop, count]) => ({
      crop,
      count,
    }));

    // Soil type distribution
    const soilCounts: Record<string, number> = {};
    farms.forEach((f) => {
      if (f.soilType) {
        const typeFormatted = f.soilType.replace('_', ' ');
        soilCounts[typeFormatted] = (soilCounts[typeFormatted] || 0) + 1;
      }
    });
    const soilTypeDistribution = Object.entries(soilCounts).map(([type, count]) => ({
      type,
      count,
    }));

    return {
      totalFarms,
      totalAcres: Number(totalAcres.toFixed(1)),
      totalSoilTests,
      averagePh,
      optimalSoilPercent,
      deficientTestsCount,
      primaryCrops,
      soilTypeDistribution,
      latestSoilTests: soilTests.slice(0, 5),
      recentFarms: farms.slice(0, 5),
    };
  },
};
