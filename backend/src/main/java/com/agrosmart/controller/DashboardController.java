package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.dto.DashboardSummaryDto;
import com.agrosmart.security.SecurityUser;
import com.agrosmart.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryDto> getSummary(@AuthenticationPrincipal SecurityUser user) {
        DashboardSummaryDto summary = dashboardService.getSummary(user.getUid());
        return ApiResponse.ok(summary);
    }
}
