package com.agrosmart.repository;

import com.agrosmart.model.CropRecommendation;
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
public class CropRecommendationRepository {
    private static final Logger logger = LoggerFactory.getLogger(CropRecommendationRepository.class);
    private static final String COLLECTION_NAME = "recommendations";

    private final Firestore firestore;
    private final Map<String, CropRecommendation> localCache = new ConcurrentHashMap<String, CropRecommendation>();

    @Autowired
    public CropRecommendationRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<CropRecommendation> findByUserId(String userId) {
        List<CropRecommendation> result = new ArrayList<CropRecommendation>();
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("userId", userId)
                    .get();
            List<QueryDocumentSnapshot> docs = future.get().getDocuments();
            for (QueryDocumentSnapshot doc : docs) {
                result.add(doc.toObject(CropRecommendation.class));
            }
            if (!result.isEmpty()) return result;
        } catch (Exception e) {
            logger.debug("Firestore query fallback for recommendations: {}", e.getMessage());
        }

        for (CropRecommendation r : localCache.values()) {
            if (userId.equals(r.getUserId())) {
                result.add(r);
            }
        }
        return result;
    }

    public CropRecommendation findById(String id) {
        if (id == null) return null;
        try {
            ApiFuture<com.google.cloud.firestore.DocumentSnapshot> future =
                    firestore.collection(COLLECTION_NAME).document(id).get();
            com.google.cloud.firestore.DocumentSnapshot snap = future.get();
            if (snap.exists()) {
                return snap.toObject(CropRecommendation.class);
            }
        } catch (Exception e) {
            logger.debug("Firestore fetch fallback for recommendation {}: {}", id, e.getMessage());
        }
        return localCache.get(id);
    }

    public CropRecommendation save(CropRecommendation rec) {
        if (rec == null) return null;
        localCache.put(rec.getId(), rec);
        try {
            firestore.collection(COLLECTION_NAME).document(rec.getId()).set(rec);
        } catch (Exception e) {
            logger.debug("Firestore write deferred for recommendation: {}", e.getMessage());
        }
        return rec;
    }

    public void deleteById(String id) {
        if (id == null) return;
        localCache.remove(id);
        try {
            firestore.collection(COLLECTION_NAME).document(id).delete();
        } catch (Exception e) {
            logger.debug("Firestore delete deferred for recommendation {}: {}", id, e.getMessage());
        }
    }
}
