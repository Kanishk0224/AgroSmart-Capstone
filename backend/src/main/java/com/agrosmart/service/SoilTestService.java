package com.agrosmart.service;

import com.agrosmart.dto.SoilTestRequest;
import com.agrosmart.dto.SoilTestResponse;
import com.agrosmart.exception.ResourceNotFoundException;
import com.agrosmart.exception.UnauthorizedException;
import com.agrosmart.model.SoilTest;
import com.agrosmart.repository.SoilTestRepository;
import com.agrosmart.util.DateUtils;
import com.agrosmart.util.SoilHealthCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SoilTestService {

    private final SoilTestRepository soilTestRepository;

    @Autowired
    public SoilTestService(SoilTestRepository soilTestRepository) {
        this.soilTestRepository = soilTestRepository;
    }

    public List<SoilTestResponse> getSoilTests(String userId, String farmId) {
        List<SoilTest> tests;
        if (farmId != null && !farmId.isEmpty() && !"ALL".equalsIgnoreCase(farmId)) {
            tests = soilTestRepository.findByFarmIdAndUserId(farmId, userId);
        } else {
            tests = soilTestRepository.findByUserId(userId);
        }

        List<SoilTestResponse> responses = new ArrayList<SoilTestResponse>();
        for (SoilTest t : tests) {
            responses.add(SoilTestResponse.fromModel(t));
        }
        return responses;
    }

    public SoilTestResponse getSoilTestById(String testId, String userId) {
        SoilTest test = soilTestRepository.findById(testId);
        if (test == null) {
            throw new ResourceNotFoundException("Soil test record not found for ID: " + testId);
        }
        if (!userId.equals(test.getUserId())) {
            throw new UnauthorizedException("You do not have permission to access this soil test");
        }
        return SoilTestResponse.fromModel(test);
    }

    public SoilTestResponse createSoilTest(SoilTestRequest request, String userId) {
        String id = "soil-" + UUID.randomUUID().toString().substring(0, 8);
        String now = DateUtils.nowIso();

        SoilHealthCalculator.AnalysisResult analysis = SoilHealthCalculator.analyze(
                request.getPhLevel(),
                request.getNitrogenLevel(),
                request.getPhosphorusLevel(),
                request.getPotassiumLevel(),
                request.getOrganicMatter()
        );

        SoilTest test = new SoilTest(
                id,
                request.getFarmId(),
                userId,
                request.getTestDate(),
                request.getPhLevel(),
                request.getNitrogenLevel(),
                request.getPhosphorusLevel(),
                request.getPotassiumLevel(),
                request.getOrganicMatter(),
                request.getMoistureContent(),
                request.getElectricalConductivity(),
                analysis.getRating(),
                analysis.getRecommendations(),
                now,
                now
        );

        SoilTest saved = soilTestRepository.save(test);
        return SoilTestResponse.fromModel(saved);
    }

    public SoilTestResponse updateSoilTest(String testId, SoilTestRequest request, String userId) {
        SoilTest test = soilTestRepository.findById(testId);
        if (test == null) {
            throw new ResourceNotFoundException("Soil test record not found for ID: " + testId);
        }
        if (!userId.equals(test.getUserId())) {
            throw new UnauthorizedException("You do not have permission to modify this soil test");
        }

        SoilHealthCalculator.AnalysisResult analysis = SoilHealthCalculator.analyze(
                request.getPhLevel(),
                request.getNitrogenLevel(),
                request.getPhosphorusLevel(),
                request.getPotassiumLevel(),
                request.getOrganicMatter()
        );

        test.setFarmId(request.getFarmId());
        test.setTestDate(request.getTestDate());
        test.setPhLevel(request.getPhLevel());
        test.setNitrogenLevel(request.getNitrogenLevel());
        test.setPhosphorusLevel(request.getPhosphorusLevel());
        test.setPotassiumLevel(request.getPotassiumLevel());
        test.setOrganicMatter(request.getOrganicMatter());
        test.setMoistureContent(request.getMoistureContent());
        test.setElectricalConductivity(request.getElectricalConductivity());
        test.setFertilityRating(analysis.getRating());
        test.setRecommendations(analysis.getRecommendations());
        test.setUpdatedAt(DateUtils.nowIso());

        SoilTest saved = soilTestRepository.save(test);
        return SoilTestResponse.fromModel(saved);
    }

    public void deleteSoilTest(String testId, String userId) {
        SoilTest test = soilTestRepository.findById(testId);
        if (test == null) {
            throw new ResourceNotFoundException("Soil test record not found for ID: " + testId);
        }
        if (!userId.equals(test.getUserId())) {
            throw new UnauthorizedException("You do not have permission to delete this soil test");
        }
        soilTestRepository.deleteById(testId);
    }
}
