import clsx from 'clsx';

import type { CommonSchemaType } from '@app/types/content';

import { Video, VideoProps } from '@app/components/general/video';
import { SanityImage } from '@app/components/sanity/image';

import styles from './video.module.css';

export type SanityRemoteVideo = CommonSchemaType<'remoteVideo'>;
export type SanityVideo = CommonSchemaType<'video'>;

export interface SanityVideoProps extends Omit<VideoProps, 'src' | 'title'> {
  video: SanityVideo | SanityRemoteVideo;
  alt?: string;
  sizes?: string;
}

export function SanityVideo({
  video,
  className,
  alt,
  sizes,
  ...rest
}: SanityVideoProps) {
  const src =
    'file' in video
      ? video.file?.asset?.url
      : 'url' in video
        ? video.url
        : undefined;

  if (!src) return;

  return (
    <Video
      {...rest}
      src={src}
      title={alt || video.alt}
      poster={({ playing }) =>
        (video.poster && (
          <SanityImage
            className={clsx(styles.poster, playing && styles.posterPlaying)}
            image={video.poster}
            sizes={sizes}
          />
        )) ||
        null
      }
      native={'url' in video}
    />
  );
}
