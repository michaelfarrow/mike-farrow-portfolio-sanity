'use client';

import clsx from 'clsx';
import { useAnimationFrameLoop } from 'react-timing-hooks';
import React, { useEffect, useState } from 'react';

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
  min?: number;
  max?: number;
  current: number;
  animate?: boolean;
}

export default function Progress({
  className,
  min = 0,
  max = 100,
  current,
  animate,
  ...rest
}: Props) {
  const [inc, setInc] = useState(0);

  const { start, stop } = useAnimationFrameLoop(() => {
    setInc(current === 0 ? 0 : inc + (current - inc) / 10);
  });

  useEffect(() => {
    if (animate) {
      start();
    } else {
      stop();
    }
  }, [animate, start, stop]);

  const percent =
    min === max
      ? 0
      : ((Math.min(max, Math.max(animate === undefined ? current : inc, min)) -
          min) /
          (max - min)) *
        100;

  return (
    <div
      className={clsx('relative h-3 overflow-hidden bg-black', className)}
      {...rest}
    >
      <span
        className='absolute left-0 block h-full w-full origin-left bg-red-500'
        style={{ transform: `scaleX(${percent}%)` }}
      />
      <span className='absolute hidden'>{percent}</span>
    </div>
  );
}
