package com.agrosmart.repository;

import com.agrosmart.model.ProfitabilityEstimate;
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
public class ProfitabilityRepository {
    private static final Logger logger = LoggerFactory.getLogger(ProfitabilityRepository.class);
    private static final String COLLECTION_NAME = "profitabilityEstimates";

    private final Firestore firestore;
    private final Map<String, ProfitabilityEstimate> localCache = new ConcurrentHashMap<String, ProfitabilityEstimate>();

    @Autowired
    public ProfitabilityRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<ProfitabilityEstimate> findByFarmId(String farmId) {
        List<ProfitabilityEstimate> result = new ArrayList<ProfitabilityEstimate>();
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("farmId", farmId)
                    .get();
            List<QueryDocumentSnapshot> docs = future.get().getDocuments();
            for (QueryDocumentSnapshot doc : docs) {
                result.add(doc.toObject(ProfitabilityEstimate.class));
            }
            if (!result.isEmpty()) return result;
        } catch (Exception e) {
            logger.debug("Firestore query fallback for profitabilityEstimates: {}", e.getMessage());
        }

        for (ProfitabilityEstimate pe : localCache.values()) {
            if (farmId.equals(pe.getFarmId())) {
                result.add(pe);
            }
        }
        return result;
    }

    public ProfitabilityEstimate save(ProfitabilityEstimate pe) {
        if (pe == null) return null;
        localCache.put(pe.getId(), pe);
        try {
            firestore.collection(COLLECTION_NAME).document(pe.getId()).set(pe);
        } catch (Exception e) {
            logger.debug("Firestore write deferred for profitability estimate: {}", e.getMessage());
        }
        return pe;
    }
}
