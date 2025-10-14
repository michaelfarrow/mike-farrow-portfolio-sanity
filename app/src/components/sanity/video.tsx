import clsx from 'clsx';
import getVideoId from 'get-video-id';
import React from 'react';

import { SUPPORTED_VIDEO_TYPES } from '@studio/schemas/common/fields/video-types';

import type { CommonSchemaType } from '@app/types/content';
import { Video, VideoProps } from '@app/components/general/video';
import { LiteVideoExtendsProps } from '@app/components/general/video/lite-video';
import { VimeoVideo } from '@app/components/general/video/vimeo-video';
import { YoutubeVideo } from '@app/components/general/video/youtube-video';
import { SanityImage } from '@app/components/sanity/image';

import styles from './video.module.css';

export type SanityRemoteVideo = CommonSchemaType<'remoteVideo'>;
export type SanityVideo = CommonSchemaType<'video'>;

export interface SanityVideoProps extends Omit<VideoProps, 'src' | 'title'> {
  video: SanityVideo | SanityRemoteVideo;
  alt?: string;
  sizes?: string;
}

export const videoComponentMap: Record<
  keyof typeof SUPPORTED_VIDEO_TYPES,
  React.ComponentType<LiteVideoExtendsProps & { title: string; id: string }>
> = {
  youTube: YoutubeVideo,
  vimeo: VimeoVideo,
};

export function SanityVideo({ video, alt, sizes, ...rest }: SanityVideoProps) {
  const src =
    'file' in video
      ? video.file?.asset?.url
      : 'url' in video
        ? video.url
        : undefined;

  if (!src) return;

  if ('url' in video) {
    if (!video.url) return null;
    const matchedVideo = getVideoId(video.url);
    if (!matchedVideo?.id) return null;

    for (const [key, type] of Object.entries(SUPPORTED_VIDEO_TYPES)) {
      if (type.test(video.url)) {
        const VideoComponent =
          videoComponentMap[key as keyof typeof SUPPORTED_VIDEO_TYPES];
        return (
          <VideoComponent
            id={matchedVideo.id}
            title={video.alt || ''}
            poster={
              video.poster && (
                <SanityImage
                  className={styles.posterImage}
                  image={video.poster}
                  sizes={sizes}
                />
              )
            }
          />
        );
      }
    }
  }

  return null;

  // return (
  //   <Video
  //     {...rest}
  //     src={src}
  //     title={alt || video.alt}
  //     poster={({ playing }) =>
  //       (video.poster && (
  //         <div className={clsx(styles.poster, playing && styles.posterPlaying)}>
  //           <SanityImage
  //             className={styles.posterImage}
  //             image={video.poster}
  //             sizes={sizes}
  //           />
  //         </div>
  //       )) ||
  //       null
  //     }
  //     native={'url' in video}
  //   />
  // );
}
