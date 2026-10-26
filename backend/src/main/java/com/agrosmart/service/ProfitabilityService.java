package com.agrosmart.service;

import com.agrosmart.dto.ProfitabilityRequest;
import com.agrosmart.dto.ProfitabilityResponse;
import com.agrosmart.exception.ResourceNotFoundException;
import com.agrosmart.exception.UnauthorizedException;
import com.agrosmart.model.Crop;
import com.agrosmart.model.Farm;
import com.agrosmart.model.ProfitabilityEstimate;
import com.agrosmart.repository.FarmRepository;
import com.agrosmart.repository.ProfitabilityRepository;
import com.agrosmart.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProfitabilityService {

    private final CropDataService cropDataService;
    private final FarmRepository farmRepository;
    private final ProfitabilityRepository profitabilityRepository;

    @Autowired
    public ProfitabilityService(
            CropDataService cropDataService,
            FarmRepository farmRepository,
            ProfitabilityRepository profitabilityRepository) {
        this.cropDataService = cropDataService;
        this.farmRepository = farmRepository;
        this.profitabilityRepository = profitabilityRepository;
    }

    public ProfitabilityResponse estimateProfitability(ProfitabilityRequest request, String userId) {
        Farm farm = farmRepository.findById(request.getFarmId());
        if (farm == null) {
            throw new ResourceNotFoundException("Farm parcel not found: " + request.getFarmId());
        }
        if (!userId.equals(farm.getUserId())) {
            throw new UnauthorizedException("Unauthorized access to farm parcel");
        }

        double areaAcres = request.getAreaAcres();
        Crop crop = cropDataService.getCropById(request.getCropName());

        // Default or user-provided costs per acre
        double seedCost = request.getSeedCost() != null ? request.getSeedCost() : (areaAcres * 2500.0);
        double fertilizerCost = request.getFertilizerCost() != null ? request.getFertilizerCost() : (areaAcres * 4000.0);
        double labourCost = request.getLabourCost() != null ? request.getLabourCost() : (areaAcres * 5500.0);
        double irrigationCost = request.getIrrigationCost() != null ? request.getIrrigationCost() : (areaAcres * 2000.0);
        double equipmentCost = request.getEquipmentCost() != null ? request.getEquipmentCost() : (areaAcres * 3000.0);
        double otherCosts = request.getOtherCosts() != null ? request.getOtherCosts() : (areaAcres * 1200.0);

        double totalCost = seedCost + fertilizerCost + labourCost + irrigationCost + equipmentCost + otherCosts;
        double costPerAcre = Math.round((totalCost / areaAcres) * 100.0) / 100.0;

        double expectedYieldPerAcre = request.getExpectedYieldPerAcre();
        double totalYield = Math.round((expectedYieldPerAcre * areaAcres) * 100.0) / 100.0;
        double pricePerUnit = request.getExpectedSellingPricePerUnit();

        double estimatedRevenue = Math.round((totalYield * pricePerUnit) * 100.0) / 100.0;
        double estimatedProfit = Math.round((estimatedRevenue - totalCost) * 100.0) / 100.0;
        double profitPerAcre = Math.round((estimatedProfit / areaAcres) * 100.0) / 100.0;

        double roi = 0.0;
        if (totalCost > 0) {
            roi = Math.round(((estimatedProfit / totalCost) * 100.0) * 10.0) / 10.0;
        }

        double breakEvenPrice = 0.0;
        if (totalYield > 0) {
            breakEvenPrice = Math.round((totalCost / totalYield) * 100.0) / 100.0;
        }

        Map<String, Double> breakdown = new HashMap<String, Double>();
        if (totalCost > 0) {
            breakdown.put("seeds", Math.round((seedCost / totalCost * 100.0) * 10.0) / 10.0);
            breakdown.put("fertilizer", Math.round((fertilizerCost / totalCost * 100.0) * 10.0) / 10.0);
            breakdown.put("labour", Math.round((labourCost / totalCost * 100.0) * 10.0) / 10.0);
            breakdown.put("irrigation", Math.round((irrigationCost / totalCost * 100.0) * 10.0) / 10.0);
            breakdown.put("equipment", Math.round((equipmentCost / totalCost * 100.0) * 10.0) / 10.0);
            breakdown.put("other", Math.round((otherCosts / totalCost * 100.0) * 10.0) / 10.0);
        }

        List<String> assumptions = new ArrayList<String>();
        assumptions.add("Estimates assume standard agronomic pest management with zero extreme weather loss.");
        assumptions.add("Cost of credit/interest on working capital is excluded.");
        assumptions.add(String.format("Calculated for parcel area of %.2f acres.", areaAcres));

        List<String> riskFactors = new ArrayList<String>();
        if (roi < 20.0) {
            riskFactors.add("Low margin buffer: small fluctuations in market price may result in negative net returns.");
        }
        if (crop != null && crop.getWaterRequirementMm() != null && crop.getWaterRequirementMm() > 800.0) {
            riskFactors.add("High water dependence: erratic canal or groundwater supply may jeopardize expected yields.");
        }
        riskFactors.add("Commodity spot prices are subject to post-harvest market volatility.");

        String id = "prof-" + UUID.randomUUID().toString().substring(0, 8);
        ProfitabilityResponse response = new ProfitabilityResponse();
        response.setId(id);
        response.setFarmId(farm.getId());
        response.setCropName(request.getCropName());
        response.setAreaAcres(areaAcres);
        response.setSeedCost(seedCost);
        response.setFertilizerCost(fertilizerCost);
        response.setLabourCost(labourCost);
        response.setIrrigationCost(irrigationCost);
        response.setEquipmentCost(equipmentCost);
        response.setOtherCosts(otherCosts);
        response.setTotalCost(totalCost);
        response.setCostPerAcre(costPerAcre);
        response.setExpectedYieldPerAcre(expectedYieldPerAcre);
        response.setYieldUnit(request.getYieldUnit() != null ? request.getYieldUnit() : "Quintals");
        response.setExpectedTotalYield(totalYield);
        response.setExpectedSellingPricePerUnit(pricePerUnit);
        response.setEstimatedRevenue(estimatedRevenue);
        response.setEstimatedProfit(estimatedProfit);
        response.setProfitPerAcre(profitPerAcre);
        response.setReturnOnInvestmentPercent(roi);
        response.setBreakEvenPricePerUnit(breakEvenPrice);
        response.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
        response.setCostBreakdownPercent(breakdown);
        response.setFinancialAssumptions(assumptions);
        response.setRiskFactors(riskFactors);

        // Snapshot persistence
        try {
            ProfitabilityEstimate entity = new ProfitabilityEstimate();
            entity.setId(id);
            entity.setFarmId(farm.getId());
            entity.setUserId(userId);
            entity.setCropName(request.getCropName());
            entity.setAreaAcres(areaAcres);
            entity.setTotalCost(totalCost);
            entity.setEstimatedRevenue(estimatedRevenue);
            entity.setEstimatedProfit(estimatedProfit);
            entity.setRoiPercent(roi);
            entity.setCreatedAt(DateUtils.nowIso());
            profitabilityRepository.save(entity);
        } catch (Exception e) {
            // non-blocking
        }

        return response;
    }

    public List<ProfitabilityEstimate> getSavedEstimates(String userId) {
        return profitabilityRepository.findByUserId(userId);
    }
}
