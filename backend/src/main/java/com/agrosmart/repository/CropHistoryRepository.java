package com.agrosmart.repository;

import com.agrosmart.model.CropHistory;
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
public class CropHistoryRepository {
    private static final Logger logger = LoggerFactory.getLogger(CropHistoryRepository.class);
    private static final String COLLECTION_NAME = "cropHistory";

    private final Firestore firestore;
    private final Map<String, CropHistory> localCache = new ConcurrentHashMap<String, CropHistory>();

    @Autowired
    public CropHistoryRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<CropHistory> findByFarmId(String farmId) {
        List<CropHistory> result = new ArrayList<CropHistory>();
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("farmId", farmId)
                    .get();
            List<QueryDocumentSnapshot> docs = future.get().getDocuments();
            for (QueryDocumentSnapshot doc : docs) {
                result.add(doc.toObject(CropHistory.class));
            }
            if (!result.isEmpty()) return result;
        } catch (Exception e) {
            logger.debug("Firestore query fallback for cropHistory: {}", e.getMessage());
        }

        for (CropHistory h : localCache.values()) {
            if (farmId.equals(h.getFarmId())) {
                result.add(h);
            }
        }
        return result;
    }

    public CropHistory findById(String id) {
        if (id == null) return null;
        try {
            ApiFuture<com.google.cloud.firestore.DocumentSnapshot> future =
                    firestore.collection(COLLECTION_NAME).document(id).get();
            com.google.cloud.firestore.DocumentSnapshot snap = future.get();
            if (snap.exists()) {
                return snap.toObject(CropHistory.class);
            }
        } catch (Exception e) {
            logger.debug("Firestore fetch fallback for crop history: {}", e.getMessage());
        }
        return localCache.get(id);
    }

    public CropHistory save(CropHistory history) {
        if (history == null) return null;
        localCache.put(history.getId(), history);
        try {
            firestore.collection(COLLECTION_NAME).document(history.getId()).set(history);
        } catch (Exception e) {
            logger.debug("Firestore write deferred for crop history: {}", e.getMessage());
        }
        return history;
    }

    public void deleteById(String id) {
        if (id == null) return;
        localCache.remove(id);
        try {
            firestore.collection(COLLECTION_NAME).document(id).delete();
        } catch (Exception e) {
            logger.debug("Firestore delete deferred for crop history: {}", e.getMessage());
        }
    }
}
