import clsx from 'clsx';
import ReactPlayer from 'react-player';

import styles from './video.module.css';

export interface VideoProps extends React.ComponentPropsWithoutRef<'div'> {
  src: string;
  title?: string;
}

export function Video({ className, src, title, ...rest }: VideoProps) {
  return (
    <div {...rest} className={clsx(styles.video, className)}>
      <ReactPlayer
        className={styles.inner}
        src={src}
        controls={false}
        width={undefined}
        height={undefined}
        title={title}
      />
    </div>
  );
}
