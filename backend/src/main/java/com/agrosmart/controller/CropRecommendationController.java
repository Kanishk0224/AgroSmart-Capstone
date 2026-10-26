package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.dto.RecommendationRequest;
import com.agrosmart.dto.RecommendationResponse;
import com.agrosmart.model.CropRecommendation;
import com.agrosmart.security.SecurityUser;
import com.agrosmart.service.CropRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
public class CropRecommendationController {

    private final CropRecommendationService recommendationService;

    @Autowired
    public CropRecommendationController(CropRecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/generate")
    public ApiResponse<RecommendationResponse> generateRecommendations(
            @Valid @RequestBody RecommendationRequest request,
            @AuthenticationPrincipal SecurityUser user) {
        RecommendationResponse response = recommendationService.generateRecommendations(request, user.getUid());
        return ApiResponse.ok("Crop recommendations evaluated successfully", response);
    }

    @GetMapping("/history")
    public ApiResponse<List<CropRecommendation>> getRecommendationHistory(
            @AuthenticationPrincipal SecurityUser user) {
        List<CropRecommendation> history = recommendationService.getSavedRecommendations(user.getUid());
        return ApiResponse.ok(history);
    }

    @GetMapping("/{id}")
    public ApiResponse<CropRecommendation> getRecommendationById(
            @PathVariable("id") String id,
            @AuthenticationPrincipal SecurityUser user) {
        CropRecommendation rec = recommendationService.getSavedRecommendationById(id, user.getUid());
        return ApiResponse.ok(rec);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRecommendation(
            @PathVariable("id") String id,
            @AuthenticationPrincipal SecurityUser user) {
        recommendationService.deleteSavedRecommendation(id, user.getUid());
        return ApiResponse.ok("Recommendation record deleted successfully", null);
    }
}
