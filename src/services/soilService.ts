import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { SoilTest, FertilityRating } from '../types';

export interface CreateSoilTestDto {
  farmId: string;
  testDate: string;
  phLevel: number;
  nitrogenLevel: number;
  phosphorusLevel: number;
  potassiumLevel: number;
  organicMatter?: number;
  moistureContent?: number;
  electricalConductivity?: number;
}

export type UpdateSoilTestDto = Partial<CreateSoilTestDto>;

/**
 * Calculates scientific fertility rating & recommendations
 */
export function analyzeSoilHealth(
  ph: number,
  n: number,
  p: number,
  k: number,
  organicMatter?: number
): { rating: FertilityRating; recommendations: string } {
  const isPhOptimal = ph >= 6.0 && ph <= 7.5;
  const isPhAcidic = ph < 6.0;
  const isPhAlkaline = ph > 7.5;

  const nDeficient = n < 280;
  const nHigh = n > 560;

  const pDeficient = p < 15;
  const pHigh = p > 35;

  const kDeficient = k < 120;
  const kHigh = k > 280;

  const deficiencyCount = (nDeficient ? 1 : 0) + (pDeficient ? 1 : 0) + (kDeficient ? 1 : 0);
  const highCount = (nHigh ? 1 : 0) + (pHigh ? 1 : 0) + (kHigh ? 1 : 0);

  let rating: FertilityRating = 'OPTIMAL';
  if (deficiencyCount >= 2 || isPhAcidic || isPhAlkaline) {
    rating = 'DEFICIENT';
  } else if (deficiencyCount === 1) {
    rating = 'MODERATE';
  } else if (highCount >= 2) {
    rating = 'EXCESSIVE';
  } else if (isPhOptimal && deficiencyCount === 0) {
    rating = 'OPTIMAL';
  }

  const notes: string[] = [];
  if (isPhAcidic) {
    notes.push('Soil is acidic (pH < 6.0). Consider agricultural lime (calcium carbonate) application.');
  } else if (isPhAlkaline) {
    notes.push('Soil is alkaline (pH > 7.5). Consider agricultural gypsum dressing and organic matter additions.');
  } else {
    notes.push('pH is in optimal range (6.0 - 7.5) for nutrient bioavailability.');
  }

  if (nDeficient) {
    notes.push('Available Nitrogen is low (<280 kg/ha). Apply nitrogenous fertilizers or green manure.');
  } else if (nHigh) {
    notes.push('Available Nitrogen is high (>560 kg/ha). Reduce urea/nitrogen inputs to prevent vegetative lodging.');
  }

  if (pDeficient) {
    notes.push('Phosphorus is deficient (<15 kg/ha). Apply rock phosphate or single super phosphate (SSP).');
  }

  if (kDeficient) {
    notes.push('Potassium is deficient (<120 kg/ha). Top dress with Muriate of Potash (MOP).');
  }

  if (organicMatter !== undefined && organicMatter < 1.0) {
    notes.push('Organic matter is low (<1.0%). Incorporate crop residues or well-rotted farmyard manure.');
  }

  return {
    rating,
    recommendations: notes.join(' '),
  };
}

export const soilService = {
  /**
   * Fetch all soil tests for a user, optionally filtered by farmId
   */
  async getSoilTests(userId: string, farmId?: string): Promise<SoilTest[]> {
    if (!userId) return [];
    try {
      let q = query(collection(db, 'soilTests'), where('userId', '==', userId));
      if (farmId) {
        q = query(
          collection(db, 'soilTests'),
          where('userId', '==', userId),
          where('farmId', '==', farmId)
        );
      }
      const snapshot = await getDocs(q);
      const tests: SoilTest[] = [];
      snapshot.forEach((docSnap) => {
        tests.push(docSnap.data() as SoilTest);
      });
      return tests.sort(
        (a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'soilTests');
      return [];
    }
  },

  /**
   * Fetch a single soil test by ID with ownership verification
   */
  async getSoilTestById(testId: string, userId: string): Promise<SoilTest | null> {
    if (!userId || !testId) return null;
    try {
      const docSnap = await getDoc(doc(db, 'soilTests', testId));
      if (docSnap.exists()) {
        const test = docSnap.data() as SoilTest;
        if (test.userId === userId) {
          return test;
        }
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `soilTests/${testId}`);
      return null;
    }
  },

  /**
   * Create a new soil test record
   */
  async createSoilTest(dto: CreateSoilTestDto, userId: string): Promise<SoilTest> {
    if (!userId) {
      throw new Error('Authentication required to record a soil assay.');
    }
    const testId = 'soil-' + Date.now();
    const now = new Date().toISOString();

    const analysis = analyzeSoilHealth(
      Number(dto.phLevel),
      Number(dto.nitrogenLevel),
      Number(dto.phosphorusLevel),
      Number(dto.potassiumLevel),
      dto.organicMatter !== undefined ? Number(dto.organicMatter) : undefined
    );

    const newTest: SoilTest = {
      id: testId,
      farmId: dto.farmId,
      userId,
      testDate: dto.testDate,
      phLevel: Number(dto.phLevel),
      nitrogenLevel: Number(dto.nitrogenLevel),
      phosphorusLevel: Number(dto.phosphorusLevel),
      potassiumLevel: Number(dto.potassiumLevel),
      organicMatter: dto.organicMatter !== undefined ? Number(dto.organicMatter) : undefined,
      moistureContent:
        dto.moistureContent !== undefined ? Number(dto.moistureContent) : undefined,
      electricalConductivity:
        dto.electricalConductivity !== undefined ? Number(dto.electricalConductivity) : undefined,
      fertilityRating: analysis.rating,
      recommendations: analysis.recommendations,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'soilTests', testId), newTest);
      return newTest;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `soilTests/${testId}`);
      throw error;
    }
  },

  /**
   * Update an existing soil test record with ownership validation
   */
  async updateSoilTest(
    testId: string,
    dto: UpdateSoilTestDto,
    userId: string
  ): Promise<SoilTest> {
    if (!userId || !testId) {
      throw new Error('Authentication and test identifier required.');
    }

    try {
      const existing = await this.getSoilTestById(testId, userId);
      if (!existing) {
        throw new Error('Soil test record not found or you do not have permission to modify it.');
      }

      const mergedPh = dto.phLevel !== undefined ? Number(dto.phLevel) : existing.phLevel;
      const mergedN = dto.nitrogenLevel !== undefined ? Number(dto.nitrogenLevel) : existing.nitrogenLevel;
      const mergedP = dto.phosphorusLevel !== undefined ? Number(dto.phosphorusLevel) : existing.phosphorusLevel;
      const mergedK = dto.potassiumLevel !== undefined ? Number(dto.potassiumLevel) : existing.potassiumLevel;
      const mergedOm = dto.organicMatter !== undefined ? Number(dto.organicMatter) : existing.organicMatter;

      const analysis = analyzeSoilHealth(mergedPh, mergedN, mergedP, mergedK, mergedOm);

      const updates: Partial<SoilTest> = {
        ...dto,
        fertilityRating: analysis.rating,
        recommendations: analysis.recommendations,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'soilTests', testId), updates);
      return { ...existing, ...updates };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `soilTests/${testId}`);
      throw error;
    }
  },

  /**
   * Delete a soil test record
   */
  async deleteSoilTest(testId: string, userId: string): Promise<void> {
    if (!userId || !testId) {
      throw new Error('Authentication and test identifier required.');
    }

    try {
      const existing = await this.getSoilTestById(testId, userId);
      if (!existing) {
        throw new Error('Soil test record not found or you do not have permission to delete it.');
      }

      await deleteDoc(doc(db, 'soilTests', testId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `soilTests/${testId}`);
      throw error;
    }
  },
};
