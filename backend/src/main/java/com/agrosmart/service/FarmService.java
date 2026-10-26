package com.agrosmart.service;

import com.agrosmart.dto.FarmRequest;
import com.agrosmart.dto.FarmResponse;
import com.agrosmart.exception.ResourceNotFoundException;
import com.agrosmart.exception.UnauthorizedException;
import com.agrosmart.model.Farm;
import com.agrosmart.repository.FarmRepository;
import com.agrosmart.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FarmService {

    private final FarmRepository farmRepository;

    @Autowired
    public FarmService(FarmRepository farmRepository) {
        this.farmRepository = farmRepository;
    }

    public List<FarmResponse> getFarmsForUser(String userId) {
        List<Farm> farms = farmRepository.findByUserId(userId);
        List<FarmResponse> responses = new ArrayList<FarmResponse>();
        for (Farm f : farms) {
            responses.add(FarmResponse.fromModel(f));
        }
        return responses;
    }

    public FarmResponse getFarmById(String farmId, String userId) {
        Farm farm = farmRepository.findById(farmId);
        if (farm == null) {
            throw new ResourceNotFoundException("Farm not found with ID: " + farmId);
        }
        if (!userId.equals(farm.getUserId())) {
            throw new UnauthorizedException("You do not have permission to access this farm plot");
        }
        return FarmResponse.fromModel(farm);
    }

    public FarmResponse createFarm(FarmRequest request, String userId) {
        String id = "farm-" + UUID.randomUUID().toString().substring(0, 8);
        String now = DateUtils.nowIso();

        Farm farm = new Farm(
                id,
                userId,
                request.getName().trim(),
                request.getLocation().trim(),
                request.getTotalAreaAcres(),
                request.getSoilType(),
                request.getIrrigationSource(),
                request.getPrimaryCropType() != null ? request.getPrimaryCropType().trim() : "",
                request.getNotes() != null ? request.getNotes().trim() : "",
                now,
                now
        );

        Farm saved = farmRepository.save(farm);
        return FarmResponse.fromModel(saved);
    }

    public FarmResponse updateFarm(String farmId, FarmRequest request, String userId) {
        Farm farm = farmRepository.findById(farmId);
        if (farm == null) {
            throw new ResourceNotFoundException("Farm not found with ID: " + farmId);
        }
        if (!userId.equals(farm.getUserId())) {
            throw new UnauthorizedException("You do not have permission to modify this farm");
        }

        farm.setName(request.getName().trim());
        farm.setLocation(request.getLocation().trim());
        farm.setTotalAreaAcres(request.getTotalAreaAcres());
        farm.setSoilType(request.getSoilType());
        farm.setIrrigationSource(request.getIrrigationSource());
        if (request.getPrimaryCropType() != null) farm.setPrimaryCropType(request.getPrimaryCropType().trim());
        if (request.getNotes() != null) farm.setNotes(request.getNotes().trim());
        farm.setUpdatedAt(DateUtils.nowIso());

        Farm saved = farmRepository.save(farm);
        return FarmResponse.fromModel(saved);
    }

    public void deleteFarm(String farmId, String userId) {
        Farm farm = farmRepository.findById(farmId);
        if (farm == null) {
            throw new ResourceNotFoundException("Farm not found with ID: " + farmId);
        }
        if (!userId.equals(farm.getUserId())) {
            throw new UnauthorizedException("You do not have permission to delete this farm");
        }
        farmRepository.deleteById(farmId);
    }
}
