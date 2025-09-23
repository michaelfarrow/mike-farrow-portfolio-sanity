import clsx from 'clsx';
import getYouTubeID from 'get-youtube-id';

import type { CommonSchemaType } from '@app/types/content';

import { Video, VideoProps } from '@app/components/general/video';
import { SanityImage } from '@app/components/sanity/image';

import styles from './video.module.css';

export type SanityVideo = CommonSchemaType<'video'>;

export interface SanityVideoProps extends Omit<VideoProps, 'src' | 'title'> {
  video: SanityVideo;
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
  const id = getYouTubeID(video.url || '');

  if (!id) return null;

  const embedUrl = `https://www.youtube.com/embed/${id}`;

  return (
    <Video
      {...rest}
      src={embedUrl}
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
    />
  );
}
