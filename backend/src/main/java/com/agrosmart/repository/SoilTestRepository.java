package com.agrosmart.repository;

import com.agrosmart.model.SoilTest;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class SoilTestRepository {
    private static final Logger logger = LoggerFactory.getLogger(SoilTestRepository.class);
    private static final String COLLECTION_NAME = "soilTests";

    private final Firestore firestore;
    private final Map<String, SoilTest> localCache = new ConcurrentHashMap<String, SoilTest>();

    @Autowired
    public SoilTestRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<SoilTest> findByUserId(String userId) {
        List<SoilTest> result = new ArrayList<SoilTest>();
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("userId", userId)
                    .get();
            List<QueryDocumentSnapshot> docs = future.get().getDocuments();
            for (QueryDocumentSnapshot doc : docs) {
                result.add(doc.toObject(SoilTest.class));
            }
            if (!result.isEmpty()) return result;
        } catch (Exception e) {
            logger.debug("Firestore query fallback for soilTests: {}", e.getMessage());
        }

        for (SoilTest t : localCache.values()) {
            if (userId.equals(t.getUserId())) {
                result.add(t);
            }
        }
        return result;
    }

    public List<SoilTest> findByFarmIdAndUserId(String farmId, String userId) {
        List<SoilTest> result = new ArrayList<SoilTest>();
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("userId", userId)
                    .whereEqualTo("farmId", farmId)
                    .get();
            List<QueryDocumentSnapshot> docs = future.get().getDocuments();
            for (QueryDocumentSnapshot doc : docs) {
                result.add(doc.toObject(SoilTest.class));
            }
            if (!result.isEmpty()) return result;
        } catch (Exception e) {
            logger.debug("Firestore query fallback for farm soil tests: {}", e.getMessage());
        }

        for (SoilTest t : localCache.values()) {
            if (userId.equals(t.getUserId()) && farmId.equals(t.getFarmId())) {
                result.add(t);
            }
        }
        return result;
    }

    public SoilTest findById(String id) {
        if (id == null) return null;
        try {
            ApiFuture<com.google.cloud.firestore.DocumentSnapshot> future =
                    firestore.collection(COLLECTION_NAME).document(id).get();
            com.google.cloud.firestore.DocumentSnapshot snap = future.get();
            if (snap.exists()) {
                return snap.toObject(SoilTest.class);
            }
        } catch (Exception e) {
            logger.debug("Firestore fetch fallback for soil test {}: {}", id, e.getMessage());
        }
        return localCache.get(id);
    }

    public SoilTest save(SoilTest test) {
        if (test == null) return null;
        localCache.put(test.getId(), test);
        try {
            firestore.collection(COLLECTION_NAME).document(test.getId()).set(test);
        } catch (Exception e) {
            logger.debug("Firestore write deferred for soil test: {}", e.getMessage());
        }
        return test;
    }

    public void deleteById(String id) {
        if (id == null) return;
        localCache.remove(id);
        try {
            firestore.collection(COLLECTION_NAME).document(id).delete();
        } catch (Exception e) {
            logger.debug("Firestore delete deferred for soil test {}: {}", id, e.getMessage());
        }
    }
}
