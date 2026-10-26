package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.dto.FarmRequest;
import com.agrosmart.dto.FarmResponse;
import com.agrosmart.security.SecurityUser;
import com.agrosmart.service.FarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/farms")
public class FarmController {

    private final FarmService farmService;

    @Autowired
    public FarmController(FarmService farmService) {
        this.farmService = farmService;
    }

    @GetMapping
    public ApiResponse<List<FarmResponse>> getFarms(@AuthenticationPrincipal SecurityUser user) {
        List<FarmResponse> farms = farmService.getFarmsForUser(user.getUid());
        return ApiResponse.ok(farms);
    }

    @GetMapping("/{id}")
    public ApiResponse<FarmResponse> getFarmById(
            @PathVariable("id") String id,
            @AuthenticationPrincipal SecurityUser user) {
        FarmResponse farm = farmService.getFarmById(id, user.getUid());
        return ApiResponse.ok(farm);
    }

    @PostMapping
    public ApiResponse<FarmResponse> createFarm(
            @Valid @RequestBody FarmRequest request,
            @AuthenticationPrincipal SecurityUser user) {
        FarmResponse created = farmService.createFarm(request, user.getUid());
        return ApiResponse.ok("Farm registered successfully", created);
    }

    @PutMapping("/{id}")
    public ApiResponse<FarmResponse> updateFarm(
            @PathVariable("id") String id,
            @Valid @RequestBody FarmRequest request,
            @AuthenticationPrincipal SecurityUser user) {
        FarmResponse updated = farmService.updateFarm(id, request, user.getUid());
        return ApiResponse.ok("Farm updated successfully", updated);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteFarm(
            @PathVariable("id") String id,
            @AuthenticationPrincipal SecurityUser user) {
        farmService.deleteFarm(id, user.getUid());
        return ApiResponse.ok("Farm deleted successfully", null);
    }
}
