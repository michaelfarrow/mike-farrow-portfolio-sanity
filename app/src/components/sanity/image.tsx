'use client';

import { imageLoader } from 'next-sanity/image';

import type { CommonSchemaType } from '@app/types/content';
import { imageUrl, sanityImageCroppedSize } from '@app/lib/image';
import { Image, ImageProps } from '@app/components/general/image';

export type SanityImage = CommonSchemaType<'image'>;

export interface SanityImageProps
  extends Omit<ImageProps, 'src' | 'width' | 'height' | 'loader' | 'alt'> {
  image: SanityImage;
  alt?: string;
  ratio?: number;
}

export function getSanityImageProps(
  image: SanityImage,
  options?: { ratio?: number }
) {
  const crop = {
    ...{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    ...image.crop,
  };

  const url = image.asset?.url;

  const croppedSize = sanityImageCroppedSize(image);

  const ratioSize = options?.ratio
    ? {
        width: 1000,
        height: Math.round(1000 * options.ratio),
      }
    : null;

  if (url && croppedSize.width && croppedSize.height) {
    return {
      src: ratioSize
        ? imageUrl(image).width(ratioSize.width).height(ratioSize.height).url()
        : imageUrl(image).url(),
      width: ratioSize ? ratioSize?.width : croppedSize.width,
      height: ratioSize ? ratioSize.height : croppedSize.height,
    };
  }

  return null;
}

export function SanityImage({ image, alt, ratio, ...rest }: SanityImageProps) {
  const props = getSanityImageProps(image, { ratio });
  if (!props) return null;
  return (
    <Image
      {...rest}
      {...props}
      alt={alt || image.alt || ''}
      loader={imageLoader}
      backupSrc
    />
  );
}

// placeholder='blur'
// blurDataURL={image.asset?.metadata?.lqip}
