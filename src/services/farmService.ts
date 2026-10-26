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
import { Farm, SoilType, IrrigationSource } from '../types';

export interface CreateFarmDto {
  name: string;
  location: string;
  totalAreaAcres: number;
  soilType: SoilType;
  irrigationSource: IrrigationSource;
  primaryCropType?: string;
  notes?: string;
}

export type UpdateFarmDto = Partial<CreateFarmDto>;

export const farmService = {
  /**
   * Fetch all farms for an authenticated farmer
   */
  async getFarms(userId: string): Promise<Farm[]> {
    if (!userId) return [];
    try {
      const q = query(collection(db, 'farms'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const farms: Farm[] = [];
      snapshot.forEach((docSnap) => {
        farms.push(docSnap.data() as Farm);
      });
      return farms.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'farms');
      return [];
    }
  },

  /**
   * Fetch a single farm by ID and verify ownership
   */
  async getFarmById(farmId: string, userId: string): Promise<Farm | null> {
    if (!userId || !farmId) return null;
    try {
      const docSnap = await getDoc(doc(db, 'farms', farmId));
      if (docSnap.exists()) {
        const farm = docSnap.data() as Farm;
        if (farm.userId === userId) {
          return farm;
        }
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `farms/${farmId}`);
      return null;
    }
  },

  /**
   * Create a new farm record
   */
  async createFarm(dto: CreateFarmDto, userId: string): Promise<Farm> {
    if (!userId) {
      throw new Error('Authentication required to create a farm parcel.');
    }
    const farmId = 'farm-' + Date.now();
    const now = new Date().toISOString();

    const newFarm: Farm = {
      id: farmId,
      userId,
      name: dto.name.trim(),
      location: dto.location.trim(),
      totalAreaAcres: Number(dto.totalAreaAcres),
      soilType: dto.soilType,
      irrigationSource: dto.irrigationSource,
      primaryCropType: dto.primaryCropType?.trim() || undefined,
      notes: dto.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'farms', farmId), newFarm);
      return newFarm;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `farms/${farmId}`);
      throw error;
    }
  },

  /**
   * Update an existing farm record with ownership validation
   */
  async updateFarm(farmId: string, dto: UpdateFarmDto, userId: string): Promise<Farm> {
    if (!userId || !farmId) {
      throw new Error('Authentication and farm identifier required.');
    }

    try {
      const existing = await this.getFarmById(farmId, userId);
      if (!existing) {
        throw new Error('Farm parcel not found or you do not have permission to modify it.');
      }

      const updates: Partial<Farm> = {
        ...dto,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'farms', farmId), updates);
      return { ...existing, ...updates };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `farms/${farmId}`);
      throw error;
    }
  },

  /**
   * Delete a farm record and its associated soil records
   */
  async deleteFarm(farmId: string, userId: string): Promise<void> {
    if (!userId || !farmId) {
      throw new Error('Authentication and farm identifier required.');
    }

    try {
      const existing = await this.getFarmById(farmId, userId);
      if (!existing) {
        throw new Error('Farm parcel not found or you do not have permission to delete it.');
      }

      await deleteDoc(doc(db, 'farms', farmId));

      // Cascade delete soil tests for this farm
      const q = query(
        collection(db, 'soilTests'),
        where('farmId', '==', farmId),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `farms/${farmId}`);
      throw error;
    }
  },
};
