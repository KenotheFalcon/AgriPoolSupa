import { getAdminFirestore } from '@/lib/firebase-admin';

export interface Alert {
  id: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export async function createAlert(
  type: string,
  message: string,
  severity: Alert['severity']
): Promise<Alert> {
  const db = await getAdminFirestore();
  const docRef = await db.collection('alerts').add({
    type,
    message,
    severity,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() } as Alert;
}

export async function getAlerts(status?: Alert['status']): Promise<Alert[]> {
  const db = await getAdminFirestore();
  let query = db.collection('alerts').orderBy('createdAt', 'desc');

  if (status) {
    query = query.where('status', '==', status);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Alert);
}

export async function updateAlertStatus(id: string, status: Alert['status']): Promise<Alert> {
  const db = await getAdminFirestore();
  const docRef = db.collection('alerts').doc(id);
  await docRef.update({
    status,
    updatedAt: new Date().toISOString(),
  });

  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() } as Alert;
}

export async function deleteAlert(id: string): Promise<void> {
  const db = await getAdminFirestore();
  await db.collection('alerts').doc(id).delete();
}
