'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { resolve } from '@studio/presentation/resolve';

const links = [
  { href: resolve.album.index(), title: 'Albums' },
  { href: resolve.project.index(), title: 'Projects' },
  { href: resolve.cv(), title: 'CV' },
] satisfies { href: string; title: string }[];

export function Navigation() {
  const segment = useSelectedLayoutSegment();

  return (
    <nav>
      <ul>
        {links.map(({ href, title }, i) => (
          <li key={i}>
            <Link className={clsx(segment === href && 'font-bold')} href={href}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
