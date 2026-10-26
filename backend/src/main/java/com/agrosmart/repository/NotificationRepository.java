package com.agrosmart.repository;

import com.agrosmart.model.Notification;
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
public class NotificationRepository {
    private static final Logger logger = LoggerFactory.getLogger(NotificationRepository.class);
    private static final String COLLECTION_NAME = "notifications";

    private final Firestore firestore;
    private final Map<String, Notification> localCache = new ConcurrentHashMap<String, Notification>();

    @Autowired
    public NotificationRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<Notification> findByUserId(String userId) {
        List<Notification> result = new ArrayList<Notification>();
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("userId", userId)
                    .get();
            List<QueryDocumentSnapshot> docs = future.get().getDocuments();
            for (QueryDocumentSnapshot doc : docs) {
                result.add(doc.toObject(Notification.class));
            }
            if (!result.isEmpty()) return result;
        } catch (Exception e) {
            logger.debug("Firestore fallback for notifications: {}", e.getMessage());
        }

        for (Notification n : localCache.values()) {
            if (userId.equals(n.getUserId())) {
                result.add(n);
            }
        }
        return result;
    }

    public Notification findById(String id) {
        if (id == null) return null;
        try {
            ApiFuture<com.google.cloud.firestore.DocumentSnapshot> future =
                    firestore.collection(COLLECTION_NAME).document(id).get();
            com.google.cloud.firestore.DocumentSnapshot snap = future.get();
            if (snap.exists()) {
                return snap.toObject(Notification.class);
            }
        } catch (Exception e) {
            logger.debug("Firestore fetch fallback for notification {}: {}", id, e.getMessage());
        }
        return localCache.get(id);
    }

    public Notification save(Notification notif) {
        if (notif == null) return null;
        localCache.put(notif.getId(), notif);
        try {
            firestore.collection(COLLECTION_NAME).document(notif.getId()).set(notif);
        } catch (Exception e) {
            logger.debug("Firestore write deferred for notification: {}", e.getMessage());
        }
        return notif;
    }

    public void deleteById(String id) {
        if (id == null) return;
        localCache.remove(id);
        try {
            firestore.collection(COLLECTION_NAME).document(id).delete();
        } catch (Exception e) {
            logger.debug("Firestore delete deferred for notification {}: {}", id, e.getMessage());
        }
    }
}
