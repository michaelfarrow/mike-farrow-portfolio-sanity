import getYouTubeID from 'get-youtube-id';

import type { CommonSchemaType } from '@app/types/content';

import { Video } from '@app/components/general/video';

export type SanityVideo = CommonSchemaType<'video'>;

export interface SanityVideoProps
  extends React.ComponentPropsWithoutRef<'div'> {
  video: SanityVideo;
  alt?: string;
}

export function SanityVideo({
  video,
  className,
  alt,
  ...rest
}: SanityVideoProps) {
  const id = getYouTubeID(video.url || '');

  if (!id) return null;

  const embedUrl = `https://www.youtube.com/embed/${id}`;

  return (
    <Video src={embedUrl} title={alt || video.alt} />
    // <div {...rest} className={clsx(styles.video, className)}>
    //   <iframe
    //     className={styles.iframe}
    //     title={alt || video.alt || 'YouTube Video'}
    //     src={embedUrl}
    //     allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    //     referrerPolicy='strict-origin-when-cross-origin'
    //     allowFullScreen
    //   />
    // </div>
  );
}
