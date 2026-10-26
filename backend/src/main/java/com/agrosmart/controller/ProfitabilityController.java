package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.dto.ProfitabilityRequest;
import com.agrosmart.dto.ProfitabilityResponse;
import com.agrosmart.model.ProfitabilityEstimate;
import com.agrosmart.security.SecurityUser;
import com.agrosmart.service.ProfitabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/profitability")
public class ProfitabilityController {

    private final ProfitabilityService profitabilityService;

    @Autowired
    public ProfitabilityController(ProfitabilityService profitabilityService) {
        this.profitabilityService = profitabilityService;
    }

    @PostMapping("/estimate")
    public ApiResponse<ProfitabilityResponse> estimateProfitability(
            @Valid @RequestBody ProfitabilityRequest request,
            @AuthenticationPrincipal SecurityUser user) {
        ProfitabilityResponse response = profitabilityService.estimateProfitability(request, user.getUid());
        return ApiResponse.ok("Cultivation profitability estimated successfully", response);
    }

    @GetMapping("/history")
    public ApiResponse<List<ProfitabilityEstimate>> getSavedEstimates(
            @AuthenticationPrincipal SecurityUser user) {
        List<ProfitabilityEstimate> list = profitabilityService.getSavedEstimates(user.getUid());
        return ApiResponse.ok(list);
    }
}
