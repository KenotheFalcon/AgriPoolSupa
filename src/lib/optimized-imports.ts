// Optimized imports for better tree shaking
// This file helps bundle analyzers understand what's actually used

// Core UI Components - only import what's needed
export { Button } from '@/components/ui/button';
export { Input } from '@/components/ui/input';
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
export { Badge } from '@/components/ui/badge';
export { Label } from '@/components/ui/label';

// Form Components - lazy loaded
export const Select = () => import('@/components/ui/select');
export const Textarea = () => import('@/components/ui/textarea');
export const Checkbox = () => import('@/components/ui/checkbox');
export const RadioGroup = () => import('@/components/ui/radio-group');
export const Switch = () => import('@/components/ui/switch');

// Navigation Components - lazy loaded
export const DropdownMenu = () => import('@/components/ui/dropdown-menu');
export const NavigationMenu = () => import('@/components/ui/navigation-menu');
export const Menubar = () => import('@/components/ui/menubar');

// Layout Components
export { ScrollArea } from '@/components/ui/scroll-area';
export { Separator } from '@/components/ui/separator';
export { Skeleton } from '@/components/ui/skeleton';

// Feedback Components - lazy loaded
export const Toast = () => import('@/components/ui/toast');
export const AlertDialog = () => import('@/components/ui/alert-dialog');
export const Dialog = () => import('@/components/ui/dialog');
export const Popover = () => import('@/components/ui/popover');
export const Tooltip = () => import('@/components/ui/tooltip');
export const HoverCard = () => import('@/components/ui/hover-card');

// Data Display - lazy loaded
export const Table = () => import('@/components/ui/table');
export const Progress = () => import('@/components/ui/progress');
export const Avatar = () => import('@/components/ui/avatar');

// Complex Components - always lazy loaded
export const Calendar = () => import('@/components/ui/calendar');
export const Chart = () => import('@/components/ui/chart');
export const Carousel = () => import('@/components/ui/carousel');
export const Tabs = () => import('@/components/ui/tabs');
export const Accordion = () => import('@/components/ui/accordion');
export const Collapsible = () => import('@/components/ui/collapsible');

// Icon optimization - only load what's needed
export type { LucideIcon } from 'lucide-react';

// Commonly used icons - statically imported for better performance
export {
  Bell,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Minus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Check,
  AlertTriangle,
  Info,
  Loader2,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Upload,
  Download,
  Share2,
  Star,
} from 'lucide-react';

// Less commonly used icons - lazy loaded
export const ArrowLeft = () => import('lucide-react').then(mod => ({ ArrowLeft: mod.ArrowLeft }));
export const ArrowRight = () => import('lucide-react').then(mod => ({ ArrowRight: mod.ArrowRight }));
export const ArrowUp = () => import('lucide-react').then(mod => ({ ArrowUp: mod.ArrowUp }));
export const ArrowDown = () => import('lucide-react').then(mod => ({ ArrowDown: mod.ArrowDown }));
export const Heart = () => import('lucide-react').then(mod => ({ Heart: mod.Heart }));
export const ShoppingCart = () => import('lucide-react').then(mod => ({ ShoppingCart: mod.ShoppingCart }));
export const CreditCard = () => import('lucide-react').then(mod => ({ CreditCard: mod.CreditCard }));
export const Truck = () => import('lucide-react').then(mod => ({ Truck: mod.Truck }));
export const Package = () => import('lucide-react').then(mod => ({ Package: mod.Package }));

// Utility functions for dynamic imports
export const loadIcon = async (iconName: string) => {
  try {
    const mod = await import('lucide-react');
    return (mod as any)[iconName];
  } catch (error) {
    console.warn(`Failed to load icon: ${iconName}`);
    return null;
  }
};

export const loadComponent = async (path: string) => {
  try {
    const mod = await import(path);
    return mod.default || mod;
  } catch (error) {
    console.warn(`Failed to load component: ${path}`);
    return null;
  }
};