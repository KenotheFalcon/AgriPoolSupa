'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function ActionsCell({ order, groupStatus }: { order: any; groupStatus: string }) {
  if (order.status === 'completed') {
    return <Badge variant='outline'>Completed</Badge>;
  }

  if (groupStatus === 'pending_delivery') {
    return (
      <Button asChild size='sm'>
        <Link href={`/pickup?orderId=${order.id}`}>Confirm Receipt</Link>
      </Button>
    );
  }

  return <Badge variant='secondary'>{groupStatus.replace('_', ' ')}</Badge>;
}

export function MyOrders({ ordersWithDetails }: { ordersWithDetails: any[] }) {
  if (ordersWithDetails.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>You haven't placed any orders yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
        <CardDescription>Here is a list of your past and present group buy orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produce</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Price (₦)</TableHead>
              <TableHead>Logistics Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersWithDetails.map(({ order, group, listing }) => (
              <TableRow key={order.id}>
                <TableCell className='font-medium'>{listing.produceName}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.totalPrice.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={group.status === 'completed' ? 'default' : 'secondary'}>
                    {group.logisticsStatus
                      ? group.logisticsStatus.replace('_', ' ')
                      : group.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionsCell order={order} groupStatus={group.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
