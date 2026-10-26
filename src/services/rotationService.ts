import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { CropHistoryEntry, CropRotationEvaluation } from '../types';
import { VERIFIED_CROP_CATALOG } from './cropService';
import { apiClient } from './apiClient';

export const rotationService = {
  async evaluateRotation(candidateCropName: string, previousCropName: string): Promise<CropRotationEvaluation> {
    try {
      const res = await apiClient.post<CropRotationEvaluation>('crop-rotation/evaluate', null, {
        params: { candidateCrop: candidateCropName, previousCrop: previousCropName },
      });
      if (res && res.data) return res.data;
    } catch {
      // Local fallback
    }

    const candidate = VERIFIED_CROP_CATALOG.find(
      (c) => c.cropName.toLowerCase().includes(candidateCropName.toLowerCase()) || c.cropId.toLowerCase() === candidateCropName.toLowerCase()
    );

    const prev = (previousCropName || '').toLowerCase().trim();
    const candFamily = (candidate?.botanicalFamily || '').toLowerCase();
    let score = 75;
    const reasons: string[] = [];
    const warnings: string[] = [];

    if (!prev || prev === 'none') {
      reasons.push('Baseline diversified sequence without documented immediate predecessor.');
      return {
        candidateCrop: candidate?.cropName || candidateCropName,
        previousCrop: 'None',
        rotationScore: 75,
        reasons,
        warnings,
        previousCropFamily: 'None',
      };
    }

    // 1. Solanaceae succession risk
    if (candFamily === 'solanaceae' && (prev.includes('tomato') || prev.includes('potato') || prev.includes('eggplant') || prev.includes('brinjal') || prev.includes('chilli'))) {
      score = 35;
      warnings.push(`High Disease Vector Risk: Consecutive Solanaceous crops drastically amplify fungal wilt (Fusarium/Verticillium) and Root-Knot Nematode populations.`);
    } else if (candFamily === 'poaceae' && (prev.includes('rice') || prev.includes('wheat') || prev.includes('maize') || prev.includes('sorghum'))) {
      score = 60;
      warnings.push(`Continuous cereal monoculture depletes uniform root-zone depth and promotes cereal stem-borer cycles.`);
    } else if (candidate?.goodFollowers && candidate.goodFollowers.some((f) => prev.includes(f.toLowerCase()))) {
      score = 95;
      reasons.push(`Optimal Rotation Pair: Documented synergic rotation sequence following ${previousCropName}.`);
    } else {
      score = 80;
      reasons.push(`Beneficial botanical family diversification breaks selective host pest and pathogen cycles.`);
    }

    // 2. Legume credit
    if (prev.includes('chickpea') || prev.includes('soybean') || prev.includes('pulse') || prev.includes('pea') || prev.includes('groundnut')) {
      if (candFamily === 'poaceae') {
        score = Math.min(100, score + 20);
        reasons.push(`Legume-cereal alternation: ${candidate?.cropName || candidateCropName} capitalizes on residual biological nitrogen fixed by ${previousCropName}.`);
      }
    }

    return {
      candidateCrop: candidate?.cropName || candidateCropName,
      previousCrop: previousCropName,
      rotationScore: score,
      reasons,
      warnings,
      previousCropFamily: candFamily || 'Unknown',
    };
  },

  async getHistoryForFarm(farmId: string): Promise<CropHistoryEntry[]> {
    try {
      const q = query(collection(db, 'crop_history'), where('farmId', '==', farmId));
      const snaps = await getDocs(q);
      const list: CropHistoryEntry[] = [];
      snaps.forEach((d) => list.push(d.data() as CropHistoryEntry));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'crop_history');
      return [];
    }
  },

  async addHistoryEntry(
    farmId: string,
    userId: string,
    data: Omit<CropHistoryEntry, 'id' | 'farmId' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<CropHistoryEntry> {
    const id = 'hist-' + Date.now();
    const now = new Date().toISOString();
    const entry: CropHistoryEntry = {
      id,
      farmId,
      userId,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'crop_history', id), entry);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'crop_history');
    }

    return entry;
  },

  async deleteHistoryEntry(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'crop_history', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `crop_history/${id}`);
    }
  },
};
