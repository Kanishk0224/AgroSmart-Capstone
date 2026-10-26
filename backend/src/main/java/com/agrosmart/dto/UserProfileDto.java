package com.agrosmart.dto;

import com.agrosmart.model.UserProfile;
import com.agrosmart.model.UserRole;
import java.io.Serializable;

public class UserProfileDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private String uid;
    private String email;
    private String fullName;
    private String phoneNumber;
    private UserRole role;
    private Boolean termsAccepted;

    public UserProfileDto() {
    }

    public static UserProfileDto fromModel(UserProfile profile) {
        if (profile == null) return null;
        UserProfileDto dto = new UserProfileDto();
        dto.setUid(profile.getUid());
        dto.setEmail(profile.getEmail());
        dto.setFullName(profile.getFullName());
        dto.setPhoneNumber(profile.getPhoneNumber());
        dto.setRole(profile.getRole());
        dto.setTermsAccepted(profile.getTermsAccepted());
        return dto;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public Boolean getTermsAccepted() {
        return termsAccepted;
    }

    public void setTermsAccepted(Boolean termsAccepted) {
        this.termsAccepted = termsAccepted;
    }
}
