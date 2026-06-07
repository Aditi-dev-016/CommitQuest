import { db } from '../../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  FirestoreDataConverter,
  serverTimestamp
} from 'firebase/firestore';

export interface RepositoryAnalysis {
  id: string;
  userId: string;
  repoUrl: string;
  repoName: string;
  summary: string;
  difficulty: string;
  beginnerFriendliness: number;
  generatedAt: any;
}

const analysisConverter: FirestoreDataConverter<RepositoryAnalysis> = {
  toFirestore(analysis: RepositoryAnalysis) {
    const { id, ...rest } = analysis;
    return {
      ...rest,
      generatedAt: analysis.generatedAt || serverTimestamp()
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      repoUrl: data.repoUrl || '',
      repoName: data.repoName || '',
      summary: data.summary || '',
      difficulty: data.difficulty || 'medium',
      beginnerFriendliness: data.beginnerFriendliness || 50,
      generatedAt: data.generatedAt,
    };
  }
};

export const repositoryService = {
  async getAnalysesForUser(userId: string): Promise<RepositoryAnalysis[]> {
    try {
      const q = query(
        collection(db, 'repositoryAnalysis').withConverter(analysisConverter),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error fetching repository analyses:', error);
      throw error;
    }
  },

  async getAnalysis(analysisId: string): Promise<RepositoryAnalysis | null> {
    try {
      const docRef = doc(db, 'repositoryAnalysis', analysisId).withConverter(analysisConverter);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      throw error;
    }
  },

  async saveAnalysis(userId: string, data: Omit<RepositoryAnalysis, 'id' | 'userId' | 'generatedAt'>): Promise<RepositoryAnalysis> {
    try {
      // Create a unique document ID based on owner and repo name from the URL
      const cleanUrl = data.repoUrl.replace(/https?:\/\/github\.com\//i, '').replace(/\/$/, '').toLowerCase();
      const docId = `${userId}_${cleanUrl.replace(/\//g, '_')}`;
      const docRef = doc(db, 'repositoryAnalysis', docId).withConverter(analysisConverter);
      
      const newAnalysis: RepositoryAnalysis = {
        id: docId,
        userId,
        ...data,
        generatedAt: null
      };
      
      await setDoc(docRef, newAnalysis);
      return newAnalysis;
    } catch (error) {
      console.error('Error saving repository analysis:', error);
      throw error;
    }
  }
};
