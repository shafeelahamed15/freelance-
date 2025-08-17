'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'oklch(var(--muted-foreground))' }}>
      {showHome && (
        <>
          <Link href="/dashboard" className="flex items-center hover:text-gray-900 transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/dashboard" className="hover:text-gray-900 transition-colors">
            Dashboard
          </Link>
          {items.length > 0 && <ChevronRight className="w-4 h-4" />}
        </>
      )}
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-gray-900 transition-colors"
              style={{ color: index === items.length - 1 ? 'oklch(var(--foreground))' : 'oklch(var(--muted-foreground))' }}
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className="font-medium" 
              style={{ color: 'oklch(var(--foreground))' }}
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <ChevronRight className="w-4 h-4" />}
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumb;