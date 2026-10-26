package com.agrosmart.service;

import com.agrosmart.exception.ResourceNotFoundException;
import com.agrosmart.exception.UnauthorizedException;
import com.agrosmart.model.*;
import com.agrosmart.repository.*;
import com.agrosmart.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReportService {

    private final FarmRepository farmRepository;
    private final SoilTestRepository soilTestRepository;
    private final CropRecommendationRepository recommendationRepository;
    private final WaterBudgetRepository waterBudgetRepository;
    private final CropHistoryRepository cropHistoryRepository;
    private final ProfitabilityRepository profitabilityRepository;

    @Autowired
    public ReportService(
            FarmRepository farmRepository,
            SoilTestRepository soilTestRepository,
            CropRecommendationRepository recommendationRepository,
            WaterBudgetRepository waterBudgetRepository,
            CropHistoryRepository cropHistoryRepository,
            ProfitabilityRepository profitabilityRepository) {
        this.farmRepository = farmRepository;
        this.soilTestRepository = soilTestRepository;
        this.recommendationRepository = recommendationRepository;
        this.waterBudgetRepository = waterBudgetRepository;
        this.cropHistoryRepository = cropHistoryRepository;
        this.profitabilityRepository = profitabilityRepository;
    }

    public String generateCsvReport(String type, String farmId, String userId) {
        StringBuilder csv = new StringBuilder();

        if ("farms".equalsIgnoreCase(type)) {
            csv.append("Farm ID,Name,Location,Acreage,Soil Type,Irrigation Method,Primary Crop,Created Date\n");
            List<Farm> farms = farmRepository.findByUserId(userId);
            for (Farm f : farms) {
                csv.append(escape(f.getId())).append(",")
                   .append(escape(f.getName())).append(",")
                   .append(escape(f.getLocation())).append(",")
                   .append(f.getTotalAreaAcres()).append(",")
                   .append(escape(f.getSoilType())).append(",")
                   .append(escape(f.getIrrigationSource())).append(",")
                   .append(escape(f.getPrimaryCropType() != null ? f.getPrimaryCropType() : "N/A")).append(",")
                   .append(escape(f.getCreatedAt())).append("\n");
            }
        } else if ("soil".equalsIgnoreCase(type)) {
            csv.append("Test ID,Farm ID,Date,pH,Nitrogen (kg/ha),Phosphorus (kg/ha),Potassium (kg/ha),Fertility Rating,Recommendations\n");
            List<SoilTest> tests = soilTestRepository.findByUserId(userId);
            for (SoilTest t : tests) {
                if (farmId == null || farmId.equals(t.getFarmId())) {
                    csv.append(escape(t.getId())).append(",")
                       .append(escape(t.getFarmId())).append(",")
                       .append(escape(t.getTestDate())).append(",")
                       .append(t.getPhLevel()).append(",")
                       .append(t.getNitrogenLevel()).append(",")
                       .append(t.getPhosphorusLevel()).append(",")
                       .append(t.getPotassiumLevel()).append(",")
                       .append(escape(t.getFertilityRating() != null ? t.getFertilityRating().name() : "N/A")).append(",")
                       .append(escape(t.getRecommendations() != null ? t.getRecommendations() : "")).append("\n");
                }
            }
        } else if ("recommendations".equalsIgnoreCase(type)) {
            csv.append("Recommendation ID,Farm ID,Season,Soil Type,pH,Nitrogen,Phosphorus,Potassium,Irrigation,Previous Crop,Created At\n");
            List<CropRecommendation> recs = recommendationRepository.findByUserId(userId);
            for (CropRecommendation r : recs) {
                if (farmId == null || farmId.equals(r.getFarmId())) {
                    csv.append(escape(r.getId())).append(",")
                       .append(escape(r.getFarmId())).append(",")
                       .append(escape(r.getSeason())).append(",")
                       .append(escape(r.getSoilType())).append(",")
                       .append(r.getPhLevel()).append(",")
                       .append(r.getNitrogenLevel()).append(",")
                       .append(r.getPhosphorusLevel()).append(",")
                       .append(r.getPotassiumLevel()).append(",")
                       .append(escape(r.getIrrigationMethod())).append(",")
                       .append(escape(r.getPreviousCrop())).append(",")
                       .append(escape(r.getCreatedAt())).append("\n");
                }
            }
        } else if ("rotation".equalsIgnoreCase(type)) {
            csv.append("History ID,Farm ID,Crop Name,Botanical Family,Season,Sown Date,Harvest Date,Acreage,Yield (MT),Notes\n");
            List<CropHistory> list = cropHistoryRepository.findByUserId(userId);
            for (CropHistory h : list) {
                if (farmId == null || farmId.equals(h.getFarmId())) {
                    csv.append(escape(h.getId())).append(",")
                       .append(escape(h.getFarmId())).append(",")
                       .append(escape(h.getCropName())).append(",")
                       .append(escape(h.getBotanicalFamily())).append(",")
                       .append(escape(h.getSeason())).append(",")
                       .append(escape(h.getSowingDate())).append(",")
                       .append(escape(h.getHarvestDate())).append(",")
                       .append(h.getAreaPlantedAcres()).append(",")
                       .append(h.getYieldMetricTons()).append(",")
                       .append(escape(h.getNotes())).append("\n");
                }
            }
        } else if ("profitability".equalsIgnoreCase(type)) {
            csv.append("Estimate ID,Farm ID,Crop Name,Acreage,Total Cost,Estimated Revenue,Estimated Profit,ROI Percent,Created At\n");
            List<ProfitabilityEstimate> list = profitabilityRepository.findByUserId(userId);
            for (ProfitabilityEstimate p : list) {
                if (farmId == null || farmId.equals(p.getFarmId())) {
                    csv.append(escape(p.getId())).append(",")
                       .append(escape(p.getFarmId())).append(",")
                       .append(escape(p.getCropName())).append(",")
                       .append(p.getAreaAcres()).append(",")
                       .append(p.getTotalCost()).append(",")
                       .append(p.getEstimatedRevenue()).append(",")
                       .append(p.getEstimatedProfit()).append(",")
                       .append(p.getRoiPercent()).append(",")
                       .append(escape(p.getCreatedAt())).append("\n");
                }
            }
        } else {
            csv.append("Entity,Count,Export Timestamp\n")
               .append("Total Managed Farms,").append(farmRepository.findByUserId(userId).size()).append(",").append(escape(DateUtils.nowIso())).append("\n")
               .append("Total Soil Tests,").append(soilTestRepository.findByUserId(userId).size()).append(",").append(escape(DateUtils.nowIso())).append("\n");
        }

        return csv.toString();
    }

    public Map<String, Object> generateComprehensiveSummary(String farmId, String userId) {
        Farm farm = farmRepository.findById(farmId);
        if (farm == null) throw new ResourceNotFoundException("Farm parcel not found: " + farmId);
        if (!userId.equals(farm.getUserId())) throw new UnauthorizedException("Unauthorized access to farm data");

        List<SoilTest> soilTests = soilTestRepository.findByFarmId(farmId);
        List<CropHistory> history = cropHistoryRepository.findByFarmId(farmId);
        List<WaterBudget> budgets = waterBudgetRepository.findByFarmId(farmId);

        Map<String, Object> summary = new HashMap<String, Object>();
        summary.put("reportTitle", "AgroSmart 360 Comprehensive Farm Dossier");
        summary.put("generatedAt", DateUtils.nowIso());
        summary.put("farm", farm);
        summary.put("soilTestsCount", soilTests.size());
        summary.put("latestSoilTest", soilTests.isEmpty() ? null : soilTests.get(0));
        summary.put("cropHistoryCount", history.size());
        summary.put("recentRotations", history);
        summary.put("waterBudgetsCount", budgets.size());
        summary.put("disclaimer", "Official agricultural decision-support record. Generated by AgroSmart 360 v3.0.");
        return summary;
    }

    /**
     * RFC 4180 compliant CSV escaping with Formula Injection Protection (OWASP CSV Injection).
     */
    private String escape(String val) {
        if (val == null) return "\"\"";
        String clean = val.trim();
        // Prevent CSV injection: if value starts with =, +, -, @, prepend single quote
        if (clean.startsWith("=") || clean.startsWith("+") || clean.startsWith("-") || clean.startsWith("@")) {
            clean = "'" + clean;
        }
        return "\"" + clean.replace("\"", "\"\"") + "\"";
    }
}
