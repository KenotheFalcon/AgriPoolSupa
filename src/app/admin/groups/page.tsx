import { requireRole } from '@/lib/auth/server';
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
import { AdminChatModal } from './admin-chat-modal';

async function getAllGroupBuys() {
  // TODO: Replace with Supabase implementation according to PRD
  // Mock data for now
  return [
    {
      id: '1',
      produceName: 'Fresh Tomatoes',
      status: 'active',
      targetQuantity: 100,
      quantityFunded: 75,
      totalQuantity: 100,
      deadline: '2024-01-15T10:00:00Z',
      organizerId: 'user1',
      participants: { user1: 25, user2: 50 },
    },
    {
      id: '2',
      produceName: 'Organic Spinach',
      status: 'completed',
      targetQuantity: 50,
      quantityFunded: 50,
      totalQuantity: 50,
      deadline: '2024-01-10T10:00:00Z',
      organizerId: 'user2',
      participants: { user3: 30, user4: 20 },
    },
  ];
}

export default async function AdminGroupsPage() {
  const user = await requireRole('support');
  const groups = await getAllGroupBuys();

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Group Buys</CardTitle>
        <CardDescription>View and manage all group buys across the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produce</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Funded</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className='font-medium'>{group.produceName}</TableCell>
                <TableCell>
                  <Badge variant={group.status === 'completed' ? 'default' : 'secondary'}>
                    {group.status.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {group.quantityFunded} / {group.totalQuantity}
                </TableCell>
                <TableCell>{Object.keys(group.participants || {}).length}</TableCell>
                <TableCell>
                  <AdminChatModal groupId={group.id} user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
