import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

console.log('Connecting to Firebase project:', config.projectId);
const app = initializeApp(config);
const db = getFirestore(app);

const sampleFarms = [
  {
    id: 'farm-001',
    userId: 'demo-farmer-id-1234',
    name: 'Green Valley Organic Estate',
    location: 'District Nashik, Maharashtra',
    totalAreaAcres: 14.5,
    soilType: 'LOAMY',
    irrigationSource: 'DRIP',
    primaryCropType: 'Pomegranate & Grapes',
    notes: 'Well-drained volcanic soil with automated micro-drip irrigation network.',
    createdAt: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'farm-002',
    userId: 'demo-farmer-id-1234',
    name: 'Sunrise Fertile Plains',
    location: 'Bhatinda Agro Corridor, Punjab',
    totalAreaAcres: 28.0,
    soilType: 'CLAY_LOAM',
    irrigationSource: 'CANAL',
    primaryCropType: 'Wheat & Mustard',
    notes: 'Seasonal canal water allocation supplemented with solar borewell backup.',
    createdAt: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'farm-003',
    userId: 'demo-farmer-id-1234',
    name: 'Cauvery River Terrace Field',
    location: 'Thanjavur Delta, Tamil Nadu',
    totalAreaAcres: 8.2,
    soilType: 'CLAY',
    irrigationSource: 'CANAL',
    primaryCropType: 'Basmati Rice (Kharif)',
    notes: 'High water-holding capacity, optimal for wetland paddy cultivation.',
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'farm-004',
    userId: 'demo-farmer-id-1234',
    name: 'Highland Spice Plantation',
    location: 'Wayanad Ghats, Kerala',
    totalAreaAcres: 6.0,
    soilType: 'SANDY_LOAM',
    irrigationSource: 'SPRINKLER',
    primaryCropType: 'Black Pepper & Cardamom',
    notes: 'Rich forest humic topsoil on terrace slopes.',
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  }
];

const sampleSoilTests = [
  {
    id: 'soil-001',
    farmId: 'farm-001',
    userId: 'demo-farmer-id-1234',
    testDate: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString().split('T')[0],
    phLevel: 6.8,
    nitrogenLevel: 320,
    phosphorusLevel: 24,
    potassiumLevel: 210,
    organicMatter: 2.4,
    moistureContent: 22,
    electricalConductivity: 0.45,
    fertilityRating: 'OPTIMAL',
    recommendations: 'Soil nutrient balance is optimal. Maintain current organic compost application regime. Schedule next seasonal micro-nutrient evaluation in 90 days.',
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'soil-002',
    farmId: 'farm-002',
    userId: 'demo-farmer-id-1234',
    testDate: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString().split('T')[0],
    phLevel: 7.9,
    nitrogenLevel: 180,
    phosphorusLevel: 11,
    potassiumLevel: 165,
    organicMatter: 1.1,
    moistureContent: 16,
    electricalConductivity: 0.82,
    fertilityRating: 'DEFICIENT',
    recommendations: 'Slightly alkaline soil with nitrogen and phosphorus deficiency. Apply Single Super Phosphate (SSP) and well-decomposed FYM (10 t/ha). Consider green manuring with Sesbania (Dhaincha) before sowing.',
    createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'soil-003',
    farmId: 'farm-003',
    userId: 'demo-farmer-id-1234',
    testDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
    phLevel: 6.4,
    nitrogenLevel: 290,
    phosphorusLevel: 18,
    potassiumLevel: 140,
    organicMatter: 1.8,
    moistureContent: 28,
    electricalConductivity: 0.38,
    fertilityRating: 'MODERATE',
    recommendations: 'Healthy wetland soil profile. Phosphorus is within lower safe band; supplement with split application of rock phosphate or bio-fertilizers (Phosphobacteria / PSB).',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'soil-004',
    farmId: 'farm-004',
    userId: 'demo-farmer-id-1234',
    testDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
    phLevel: 5.7,
    nitrogenLevel: 340,
    phosphorusLevel: 16,
    potassiumLevel: 195,
    organicMatter: 3.2,
    moistureContent: 24,
    electricalConductivity: 0.28,
    fertilityRating: 'MODERATE',
    recommendations: 'Moderately acidic hill soil with excellent organic carbon. Broadcast agricultural dolomite lime (1.5 t/ha) to optimize magnesium and pH levels.',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  }
];

const sampleUser = {
  uid: 'demo-farmer-id-1234',
  email: 'pjeeva554@gmail.com',
  fullName: 'P. Jeeva',
  phoneNumber: '+91 98765 43210',
  role: 'FARMER',
  termsAccepted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function seed() {
  try {
    console.log('Seeding user profile...');
    await setDoc(doc(db, 'users', sampleUser.uid), sampleUser);
    console.log('✓ User profile created:', sampleUser.email);

    console.log('Seeding farms...');
    for (const farm of sampleFarms) {
      await setDoc(doc(db, 'farms', farm.id), farm);
      console.log('✓ Farm created:', farm.name);
    }

    console.log('Seeding soil tests...');
    for (const test of sampleSoilTests) {
      await setDoc(doc(db, 'soilTests', test.id), test);
      console.log('✓ Soil test created:', test.id, 'for farm:', test.farmId);
    }

    console.log('\nAll seed data successfully pushed to Firestore!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
