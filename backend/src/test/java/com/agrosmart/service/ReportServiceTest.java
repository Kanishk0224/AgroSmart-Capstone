package com.agrosmart.service;

import com.agrosmart.model.Farm;
import com.agrosmart.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class ReportServiceTest {

    private FarmRepository farmRepository;
    private SoilTestRepository soilTestRepository;
    private CropRecommendationRepository recommendationRepository;
    private WaterBudgetRepository waterBudgetRepository;
    private CropHistoryRepository cropHistoryRepository;
    private ProfitabilityRepository profitabilityRepository;
    private ReportService reportService;

    @BeforeEach
    public void setup() {
        farmRepository = Mockito.mock(FarmRepository.class);
        soilTestRepository = Mockito.mock(SoilTestRepository.class);
        recommendationRepository = Mockito.mock(CropRecommendationRepository.class);
        waterBudgetRepository = Mockito.mock(WaterBudgetRepository.class);
        cropHistoryRepository = Mockito.mock(CropHistoryRepository.class);
        profitabilityRepository = Mockito.mock(ProfitabilityRepository.class);

        reportService = new ReportService(
                farmRepository,
                soilTestRepository,
                recommendationRepository,
                waterBudgetRepository,
                cropHistoryRepository,
                profitabilityRepository
        );
    }

    @Test
    public void testCsvExportEscapesFormulaCharacters() {
        Farm maliciousFarm = new Farm();
        maliciousFarm.setId("farm-vuln");
        maliciousFarm.setUserId("user-1");
        maliciousFarm.setName("=cmd|'/C calc'!A0"); // Attempted spreadsheet formula injection
        maliciousFarm.setLocation("+12345 Dangerous Street");
        maliciousFarm.setTotalAreaAcres(12.0);

        when(farmRepository.findByUserId("user-1")).thenReturn(Collections.singletonList(maliciousFarm));

        String csv = reportService.generateCsvReport("farms", null, "user-1");
        assertNotNull(csv);
        // Formula injection protection must sanitize leading = by prepending single quote
        assertTrue(csv.contains("\"'=cmd|'/C calc'!A0\""), "CSV export must escape leading = to neutralize formula injection");
        assertTrue(csv.contains("\"'+12345 Dangerous Street\""), "CSV export must escape leading + character");
    }
}
