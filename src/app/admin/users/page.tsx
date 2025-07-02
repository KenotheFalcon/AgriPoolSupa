import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
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
import { RoleManager } from './role-manager';
// import { FarmerVerificationManager } from './farmer-verification-manager';

async function getAllUsers() {
  const adminAuth = await getAdminAuth();
  const userRecords = await adminAuth.listUsers();
  return userRecords.users.map((user) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role: user.customClaims?.role || 'buyer',
    emailVerified: user.emailVerified,
    isVerified: user.customClaims?.isVerified || false,
  }));
}

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage all users on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className='font-medium'>{user.displayName || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.isVerified ? (
                      <Badge className='bg-green-600 text-white'>Yes</Badge>
                    ) : (
                      'No'
                    )}
                  </TableCell>
                  <TableCell className='flex items-center gap-2'>
                    <RoleManager targetUserId={user.uid} currentRole={user.role} />
                    {/* {user.role === 'farmer' && <FarmerVerificationManager farmerId={user.uid} />} */}
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
