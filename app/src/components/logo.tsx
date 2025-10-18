'use client';

import clsx from 'clsx';
import {
  usePathname,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from 'next/navigation';

export default function Logo() {
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();

  const root = pathname === '/';
  return (
    <p
      className={clsx([
        'transition-all duration-1000',
        (root && 'h-10') || 'h-48',
      ])}
    >
      Current pathname: {pathname} {segment} - {segments.join(' // ')}
    </p>
  );
}
