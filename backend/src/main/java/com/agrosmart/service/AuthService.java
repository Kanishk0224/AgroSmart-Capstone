package com.agrosmart.service;

import com.agrosmart.dto.UserProfileDto;
import com.agrosmart.exception.ResourceNotFoundException;
import com.agrosmart.model.UserProfile;
import com.agrosmart.model.UserRole;
import com.agrosmart.repository.UserRepository;
import com.agrosmart.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileDto getProfile(String uid) {
        UserProfile profile = userRepository.findById(uid);
        if (profile == null) {
            throw new ResourceNotFoundException("User profile not found for ID: " + uid);
        }
        return UserProfileDto.fromModel(profile);
    }

    public UserProfileDto createOrUpdateProfile(String uid, String email, String fullName, String phone, Boolean terms) {
        UserProfile existing = userRepository.findById(uid);
        String now = DateUtils.nowIso();

        if (existing == null) {
            existing = new UserProfile(
                    uid,
                    email,
                    fullName != null ? fullName : "Farmer",
                    phone != null ? phone : "",
                    UserRole.FARMER, // Strictly default to FARMER, no ADMIN self-assignment
                    terms != null ? terms : true,
                    now,
                    now
            );
        } else {
            if (fullName != null) existing.setFullName(fullName);
            if (phone != null) existing.setPhoneNumber(phone);
            existing.setUpdatedAt(now);
        }

        userRepository.save(existing);
        return UserProfileDto.fromModel(existing);
    }
}
