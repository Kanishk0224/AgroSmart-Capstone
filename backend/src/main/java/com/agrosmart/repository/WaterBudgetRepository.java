package com.agrosmart.repository;

import com.agrosmart.model.WaterBudget;
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
public class WaterBudgetRepository {
    private static final Logger logger = LoggerFactory.getLogger(WaterBudgetRepository.class);
    private static final String COLLECTION_NAME = "waterBudgets";

    private final Firestore firestore;
    private final Map<String, WaterBudget> localCache = new ConcurrentHashMap<String, WaterBudget>();

    @Autowired
    public WaterBudgetRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<WaterBudget> findByFarmId(String farmId) {
        List<WaterBudget> result = new ArrayList<WaterBudget>();
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("farmId", farmId)
                    .get();
            List<QueryDocumentSnapshot> docs = future.get().getDocuments();
            for (QueryDocumentSnapshot doc : docs) {
                result.add(doc.toObject(WaterBudget.class));
            }
            if (!result.isEmpty()) return result;
        } catch (Exception e) {
            logger.debug("Firestore query fallback for waterBudgets: {}", e.getMessage());
        }

        for (WaterBudget wb : localCache.values()) {
            if (farmId.equals(wb.getFarmId())) {
                result.add(wb);
            }
        }
        return result;
    }

    public WaterBudget save(WaterBudget wb) {
        if (wb == null) return null;
        localCache.put(wb.getId(), wb);
        try {
            firestore.collection(COLLECTION_NAME).document(wb.getId()).set(wb);
        } catch (Exception e) {
            logger.debug("Firestore write deferred for water budget: {}", e.getMessage());
        }
        return wb;
    }
}
