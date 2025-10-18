'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

const links = [
  { href: 'albums', title: 'Albums' },
  { href: 'projects', title: 'Projects' },
  { href: 'cv', title: 'CV' },
];

export function Navigation() {
  const segment = useSelectedLayoutSegment();

  return (
    <nav>
      <ul>
        {links.map(({ href, title }, i) => (
          <li key={i}>
            <Link
              className={clsx(segment === href && 'font-bold')}
              href={`/${href}`}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
