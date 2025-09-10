import { stegaClean } from 'next-sanity';
import { imageLoader } from 'next-sanity/image';

import type { CommonSchemaType } from '@app/types/content';

import { BREAKPOINTS } from '@app/lib/responsive';

import { Picture, PictureProps } from '@app/components/general/picture';
import { getSanityImageProps } from '@app/components/sanity/image';

export type SanityPictureImage = CommonSchemaType<'responsiveImage'>;

export interface SanityPictureProps
  extends Omit<PictureProps, 'loader' | 'images' | 'alt'> {
  image: SanityPictureImage;
  alt?: string;
}

export function SanityPicture({ image, alt, ...rest }: SanityPictureProps) {
  const images = [
    (image.main && { source: image.main, breakpoint: undefined }) || undefined,
    ...(image?.alternative || [])
      .filter((altImage) => !!altImage)
      .map((altImage) => ({
        source: altImage.image,
        breakpoint: altImage.breakpoint,
      })),
  ]
    .filter((image) => !!image)
    .map((image) => {
      const { source, breakpoint } = image;

      if (source) {
        const props = getSanityImageProps(source);

        return (
          (props && {
            ...props,
            max: breakpoint && BREAKPOINTS[stegaClean(breakpoint)],
          }) ||
          null
        );
      }

      return null;
    })
    .filter((image) => !!image);

  return (
    <Picture
      {...rest}
      alt={alt || image.main?.alt || ''}
      images={images}
      loader={imageLoader}
    />
  );
}
