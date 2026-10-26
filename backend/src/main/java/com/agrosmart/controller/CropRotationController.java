package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.dto.CropHistoryRequest;
import com.agrosmart.dto.CropHistoryResponse;
import com.agrosmart.model.Crop;
import com.agrosmart.security.SecurityUser;
import com.agrosmart.service.CropDataService;
import com.agrosmart.service.CropRotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/crop-rotation")
public class CropRotationController {

    private final CropRotationService cropRotationService;
    private final CropDataService cropDataService;

    @Autowired
    public CropRotationController(CropRotationService cropRotationService, CropDataService cropDataService) {
        this.cropRotationService = cropRotationService;
        this.cropDataService = cropDataService;
    }

    @PostMapping("/evaluate")
    public ApiResponse<Map<String, Object>> evaluateRotation(
            @RequestParam("candidateCrop") String candidateCrop,
            @RequestParam(value = "previousCrop", required = false) String previousCrop) {
        Crop crop = cropDataService.getCropById(candidateCrop);
        CropRotationService.RotationEvaluation eval = cropRotationService.evaluateRotation(crop, previousCrop);

        Map<String, Object> result = new HashMap<String, Object>();
        result.put("candidateCrop", crop != null ? crop.getCropName() : candidateCrop);
        result.put("previousCrop", previousCrop != null ? previousCrop : "None");
        result.put("rotationScore", eval.getScore());
        result.put("reasons", eval.getReasons());
        result.put("warnings", eval.getWarnings());
        result.put("previousCropFamily", eval.getPreviousCropFamily());

        return ApiResponse.ok(result);
    }

    @GetMapping("/history/{farmId}")
    public ApiResponse<List<CropHistoryResponse>> getHistoryForFarm(
            @PathVariable("farmId") String farmId,
            @AuthenticationPrincipal SecurityUser user) {
        List<CropHistoryResponse> list = cropRotationService.getHistoryForFarm(farmId, user.getUid());
        return ApiResponse.ok(list);
    }

    @PostMapping("/history/{farmId}")
    public ApiResponse<CropHistoryResponse> addHistory(
            @PathVariable("farmId") String farmId,
            @Valid @RequestBody CropHistoryRequest request,
            @AuthenticationPrincipal SecurityUser user) {
        CropHistoryResponse created = cropRotationService.addHistory(farmId, request, user.getUid());
        return ApiResponse.ok("Crop rotation history logged successfully", created);
    }

    @PutMapping("/history/entry/{id}")
    public ApiResponse<CropHistoryResponse> updateHistory(
            @PathVariable("id") String id,
            @Valid @RequestBody CropHistoryRequest request,
            @AuthenticationPrincipal SecurityUser user) {
        CropHistoryResponse updated = cropRotationService.updateHistory(id, request, user.getUid());
        return ApiResponse.ok("Crop rotation history updated", updated);
    }

    @DeleteMapping("/history/entry/{id}")
    public ApiResponse<Void> deleteHistory(
            @PathVariable("id") String id,
            @AuthenticationPrincipal SecurityUser user) {
        cropRotationService.deleteHistory(id, user.getUid());
        return ApiResponse.ok("Crop rotation entry deleted", null);
    }
}
