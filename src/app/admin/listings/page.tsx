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
  // TODO: Replace with Supabase implementation according to PRD
  // Mock data for now
  return [
    {
      id: '1',
      produceName: 'Fresh Tomatoes',
      farmerName: 'John Doe',
      status: 'active',
      pricePerUnit: 500,
      quantityAvailable: 75,
      totalQuantity: 100,
      location: 'Lagos, Nigeria',
    },
    {
      id: '2',
      produceName: 'Organic Spinach',
      farmerName: 'Jane Smith',
      status: 'sold',
      pricePerUnit: 300,
      quantityAvailable: 0,
      totalQuantity: 50,
      location: 'Abuja, Nigeria',
    },
    {
      id: '3',
      produceName: 'Sweet Potatoes',
      farmerName: 'Mike Johnson',
      status: 'suspended',
      pricePerUnit: 400,
      quantityAvailable: 30,
      totalQuantity: 75,
      location: 'Kano, Nigeria',
    },
  ];
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
