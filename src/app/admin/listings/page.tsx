import { getAdminFirestore } from '@/lib/firebase-admin';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SuspendButton } from './suspend-button';

async function getAllListings() {
  const db = await getAdminFirestore();
  const listingsSnapshot = await db
    .collection('produceListings')
    .orderBy('createdAt', 'desc')
    .get();
  return listingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export default async function AdminListingsPage() {
  const listings = await getAllListings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Produce Listings</CardTitle>
        <CardDescription>View and manage all produce listings on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produce</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price (₦)</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className='font-medium'>{listing.produceName}</TableCell>
                  <TableCell>{listing.farmerName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        listing.status === 'suspended'
                          ? 'destructive'
                          : listing.status === 'completed'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {listing.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{listing.pricePerUnit.toLocaleString()}</TableCell>
                  <TableCell>
                    {listing.quantityAvailable} / {listing.totalQuantity}
                  </TableCell>
                  <TableCell>
                    <SuspendButton listingId={listing.id} currentStatus={listing.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
