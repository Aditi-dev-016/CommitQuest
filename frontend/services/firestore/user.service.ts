import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, FirestoreDataConverter, serverTimestamp } from 'firebase/firestore';
import { FirestoreUser } from '../../types/auth';

export const userConverter: FirestoreDataConverter<FirestoreUser> = {
  toFirestore(user: FirestoreUser) {
    const { createdAt, ...rest } = user;
    return {
      ...rest,
      updatedAt: serverTimestamp(),
      ...(createdAt ? {} : { createdAt: serverTimestamp() })
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      uid: data.uid,
      email: data.email || '',
      displayName: data.displayName || '',
      photoURL: data.photoURL || '',
      githubUsername: data.githubUsername || '',
      level: data.level ?? 1,
      xp: data.xp ?? 0,
      streak: data.streak ?? 0,
      contributionScore: data.contributionScore ?? 0,
      achievements: data.achievements || [],
      skills: data.skills || [],
      interests: data.interests || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
};

export const userService = {
  async getUser(uid: string): Promise<FirestoreUser | null> {
    try {
      const docRef = doc(db, 'users', uid).withConverter(userConverter);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async createUser(uid: string, initialData: Partial<FirestoreUser>): Promise<FirestoreUser> {
    try {
      const docRef = doc(db, 'users', uid).withConverter(userConverter);
      const newUser: FirestoreUser = {
        uid,
        email: initialData.email || '',
        displayName: initialData.displayName || '',
        photoURL: initialData.photoURL || '',
        githubUsername: initialData.githubUsername || '',
        level: 1,
        xp: 0,
        streak: 0,
        contributionScore: 0,
        achievements: [],
        skills: [],
        interests: [],
        createdAt: null,
        updatedAt: null,
      };
      await setDoc(docRef, newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUser(uid: string, data: Partial<FirestoreUser>): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};
