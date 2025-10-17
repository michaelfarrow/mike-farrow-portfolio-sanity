'use client';

import clsx from 'clsx';
import getVideoId from 'get-video-id';
import React from 'react';

import { SUPPORTED_VIDEO_TYPES } from '@studio/schemas/common/fields/video-types';

import type { CommonSchemaType } from '@app/types/content';
import { sanityImageCroppedSize } from '@app/lib/image';
import { LiteVideoExtendsProps } from '@app/components/general/video/lite-video';
import { NativeVideo } from '@app/components/general/video/native-video';
import { VimeoVideo } from '@app/components/general/video/vimeo-video';
import { YoutubeVideo } from '@app/components/general/video/youtube-video';
import { SanityImage } from '@app/components/sanity/image';

export type SanityRemoteVideo = CommonSchemaType<'remoteVideo'>;
export type SanityVideo = CommonSchemaType<'video'>;

export interface SanityVideoProps {
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

export function SanityVideo({ video, alt, sizes }: SanityVideoProps) {
  const src =
    'file' in video
      ? video.file?.asset?.url
      : 'url' in video
        ? video.url
        : undefined;

  if (!src) return;

  const { poster, ratio } = video;
  const title = alt || video.alt || '';

  const croppedSize = poster && sanityImageCroppedSize(poster);

  const parsedRatio = ratio?.match(/(\d+)\s*[/:]\s*(\d+)/);
  const finalRatio = parsedRatio
    ? Number(parsedRatio[1]) / Number(parsedRatio[2])
    : croppedSize?.width && croppedSize.height
      ? croppedSize.width / croppedSize.height
      : undefined;

  const posterComponent = ({ initialised }: { initialised: boolean }) =>
    video.poster && (
      <div
        className={clsx(
          'transition-transform',
          initialised && 'scale-110 duration-500'
        )}
      >
        <SanityImage className='h-full' image={video.poster} sizes={sizes} />
      </div>
    );

  const commonProps = {
    title,
    poster: posterComponent,
    aspect: finalRatio,
  };

  if ('url' in video) {
    if (!video.url) return null;

    const matchedVideo = getVideoId(video.url);
    if (!matchedVideo?.id) return null;

    for (const [key, type] of Object.entries(SUPPORTED_VIDEO_TYPES)) {
      if (type.test(video.url)) {
        const VideoComponent =
          videoComponentMap[key as keyof typeof SUPPORTED_VIDEO_TYPES];
        return <VideoComponent {...commonProps} id={matchedVideo.id} />;
      }
    }
  }

  return <NativeVideo {...commonProps} src={src} />;
}
