package com.agrosmart.service;

import com.agrosmart.dto.WaterBudgetRequest;
import com.agrosmart.dto.WaterBudgetResponse;
import com.agrosmart.exception.ResourceNotFoundException;
import com.agrosmart.exception.UnauthorizedException;
import com.agrosmart.model.Crop;
import com.agrosmart.model.Farm;
import com.agrosmart.model.WaterBudget;
import com.agrosmart.repository.FarmRepository;
import com.agrosmart.repository.WaterBudgetRepository;
import com.agrosmart.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class WaterManagementService {

    private final CropDataService cropDataService;
    private final FarmRepository farmRepository;
    private final WaterBudgetRepository waterBudgetRepository;

    // 1 mm depth on 1 acre = 4.04686 cubic meters (m3)
    private static final double M3_PER_MM_PER_ACRE = 4.04686;
    // 1 acre = 0.404686 hectares
    private static final double HECTARES_PER_ACRE = 0.404686;

    @Autowired
    public WaterManagementService(
            CropDataService cropDataService,
            FarmRepository farmRepository,
            WaterBudgetRepository waterBudgetRepository) {
        this.cropDataService = cropDataService;
        this.farmRepository = farmRepository;
        this.waterBudgetRepository = waterBudgetRepository;
    }

    public WaterBudgetResponse calculateBudget(WaterBudgetRequest request, String userId) {
        Farm farm = farmRepository.findById(request.getFarmId());
        if (farm == null) {
            throw new ResourceNotFoundException("Farm parcel not found: " + request.getFarmId());
        }
        if (!userId.equals(farm.getUserId())) {
            throw new UnauthorizedException("Unauthorized access to farm parcel");
        }

        Crop crop = cropDataService.getCropById(request.getCropIdOrName());
        double cropWaterDemandMm = 500.0;
        String cropName = request.getCropIdOrName();
        if (crop != null) {
            cropWaterDemandMm = crop.getWaterRequirementMm() != null ? crop.getWaterRequirementMm() : 500.0;
            cropName = crop.getCropName();
        }

        double areaAcres = request.getAreaAcres();
        double areaHectares = Math.round(areaAcres * HECTARES_PER_ACRE * 100.0) / 100.0;

        String method = request.getIrrigationMethod() != null ? request.getIrrigationMethod().toUpperCase() : farm.getIrrigationSource();
        double efficiency = 0.75;
        if ("DRIP".equalsIgnoreCase(method)) efficiency = 0.90;
        else if ("SPRINKLER".equalsIgnoreCase(method)) efficiency = 0.75;
        else if ("CANAL".equalsIgnoreCase(method) || "BOREWELL".equalsIgnoreCase(method) || "WELL".equalsIgnoreCase(method)) efficiency = 0.55;
        else if ("RAIN_FED".equalsIgnoreCase(method)) efficiency = 1.0;

        // Rainfall & Effective Rainfall
        Double rainfallMm = request.getSeasonalRainfallMm();
        double effectiveRainfallMm = 0.0;
        List<String> assumptions = new ArrayList<String>();
        List<String> warnings = new ArrayList<String>();
        List<String> recommendations = new ArrayList<String>();

        if (rainfallMm != null) {
            // USDA-SCS effective precipitation model: Peff = max(0, P * 0.75 - 10)
            effectiveRainfallMm = Math.max(0.0, rainfallMm * 0.75 - 10.0);
            assumptions.add(String.format("Effective rainfall estimated at %.1f mm from gross %.1f mm precipitation using USDA-SCS runoff deduction.", effectiveRainfallMm, rainfallMm));
        } else {
            assumptions.add("Rainfall estimate was not supplied; assuming 0 mm contribution for conservative drought planning.");
            warnings.add("Precipitation telemetry missing. Water demand calculations assume 100% reliance on irrigation water.");
        }

        // Net Irrigation Requirement (mm)
        double netIrrigationMm = Math.max(0.0, cropWaterDemandMm - effectiveRainfallMm);

        // Gross Irrigation Requirement (mm) incorporating field conveyance efficiency
        double grossIrrigationMm = "RAIN_FED".equalsIgnoreCase(method) ? netIrrigationMm : (netIrrigationMm / efficiency);

        // Volumetric calculations (m3)
        double totalCropDemandM3 = Math.round(cropWaterDemandMm * M3_PER_MM_PER_ACRE * areaAcres * 10.0) / 10.0;
        double effectiveRainfallM3 = Math.round(effectiveRainfallMm * M3_PER_MM_PER_ACRE * areaAcres * 10.0) / 10.0;
        double netIrrigationM3 = Math.round(netIrrigationMm * M3_PER_MM_PER_ACRE * areaAcres * 10.0) / 10.0;
        double grossIrrigationM3 = Math.round(grossIrrigationMm * M3_PER_MM_PER_ACRE * areaAcres * 10.0) / 10.0;

        // Available Supply vs Demand
        Double availableSupplyM3 = request.getAvailableWaterSupplyM3();
        String balanceStatus = "DATA_INSUFFICIENT";
        double deficitSurplusM3 = 0.0;

        if (availableSupplyM3 != null) {
            deficitSurplusM3 = Math.round((availableSupplyM3 - grossIrrigationM3) * 10.0) / 10.0;
            if (deficitSurplusM3 >= 0) {
                balanceStatus = "SUFFICIENT_ESTIMATED";
                recommendations.add("Current water allocation satisfies full seasonal crop evapotranspiration demand.");
            } else {
                balanceStatus = "POSSIBLE_SHORTAGE";
                warnings.add(String.format("Estimated volumetric deficit of %.1f m³ (%.1f%% shortage). Shift to micro-drip or deficit scheduling recommended.", Math.abs(deficitSurplusM3), (Math.abs(deficitSurplusM3) / grossIrrigationM3) * 100.0));
                recommendations.add("Adopt regulated deficit irrigation (RDI) during vegetative phase to preserve moisture for critical flowering period.");
            }
        } else {
            assumptions.add("Available water storage/borewell yield unrecorded. Supply sufficiency cannot be verified.");
        }

        if ("DRIP".equalsIgnoreCase(method)) {
            recommendations.add("Operating at 90% micro-drip efficiency saves an estimated 35-40% water compared to surface canal flooding.");
        } else if ("CANAL".equalsIgnoreCase(method)) {
            recommendations.add("Lining field supply channels and adopting furrow irrigation can lift conveyance efficiency from 55% to 70%.");
        }

        String id = "wb-" + UUID.randomUUID().toString().substring(0, 8);
        String now = DateUtils.nowIso();

        WaterBudgetResponse resp = new WaterBudgetResponse();
        resp.setId(id);
        resp.setFarmId(farm.getId());
        resp.setCropName(cropName);
        resp.setAreaAcres(areaAcres);
        resp.setAreaHectares(areaHectares);
        resp.setIrrigationMethod(method);
        resp.setIrrigationEfficiencyPercent(Math.round(efficiency * 100.0 * 10.0) / 10.0);
        resp.setCropWaterDemandMm(cropWaterDemandMm);
        resp.setEstimatedRainfallMm(rainfallMm);
        resp.setEffectiveRainfallMm(Math.round(effectiveRainfallMm * 10.0) / 10.0);
        resp.setNetIrrigationDemandMm(Math.round(netIrrigationMm * 10.0) / 10.0);
        resp.setGrossIrrigationDemandMm(Math.round(grossIrrigationMm * 10.0) / 10.0);
        resp.setTotalCropDemandM3(totalCropDemandM3);
        resp.setEffectiveRainfallM3(effectiveRainfallM3);
        resp.setNetIrrigationDemandM3(netIrrigationM3);
        resp.setGrossIrrigationDemandM3(grossIrrigationM3);
        resp.setAvailableSupplyM3(availableSupplyM3);
        resp.setDeficitSurplusM3(deficitSurplusM3);
        resp.setBalanceStatus(balanceStatus);
        resp.setAgronomicAssumptions(assumptions);
        resp.setWaterConservationRecommendations(recommendations);
        resp.setWarnings(warnings);

        // Persist
        try {
            WaterBudget entity = new WaterBudget();
            entity.setId(id);
            entity.setFarmId(farm.getId());
            entity.setUserId(userId);
            entity.setCropName(cropName);
            entity.setAreaAcres(areaAcres);
            entity.setIrrigationMethod(method);
            entity.setCropWaterDemandMm(cropWaterDemandMm);
            entity.setTotalWaterDemandM3(totalCropDemandM3);
            entity.setEstimatedRainfallMm(rainfallMm);
            entity.setEffectiveRainfallM3(effectiveRainfallM3);
            entity.setNetIrrigationDemandM3(netIrrigationM3);
            entity.setGrossIrrigationDemandM3(grossIrrigationM3);
            entity.setAvailableSupplyM3(availableSupplyM3);
            entity.setDeficitSurplusM3(deficitSurplusM3);
            entity.setBalanceStatus(balanceStatus);
            entity.setCreatedAt(now);
            waterBudgetRepository.save(entity);
        } catch (Exception e) {
            // Non-blocking
        }

        return resp;
    }

    public List<WaterBudget> getSavedBudgets(String farmId, String userId) {
        Farm farm = farmRepository.findById(farmId);
        if (farm == null) throw new ResourceNotFoundException("Farm not found: " + farmId);
        if (!userId.equals(farm.getUserId())) throw new UnauthorizedException("Unauthorized access to farm water budgets");
        return waterBudgetRepository.findByFarmId(farmId);
    }
}
