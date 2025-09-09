import { getAdminFirestore } from '@/lib/firebase-admin';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';

interface Alert {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  [key: string]: any;
}

class MonitoringService {
  private db: any;

  constructor() {
    this.init();
  }

  private async init() {
    this.db = await getAdminFirestore();
  }

  async logMetric(name: string, value: number, tags: Record<string, string> = {}) {
    if (!this.db) await this.init();
    await this.db.collection('metrics').add({
      name,
      value,
      tags,
      timestamp: new Date(),
    });
  }

  async getMetrics(name: string, startTime: Date, endTime: Date) {
    if (!this.db) await this.init();
    const snapshot = await this.db
      .collection('metrics')
      .where('name', '==', name)
      .where('timestamp', '>=', startTime)
      .where('timestamp', '<=', endTime)
      .get();

    return snapshot.docs.map((doc: QueryDocumentSnapshot) => doc.data());
  }

  async createAlert(name: string, condition: string, threshold: number) {
    if (!this.db) await this.init();
    await this.db.collection('alerts').add({
      name,
      condition,
      threshold,
      enabled: true,
      createdAt: new Date(),
    });
  }

  async getAlerts(
    options: {
      type?: string;
      status?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<Alert[]> {
    if (!this.db) await this.init();
    let query = this.db.collection('alerts').where('enabled', '==', true);
    if (options.type) {
      query = query.where('type', '==', options.type);
    }
    if (options.status) {
      query = query.where('status', '==', options.status);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    // Firestore does not support offset directly; for simplicity, we skip it here.
    const snapshot = await query.get();
    let docs = snapshot.docs;
    if (options.offset) {
      docs = docs.slice(options.offset);
    }
    return docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    })) as Alert[];
  }

  async checkAlerts() {
    const alerts = await this.getAlerts();
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    for (const alert of alerts) {
      const metrics = await this.getMetrics(alert.name, oneHourAgo, now);

      if (metrics.length === 0) continue;

      const avgValue =
        metrics.reduce((sum: number, m: { value: number }) => sum + m.value, 0) / metrics.length;

      if (this.evaluateCondition(avgValue, alert.condition, alert.threshold)) {
        await this.triggerAlert(alert);
      }
    }
  }

  private evaluateCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case '>':
        return value > threshold;
      case '<':
        return value < threshold;
      case '>=':
        return value >= threshold;
      case '<=':
        return value <= threshold;
      case '==':
        return value === threshold;
      default:
        return false;
    }
  }

  private async triggerAlert(alert: any) {
    if (!this.db) await this.init();
    await this.db.collection('alertHistory').add({
      alertId: alert.id,
      alertName: alert.name,
      triggeredAt: new Date(),
      value: alert.threshold,
    });
  }

  async addAlert({
    type,
    message,
    metadata,
  }: {
    type: string;
    message: string;
    metadata?: Record<string, any>;
  }) {
    if (!this.db) await this.init();
    const docRef = await this.db.collection('alerts').add({
      type,
      message,
      metadata: metadata || {},
      status: 'new',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  async updateAlertStatus(id: string, status: string) {
    if (!this.db) await this.init();
    const docRef = this.db.collection('alerts').doc(id);
    await docRef.update({
      status,
      updatedAt: new Date(),
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  async deleteAlert(id: string) {
    if (!this.db) await this.init();
    await this.db.collection('alerts').doc(id).delete();
  }
}

export const monitoringService = new MonitoringService();
