package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.dto.SoilTestRequest;
import com.agrosmart.dto.SoilTestResponse;
import com.agrosmart.security.SecurityUser;
import com.agrosmart.service.SoilTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/soil-tests")
public class SoilTestController {

    private final SoilTestService soilTestService;

    @Autowired
    public SoilTestController(SoilTestService soilTestService) {
        this.soilTestService = soilTestService;
    }

    @GetMapping
    public ApiResponse<List<SoilTestResponse>> getSoilTests(
            @RequestParam(value = "farmId", required = false) String farmId,
            @AuthenticationPrincipal SecurityUser user) {
        List<SoilTestResponse> tests = soilTestService.getSoilTests(user.getUid(), farmId);
        return ApiResponse.ok(tests);
    }

    @GetMapping("/{id}")
    public ApiResponse<SoilTestResponse> getSoilTestById(
            @PathVariable("id") String id,
            @AuthenticationPrincipal SecurityUser user) {
        SoilTestResponse test = soilTestService.getSoilTestById(id, user.getUid());
        return ApiResponse.ok(test);
    }

    @PostMapping
    public ApiResponse<SoilTestResponse> createSoilTest(
            @Valid @RequestBody SoilTestRequest request,
            @AuthenticationPrincipal SecurityUser user) {
        SoilTestResponse created = soilTestService.createSoilTest(request, user.getUid());
        return ApiResponse.ok("Soil test record saved successfully", created);
    }

    @PutMapping("/{id}")
    public ApiResponse<SoilTestResponse> updateSoilTest(
            @PathVariable("id") String id,
            @Valid @RequestBody SoilTestRequest request,
            @AuthenticationPrincipal SecurityUser user) {
        SoilTestResponse updated = soilTestService.updateSoilTest(id, request, user.getUid());
        return ApiResponse.ok("Soil test updated successfully", updated);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSoilTest(
            @PathVariable("id") String id,
            @AuthenticationPrincipal SecurityUser user) {
        soilTestService.deleteSoilTest(id, user.getUid());
        return ApiResponse.ok("Soil test deleted successfully", null);
    }
}
