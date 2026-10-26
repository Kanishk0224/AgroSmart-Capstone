package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.dto.UserProfileDto;
import com.agrosmart.security.SecurityUser;
import com.agrosmart.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/profile")
    public ApiResponse<UserProfileDto> getProfile(@AuthenticationPrincipal SecurityUser user) {
        UserProfileDto profile = authService.getProfile(user.getUid());
        return ApiResponse.ok(profile);
    }

    @PostMapping("/sync-profile")
    public ApiResponse<UserProfileDto> syncProfile(
            @AuthenticationPrincipal SecurityUser user,
            @RequestBody Map<String, Object> body) {
        String fullName = body.get("fullName") != null ? body.get("fullName").toString() : null;
        String phone = body.get("phoneNumber") != null ? body.get("phoneNumber").toString() : null;
        Boolean terms = body.get("termsAccepted") != null ? Boolean.valueOf(body.get("termsAccepted").toString()) : true;

        UserProfileDto profile = authService.createOrUpdateProfile(user.getUid(), user.getEmail(), fullName, phone, terms);
        return ApiResponse.ok("Profile synchronized successfully", profile);
    }
}
