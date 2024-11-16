import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, getDoc } from 'firebase/firestore';
import type { Company, Report } from '@/types';

// Company Operations
export async function createCompany(data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = Date.now();
  const companyData = {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  
  const docRef = await addDoc(collection(db, 'companies'), companyData);
  return { id: docRef.id, ...companyData };
}

export async function getCompany(id: string) {
  const docRef = doc(db, 'companies', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Company;
  }
  return null;
}

export async function getCompanies() {
  const querySnapshot = await getDocs(
    query(collection(db, 'companies'), orderBy('createdAt', 'desc'))
  );
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
}

// Report Operations
export async function createReport(data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = Date.now();
  const reportData = {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  
  const docRef = await addDoc(collection(db, 'reports'), reportData);
  return { id: docRef.id, ...reportData };
}

export async function getCompanyReports(companyId: string) {
  const querySnapshot = await getDocs(
    query(
      collection(db, 'reports'),
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc')
    )
  );
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
}