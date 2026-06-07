import { db } from '../../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  FirestoreDataConverter
} from 'firebase/firestore';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  tier: 'bronze' | 'silver' | 'gold' | 'legendary';
}

const achievementConverter: FirestoreDataConverter<Achievement> = {
  toFirestore(achievement: Achievement) {
    const { id, ...rest } = achievement;
    return rest;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name || '',
      description: data.description || '',
      xpReward: data.xpReward || 0,
      tier: data.tier || 'bronze',
    };
  }
};

export const achievementService = {
  async getAchievements(): Promise<Achievement[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'achievements').withConverter(achievementConverter));
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        achievements: arrayUnion(achievementId)
      });
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  }
};
