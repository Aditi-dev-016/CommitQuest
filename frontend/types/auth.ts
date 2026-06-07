import { User as FirebaseUser } from 'firebase/auth';

export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  githubUsername: string;
  level: number;
  xp: number;
  streak: number;
  contributionScore: number;
  achievements: string[];
  skills: string[];
  interests: string[];
  createdAt: any; // Timestamp or Date
  updatedAt: any; // Timestamp or Date;
}

export interface AuthContextType {
  user: FirestoreUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  loginWithGithub: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  error: string | null;
}
