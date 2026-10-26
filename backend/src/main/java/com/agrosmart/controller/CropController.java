package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.model.Crop;
import com.agrosmart.service.CropDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/crops")
public class CropController {

    private final CropDataService cropDataService;

    @Autowired
    public CropController(CropDataService cropDataService) {
        this.cropDataService = cropDataService;
    }

    @GetMapping
    public ApiResponse<List<Crop>> getAllCrops(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "soilType", required = false) String soilType,
            @RequestParam(value = "season", required = false) String season) {
        List<Crop> crops = cropDataService.getAllCrops();
        List<Crop> filtered = new ArrayList<Crop>();

        for (Crop crop : crops) {
            boolean match = true;
            if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("ALL")) {
                if (crop.getCategory() == null || !crop.getCategory().name().equalsIgnoreCase(category)) {
                    match = false;
                }
            }
            if (match && soilType != null && !soilType.isEmpty() && !soilType.equalsIgnoreCase("ALL")) {
                if (crop.getSuitableSoilTypes() == null || !crop.getSuitableSoilTypes().contains(soilType.toUpperCase())) {
                    match = false;
                }
            }
            if (match && season != null && !season.isEmpty() && !season.equalsIgnoreCase("ALL")) {
                if (crop.getSuitableSeasons() == null || crop.getSuitableSeasons().stream().noneMatch(s -> s.name().equalsIgnoreCase(season))) {
                    match = false;
                }
            }
            if (match) {
                filtered.add(crop);
            }
        }
        return ApiResponse.ok(filtered);
    }

    @GetMapping("/{id}")
    public ApiResponse<Crop> getCropById(@PathVariable("id") String id) {
        Crop crop = cropDataService.getCropById(id);
        if (crop == null) {
            return ApiResponse.error("Crop cultivar not found: " + id);
        }
        return ApiResponse.ok(crop);
    }
}
