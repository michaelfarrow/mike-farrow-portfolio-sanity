import { useMeasure, useMouse } from '@uidotdev/usehooks';
import clsx from 'clsx';
import formatDuration from 'format-duration';
import mergeRefs from 'merge-refs';
import React, { useState } from 'react';

import { styleWithVars } from '@app/lib/style';
import Progress from '@app/components/general/progress';

import styles from './video-progress.module.scss';

// const SEEK_PAD = 25;

export interface VideoProgressProps
  extends React.ComponentPropsWithoutRef<'div'> {
  duration: number;
  progress: number;
  onSeek?: (t: number) => void;
}

export default function VideoProgress({
  className,
  style,
  duration,
  progress,
  onSeek,
  ...rest
}: VideoProgressProps) {
  const [mouse, mouseRef] = useMouse<HTMLDivElement>();
  const [measureRef, dimensions] = useMeasure<HTMLDivElement>();

  const pos =
    dimensions.width !== null && mouse.elementX !== null
      ? mouse.elementX / dimensions.width
      : 0;

  const [hover, setHover] = useState(false);

  const onMouseOver = () => {
    setHover(true);
  };

  const onMouseOut = () => {
    setHover(false);
  };

  const onClick = () => {
    if (onSeek) onSeek(pos);
  };

  const seekPercent =
    hover && mouse.elementX && dimensions.width
      ? mouse.elementX / dimensions.width
      : 0;

  // if (mouse.elementWidth) {
  //   seekPos = Math.max(SEEK_PAD, Math.min(dimensions.elementWidth - SEEK_PAD, seekPos))
  // }

  return (
    <div
      className={clsx(styles.wrapper, className)}
      style={styleWithVars(style, {
        '--video-progress-seek-percent': seekPercent,
      })}
      {...rest}
    >
      <div
        ref={mergeRefs(mouseRef, measureRef)}
        className={styles.inner}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
      >
        <span className={styles.background}>
          <span className={styles.seek} />
          <Progress
            className={styles.progress}
            max={duration}
            current={progress}
            animate
          />
        </span>
        <span className={styles.label}>
          <span className={styles.labelInner}>
            {(hover && formatDuration(duration * pos * 1000)) || ''}
          </span>
        </span>
      </div>
    </div>
  );
}
