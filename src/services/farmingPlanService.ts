import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { FarmingPlan } from '../types';

export const farmingPlanService = {
  async getFarmingPlans(userId: string): Promise<FarmingPlan[]> {
    try {
      const q = query(collection(db, 'farming_plans'), where('userId', '==', userId));
      const snaps = await getDocs(q);
      const list: FarmingPlan[] = [];
      snaps.forEach((d) => list.push(d.data() as FarmingPlan));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'farming_plans');
      return [];
    }
  },

  async createFarmingPlan(
    userId: string,
    planData: Omit<FarmingPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<FarmingPlan> {
    const id = 'plan-' + Date.now();
    const now = new Date().toISOString();
    const plan: FarmingPlan = {
      id,
      userId,
      ...planData,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'farming_plans', id), plan);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'farming_plans');
    }

    return plan;
  },

  async updateFarmingPlanStatus(
    id: string,
    status: FarmingPlan['status']
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'farming_plans', id), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `farming_plans/${id}`);
    }
  },

  async deleteFarmingPlan(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'farming_plans', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `farming_plans/${id}`);
    }
  },
};
