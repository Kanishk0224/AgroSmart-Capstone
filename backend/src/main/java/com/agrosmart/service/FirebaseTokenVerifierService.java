package com.agrosmart.service;

import com.agrosmart.model.UserRole;
import com.agrosmart.security.SecurityUser;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FirebaseTokenVerifierService {
    private static final Logger logger = LoggerFactory.getLogger(FirebaseTokenVerifierService.class);

    public SecurityUser verifyToken(String idToken) {
        if (idToken == null || idToken.trim().isEmpty()) {
            return null;
        }

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();
            return new SecurityUser(uid, email, UserRole.FARMER);
        } catch (Exception e) {
            logger.warn("Firebase ID Token verification failed: {}", e.getMessage());
            return null;
        }
    }
}
