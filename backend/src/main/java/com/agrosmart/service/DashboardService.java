package com.agrosmart.service;

import com.agrosmart.dto.DashboardSummaryDto;
import com.agrosmart.dto.FarmResponse;
import com.agrosmart.dto.SoilTestResponse;
import com.agrosmart.model.FertilityRating;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final FarmService farmService;
    private final SoilTestService soilTestService;

    @Autowired
    public DashboardService(FarmService farmService, SoilTestService soilTestService) {
        this.farmService = farmService;
        this.soilTestService = soilTestService;
    }

    public DashboardSummaryDto getSummary(String userId) {
        List<FarmResponse> farms = farmService.getFarmsForUser(userId);
        List<SoilTestResponse> soilTests = soilTestService.getSoilTests(userId, null);

        int totalFarms = farms.size();
        double totalAcres = 0.0;
        for (FarmResponse f : farms) {
            if (f.getTotalAreaAcres() != null) {
                totalAcres += f.getTotalAreaAcres();
            }
        }

        int totalSoilTests = soilTests.size();
        double sumPh = 0.0;
        int optimalCount = 0;
        int deficientCount = 0;

        for (SoilTestResponse t : soilTests) {
            if (t.getPhLevel() != null) sumPh += t.getPhLevel();
            if (t.getFertilityRating() == FertilityRating.OPTIMAL) optimalCount++;
            if (t.getFertilityRating() == FertilityRating.DEFICIENT) deficientCount++;
        }

        double averagePh = totalSoilTests > 0 ? Math.round((sumPh / totalSoilTests) * 100.0) / 100.0 : 6.5;
        int optimalSoilPercent = totalSoilTests > 0 ? (int) Math.round(((double) optimalCount / totalSoilTests) * 100.0) : 0;

        DashboardSummaryDto summary = new DashboardSummaryDto();
        summary.setTotalFarms(totalFarms);
        summary.setTotalAcres(Math.round(totalAcres * 10.0) / 10.0);
        summary.setTotalSoilTests(totalSoilTests);
        summary.setAveragePh(averagePh);
        summary.setOptimalSoilPercent(optimalSoilPercent);
        summary.setDeficientTestsCount(deficientCount);
        summary.setRecentFarms(farms.size() > 5 ? farms.subList(0, 5) : farms);
        summary.setRecentSoilTests(soilTests.size() > 5 ? soilTests.subList(0, 5) : soilTests);

        return summary;
    }
}
