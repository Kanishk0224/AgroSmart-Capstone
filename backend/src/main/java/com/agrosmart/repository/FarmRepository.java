package com.agrosmart.repository;

import com.agrosmart.model.Farm;
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
public class FarmRepository {
    private static final Logger logger = LoggerFactory.getLogger(FarmRepository.class);
    private static final String COLLECTION_NAME = "farms";

    private final Firestore firestore;
    private final Map<String, Farm> localCache = new ConcurrentHashMap<String, Farm>();

    @Autowired
    public FarmRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<Farm> findByUserId(String userId) {
        List<Farm> result = new ArrayList<Farm>();
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("userId", userId)
                    .get();
            List<QueryDocumentSnapshot> docs = future.get().getDocuments();
            for (QueryDocumentSnapshot doc : docs) {
                result.add(doc.toObject(Farm.class));
            }
            if (!result.isEmpty()) {
                return result;
            }
        } catch (Exception e) {
            logger.debug("Firestore query fallback for farms: {}", e.getMessage());
        }

        // Return from local cache
        for (Farm f : localCache.values()) {
            if (userId.equals(f.getUserId())) {
                result.add(f);
            }
        }
        return result;
    }

    public Farm findById(String id) {
        if (id == null) return null;
        try {
            ApiFuture<com.google.cloud.firestore.DocumentSnapshot> future =
                    firestore.collection(COLLECTION_NAME).document(id).get();
            com.google.cloud.firestore.DocumentSnapshot snap = future.get();
            if (snap.exists()) {
                return snap.toObject(Farm.class);
            }
        } catch (Exception e) {
            logger.debug("Firestore fetch fallback for farm {}: {}", id, e.getMessage());
        }
        return localCache.get(id);
    }

    public Farm save(Farm farm) {
        if (farm == null) return null;
        localCache.put(farm.getId(), farm);
        try {
            firestore.collection(COLLECTION_NAME).document(farm.getId()).set(farm);
        } catch (Exception e) {
            logger.debug("Firestore write deferred for farm: {}", e.getMessage());
        }
        return farm;
    }

    public void deleteById(String id) {
        if (id == null) return;
        localCache.remove(id);
        try {
            firestore.collection(COLLECTION_NAME).document(id).delete();
        } catch (Exception e) {
            logger.debug("Firestore delete deferred for farm {}: {}", id, e.getMessage());
        }
    }
}
