import { getAdminFirestore } from '@/lib/firebase-admin';
import { requireRole, ServerUser } from '@/lib/auth/server';
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
  const db = await getAdminFirestore();
  const groupsSnapshot = await db.collection('groupBuys').orderBy('createdAt', 'desc').get();
  return groupsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any));
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
