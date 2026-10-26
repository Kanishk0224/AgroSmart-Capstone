package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.security.SecurityUser;
import com.agrosmart.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/csv")
    public ResponseEntity<String> downloadCsv(
            @RequestParam(value = "type", defaultValue = "farms") String type,
            @RequestParam(value = "farmId", required = false) String farmId,
            @AuthenticationPrincipal SecurityUser user) {
        String csvData = reportService.generateCsvReport(type, farmId, user.getUid());

        String filename = String.format("agrosmart-%s-report-%d.csv", type, System.currentTimeMillis());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvData);
    }

    @GetMapping("/summary/{farmId}")
    public ApiResponse<Map<String, Object>> getFarmSummary(
            @PathVariable("farmId") String farmId,
            @AuthenticationPrincipal SecurityUser user) {
        Map<String, Object> summary = reportService.generateComprehensiveSummary(farmId, user.getUid());
        return ApiResponse.ok("Comprehensive farm dossier generated successfully", summary);
    }
}
