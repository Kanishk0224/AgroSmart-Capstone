package com.agrosmart.repository;

import com.agrosmart.model.UserProfile;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class UserRepository {
    private static final Logger logger = LoggerFactory.getLogger(UserRepository.class);
    private static final String COLLECTION_NAME = "users";

    private final Firestore firestore;
    private final Map<String, UserProfile> localCache = new ConcurrentHashMap<String, UserProfile>();

    @Autowired
    public UserRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public UserProfile findById(String uid) {
        if (uid == null) return null;
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(uid);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot snapshot = future.get();
            if (snapshot.exists()) {
                return snapshot.toObject(UserProfile.class);
            }
        } catch (Exception e) {
            logger.debug("Falling back to local cache for user lookup: {}", e.getMessage());
        }
        return localCache.get(uid);
    }

    public void save(UserProfile profile) {
        if (profile == null || profile.getUid() == null) return;
        localCache.put(profile.getUid(), profile);
        try {
            firestore.collection(COLLECTION_NAME).document(profile.getUid()).set(profile);
        } catch (Exception e) {
            logger.debug("Firestore save deferred: {}", e.getMessage());
        }
    }
}
