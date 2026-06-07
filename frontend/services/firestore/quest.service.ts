import { db } from '../../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  FirestoreDataConverter,
  serverTimestamp
} from 'firebase/firestore';

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  type: string;
  active: boolean;
}

export interface UserProgress {
  id: string;
  userId: string;
  questId: string;
  completed: boolean;
  completedAt: any;
}

const questConverter: FirestoreDataConverter<Quest> = {
  toFirestore(quest: Quest) {
    const { id, ...rest } = quest;
    return rest;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title || '',
      description: data.description || '',
      difficulty: data.difficulty || 'easy',
      xpReward: data.xpReward || 0,
      type: data.type || '',
      active: data.active ?? true,
    };
  }
};

const progressConverter: FirestoreDataConverter<UserProgress> = {
  toFirestore(progress: UserProgress) {
    const { id, ...rest } = progress;
    return {
      ...rest,
      completedAt: progress.completed ? (progress.completedAt || serverTimestamp()) : null
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      questId: data.questId || '',
      completed: data.completed ?? false,
      completedAt: data.completedAt,
    };
  }
};

export const questService = {
  async getQuests(): Promise<Quest[]> {
    try {
      const q = query(collection(db, 'quests').withConverter(questConverter), where('active', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error fetching quests:', error);
      throw error;
    }
  },

  async getQuest(questId: string): Promise<Quest | null> {
    try {
      const docRef = doc(db, 'quests', questId).withConverter(questConverter);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error fetching quest:', error);
      throw error;
    }
  },

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const q = query(
        collection(db, 'userProgress').withConverter(progressConverter),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  },

  async startQuest(userId: string, questId: string): Promise<UserProgress> {
    try {
      const progressId = `${userId}_${questId}`;
      const docRef = doc(db, 'userProgress', progressId).withConverter(progressConverter);
      
      const newProgress: UserProgress = {
        id: progressId,
        userId,
        questId,
        completed: false,
        completedAt: null
      };
      
      await setDoc(docRef, newProgress);
      return newProgress;
    } catch (error) {
      console.error('Error starting quest:', error);
      throw error;
    }
  },

  async completeQuest(userId: string, questId: string): Promise<void> {
    try {
      const progressId = `${userId}_${questId}`;
      const docRef = doc(db, 'userProgress', progressId);
      await updateDoc(docRef, {
        completed: true,
        completedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error completing quest:', error);
      throw error;
    }
  }
};
