package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.dto.WaterBudgetRequest;
import com.agrosmart.dto.WaterBudgetResponse;
import com.agrosmart.model.WaterBudget;
import com.agrosmart.repository.WaterBudgetRepository;
import com.agrosmart.security.SecurityUser;
import com.agrosmart.service.WaterManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/water-budget")
public class WaterManagementController {

    private final WaterManagementService waterManagementService;
    private final WaterBudgetRepository waterBudgetRepository;

    @Autowired
    public WaterManagementController(
            WaterManagementService waterManagementService,
            WaterBudgetRepository waterBudgetRepository) {
        this.waterManagementService = waterManagementService;
        this.waterBudgetRepository = waterBudgetRepository;
    }

    @PostMapping("/calculate")
    public ApiResponse<WaterBudgetResponse> calculateBudget(
            @Valid @RequestBody WaterBudgetRequest request,
            @AuthenticationPrincipal SecurityUser user) {
        WaterBudgetResponse response = waterManagementService.calculateBudget(request, user.getUid());
        return ApiResponse.ok("Water budget calculated successfully", response);
    }

    @GetMapping("/farm/{farmId}")
    public ApiResponse<List<WaterBudget>> getBudgetsForFarm(
            @PathVariable("farmId") String farmId,
            @AuthenticationPrincipal SecurityUser user) {
        List<WaterBudget> budgets = waterBudgetRepository.findByFarmId(farmId);
        return ApiResponse.ok(budgets);
    }
}
