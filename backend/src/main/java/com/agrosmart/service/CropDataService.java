package com.agrosmart.service;

import com.agrosmart.model.Crop;
import com.agrosmart.model.CropCategory;
import com.agrosmart.model.CropSeason;
import com.agrosmart.model.DataConfidence;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;

@Service
public class CropDataService {

    private final Map<String, Crop> cropCatalog = new LinkedHashMap<String, Crop>();

    @PostConstruct
    public void initCatalog() {
        // 1. Rice (Oryza sativa)
        Crop rice = new Crop();
        rice.setCropId("crop-rice");
        rice.setCropName("Basmati & Wetland Rice");
        rice.setScientificName("Oryza sativa");
        rice.setCategory(CropCategory.CEREAL);
        rice.setSuitableSoilTypes(Arrays.asList("CLAY", "CLAY_LOAM", "SILT"));
        rice.setMinimumSuitablePH(5.5);
        rice.setMaximumSuitablePH(7.5);
        rice.setMinNitrogenKgPerHa(100.0);
        rice.setMaxNitrogenKgPerHa(150.0);
        rice.setMinPhosphorusKgPerHa(30.0);
        rice.setMaxPhosphorusKgPerHa(60.0);
        rice.setMinPotassiumKgPerHa(40.0);
        rice.setMaxPotassiumKgPerHa(80.0);
        rice.setMinTemperatureCelsius(20.0);
        rice.setMaxTemperatureCelsius(38.0);
        rice.setMinRainfallMm(1000.0);
        rice.setMaxRainfallMm(2500.0);
        rice.setSuitableSeasons(Arrays.asList(CropSeason.KHARIF));
        rice.setWaterRequirementMm(1200.0);
        rice.setGrowingDurationDaysMin(110);
        rice.setGrowingDurationDaysMax(145);
        rice.setBotanicalFamily("Poaceae");
        rice.setNitrogenFixer(false);
        rice.setDeepRooted(false);
        rice.setGoodFollowers(Arrays.asList("Chickpea", "Mustard", "Wheat", "Lentil"));
        rice.setBadFollowers(Arrays.asList("Rice"));
        rice.setSourceReferences("FAO Irrigation & Drainage Paper 56; ICAR Handbook of Agriculture (2020)");
        rice.setSourceUpdatedAt("2025-01-15");
        rice.setDataConfidence(DataConfidence.HIGH);
        rice.setDescription("High-demand wetland cereal staple requiring abundant standing water or canal irrigation.");
        cropCatalog.put(rice.getCropId(), rice);

        // 2. Wheat (Triticum aestivum)
        Crop wheat = new Crop();
        wheat.setCropId("crop-wheat");
        wheat.setCropName("Bread Wheat");
        wheat.setScientificName("Triticum aestivum");
        wheat.setCategory(CropCategory.CEREAL);
        wheat.setSuitableSoilTypes(Arrays.asList("LOAMY", "CLAY_LOAM", "SILT"));
        wheat.setMinimumSuitablePH(6.0);
        wheat.setMaximumSuitablePH(7.8);
        wheat.setMinNitrogenKgPerHa(90.0);
        wheat.setMaxNitrogenKgPerHa(130.0);
        wheat.setMinPhosphorusKgPerHa(40.0);
        wheat.setMaxPhosphorusKgPerHa(60.0);
        wheat.setMinPotassiumKgPerHa(30.0);
        wheat.setMaxPotassiumKgPerHa(50.0);
        wheat.setMinTemperatureCelsius(12.0);
        wheat.setMaxTemperatureCelsius(26.0);
        wheat.setMinRainfallMm(350.0);
        wheat.setMaxRainfallMm(750.0);
        wheat.setSuitableSeasons(Arrays.asList(CropSeason.RABI));
        wheat.setWaterRequirementMm(450.0);
        wheat.setGrowingDurationDaysMin(105);
        wheat.setGrowingDurationDaysMax(135);
        wheat.setBotanicalFamily("Poaceae");
        wheat.setNitrogenFixer(false);
        wheat.setDeepRooted(false);
        wheat.setGoodFollowers(Arrays.asList("Mungbean", "Soybean", "Maize"));
        wheat.setBadFollowers(Arrays.asList("Wheat", "Barley"));
        wheat.setSourceReferences("ICAR Agronomic Compendium; FAO Crop Information Portal");
        wheat.setSourceUpdatedAt("2025-01-15");
        wheat.setDataConfidence(DataConfidence.HIGH);
        wheat.setDescription("Premier temperate winter cereal crop responding well to fertile loam soils.");
        cropCatalog.put(wheat.getCropId(), wheat);

        // 3. Chickpea / Bengal Gram (Cicer arietinum)
        Crop chickpea = new Crop();
        chickpea.setCropId("crop-chickpea");
        chickpea.setCropName("Desi & Kabuli Chickpea");
        chickpea.setScientificName("Cicer arietinum");
        chickpea.setCategory(CropCategory.PULSE);
        chickpea.setSuitableSoilTypes(Arrays.asList("LOAMY", "SANDY_LOAM", "CLAY_LOAM"));
        chickpea.setMinimumSuitablePH(6.0);
        chickpea.setMaximumSuitablePH(8.0);
        chickpea.setMinNitrogenKgPerHa(20.0); // Legume - low external N needed
        chickpea.setMaxNitrogenKgPerHa(30.0);
        chickpea.setMinPhosphorusKgPerHa(40.0);
        chickpea.setMaxPhosphorusKgPerHa(60.0);
        chickpea.setMinPotassiumKgPerHa(20.0);
        chickpea.setMaxPotassiumKgPerHa(40.0);
        chickpea.setMinTemperatureCelsius(15.0);
        chickpea.setMaxTemperatureCelsius(30.0);
        chickpea.setMinRainfallMm(350.0);
        chickpea.setMaxRainfallMm(650.0);
        chickpea.setSuitableSeasons(Arrays.asList(CropSeason.RABI));
        chickpea.setWaterRequirementMm(300.0);
        chickpea.setGrowingDurationDaysMin(90);
        chickpea.setGrowingDurationDaysMax(120);
        chickpea.setBotanicalFamily("Fabaceae");
        chickpea.setNitrogenFixer(true);
        chickpea.setDeepRooted(true);
        chickpea.setGoodFollowers(Arrays.asList("Rice", "Maize", "Sorghum", "Cotton"));
        chickpea.setBadFollowers(Arrays.asList("Chickpea", "Lentil"));
        chickpea.setSourceReferences("ICRISAT Legume Compendium; ICAR Pulse Directorate");
        chickpea.setSourceUpdatedAt("2025-02-10");
        chickpea.setDataConfidence(DataConfidence.HIGH);
        chickpea.setDescription("Drought-tolerant leguminous pulse that enriches soil through atmospheric nitrogen fixation.");
        cropCatalog.put(chickpea.getCropId(), chickpea);

        // 4. Maize / Corn (Zea mays)
        Crop maize = new Crop();
        maize.setCropId("crop-maize");
        maize.setCropName("Hybrid Grain Maize");
        maize.setScientificName("Zea mays");
        maize.setCategory(CropCategory.CEREAL);
        maize.setSuitableSoilTypes(Arrays.asList("LOAMY", "SANDY_LOAM", "SILT", "CLAY_LOAM"));
        maize.setMinimumSuitablePH(5.8);
        maize.setMaximumSuitablePH(7.5);
        maize.setMinNitrogenKgPerHa(100.0);
        maize.setMaxNitrogenKgPerHa(140.0);
        maize.setMinPhosphorusKgPerHa(50.0);
        maize.setMaxPhosphorusKgPerHa(70.0);
        maize.setMinPotassiumKgPerHa(40.0);
        maize.setMaxPotassiumKgPerHa(60.0);
        maize.setMinTemperatureCelsius(18.0);
        maize.setMaxTemperatureCelsius(35.0);
        maize.setMinRainfallMm(500.0);
        maize.setMaxRainfallMm(900.0);
        maize.setSuitableSeasons(Arrays.asList(CropSeason.KHARIF, CropSeason.RABI, CropSeason.ALL_SEASON));
        maize.setWaterRequirementMm(550.0);
        maize.setGrowingDurationDaysMin(85);
        maize.setGrowingDurationDaysMax(115);
        maize.setBotanicalFamily("Poaceae");
        maize.setNitrogenFixer(false);
        maize.setDeepRooted(false);
        maize.setGoodFollowers(Arrays.asList("Chickpea", "Mustard", "Wheat"));
        maize.setBadFollowers(Arrays.asList("Maize", "Sorghum"));
        maize.setSourceReferences("CIMMYT Global Maize Program; FAO Water Bulletin 33");
        maize.setSourceUpdatedAt("2025-01-20");
        maize.setDataConfidence(DataConfidence.HIGH);
        maize.setDescription("High photosynthetic efficiency C4 cereal with versatile food, feed, and industrial value.");
        cropCatalog.put(maize.getCropId(), maize);

        // 5. Pomegranate (Punica granatum)
        Crop pomegranate = new Crop();
        pomegranate.setCropId("crop-pomegranate");
        pomegranate.setCropName("Bhagwa Pomegranate");
        pomegranate.setScientificName("Punica granatum");
        pomegranate.setCategory(CropCategory.HORTICULTURE);
        pomegranate.setSuitableSoilTypes(Arrays.asList("LOAMY", "SANDY_LOAM", "CHALKY"));
        pomegranate.setMinimumSuitablePH(6.5);
        pomegranate.setMaximumSuitablePH(8.2);
        pomegranate.setMinNitrogenKgPerHa(150.0);
        pomegranate.setMaxNitrogenKgPerHa(250.0);
        pomegranate.setMinPhosphorusKgPerHa(60.0);
        pomegranate.setMaxPhosphorusKgPerHa(100.0);
        pomegranate.setMinPotassiumKgPerHa(150.0);
        pomegranate.setMaxPotassiumKgPerHa(250.0);
        pomegranate.setMinTemperatureCelsius(18.0);
        pomegranate.setMaxTemperatureCelsius(38.0);
        pomegranate.setMinRainfallMm(450.0);
        pomegranate.setMaxRainfallMm(800.0);
        pomegranate.setSuitableSeasons(Arrays.asList(CropSeason.PERENNIAL, CropSeason.ALL_SEASON));
        pomegranate.setWaterRequirementMm(600.0);
        pomegranate.setGrowingDurationDaysMin(180);
        pomegranate.setGrowingDurationDaysMax(240);
        pomegranate.setBotanicalFamily("Lythraceae");
        pomegranate.setNitrogenFixer(false);
        pomegranate.setDeepRooted(true);
        pomegranate.setGoodFollowers(Arrays.asList("Legume Intercrops"));
        pomegranate.setBadFollowers(new ArrayList<String>());
        pomegranate.setSourceReferences("ICAR-National Research Centre on Pomegranate, Solapur");
        pomegranate.setSourceUpdatedAt("2025-02-01");
        pomegranate.setDataConfidence(DataConfidence.HIGH);
        pomegranate.setDescription("High-value arid and semi-arid perennial fruit crop thriving under micro-drip fertigation.");
        cropCatalog.put(pomegranate.getCropId(), pomegranate);

        // 6. Groundnut / Peanut (Arachis hypogaea)
        Crop groundnut = new Crop();
        groundnut.setCropId("crop-groundnut");
        groundnut.setCropName("Spanish Peanut / Groundnut");
        groundnut.setScientificName("Arachis hypogaea");
        groundnut.setCategory(CropCategory.OILSEED);
        groundnut.setSuitableSoilTypes(Arrays.asList("SANDY_LOAM", "LOAMY", "SANDY"));
        groundnut.setMinimumSuitablePH(6.0);
        groundnut.setMaximumSuitablePH(7.5);
        groundnut.setMinNitrogenKgPerHa(20.0);
        groundnut.setMaxNitrogenKgPerHa(30.0);
        groundnut.setMinPhosphorusKgPerHa(40.0);
        groundnut.setMaxPhosphorusKgPerHa(60.0);
        groundnut.setMinPotassiumKgPerHa(40.0);
        groundnut.setMaxPotassiumKgPerHa(60.0);
        groundnut.setMinTemperatureCelsius(20.0);
        groundnut.setMaxTemperatureCelsius(32.0);
        groundnut.setMinRainfallMm(450.0);
        groundnut.setMaxRainfallMm(750.0);
        groundnut.setSuitableSeasons(Arrays.asList(CropSeason.KHARIF, CropSeason.ZAID));
        groundnut.setWaterRequirementMm(450.0);
        groundnut.setGrowingDurationDaysMin(105);
        groundnut.setGrowingDurationDaysMax(125);
        groundnut.setBotanicalFamily("Fabaceae");
        groundnut.setNitrogenFixer(true);
        groundnut.setDeepRooted(false);
        groundnut.setGoodFollowers(Arrays.asList("Wheat", "Barley", "Gram"));
        groundnut.setBadFollowers(Arrays.asList("Groundnut"));
        groundnut.setSourceReferences("ICAR Directorate of Groundnut Research; ICRISAT Guidelines");
        groundnut.setSourceUpdatedAt("2025-01-25");
        groundnut.setDataConfidence(DataConfidence.HIGH);
        groundnut.setDescription("Self-pollinated legume oilseed requiring friable, well-aerated sandy loam topsoil for gynophore pegging.");
        cropCatalog.put(groundnut.getCropId(), groundnut);

        // 7. Indian Mustard (Brassica juncea)
        Crop mustard = new Crop();
        mustard.setCropId("crop-mustard");
        mustard.setCropName("Indian Mustard (Raya)");
        mustard.setScientificName("Brassica juncea");
        mustard.setCategory(CropCategory.OILSEED);
        mustard.setSuitableSoilTypes(Arrays.asList("LOAMY", "SANDY_LOAM", "CLAY_LOAM"));
        mustard.setMinimumSuitablePH(6.0);
        mustard.setMaximumSuitablePH(7.8);
        mustard.setMinNitrogenKgPerHa(60.0);
        mustard.setMaxNitrogenKgPerHa(90.0);
        mustard.setMinPhosphorusKgPerHa(30.0);
        mustard.setMaxPhosphorusKgPerHa(50.0);
        mustard.setMinPotassiumKgPerHa(30.0);
        mustard.setMaxPotassiumKgPerHa(40.0);
        mustard.setMinTemperatureCelsius(10.0);
        mustard.setMaxTemperatureCelsius(25.0);
        mustard.setMinRainfallMm(250.0);
        mustard.setMaxRainfallMm(450.0);
        mustard.setSuitableSeasons(Arrays.asList(CropSeason.RABI));
        mustard.setWaterRequirementMm(280.0);
        mustard.setGrowingDurationDaysMin(100);
        mustard.setGrowingDurationDaysMax(125);
        mustard.setBotanicalFamily("Brassicaceae");
        mustard.setNitrogenFixer(false);
        mustard.setDeepRooted(true);
        mustard.setGoodFollowers(Arrays.asList("Pearl Millet", "Maize", "Cotton"));
        mustard.setBadFollowers(Arrays.asList("Cabbage", "Cauliflower"));
        mustard.setSourceReferences("ICAR-DRMR Bharatpur Mustard Handbook");
        mustard.setSourceUpdatedAt("2025-01-10");
        mustard.setDataConfidence(DataConfidence.HIGH);
        mustard.setDescription("Low water-footprint winter oilseed crop with root glucosinolates providing biofumigant protection.");
        cropCatalog.put(mustard.getCropId(), mustard);

        // 8. Tomato (Solanum lycopersicum)
        Crop tomato = new Crop();
        tomato.setCropId("crop-tomato");
        tomato.setCropName("Determinate Field Tomato");
        tomato.setScientificName("Solanum lycopersicum");
        tomato.setCategory(CropCategory.VEGETABLE);
        tomato.setSuitableSoilTypes(Arrays.asList("LOAMY", "SANDY_LOAM", "SILT"));
        tomato.setMinimumSuitablePH(6.0);
        tomato.setMaximumSuitablePH(7.0);
        tomato.setMinNitrogenKgPerHa(100.0);
        tomato.setMaxNitrogenKgPerHa(150.0);
        tomato.setMinPhosphorusKgPerHa(60.0);
        tomato.setMaxPhosphorusKgPerHa(90.0);
        tomato.setMinPotassiumKgPerHa(80.0);
        tomato.setMaxPotassiumKgPerHa(140.0);
        tomato.setMinTemperatureCelsius(18.0);
        tomato.setMaxTemperatureCelsius(30.0);
        tomato.setMinRainfallMm(500.0);
        tomato.setMaxRainfallMm(900.0);
        tomato.setSuitableSeasons(Arrays.asList(CropSeason.KHARIF, CropSeason.RABI, CropSeason.ZAID));
        tomato.setWaterRequirementMm(500.0);
        tomato.setGrowingDurationDaysMin(90);
        tomato.setGrowingDurationDaysMax(130);
        tomato.setBotanicalFamily("Solanaceae");
        tomato.setNitrogenFixer(false);
        tomato.setDeepRooted(false);
        tomato.setGoodFollowers(Arrays.asList("Cowpea", "Beans", "Maize"));
        tomato.setBadFollowers(Arrays.asList("Potato", "Eggplant", "Chilli", "Tomato")); // Solanaceae disease cycle
        tomato.setSourceReferences("AVRDC World Vegetable Center Guidelines; FAO Vegetable Production Manual");
        tomato.setSourceUpdatedAt("2025-01-18");
        tomato.setDataConfidence(DataConfidence.HIGH);
        tomato.setDescription("High-turnover commercial vegetable demanding well-drained soils and steady calcium-potassium nutrition.");
        cropCatalog.put(tomato.getCropId(), tomato);

        // 9. Cotton (Gossypium hirsutum)
        Crop cotton = new Crop();
        cotton.setCropId("crop-cotton");
        cotton.setCropName("Upland Cotton");
        cotton.setScientificName("Gossypium hirsutum");
        cotton.setCategory(CropCategory.CASH_CROP);
        cotton.setSuitableSoilTypes(Arrays.asList("CLAY", "CLAY_LOAM", "LOAMY"));
        cotton.setMinimumSuitablePH(6.5);
        cotton.setMaximumSuitablePH(8.5);
        cotton.setMinNitrogenKgPerHa(90.0);
        cotton.setMaxNitrogenKgPerHa(130.0);
        cotton.setMinPhosphorusKgPerHa(40.0);
        cotton.setMaxPhosphorusKgPerHa(60.0);
        cotton.setMinPotassiumKgPerHa(40.0);
        cotton.setMaxPotassiumKgPerHa(70.0);
        cotton.setMinTemperatureCelsius(21.0);
        cotton.setMaxTemperatureCelsius(37.0);
        cotton.setMinRainfallMm(500.0);
        cotton.setMaxRainfallMm(1100.0);
        cotton.setSuitableSeasons(Arrays.asList(CropSeason.KHARIF));
        cotton.setWaterRequirementMm(700.0);
        cotton.setGrowingDurationDaysMin(150);
        cotton.setGrowingDurationDaysMax(180);
        cotton.setBotanicalFamily("Malvaceae");
        cotton.setNitrogenFixer(false);
        cotton.setDeepRooted(true);
        cotton.setGoodFollowers(Arrays.asList("Chickpea", "Wheat", "Fallow"));
        cotton.setBadFollowers(Arrays.asList("Cotton", "Okra"));
        cotton.setSourceReferences("ICAR-Central Institute for Cotton Research (CICR)");
        cotton.setSourceUpdatedAt("2025-01-05");
        cotton.setDataConfidence(DataConfidence.HIGH);
        cotton.setDescription("Deep-rooted cash fibre crop performing exceptionally on heavy vertisol (black cotton) soils.");
        cropCatalog.put(cotton.getCropId(), cotton);

        // 10. Soybean (Glycine max)
        Crop soybean = new Crop();
        soybean.setCropId("crop-soybean");
        soybean.setCropName("Yellow Seeded Soybean");
        soybean.setScientificName("Glycine max");
        soybean.setCategory(CropCategory.OILSEED);
        soybean.setSuitableSoilTypes(Arrays.asList("LOAMY", "CLAY_LOAM", "SILT"));
        soybean.setMinimumSuitablePH(6.0);
        soybean.setMaximumSuitablePH(7.2);
        soybean.setMinNitrogenKgPerHa(25.0);
        soybean.setMaxNitrogenKgPerHa(35.0);
        soybean.setMinPhosphorusKgPerHa(50.0);
        soybean.setMaxPhosphorusKgPerHa(70.0);
        soybean.setMinPotassiumKgPerHa(40.0);
        soybean.setMaxPotassiumKgPerHa(60.0);
        soybean.setMinTemperatureCelsius(20.0);
        soybean.setMaxTemperatureCelsius(32.0);
        soybean.setMinRainfallMm(600.0);
        soybean.setMaxRainfallMm(1000.0);
        soybean.setSuitableSeasons(Arrays.asList(CropSeason.KHARIF));
        soybean.setWaterRequirementMm(500.0);
        soybean.setGrowingDurationDaysMin(90);
        soybean.setGrowingDurationDaysMax(115);
        soybean.setBotanicalFamily("Fabaceae");
        soybean.setNitrogenFixer(true);
        soybean.setDeepRooted(false);
        soybean.setGoodFollowers(Arrays.asList("Wheat", "Gram", "Mustard"));
        soybean.setBadFollowers(Arrays.asList("Soybean"));
        soybean.setSourceReferences("ICAR-Indian Institute of Soybean Research, Indore");
        soybean.setSourceUpdatedAt("2025-01-30");
        soybean.setDataConfidence(DataConfidence.HIGH);
        soybean.setDescription("Vital protein and edible oil legume ideal for rotational restorative farming.");
        cropCatalog.put(soybean.getCropId(), soybean);
    }

    public List<Crop> getAllCrops() {
        return new ArrayList<Crop>(cropCatalog.values());
    }

    public Crop getCropById(String cropId) {
        if (cropId == null) return null;
        Crop crop = cropCatalog.get(cropId);
        if (crop != null) return crop;

        // Fallback search by crop name
        for (Crop c : cropCatalog.values()) {
            if (c.getCropName().equalsIgnoreCase(cropId) || c.getCropId().equalsIgnoreCase(cropId)) {
                return c;
            }
        }
        return null;
    }
}
