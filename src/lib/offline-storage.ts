import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AgriPoolDB extends DBSchema {
  userProfile: {
    key: string;
    value: any;
  };
  pendingActions: {
    key: string;
    value: {
      type: string;
      data: any;
      timestamp: number;
    };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<AgriPoolDB> | null = null;

  async init() {
    this.db = await openDB<AgriPoolDB>('agripool-offline', 1, {
      upgrade(db) {
        // Create object stores
        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile');
        }
        if (!db.objectStoreNames.contains('pendingActions')) {
          db.createObjectStore('pendingActions');
        }
      },
    });
  }

  async saveUserProfile(uid: string, data: any) {
    if (!this.db) await this.init();
    await this.db!.put('userProfile', data, uid);
  }

  async getUserProfile(uid: string) {
    if (!this.db) await this.init();
    return this.db!.get('userProfile', uid);
  }

  async savePendingAction(action: { type: string; data: any }) {
    if (!this.db) await this.init();
    const key = `${action.type}-${Date.now()}`;
    await this.db!.put(
      'pendingActions',
      {
        ...action,
        timestamp: Date.now(),
      },
      key
    );
    return key;
  }

  async getPendingActions() {
    if (!this.db) await this.init();
    return this.db!.getAll('pendingActions');
  }

  async removePendingAction(key: string) {
    if (!this.db) await this.init();
    await this.db!.delete('pendingActions', key);
  }
}

export const offlineStorage = new OfflineStorage();
