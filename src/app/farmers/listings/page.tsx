import { requireRole } from '@/lib/auth/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { ListingsTable } from '../listings-table';

async function getFarmerListings(farmerId: string) {
  const db = await getAdminFirestore();
  const listingsSnapshot = await db
    .collection('produceListings')
    .where('farmerId', '==', farmerId)
    .orderBy('createdAt', 'desc')
    .get();

  if (listingsSnapshot.empty) {
    return [];
  }

  const listings = listingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const listingsWithGroups = await Promise.all(
    listings.map(async (listing) => {
      const groupBuysSnapshot = await db
        .collection('groupBuys')
        .where('listingId', '==', listing.id)
        .where('status', '==', 'funding')
        .limit(1)
        .get();

      if (groupBuysSnapshot.empty) {
        return { ...listing, activeGroup: null };
      }

      const activeGroup = groupBuysSnapshot.docs[0];
      return { ...listing, activeGroup: { id: activeGroup.id, ...activeGroup.data() } };
    })
  );

  return listingsWithGroups;
}

export default async function ListingsPage() {
  const user = await requireRole('farmer');
  const listings = await getFarmerListings(user.uid);

  return <ListingsTable listings={listings} user={user} />;
}
