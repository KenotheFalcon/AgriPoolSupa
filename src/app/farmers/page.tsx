import { requireRole } from '@/lib/auth/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { FarmerOverview } from './farmer-overview';

async function getFarmerStats(farmerId: string) {
  const db = await getAdminFirestore();
  const listingsSnapshot = await db
    .collection('produceListings')
    .where('farmerId', '==', farmerId)
    .get();

  const ordersSnapshot = await db
    .collection('orders')
    .where('farmerId', '==', farmerId) // Assuming farmerId is on orders
    .where('status', '==', 'completed')
    .get();

  const totalSales = ordersSnapshot.docs.reduce((sum, doc) => sum + doc.data().totalPrice, 0);

  return {
    totalListings: listingsSnapshot.size,
    completedOrders: ordersSnapshot.size,
    totalSales,
  };
}

export default async function FarmersPage() {
  const user = await requireRole('farmer');
  const stats = await getFarmerStats(user.uid);

  return <FarmerOverview user={user} stats={stats} />;
}
