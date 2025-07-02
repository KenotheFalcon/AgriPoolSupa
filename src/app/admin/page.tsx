import { getAdminFirestore } from '@/lib/firebase-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, List, Banknote } from 'lucide-react';

async function getAdminDashboardMetrics() {
  const db = await getAdminFirestore();

  const usersPromise = db.collection('users').get();
  const groupsPromise = db.collection('groupBuys').get();
  const listingsPromise = db.collection('produceListings').get();
  const escrowPromise = db.collection('groupBuys').where('status', '==', 'pending_delivery').get();

  const [usersSnapshot, groupsSnapshot, listingsSnapshot, escrowSnapshot] = await Promise.all([
    usersPromise,
    groupsPromise,
    listingsPromise,
    escrowPromise,
  ]);

  const totalEscrow = escrowSnapshot.docs.reduce((sum, doc) => {
    const data = doc.data();
    return sum + data.totalQuantity * data.pricePerUnit;
  }, 0);

  return {
    totalUsers: usersSnapshot.size,
    totalGroups: groupsSnapshot.size,
    totalListings: listingsSnapshot.size,
    totalEscrow,
  };
}

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics();

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{metrics.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Groups</CardTitle>
            <ShoppingCart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{metrics.totalGroups}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Listings</CardTitle>
            <List className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{metrics.totalListings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total in Escrow</CardTitle>
            <Banknote className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>₦{metrics.totalEscrow.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
