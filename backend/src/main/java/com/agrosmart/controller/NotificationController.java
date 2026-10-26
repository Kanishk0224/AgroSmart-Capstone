package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.model.Notification;
import com.agrosmart.security.SecurityUser;
import com.agrosmart.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ApiResponse<List<Notification>> getNotifications(@AuthenticationPrincipal SecurityUser user) {
        List<Notification> list = notificationService.getUserNotifications(user.getUid());
        return ApiResponse.ok(list);
    }

    @PutMapping("/{id}/read")
    public ApiResponse<Notification> markAsRead(
            @PathVariable("id") String id,
            @AuthenticationPrincipal SecurityUser user) {
        Notification updated = notificationService.markAsRead(id, user.getUid());
        return ApiResponse.ok("Notification marked as read", updated);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteNotification(
            @PathVariable("id") String id,
            @AuthenticationPrincipal SecurityUser user) {
        notificationService.deleteNotification(id, user.getUid());
        return ApiResponse.ok("Notification dismissed", null);
    }
}
