import { 
  collection, 
  doc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';
import type { 
  Client, 
  Invoice, 
  OnboardingFlow, 
  Template
} from '@/types';

export const collections = {
  users: 'users',
  clients: 'clients',
  invoices: 'invoices',
  onboardingFlows: 'onboardingFlows',
  templates: 'templates',
  emailLogs: 'emailLogs',
} as const;

export class FirestoreService {
  static async create<T extends DocumentData>(collectionName: string, data: Omit<T, 'id'>, userId?: string, customId?: string): Promise<string> {
    const docData: DocumentData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (userId && (collectionName === collections.clients || collectionName === collections.invoices || collectionName === collections.templates)) {
      docData.userId = userId;
    }

    if (customId) {
      const docRef = doc(db, collectionName, customId);
      await setDoc(docRef, docData);
      return customId;
    } else {
      const docRef = await addDoc(collection(db, collectionName), docData);
      return docRef.id;
    }
  }

  static async update<T extends DocumentData>(
    collectionName: string, 
    id: string, 
    data: Partial<T>
  ): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  }

  static async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }

  static async getById<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  static async getAll<T>(collectionName: string, userIdOrConstraints?: string | QueryConstraint[], constraints: QueryConstraint[] = []): Promise<T[]> {
    let finalConstraints: QueryConstraint[] = [];
    
    if (typeof userIdOrConstraints === 'string') {
      // User ID provided, add user constraint and use additional constraints
      finalConstraints = [where('userId', '==', userIdOrConstraints), ...constraints];
    } else if (Array.isArray(userIdOrConstraints)) {
      // Only constraints provided, use them directly
      finalConstraints = userIdOrConstraints;
    }
    
    const q = query(collection(db, collectionName), ...finalConstraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  }

  static async getUserClients(userId: string): Promise<Client[]> {
    return this.getAll<Client>(collections.clients, [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async getUserInvoices(userId: string): Promise<Invoice[]> {
    return this.getAll<Invoice>(collections.invoices, [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async getClientInvoices(clientId: string): Promise<Invoice[]> {
    return this.getAll<Invoice>(collections.invoices, [
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async getUserTemplates(userId: string, type?: 'onboarding' | 'invoice'): Promise<Template[]> {
    try {
      const constraints: QueryConstraint[] = [where('userId', '==', userId)];
      if (type) {
        constraints.push(where('type', '==', type));
      }
      constraints.push(orderBy('createdAt', 'desc'));
      
      return this.getAll<Template>(collections.templates, constraints);
    } catch (error: unknown) {
      // Fallback query without ordering if index is not ready
      if ((error as { code?: string })?.code === 'failed-precondition') {
        console.log('Index not ready, using fallback query');
        const constraints: QueryConstraint[] = [where('userId', '==', userId)];
        if (type) {
          constraints.push(where('type', '==', type));
        }
        
        const templates = await this.getAll<Template>(collections.templates, constraints);
        // Sort in memory as fallback
        return templates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      throw error;
    }
  }

  static async getOnboardingFlow(clientId: string): Promise<OnboardingFlow | null> {
    const flows = await this.getAll<OnboardingFlow>(collections.onboardingFlows, [
      where('clientId', '==', clientId),
      limit(1)
    ]);
    
    return flows.length > 0 ? flows[0] : null;
  }
}