import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { ProfitabilityResponse } from '../types';
import { apiClient } from './apiClient';

export interface EstimateProfitabilityParams {
  farmId: string;
  cropName: string;
  areaAcres: number;
  seedCost?: number;
  fertilizerCost?: number;
  labourCost?: number;
  irrigationCost?: number;
  equipmentCost?: number;
  otherCosts?: number;
  expectedYieldPerAcre: number;
  yieldUnit?: string;
  expectedSellingPricePerUnit: number;
  currency?: string;
}

export const profitabilityService = {
  async estimateProfitability(
    userId: string,
    params: EstimateProfitabilityParams
  ): Promise<ProfitabilityResponse> {
    // 1. Try Java Backend
    try {
      const res = await apiClient.post<ProfitabilityResponse>('profitability/estimate', {
        farmId: params.farmId,
        cropName: params.cropName,
        areaAcres: params.areaAcres,
        seedCost: params.seedCost,
        fertilizerCost: params.fertilizerCost,
        labourCost: params.labourCost,
        irrigationCost: params.irrigationCost,
        equipmentCost: params.equipmentCost,
        otherCosts: params.otherCosts,
        expectedYieldPerAcre: params.expectedYieldPerAcre,
        yieldUnit: params.yieldUnit || 'Quintals',
        expectedSellingPricePerUnit: params.expectedSellingPricePerUnit,
        currency: params.currency || 'INR',
      });
      if (res && res.data) return res.data;
    } catch {
      // Local fallback
    }

    const area = params.areaAcres;
    const seed = params.seedCost !== undefined ? params.seedCost : area * 2500;
    const fert = params.fertilizerCost !== undefined ? params.fertilizerCost : area * 4000;
    const labour = params.labourCost !== undefined ? params.labourCost : area * 5500;
    const irrig = params.irrigationCost !== undefined ? params.irrigationCost : area * 2000;
    const equip = params.equipmentCost !== undefined ? params.equipmentCost : area * 3000;
    const other = params.otherCosts !== undefined ? params.otherCosts : area * 1200;

    const totalCost = Math.round(seed + fert + labour + irrig + equip + other);
    const costPerAcre = Math.round((totalCost / area) * 100) / 100;

    const totalYield = Math.round(params.expectedYieldPerAcre * area * 100) / 100;
    const estRevenue = Math.round(totalYield * params.expectedSellingPricePerUnit);
    const estProfit = Math.round(estRevenue - totalCost);
    const profitPerAcre = Math.round((estProfit / area) * 100) / 100;

    const roi = totalCost > 0 ? Math.round(((estProfit / totalCost) * 100) * 10) / 10 : 0;
    const breakEven = totalYield > 0 ? Math.round((totalCost / totalYield) * 100) / 100 : 0;

    const breakdown: Record<string, number> = {
      seeds: Math.round((seed / totalCost) * 100),
      fertilizer: Math.round((fert / totalCost) * 100),
      labour: Math.round((labour / totalCost) * 100),
      irrigation: Math.round((irrig / totalCost) * 100),
      equipment: Math.round((equip / totalCost) * 100),
      other: Math.round((other / totalCost) * 100),
    };

    const riskFactors: string[] = [];
    if (roi < 25) {
      riskFactors.push('Tight operational profit buffer: input price inflation could erode net margins.');
    }
    riskFactors.push('Mandated post-harvest grain moisture thresholds govern APMC/mandi realization prices.');
    riskFactors.push('Local logistics and transport tariffs from field to terminal market.');

    const id = 'prof-' + Date.now();
    const result: ProfitabilityResponse = {
      id,
      farmId: params.farmId,
      cropName: params.cropName,
      areaAcres: area,
      seedCost: seed,
      fertilizerCost: fert,
      labourCost: labour,
      irrigationCost: irrig,
      equipmentCost: equip,
      otherCosts: other,
      totalCost,
      costPerAcre,
      expectedYieldPerAcre: params.expectedYieldPerAcre,
      yieldUnit: params.yieldUnit || 'Quintals',
      expectedTotalYield: totalYield,
      expectedSellingPricePerUnit: params.expectedSellingPricePerUnit,
      estimatedRevenue: estRevenue,
      estimatedProfit: estProfit,
      profitPerAcre,
      returnOnInvestmentPercent: roi,
      breakEvenPricePerUnit: breakEven,
      currency: params.currency || 'INR',
      costBreakdownPercent: breakdown,
      financialAssumptions: [
        'Excludes capital equipment depreciation and land rental interest charges.',
        'Assumes normal weather window with zero severe lodging or flood damage.',
        `Calibrated for ${area} acre parcel extent.`,
      ],
      riskFactors,
    };

    try {
      await setDoc(doc(db, 'profitability_estimates', id), {
        ...result,
        userId,
      });
    } catch {
      // Local fallback
    }

    return result;
  },

  async getSavedEstimates(userId: string): Promise<ProfitabilityResponse[]> {
    try {
      const q = query(collection(db, 'profitability_estimates'), where('userId', '==', userId));
      const snaps = await getDocs(q);
      const list: ProfitabilityResponse[] = [];
      snaps.forEach((d) => list.push(d.data() as ProfitabilityResponse));
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'profitability_estimates');
      return [];
    }
  },

  async deleteEstimate(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'profitability_estimates', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `profitability_estimates/${id}`);
    }
  },
};
