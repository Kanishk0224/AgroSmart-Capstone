package com.agrosmart.service;

import com.agrosmart.exception.ResourceNotFoundException;
import com.agrosmart.exception.UnauthorizedException;
import com.agrosmart.model.Notification;
import com.agrosmart.repository.NotificationRepository;
import com.agrosmart.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserId(userId);
    }

    public Notification createNotification(String userId, String title, String message, String type, String actionUrl) {
        String id = "notif-" + UUID.randomUUID().toString().substring(0, 8);
        Notification n = new Notification(
                id,
                userId,
                title,
                message,
                type,
                false,
                DateUtils.nowIso(),
                actionUrl
        );
        return notificationRepository.save(n);
    }

    public Notification markAsRead(String notifId, String userId) {
        Notification n = notificationRepository.findById(notifId);
        if (n == null) throw new ResourceNotFoundException("Notification not found: " + notifId);
        if (!userId.equals(n.getUserId())) throw new UnauthorizedException("Unauthorized access to notification");

        n.setRead(true);
        return notificationRepository.save(n);
    }

    public void deleteNotification(String notifId, String userId) {
        Notification n = notificationRepository.findById(notifId);
        if (n == null) throw new ResourceNotFoundException("Notification not found: " + notifId);
        if (!userId.equals(n.getUserId())) throw new UnauthorizedException("Unauthorized to delete notification");

        notificationRepository.deleteById(notifId);
    }
}
