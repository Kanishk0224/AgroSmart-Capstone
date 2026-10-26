package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ApiResponse<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<String, Object>();
        status.put("status", "UP");
        status.put("service", "AgroSmart 360 Backend");
        status.put("javaVersion", System.getProperty("java.version"));
        status.put("stage", "STAGE_1_FOUNDATION");
        return ApiResponse.ok("System Operational", status);
    }
}
