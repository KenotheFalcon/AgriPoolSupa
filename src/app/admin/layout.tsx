import { requireRole } from '@/lib/auth/server';
import Link from 'next/link';
import { headers } from 'next/headers';
import { LayoutDashboard, ShoppingCart, List, Users } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Groups', href: '/admin/groups', icon: ShoppingCart },
  { name: 'Listings', href: '/admin/listings', icon: List },
  { name: 'Users', href: '/admin/users', icon: Users },
];

function NavLink({ item }: { item: (typeof navigation)[0] }) {
  const pathname = headers().get('x-pathname') || '';
  const isActive = pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <item.icon className='mr-3 h-6 w-6' />
      {item.name}
    </Link>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole('support');

  return (
    <div className='flex h-screen bg-gray-100 dark:bg-gray-900'>
      <div className='hidden md:flex md:flex-shrink-0'>
        <div className='flex w-64 flex-col'>
          <div className='flex flex-grow flex-col overflow-y-auto bg-gray-800 pt-5'>
            <div className='flex flex-shrink-0 items-center px-4'>
              <h1 className='text-2xl font-bold text-white'>AgriPool Admin</h1>
            </div>
            <div className='mt-5 flex flex-1 flex-col'>
              <nav className='flex-1 space-y-1 px-2 pb-4'>
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      <main className='flex-1 overflow-y-auto p-4 md:p-8'>{children}</main>
    </div>
  );
}
