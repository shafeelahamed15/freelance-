'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Receipt,
  Mail,
  Settings,
  Wrench,
  LucideIcon
} from 'lucide-react';

interface SidebarLink {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const mainLinks: SidebarLink[] = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/clients', icon: Users, label: 'Clients', badge: '42' },
  { href: '/invoices', icon: Receipt, label: 'Invoices', badge: '8' },
  { href: '/templates', icon: Mail, label: 'Templates' }
];

const bottomLinks: SidebarLink[] = [
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/admin', icon: Wrench, label: 'Admin' }
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const renderSidebarLink = (link: SidebarLink) => {
    const IconComponent = link.icon;
    const isActive = isActiveLink(link.href);

    return (
      <Link key={link.href} href={link.href} onClick={onClose}>
        <div className={`sidebar-link flex items-center gap-3 px-3 py-2 font-medium ${
          isActive ? 'active' : ''
        }`}>
          <IconComponent className="w-5 h-5" />
          <span>{link.label}</span>
          {link.badge && (
            <span className="ml-auto text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: isActive ? 'oklch(var(--primary-foreground) / 0.2)' : 'oklch(var(--primary) / 0.1)',
                    color: isActive ? 'oklch(var(--primary-foreground))' : 'oklch(var(--primary))'
                  }}>
              {link.badge}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <aside className={`w-64 sidebar min-h-screen transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 fixed lg:relative z-40`}>
      <nav className="p-4 space-y-2">
        {/* Main Navigation Links */}
        {mainLinks.map(renderSidebarLink)}
        
        {/* Divider and Bottom Links */}
        <div className="border-t pt-4 mt-4" style={{ borderColor: 'oklch(var(--sidebar-border))' }}>
          {bottomLinks.map(renderSidebarLink)}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;