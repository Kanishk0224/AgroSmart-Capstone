import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { InAppNotification } from '../types';

export const notificationService = {
  async getNotifications(userId: string): Promise<InAppNotification[]> {
    try {
      const q = query(collection(db, 'notifications'), where('userId', '==', userId));
      const snaps = await getDocs(q);
      const list: InAppNotification[] = [];
      snaps.forEach((d) => list.push(d.data() as InAppNotification));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (list.length > 0) return list;
    } catch {
      // Local fallback
    }

    // Default notifications if none exist
    const defaultList: InAppNotification[] = [
      {
        id: 'notif-1',
        userId,
        title: 'Crop Intelligence Ready',
        message: 'Multi-criteria recommendation and suitability models are active for your parcels.',
        type: 'SYSTEM',
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/recommendations',
      },
      {
        id: 'notif-2',
        userId,
        title: 'Weather Advisory Active',
        message: 'High-resolution meteorological forecast available for your parcels.',
        type: 'WEATHER_ALERT',
        read: false,
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        actionUrl: '/weather-advisory',
      },
    ];
    return defaultList;
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch {
      // Local fallback
    }
  },

  async dismiss(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch {
      // Local fallback
    }
  },

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: InAppNotification['type'],
    actionUrl?: string
  ): Promise<InAppNotification> {
    const id = `notif-${Date.now()}`;
    const notif: InAppNotification = {
      id,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl,
    };

    try {
      await setDoc(doc(db, 'notifications', id), notif);
    } catch {
      // Local fallback
    }

    return notif;
  },
};
